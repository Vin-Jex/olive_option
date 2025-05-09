import * as Joi from 'joi';
import { ObjectSchema } from 'joi';
import validator, { paginationValidation2 } from '../../validator';
import { content_categories, content_user_categories, listing_order } from '../../consts';
import { 
    CreateContentType, 
    GetContentType
} from '../../../types/staff/content.types';

export const createContentValidation = (body : any) : CreateContentType =>{
    const schema : ObjectSchema = Joi.object({
        user_category : Joi.any().valid(...(Object.values(content_user_categories))).required(),
        category : Joi.any().valid(...(Object.values(content_categories))).required(),
        content : Joi.string().required(),
        document : Joi.object({
            fieldname : Joi.string().required(),
            originalname : Joi.string().required(),
            encoding : Joi.string().required(),
            mimetype : Joi.string().required(),
            size : Joi.number().required(),
            destination : Joi.string().required(),
            filename : Joi.string().required(),
            path : Joi.string().required()
        }).optional()
    });

    return validator(schema, body);
}

export const getContentValidation = (body : any) : GetContentType =>{

    const schema : ObjectSchema = Joi.object({
        user_category : Joi.any().valid(...(Object.values(content_user_categories))).required(),
        category : Joi.any().valid(...(Object.values(content_categories))).required()
    })

    return validator(schema, body);
}
