import { Request, Response } from 'express';
import { log } from '../utils/logger';
import { 
    listTickersValidation,
    pinTickerValidation,
    getTickerValidation
} from '../utils/validations/options.validation';
import { 
    getTickersService,
    pinTickerService,
    listPinnedTickersService,
    deletePinnedTickerService,
    getTickerService
} from '../services/options.service';
import { User } from '../models/User';
import { singleIdValidation } from '../utils/validations/trades.validation';

export default {
    getTickers : async (req : Request & { user : User }, res : Response) : Promise<Response> =>{
        const { ip, url, user, query } = req;

        try{
            let payload = listTickersValidation(query);
            let service = await getTickersService(payload);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    pinTicker : async (req : Request & { user : User }, res : Response) : Promise<Response> =>{
        const { ip, url, user, body } = req;

        try{
            let payload = pinTickerValidation(body);
            let service = await pinTickerService(payload, user);
            return res.status(service.status).json({...service});
        }catch(error : any){
            console.log(error)
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    listPinnedTickers : async (req : Request & { user : User }, res : Response) : Promise<Response> =>{
        const { ip, url, user } = req;

        try{
            let service = await listPinnedTickersService(user);
            return res.status(service.status).json({...service});
        }catch(error : any){
            console.log(error)
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    deletePinned : async (req : Request & { user : User }, res : Response) : Promise<Response> =>{
        const { ip, url, user, params } = req;

        try{
            let payload = singleIdValidation(params);
            let service = await deletePinnedTickerService(payload, user);
            return res.status(service.status).json({...service});
        }catch(error : any){
            console.log(error)
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    getTicker : async (req : Request & { user : User }, res : Response) : Promise<Response> =>{
        const { ip, url, user, params } = req;

        try{
            let payload = getTickerValidation(params);
            let service = await getTickerService(payload);
            return res.status(service.status).json({...service});
        }catch(error : any){
            console.log(error)
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
}