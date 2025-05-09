import { CreateStaffType, EditStaffPermissionType, GetStaffActivitiesType, ListStaffsType, LoginType, UpdateStaffType } from "../../types/staff/auth.types";
import { ResponseType } from '../../types/api.types';
import { Staff } from '../../models/Staff';
import { StaffPermission } from '../../models/StaffPermission';
import { StaffActivity } from '../../models/StaffActivity';
import { messages, staff_otp_types } from '../../utils/consts';
import { StatusCodes } from "http-status-codes";
import { log } from '../../utils/logger';
import { compareString, hashString, signObject, generateRandomNumber, encryptString, decryptString } from '../../utils/auth';
import env from '../../config/config';
import { Op } from "sequelize";
import { SingleIdType } from "../../types/trades.types";
import { sendOtpService, checkOtp, verifyOtp } from "./otp.service";
import { ChangePasswordType, ResetOtpType, ResetPasswordType, ResetVerifyType, VerifyOtpType } from "../../types/user.types";

export const loginService = async (payload: LoginType): Promise<ResponseType> => {
    const { email, password } = payload;

    let staff = await Staff.findOne({ where: { email } });

    if (!staff) {
        throw { ok: false, message: messages.INVALID_LOGIN_CRED, status: StatusCodes.UNAUTHORIZED };
    }

    let check = compareString(password, staff.password_hash);

    if (!check) {
        throw { ok: false, message: messages.INVALID_LOGIN_CRED, status: StatusCodes.UNAUTHORIZED };
    }

    let authExpiration = env.NODE_ENV !== "production" ? "3h" : "20m";
    let refreshExpiration = env.NODE_ENV !== "production" ? "150m" : "25m";

    let auth = signObject({ staff_id: staff.id }, authExpiration);
    let refresh = signObject({ staff_id: staff.id }, refreshExpiration);

    await Staff.update({ last_login: new Date() }, { where: { id: staff.id } });

    return { ok: true, message: messages.OK, status: StatusCodes.OK, body: { id : staff.id, tokens: { auth, refresh } } };
}

export const createStaffService = async (payload: CreateStaffType): Promise<ResponseType> => {
    const { email, password, is_admin, full_name, permissions } = payload;

    let staff = await Staff.findOne({ where: { email } });

    if (staff) {
        throw { ok: false, message: messages.USER_ALREADY_EXIST, status: StatusCodes.BAD_REQUEST };
    }

    let createPayload: any = { ...payload };
    createPayload.password_hash = hashString(password);
    delete createPayload.permissions;
    delete createPayload.passwprd;

    staff = await Staff.create({ ...createPayload });

    let createPermissionsPayload: any = { ...permissions };
    if (is_admin == true) {
        let keys = Object.keys(createPermissionsPayload);

        for (let i = 0; i < keys.length; i++) {
            createPermissionsPayload[keys[i]] = true;
        }
    }

    await StaffPermission.create({ ...createPermissionsPayload, staff_id: staff.id });

    return { ok: true, message: messages.OK, status: StatusCodes.OK };
}

export const listStaffsService = async (payload: ListStaffsType): Promise<ResponseType> => {
    let { q, page, size, order, is_admin } = payload;

    let permissionsFilter: any = { ...payload };
    delete permissionsFilter.q;
    delete permissionsFilter.page;
    delete permissionsFilter.size;
    delete permissionsFilter.order;
    delete permissionsFilter.is_admin;

    let where: any = {};
    let where2: any = {};

    let keys = Object.keys(permissionsFilter);

    for (let i = 0; i < keys.length; i++) {
        where2[keys[i]] = permissionsFilter[keys[i]];
    }

    let allPermissions = await StaffPermission.findAll({
        attributes: [...keys, 'id', 'staff_id'],
        where: where2
    });

    let allPermissionsStaffId = allPermissions.map((e: any) => { return e.staff_id })

    where.id = { [Op.in]: allPermissionsStaffId };

    if (is_admin != undefined) {
        where.is_admin
    }

    if (q) {
        where = {
            [Op.and]: [
                where, {
                    [Op.or]: [
                        { full_name: { [Op.like]: '%' + q + '%' } },
                        { email: { [Op.like]: '%' + q + '%' } }
                    ]
                }
            ]
        }
    }

    let staffs = await Staff.findAll({
        attributes: ['id', 'full_name', 'email', 'pfp_url', 'is_admin', 'is_active', 'created_at', 'last_login', 'updated_at'],
        where,
        limit: size,
        offset: page,
        order: [['id', order]],
    });

    let total_count = await Staff.count({ where });
    let total_pages = Math.ceil(total_count / size);

    if (page > 1) {
        page = (Math.ceil(page / size)) + 1;
    } else {
        page = 1;
    }

    return { ok: true, status: StatusCodes.OK, body: { page, size, total_count, total_pages, staffs }, message: messages.OK }
}

export const getStaffService = async (payload: SingleIdType): Promise<ResponseType> => {
    const { id } = payload;

    let staff = await Staff.findOne({
        attributes: ['id', 'full_name', 'email', 'pfp_url', 'is_admin', 'is_active', 'created_at', 'last_login', 'updated_at'],
        where: { id },
        include: [{ model: StaffPermission, as: 'permissions' }]
    });

    if (!staff) {
        throw { ok: false, message: messages.NOT_FOUND, status: StatusCodes.NOT_FOUND };
    }

    return { ok: true, message: messages.OK, status: StatusCodes.OK, body: { staff } };
}

export const editStaffPermissionService = async (payload: EditStaffPermissionType): Promise<ResponseType> => {
    const { id } = payload;

    let staff = await Staff.findOne({ where: { id } });

    if (!staff) {
        throw { ok: false, message: messages.NOT_FOUND, status: StatusCodes.NOT_FOUND };
    }

    let updatePayload: any = { ...payload };
    delete updatePayload.id;

    await StaffPermission.update({ ...updatePayload }, { where: { staff_id: id } });

    return await getStaffService({ id });
}

export const toggleRoleService = async (payload: SingleIdType): Promise<ResponseType> => {
    const { id } = payload;

    let staff = await Staff.findOne({ where: { id } });

    if (!staff) {
        throw { ok: false, message: messages.NOT_FOUND, status: StatusCodes.NOT_FOUND };
    }

    await Staff.update({ is_admin: !staff.is_admin }, { where: { id } });

    return { ok: true, message: messages.OK, status: StatusCodes.OK };
}

export const toggleStatusService = async (payload: SingleIdType): Promise<ResponseType> => {
    const { id } = payload;

    let staff = await Staff.findOne({ where: { id } });

    if (!staff) {
        throw { ok: false, message: messages.NOT_FOUND, status: StatusCodes.NOT_FOUND };
    }

    await Staff.update({ is_active: !staff.is_active }, { where: { id } });

    return { ok: true, message: messages.OK, status: StatusCodes.OK };
}

export const getStaffActivitesService = async (payload: GetStaffActivitiesType): Promise<ResponseType> => {
    let { id, q, order, size, page } = payload;

    let where: any = { staff_id : id };

    // if (q) {
    //     let searchStaffs = await Staff.findAll({
    //         attributes : ['full_name', 'email', 'id'],
    //         where: {
    //             [Op.or]: [
    //                 { full_name: { [Op.like]: '%' + q + '%' } },
    //                 { email: { [Op.like]: '%' + q + '%' } },
    //             ]
    //         }
    //     });

    //     where.staff_id = { [Op.in] : searchStaffs.map((e)=>{ return e.id }) };
    // }

    let activities = await StaffActivity.findAll({ where, limit : size, offset : page, order : [['id', order]] });

    let total_count = await StaffActivity.count({ where });
    let total_pages = Math.ceil(total_count / size);

    if (page > 1) {
        page = (Math.ceil(page / size)) + 1;
    } else {
        page = 1;
    }

    return { ok: true, status: StatusCodes.OK, body: { page, size, total_count, total_pages, activities }, message: messages.OK }
}

export const passwordOtpService = async (payload : ResetOtpType) : Promise<ResponseType> =>{
    let { email } = payload;
    let staff = await Staff.findOne({ where : { email } });

    if(!staff){
        throw { ok : false, message : messages.UNAUTHORIZED, status : StatusCodes.UNAUTHORIZED };
    }

    await sendOtpService(staff, staff_otp_types.reset_password, generateRandomNumber(4), undefined, staff.email);
    return { ok : true, message : messages.OK, status : StatusCodes.OK };
}

export const verifyOtpService = async (payload : ResetVerifyType) : Promise<ResponseType> =>{
    let { otp, email } = payload;

    let staff = await Staff.findOne({ where : { email } });

    if(!staff){
        throw { ok : false, message : messages.UNAUTHORIZED, status : StatusCodes.UNAUTHORIZED };
    }

    await checkOtp(staff.id, staff_otp_types.reset_password, otp);

    let token = encryptString(`${otp}~~~${staff.id}`);

    return { ok : true, message : messages.OK, status : StatusCodes.OK, body : { token } };
}

export const resetPasswordService = async (payload : ResetPasswordType) : Promise<ResponseType> =>{
    const { password, token } = payload;

    let decryptedString : string;

    try{
       decryptedString = decryptString(token)
    }catch(error : any){
        log("error", { error });
        throw { ok : false, message : messages.UNAUTHORIZED, status : StatusCodes.UNAUTHORIZED };
    }

    let split = decryptedString.split('~~~');
    let otp = split[0];
    let staff_id = split[1];

    let staff = await Staff.findOne({ where : { id : staff_id } });

    if(!staff){
        throw { ok : false, message : messages.UNAUTHORIZED, status : StatusCodes.UNAUTHORIZED };
    }

    await verifyOtp(otp, staff.id, staff_otp_types.reset_password);

    staff.password_hash = hashString(password);
    await staff.save();

    return { ok : true, message : messages.OK, status : StatusCodes.OK };
}

export const changePasswordService = async (payload : ChangePasswordType, staff : Staff) : Promise<ResponseType> =>{
    const { new_password, old_password } = payload;

    let check = compareString(old_password, staff.password_hash);

    if (!check) {
        throw { ok: false, message: messages.INVALID_LOGIN_CRED, status: StatusCodes.UNAUTHORIZED };
    }

    staff.password_hash = hashString(new_password);
    await staff.save();

    return { ok : true, message : messages.OK, status : StatusCodes.OK };
}

export const updateStaffService = async (payload : UpdateStaffType, staff : Staff) : Promise<ResponseType> =>{
    await Staff.update({...payload}, { where : { id : staff.id } });
    return await getStaffService({ id : staff.id });
}