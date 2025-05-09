import * as Joi from 'joi';
import { ObjectSchema } from 'joi';
import { 
    SignupType, 
    UpdateUserDetailsType,
    UpdateUserSettingsType,
    ChangePasswordType,
    ResetOtpType,
    ResetVerifyType,
    ResetPasswordType,
    VerifyOtpType
} from '../../types/user.types';
import validator from '../validator';
import { FileUploadType } from '../../types/api.types';

export const uploadProfilePicValidation = (body : any) : FileUploadType =>{
    const schema : ObjectSchema = Joi.object({
            fieldname : Joi.string().required(),
            originalname : Joi.string().required(),
            encoding : Joi.string().required(),
            mimetype : Joi.string().required(),
            size : Joi.number().required(),
            destination : Joi.string().required(),
            filename : Joi.string().required(),
            path : Joi.string().required()
        }).required()

    return validator(schema, body);
}

export const verifyOtpValidation = (body : any) : VerifyOtpType =>{
    const schema : ObjectSchema = Joi.object({
        otp : Joi.string().min(4).max(4).required()
    });

    return validator(schema, body);
}

export const resetPasswordValidation = (body : any) : ResetPasswordType =>{
    const schema : ObjectSchema = Joi.object({
        token : Joi.string().required(),
        password : Joi.string().required().min(8)
    });

    return validator(schema, body);
}

export const resetVerifyValidation = (body : any) : ResetVerifyType =>{
    const schema : ObjectSchema = Joi.object({
        email : Joi.string().required().email(),
        otp : Joi.string().required().max(4).min(4)
    });

    return validator(schema, body);
}

export const resetOtpValidation = (body : any) : ResetOtpType =>{
    const schema : ObjectSchema = Joi.object({
        email : Joi.string().email().required()
    });

    return validator(schema, body);
}

export const signupValidation = (body : any) : SignupType =>{
    const schema : ObjectSchema = Joi.object({
        email : Joi.string().required().email(),
        password : Joi.string().required().min(8)
    });
    
    return validator(schema, body);
}

export const updateUserDetailsValidation = (body : any) : UpdateUserDetailsType =>{
    const schema : ObjectSchema = Joi.object({
        first_name : Joi.string().optional(),
        last_name : Joi.string().optional(),
        date_of_birth : Joi.date().optional(),
        country : Joi.string().optional().max(2).min(2),
        phone : Joi.string()
                    .pattern(/^\+(\d{1,3})\s?(\d{4,14})$/)
                    .optional()
                    .messages({
                        'string.pattern.base': 'Phone number must include a country code and be in the format: +[country code] [number]',
                        'any.required': 'Phone number is required',
                    })
    });

    return validator(schema, body);
}

export const updateUserSettingsValidation = (body : any) : UpdateUserSettingsType =>{
    const schema : ObjectSchema = Joi.object({
        language : Joi.string().optional(),
        enable_sound : Joi.boolean().optional(),
        email_notification : Joi.boolean().optional()
    });

    return validator(schema, body);
}

export const changePasswordValidation = (body : any) : ChangePasswordType =>{
    const schema : ObjectSchema = Joi.object({
        old_password : Joi.string().required(),
        new_password : Joi.string().required()
    });

    return validator(schema, body);
}