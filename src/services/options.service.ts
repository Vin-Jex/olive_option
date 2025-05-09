import { ResponseType } from '../types/api.types';
import { openRequest } from '../utils/network';
import { request_methods, polygon_endpoints, messages } from '../utils/consts';
import { log } from '../utils/logger';
import { StatusCodes } from 'http-status-codes';
import env from '../config/config';
import { GetTickerType, ListTickersType, PinTickerType } from '../types/options.types';
import { User } from '../models/User';
import { PinnedOption } from '../models/PinnedOption';
import { Sequelize } from 'sequelize-typescript';
import { SingleIdType } from '../types/trades.types';

export const getTickersService = async (payload : ListTickersType) : Promise<ResponseType> =>{
    try{
        let url = `${env.POLYGON_BASEURL}${polygon_endpoints.tickers}?market=crypto&active=true&limit=1000`;

        if(payload.symbol){
            url += `&ticker=${payload.symbol}`
        }

        let request = await openRequest(request_methods.get, url, undefined, { Authorization : `Bearer ${env.POLYGON_API_KEY}` });

        if(request.status != "OK"){
            throw request;
        }

        return { ok : true, message : messages.OK, status : StatusCodes.OK, body : { tickers : request.results } };
    }catch(error : any){
        log('error', { error });
        throw { ok : false, message : messages.SERVER_ERROR, status : StatusCodes.INTERNAL_SERVER_ERROR };
    }
}

export const getTickerService = async (payload : GetTickerType) : Promise<ResponseType> =>{
    const { ticker } = payload;

    try{
        let url = `${env.POLYGON_BASEURL}${polygon_endpoints.tickers}?market=crypto&ticker=${ticker}`;

        let request = await openRequest(request_methods.get, url, undefined, { Authorization : `Bearer ${env.POLYGON_API_KEY}` });

        if(request.status != "OK"){
            throw request;
        }

        return { ok : true, message : messages.OK, status : StatusCodes.OK, body : { ticker : request.results } };
    }catch(error : any){
        log('error', { error });
        throw { ok : false, message : messages.SERVER_ERROR, status : StatusCodes.INTERNAL_SERVER_ERROR };
    }
}

export const pinTickerService = async (payload : PinTickerType, user : User) : Promise<ResponseType> =>{
    const { symbol, full_data } = payload;

    await PinnedOption.destroy({ where : { user_id : user.id, symbol } })
    await PinnedOption.create({ symbol, full_data : JSON.stringify(full_data), user_id : user.id });

    return { ok : true, message : messages.OK, status : StatusCodes.OK };
}

export const listPinnedTickersService = async (user : User) : Promise<ResponseType> =>{
    let tickers : any = await PinnedOption.findAll({ 
        where : { user_id : user.id }, 
        order : [['created_at', 'desc']],
        attributes: [
            'id', 
            'user_id', 
            'created_at', 
            'updated_at',
            'symbol',
            [Sequelize.literal('full_data::jsonb'), 'full_data']
          ]
    });

    // tickers = tickers.map((t : any)=>{ return t.full_data })

    return { ok : true, message : messages.OK, status : StatusCodes.OK, body : { tickers } };
}

export const deletePinnedTickerService = async (payload : SingleIdType, user : User) : Promise<ResponseType> =>{
    const { id } = payload;

    let pinned = await PinnedOption.findOne({ where : { id, user_id : user.id } });

    if(!pinned){
        throw { ok : false, message : messages.NOT_FOUND, status : StatusCodes.NOT_FOUND };
    }

    await PinnedOption.destroy({ where : { id } });

    return { ok : true, message : messages.OK, status : StatusCodes.OK };
}

export const getTickerHistory = async (ticker : string) : Promise<Array<any>> =>{
    let newTicker : any = ticker.split("-");
    newTicker = `X:${newTicker[0]}${newTicker[1]}`;

    try{
        let to : any = (new Date()).getTime();
        let from : any = (new Date(to - (8 * 60 * 60 * 1000))).getTime();

        let url = `${env.POLYGON_BASEURL}${polygon_endpoints.agg_history}${newTicker}/range/1/second/${from}/${to}?limit=10000`;

        let request = await openRequest(request_methods.get, url, undefined, { Authorization : `Bearer ${env.POLYGON_API_KEY}` });

        if(request.status != "OK"){
            throw request;
        }

        return request.results;
    }catch(error : any){
        log('error', { error });
        throw { ok : false, message : messages.SERVER_ERROR, status : StatusCodes.INTERNAL_SERVER_ERROR };
    }
}