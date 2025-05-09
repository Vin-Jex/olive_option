import * as Joi from 'joi';
import { ObjectSchema } from 'joi';
import validator, { paginationValidation2 } from '../../validator';
import { promotional_material_section_types, promotional_material_types, listing_order } from '../../consts';
import {
    CreateSectionType,
    EditSectionType,
    CreateMaterialType,
    EditMaterialType,
    ListMaterialsType,
    ListSectionsType
} from '../../../types/staff/promotion.types';

export const createSectionValidation = (body: any): CreateSectionType => {
    const schema: ObjectSchema = Joi.object({
        name: Joi.string().required().trim(),
        type: Joi.any().valid(...(Object.values(promotional_material_section_types))).required(),
        thumbnail: Joi.object({
            fieldname: Joi.string().required(),
            originalname: Joi.string().required(),
            encoding: Joi.string().required(),
            mimetype: Joi.string().required(),
            size: Joi.number().required(),
            destination: Joi.string().required(),
            filename: Joi.string().required(),
            path: Joi.string().required()
        }).required()
    });

    return validator(schema, body);
}

export const editSectionValidation = (body: any): EditSectionType => {
    const schema: ObjectSchema = Joi.object({
        id: Joi.number().required(),
        name: Joi.string().optional().trim(),
        type: Joi.any().valid(...(Object.values(promotional_material_section_types))).optional(),
        thumbnail: Joi.object({
            fieldname: Joi.string().required(),
            originalname: Joi.string().required(),
            encoding: Joi.string().required(),
            mimetype: Joi.string().required(),
            size: Joi.number().required(),
            destination: Joi.string().required(),
            filename: Joi.string().required(),
            path: Joi.string().required()
        }).optional()
    });

    return validator(schema, body);
}

export const createMaterialValidation = (body: any): CreateMaterialType => {
    const schema: ObjectSchema = Joi.object({
        language: Joi.string().required(),
        size: Joi.string().required(),
        media: Joi.object({
            fieldname: Joi.string().required(),
            originalname: Joi.string().required(),
            encoding: Joi.string().required(),
            mimetype: Joi.string().required(),
            size: Joi.number().required(),
            destination: Joi.string().required(),
            filename: Joi.string().required(),
            path: Joi.string().required()
        }).required(),
        section_id: Joi.number().required(),
        type: Joi.any().valid(...(Object.values(promotional_material_types))).required(),
    });

    return validator(schema, body)
}

export const editMaterialValidation = (body: any): EditMaterialType => {
    const schema: ObjectSchema = Joi.object({
        id: Joi.number().required(),
        language: Joi.string().optional(),
        size: Joi.string().optional(),
        media: Joi.object({
            fieldname: Joi.string().required(),
            originalname: Joi.string().required(),
            encoding: Joi.string().required(),
            mimetype: Joi.string().required(),
            size: Joi.number().required(),
            destination: Joi.string().required(),
            filename: Joi.string().required(),
            path: Joi.string().required()
        }).required(),
        section_id: Joi.number().optional(),
        type: Joi.any().valid(...(Object.values(promotional_material_types))).optional(),
    });

    return validator(schema, body)
}

export const listMaterialsValidation = (body: any): ListMaterialsType => {
    const schema: ObjectSchema = Joi.object({
        q: Joi.string().optional(),
        page: Joi.number().optional().default(1).min(1),
        size: Joi.number().optional().default(20).min(1),
        order: Joi.any().valid(...(Object.values(listing_order))).optional().default(listing_order.desc),
        section_id : Joi.number().required()
    });

    let values = validator(schema, body);
    return paginationValidation2(values);
}

export const listSectionsValidation = (body: any): ListSectionsType => {
    const schema: ObjectSchema = Joi.object({
        q: Joi.string().optional(),
        page: Joi.number().optional().default(1).min(1),
        size: Joi.number().optional().default(20).min(1),
        order: Joi.any().valid(...(Object.values(listing_order))).optional().default(listing_order.desc),
        type : Joi.any().valid(...(Object.values(promotional_material_section_types))).optional()
    });

    let values = validator(schema, body);
    return paginationValidation2(values);
}