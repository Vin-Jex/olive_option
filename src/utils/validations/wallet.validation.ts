import * as Joi from 'joi';
import { ObjectSchema } from 'joi';
import { 
    ListTransactionsType,
    InitFunWalletType,
    InitPayoutType
} from '../../types/wallet.types';
import validator, { paginationValidation } from '../validator';
import { transaction_statuses, transaction_type, user_roles } from '../consts';

export const initPayoutValidation = (body : any) : InitPayoutType =>{
    const schema : ObjectSchema = Joi.object({
        crypto_currency : Joi.string().required(),
        amount_in_usd : Joi.number().required(),
        wallet_address : Joi.string().required(),
        user_type : Joi.any().valid(...(Object.values(user_roles))).optional().default(user_roles.user)
    });

    return validator(schema, body);
}

export const listTransactionsValidation = (body : any) : ListTransactionsType =>{
    const schema : ObjectSchema = Joi.object({
        limit : Joi.number().optional().default(10),
        offset : Joi.number().optional().default(0),
        type : Joi.any().valid(...Object.values(transaction_type)).optional(),
        status : Joi.any().valid(...Object.values(transaction_statuses)).optional(),
        date_from : Joi.date().optional(),
        date_to : Joi.date().optional(),
        user_type : Joi.any().valid(...(Object.values(user_roles))).optional().default(user_roles.user)
    });

    const values = validator(schema, body);
    return paginationValidation(values);
}

export const initFundWalletValidation = (body : any) : InitFunWalletType =>{
    const schema : ObjectSchema = Joi.object({
        amount : Joi.number().required(),
        crypto_currency : Joi.string().required(),
        user_type : Joi.any().valid(...(Object.values(user_roles))).optional().default(user_roles.user)
    });

    return validator(schema, body);
}