import * as Joi from 'joi';
import { ObjectSchema } from 'joi';
import { 
    SingleIdType,
    TradeHistoryTypes,
    LeadersBoardType
} from '../../types/trades.types';
import validator, { paginationValidation2 } from '../validator';
import { listing_order } from '../consts';

export const tradeHistoryValidation = (body : any) : TradeHistoryTypes =>{
    const schema : ObjectSchema = Joi.object({
        q : Joi.string().optional(),
        size : Joi.number().optional().default(20).min(1),
        page : Joi.number().optional().default(1).min(1),
        order : Joi.any().valid(...(Object.values(listing_order))).optional().default(listing_order.desc),
        period : Joi.number().optional(),
        pending : Joi.boolean().optional(),
        symbol : Joi.string().optional()
    });

    let values = validator(schema, body);
    return paginationValidation2(values);
}

export const singleIdValidation = (body : any) : SingleIdType =>{
    const schema : ObjectSchema = Joi.object({
        id : Joi.any().required()
    });

    return validator(schema, body);
}

export const leadersBoardValidation = (body : any) : LeadersBoardType =>{
    const schema : ObjectSchema = Joi.object({
        period : Joi.number().required().max(30).min(1)
    });

    return validator(schema, body);
}