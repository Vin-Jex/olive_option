import * as Joi from 'joi';
import { ObjectSchema } from 'joi';
import validator, { paginationValidation2 } from '../../validator';
import { listing_order } from '../../consts';
import { 
    CreateFaqCategoryType,
    EditFaqCategoryType,
    CreateFaqType,
    EditFaqType,
    ListFaqsType
} from '../../../types/staff/faq.types';

export const createFaqCategoryValidation = (body : any) : CreateFaqCategoryType =>{
    const schema : ObjectSchema = Joi.object({
        name : Joi.string().required()
    });

    return validator(schema, body);
}

export const editFaqCategoryValidation = (body : any) : EditFaqCategoryType =>{
    const schema : ObjectSchema = Joi.object({
        name : Joi.string().required(),
        id : Joi.number().required()
    });

    return validator(schema, body);
}

export const createFaqValidation = (body : any) : CreateFaqType =>{
    const schema : ObjectSchema = Joi.object({
        category : Joi.number().required(),
        question : Joi.string().required(),
        answer : Joi.string().required()
    });

    return validator(schema, body);
}

export const editFaqValidation = (body : any) : EditFaqType =>{
    const schema : ObjectSchema = Joi.object({
        id : Joi.number().required(),
        category : Joi.number().optional(),
        question : Joi.string().optional(),
        answer : Joi.string().optional()
    });

    return validator(schema, body);
}

export const listFaqsValidation = (body : any) : ListFaqsType =>{
    const schema : ObjectSchema = Joi.object({
        q : Joi.string().optional(),
        page : Joi.number().optional().default(1).min(1),
        size : Joi.number().optional().default(20).min(1),
        category : Joi.number().optional(),
        order : Joi.any().valid(...(Object.values(listing_order))).optional().default(listing_order.desc)
    });

    let values = validator(schema, body);
    return paginationValidation2(values);
}