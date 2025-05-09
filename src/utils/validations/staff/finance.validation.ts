import * as Joi from 'joi';
import { ObjectSchema } from 'joi';
import validator, { paginationValidation2 } from '../../validator';
import { listing_order, transaction_statuses, transaction_type } from '../../consts';
import { ListTransactionType, ListWalletsType } from '../../../types/staff/finance.types';

export const listWalletsValidation = (body : any) : ListWalletsType =>{
    const schema : ObjectSchema = Joi.object({
        user_id : Joi.string().optional(),
        q : Joi.string().optional(),
        page : Joi.number().optional().default(1).min(1),
        size : Joi.number().optional().default(20).min(1),
        order : Joi.any().valid(...(Object.values(listing_order))).optional().default(listing_order.desc)
    });

    let values = validator(schema, body);
    return paginationValidation2(values);
}

export const listTransactionsValidation = (body : any) : ListTransactionType =>{
    const schema : ObjectSchema = Joi.object({
        q : Joi.string().optional(),
        page : Joi.number().optional().default(1).min(1),
        size : Joi.number().optional().default(20).min(1),
        order : Joi.any().valid(...(Object.values(listing_order))).optional().default(listing_order.desc),
        transaction_type : Joi.any().valid(...(Object.values(transaction_type))).optional(),
        transaction_status : Joi.any().valid(...(Object.values(transaction_statuses))).optional(),
        period : Joi.date().optional(),
        payment_method : Joi.string().optional(),
        min_amount : Joi.number().optional()
    });

    let values = validator(schema, body);
    return paginationValidation2(values);
}
