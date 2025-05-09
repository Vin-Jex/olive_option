import { GetStaffActivitiesType } from "../../types/staff/auth.types";
import { ResponseType } from '../../types/api.types';
import { Order } from '../../models/Order';
import { Op } from "sequelize";
import { StatusCodes } from "http-status-codes";
import { messages, setting_keys } from "../../utils/consts";
import { GenericPaginationSchemaType } from "../../types/staff/user.types";
import { SingleIdType } from "../../types/trades.types";
import { Transaction } from "../../models/Transaction";
import { User } from "../../models/User";
import { CreatePairType, EditPairType } from "../../types/staff/trade.types";
import { TradePair } from "../../models/TradePair";
import { CustomProfitOutcome } from "../../models/CustomProfitOutcome";
import { getSettingsService } from "./setting.service";

export const tradeHistoryService = async (payload : GetStaffActivitiesType) : Promise<ResponseType> =>{
    let { id, q, size, page, order } = payload;

    let where : any = { user_id : id, livemode : true };

    if(q){
        where.symbol = { [Op.like] : '%'+q+'%' }
    }

    let trades = await Order.findAll({ where, limit : size, offset : page, order : [['id', order]] });
    let total_count = await Order.count({ where });
    let total_pages = Math.ceil(total_count / size);

    if (page > 1) {
        page = (Math.ceil(page / size)) + 1;
    } else {
        page = 1;
    }

    return { ok: true, status: StatusCodes.OK, body: { page, size, total_count, total_pages, trades }, message: messages.OK }
}

export const allHistoryService = async (payload : GenericPaginationSchemaType) : Promise<ResponseType> =>{
    let { q, size, page, order } = payload;



    let where : any = { livemode : true };

    if(q){
        where.symbol = { [Op.like] : '%'+q+'%' }
    }

    let trades = await Order.findAll({ where, limit : size, offset : page, order : [['id', order]] });
    let total_count = await Order.count({ where });
    let total_pages = Math.ceil(total_count / size);

    if (page > 1) {
        page = (Math.ceil(page / size)) + 1;
    } else {
        page = 1;
    }

    return { ok: true, status: StatusCodes.OK, body: { page, size, total_count, total_pages, trades }, message: messages.OK }
}

export const getHistoryService = async (payload : SingleIdType) : Promise<ResponseType> =>{
    const { id } = payload;

    let trade = await Order.findOne({
        where : { id, livemode : true },
        include : [
            {
                model : Transaction,
                as : "transaction"
            },
            {
                model : User,
                as : "order_user",
                attributes : ['id', 'first_name', 'email', 'created_at', 'updated_at', 'is_disabled', "pfp_url"]
            }
        ]
    });
    
    return { ok : true, message : messages.OK, body : { trade }, status : StatusCodes.OK };
}


export const createPairService = async (payload : CreatePairType) : Promise<ResponseType> =>{
    const { category, base_asset, quote_asset } = payload;

    let pair = await TradePair.findOne({ where : { category, base_asset, quote_asset } });

    if(pair){
        throw { ok : false, message : messages.DUPLICATE_DATA, status : StatusCodes.BAD_REQUEST }
    }

    pair = await TradePair.create({...payload, name : `${base_asset}/${quote_asset}`});

    return await getPairService({ id : pair.id })
}

export const editPairService = async (payload : EditPairType) : Promise<ResponseType> =>{
    const { id } = payload;

    let pair = await TradePair.findOne({ where : { id } });

    if(!pair){
        throw { ok : false, message : messages.NOT_FOUND, status : StatusCodes.NOT_FOUND };
    }

    let editPayload : any = {...payload};
    delete editPayload.id;

    await TradePair.update(editPayload, { where : { id } });

    return await getPairService({ id : pair.id })
}

export const deletePairService = async (payload : SingleIdType) : Promise<ResponseType> =>{
    const { id } = payload;

    let pair = await TradePair.findOne({ where : { id } });

    if(!pair){
        throw { ok : false, message : messages.NOT_FOUND, status : StatusCodes.OK }
    }

    await TradePair.destroy({ where : { id } });

    return { ok : true, message : messages.OK, status : StatusCodes.OK };
}

export const listPairsService = async (payload : GenericPaginationSchemaType) : Promise<ResponseType> =>{
    let { order, size, q, page } = payload;

    let where : any = { }

    if(q){
        where.name = { [Op.like] : '%'+q+'%' };
    }

    let pairs = await TradePair.findAll({ where, limit : size, offset : page, order : [['id', order]] });
    let total_count = await TradePair.count({ where });
    let total_pages = Math.ceil(total_count / size);

    if (page > 1) {
        page = (Math.ceil(page / size)) + 1;
    } else {
        page = 1;
    }

    return { ok: true, status: StatusCodes.OK, body: { page, size, total_count, total_pages, pairs }, message: messages.OK }
}

export const getPairService = async (payload : SingleIdType) : Promise<ResponseType> =>{
    const { id } = payload;

    let pair : any = await TradePair.findOne({ where : { id } });

    if(!pair){
        throw { ok : false, message : messages.NOT_FOUND, status : StatusCodes.OK }
    }

    let searchUniqueOutcome = await CustomProfitOutcome.findOne({ where : { ticker : pair.base_asset } });

    let resPair : any = {...pair.dataValues};

    if(searchUniqueOutcome){
        resPair.profit_percent = searchUniqueOutcome.profit_outcome;
    }else{
        resPair.profit_percent = (await getSettingsService()).body[setting_keys.profit_outcome] || 0;
    }

    return { ok : true, message : messages.OK, status : StatusCodes.OK, body : { pair : resPair } };
}