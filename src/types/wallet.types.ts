import { 
    order_prediction_types,
    transaction_statuses,
    transaction_type,
    user_roles
 } from "../utils/consts";

export interface PlaceOrderType{
    option : string,
    expiration : Date,
    amount : number,
    prediction : order_prediction_types
}

export interface ListTransactionsType{
    limit : number,
    offset : number,
    type? : transaction_type,
    status?: transaction_statuses,
    date_from?: Date,
    date_to?: Date,
    user_type : user_roles
}

export interface InitFunWalletType{
    amount : number,
    crypto_currency : string,
    user_type : user_roles
}

export interface InitPayoutType{
    crypto_currency : string,
    amount_in_usd : number,
    wallet_address : string,
    user_type : user_roles
}