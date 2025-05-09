import * as Joi from 'joi';
import { ObjectSchema } from 'joi';
import { 
    CreateAlertType,
    EditAlertType
} from '../../types/alert.types';
import validator from '../validator';


export const createAlertValidation = (body : any) : CreateAlertType =>{
    const schema : ObjectSchema = Joi.object({
        ticker : Joi.string().required(),
        amount : Joi.number().required()
    });

    return validator(schema, body);
}

export const editAlertValidation = (body : any) : EditAlertType =>{
    const schema : ObjectSchema = Joi.object({
        id : Joi.number().required(),
        ticker : Joi.string().optional(),
        amount : Joi.number().optional()
    });

    return validator(schema, body);
}
