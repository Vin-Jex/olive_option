import env from '../config/config';
import { request_methods, nowpay_endpoints } from '../utils/consts';
import { openRequest } from '../utils/network';

const getNowPayToken = async () : Promise<string | null> =>{
    const body = {
        email : env.NOWPAY_EMAIL,
        password : env.NOWPAY_PASSWORD
    }

    let response = await openRequest(request_methods.post, `${env.NOWPAY_BASEURL}${nowpay_endpoints.auth}`, body);

    if(!response.token){
        return null;
    }

    return response.token;
}


export const initNowPayPayment = async (amount : number, crypto : string, customer_name : string) : Promise<any> =>{
    let token = await getNowPayToken();

    if(token == null){
        return null;
    }

    let body : any = {
        price_amount: amount,
        price_currency: "usd",
        pay_currency: crypto.toLowerCase(),
        ipn_callback_url: env.NOWPAY_WEBHOOK,
        order_description: `Wallet funding of USD${amount} from ${customer_name} using ${crypto}`
    };

    let headers : any = {
        'x-api-key' : env.NOWPAY_API_KEY,
        Authorization : `Bearer ${token}`
    }

    let response = await openRequest(request_methods.post, `${env.NOWPAY_BASEURL}${nowpay_endpoints.init_payment}`, body, headers);

    if(!response.payment_id){
        return null;
    }

    return response;
}

const getNowPayEstimateService = async (currency_from : string, currency_to : string, amount : number) : Promise<any | null> =>{
    let token = await getNowPayToken();

    if(token == null){
        return null;
    }

    let headers : any = {
        'x-api-key' : env.NOWPAY_API_KEY,
        Authorization : `Bearer ${token}`
    }

    let response = await openRequest(request_methods.get, `${env.NOWPAY_BASEURL}${nowpay_endpoints.estimate}?amount=${amount}&currency_from=${currency_from}&currency_to=${currency_to}`, undefined, headers);

    if(!response.estimated_amount){
        return null;
    }

    return response;
}

export const initNowPayPayout = async (crypto : string, amount_in_usd : number, wallet_address : string) : Promise<any | null> =>{
    let token = await getNowPayToken();
    let estimates = await getNowPayEstimateService('usd', crypto, amount_in_usd);

    if(token == null || estimates == null){
        return null;
    }

    let headers : any = {
        'x-api-key' : env.NOWPAY_API_KEY,
        Authorization : `Bearer ${token}`
    }

    let body = {
        withdrawals : [
            {
                address : wallet_address,
                currency : crypto,
                amount : estimates.estimated_amount,
                ipn_callback_url: env.NOWPAY_WEBHOOK
            }
        ]
    }

    let response = await openRequest(request_methods.post, `${env.NOWPAY_BASEURL}${nowpay_endpoints.payout}`, body, headers);

    if(!response?.status){
        return null;
    }

    return response.withdrawals[0];
}