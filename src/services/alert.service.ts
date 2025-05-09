import { User } from "../models/User";
import { CreateAlertType, EditAlertType } from "../types/alert.types";
import { ResponseType } from '../types/api.types';
import { Alert } from '../models/Alert';
import { messages } from "../utils/consts";
import { StatusCodes } from "http-status-codes";
import { SingleIdType } from "../types/trades.types";
import { GenericPaginationSchemaType } from "../types/staff/user.types";
import { Op } from "sequelize";

export const createAlertService = async (payload : CreateAlertType, user : User) : Promise<ResponseType> =>{
    const { ticker, amount } = payload;

    let searchAlert = await Alert.findOne({ where : { ticker, amount, user_id : user.id } });

    if(searchAlert){
        throw { ok : false, message : messages.DUPLICATE_DATA, status : StatusCodes.BAD_REQUEST };
    }

    let alert = await Alert.create({ ticker, amount, user_id : user.id });

    return { ok : true, message : messages.OK, status : StatusCodes.OK, body : { alert } }
}

export const editAlertService = async (payload : EditAlertType, user : User) : Promise<ResponseType> =>{
    const { id, ticker, amount } = payload;

    let alert = await Alert.findOne({ where : { id, user_id : user.id } });

    if(!alert){
        throw { ok : false, message : messages.NOT_FOUND, status : StatusCodes.NOT_FOUND };
    }

    if(ticker){
        alert.ticker = ticker;
    }

    if(amount){
        alert.amount = amount;
    }

    await alert.save();

    return { ok : true, message : messages.OK, status : StatusCodes.OK, body : { alert } };
}

export const deleteAlertService = async (payload : SingleIdType, user : User) : Promise<ResponseType> =>{
    const { id } = payload;

    let alert = await Alert.findOne({ where : { id, user_id : user.id } });

    if(!alert){
        throw { ok : false, message : messages.NOT_FOUND, status : StatusCodes.NOT_FOUND };
    }

    await Alert.destroy({ where : { id } });

    return { ok : true, message : messages.OK, status : StatusCodes.OK };
}

export const listAlertsService = async (payload : GenericPaginationSchemaType, user : User) : Promise<ResponseType> =>{
    let { q, order, size, page } = payload;

    let where : any = { user_id : user.id };

    if(q){
        where.ticker = { [Op.like] : '%'+q+'%' };
    }

    let alerts = await Alert.findAll({ where, limit : size, offset : page, order : [['id', order]] });
    
    let total_count = await Alert.count({ where });
    let total_pages = Math.ceil(total_count / size);

    if (page > 1) {
        page = (Math.ceil(page / size)) + 1;
    } else {
        page = 1;
    }

    return { ok : true, message : messages.OK, status : StatusCodes.OK, body : { size, page, total_count, total_pages, alerts } }
}

export const getAlertService = async (payload : SingleIdType, user : User) : Promise<ResponseType> =>{
    const { id } = payload;

    let alert = await Alert.findOne({ where : { id, user_id : user.id } });

    if(!alert){
        throw { ok : false, message : messages.NOT_FOUND, status : StatusCodes.NOT_FOUND }
    }

    return { ok : true, message : messages.OK, status : StatusCodes.OK, body : { alert } }
}