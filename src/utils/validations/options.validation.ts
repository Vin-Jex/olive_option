import * as Joi from 'joi';
import { ObjectSchema } from 'joi';
import { 
    ListTickersType,
    PinTickerType,
    GetTickerType
} from '../../types/options.types';
import validator from '../validator';

export const listTickersValidation = (body : any) : ListTickersType =>{
    const schema : ObjectSchema = Joi.object({
        symbol : Joi.string().optional()
    });

    return validator(schema, body);
}

export const pinTickerValidation = (body : any) : PinTickerType =>{
    const schema : ObjectSchema = Joi.object({
        symbol : Joi.string().required(),
        full_data : Joi.any().required()
    });

    return validator(schema, body);
}

export const getTickerValidation = (body : any) : GetTickerType =>{
    const schema : ObjectSchema = Joi.object({
        ticker : Joi.string().required()
    });

    return validator(schema, body);
}