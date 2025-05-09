import { Op } from 'sequelize';
import { ResponseType } from '../../types/api.types';
import { GenericPaginationSchemaType, CreateUserType } from "../../types/staff/user.types";
import { User } from "../../models/User";
import { StatusCodes } from 'http-status-codes';
import { messages } from '../../utils/consts';
import { hashString } from '../../utils/auth';
import { SingleIdType } from '../../types/trades.types';

export const listUsersService = async (payload : GenericPaginationSchemaType) : Promise<ResponseType> =>{
    let { q, size, page, order } = payload;

    let where : any = {};

    if(q){
        where = {
            [Op.or] : [
                {
                    first_name : { [Op.like] : '%'+q+'%' }
                },
                {
                    email : { [Op.like] : '%'+q+'%' }
                },
                {
                    last_name : { [Op.like] : '%'+q+'%' }
                },
                {
                    phone : { [Op.like] : '%'+q+'%' }
                }
            ]
        }
    }

    let users = await User.findAll({
        attributes : { exclude : ['password_hash'] },
        where,
        order : [['created_at', order]],
        limit : size,
        offset : page
    });

    let total_count = await User.count({ where });
    let total_pages = Math.ceil(total_count / size);

    if (page > 1) {
        page = (Math.ceil(page / size)) + 1;
    } else {
        page = 1;
    }

    return { ok: true, status: StatusCodes.OK, body: { page, size, total_count, total_pages, users }, message: messages.OK }
}

export const createUserService = async (payload : CreateUserType) : Promise<ResponseType> =>{
    let { email } = payload;

    let user = await User.findOne({ where : { email } });

    if(user){
       throw { ok : false, message : messages.USER_ALREADY_EXIST, status : StatusCodes.BAD_REQUEST } 
    }

    let createPayload : any = {...payload}
    createPayload.password_hash = hashString(createPayload.password);

    let splittedName = createPayload.full_name.split(" ");
    createPayload.first_name = splittedName[0];
    
    if(splittedName.length > 1){
        createPayload.last_name = splittedName[splittedName.length - 1];
    }

    delete createPayload.password;

    await User.create({...createPayload});

    return { ok : true, message : messages.OK, status : StatusCodes.OK };
}

export const deleteUserService = async (payload : SingleIdType) : Promise<ResponseType> =>{
    const { id } = payload;

    await User.destroy({ where : { id } });

    return { ok : true, message : messages.OK, status : StatusCodes.OK };
}

export const toggleStatusService = async (payload : SingleIdType) : Promise<ResponseType> =>{
    const { id } = payload;

    let user = await User.findOne({ where : { id } });

    if(!user){
        throw { ok : false, message : messages.NOT_FOUND, status : StatusCodes.NOT_FOUND };
    }

    user.is_disabled = !user.is_disabled;
    await user.save();

    return { ok : true, message : messages.OK, status : StatusCodes.OK };
}

export const getUserService = async (payload : SingleIdType) : Promise<ResponseType> =>{
    const { id } = payload;

    let user = await User.findOne({ where : { id } });

    if(!user){
        throw { ok : false, message : messages.NOT_FOUND, status : StatusCodes.NOT_FOUND };
    }

    return { ok : true, message : messages.OK, status : StatusCodes.OK, body : { user } };
}