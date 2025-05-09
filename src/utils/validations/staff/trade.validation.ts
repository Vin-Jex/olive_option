import * as Joi from 'joi';
import { ObjectSchema } from 'joi';
import validator, { paginationValidation2 } from '../../validator';
import { trade_pair_categories } from '../../consts';
import {
    CreatePairType,
    EditPairType
} from '../../../types/staff/trade.types';

export const createPairValidation = (body : any) : CreatePairType =>{
    const schema : ObjectSchema = Joi.object({
        category : Joi.any().valid(...(Object.values(trade_pair_categories))).required(),
        base_asset : Joi.string().required(),
        quote_asset : Joi.string().required(),
        is_active : Joi.boolean().optional().default(true)
    });

    return validator(schema, body)
}

export const editPairValidation = (body : any) : EditPairType =>{
    const schema : ObjectSchema = Joi.object({
        id : Joi.number().required(),
        category : Joi.any().valid(...(Object.values(trade_pair_categories))).optional(),
        base_asset : Joi.string().optional(),
        quote_asset : Joi.string().optional(),
        is_active : Joi.boolean().optional().default(true)
    });

    return validator(schema, body)
}