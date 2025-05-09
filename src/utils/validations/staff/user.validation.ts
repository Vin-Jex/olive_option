import * as Joi from 'joi';
import { ObjectSchema } from 'joi';
import validator, { paginationValidation2 } from '../../validator';
import { listing_order } from '../../consts';
import { GenericPaginationSchemaType, CreateUserType } from '../../../types/staff/user.types';


export const generaticPaginationValidation = (body : any) : GenericPaginationSchemaType =>{
    const schema : ObjectSchema = Joi.object({
        q : Joi.string().optional(),
        page : Joi.number().optional().default(1).min(1),
        size : Joi.number().optional().default(20).min(1),
        order : Joi.any().valid(...(Object.values(listing_order))).optional().default(listing_order.desc)
    });

    let values = validator(schema, body);
    return paginationValidation2(values);
}

export const createUserValidation = (body : any) : CreateUserType =>{
    const schema : ObjectSchema = Joi.object({
        full_name : Joi.string().required(),
        email : Joi.string().required().email(),
        password : Joi.string().required()
    });

    return validator(schema, body);
}