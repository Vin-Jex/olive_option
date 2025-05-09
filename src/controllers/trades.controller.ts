import { Request, Response } from 'express';
import { log } from '../utils/logger';
import { 
    tradeHistoryValidation,
    singleIdValidation,
    leadersBoardValidation
} from '../utils/validations/trades.validation';
import { 
    tradeHistoryService,
    getHistoryService,
    leadersBoardService
} from '../services/trades.service';
import { User } from '../models/User';

export default {
    history : async (req : Request & { user : User }, res : Response) : Promise<Response> =>{
        const { ip, url, user, query } = req;

        try{
            let payload = tradeHistoryValidation(query);
            let service = await tradeHistoryService(payload, user);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    getHistory : async (req : Request & { user : User }, res : Response) : Promise<Response> =>{
        const { ip, url, user, params } = req;

        try{
            let payload = singleIdValidation(params);
            let service = await getHistoryService(payload, user);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    leadersBoard : async (req : Request & { user : User }, res : Response) : Promise<Response> =>{
        const { ip, url, user, query } = req;

        try{
            let payload = leadersBoardValidation(query);
            let service = await leadersBoardService(payload);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    }
}