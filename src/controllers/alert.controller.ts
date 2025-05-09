import { Request, Response } from "express";
import { User } from "../models/User";
import { createAlertValidation, editAlertValidation } from '../utils/validations/alert.validation';
import { 
    createAlertService, 
    editAlertService, 
    deleteAlertService, 
    listAlertsService,
    getAlertService
} from '../services/alert.service';
import { log } from "../utils/logger";
import { singleIdValidation } from '../utils/validations/trades.validation';
import { generaticPaginationValidation } from '../utils/validations/staff/user.validation';

export default {
    createAlert : async (req : Request & { user : User }, res : Response) : Promise<Response> =>{
        let { ip, body, url, user } = req;

        try{
            let payload = createAlertValidation(body);
            let service = await createAlertService(payload, user);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    editAlert : async (req : Request & { user : User }, res : Response) : Promise<Response> =>{
        let { ip, body, url, user, params } = req;

        try{
            let payload = editAlertValidation({...body, ...params});
            let service = await editAlertService(payload, user);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    deleteAlert : async (req : Request & { user : User }, res : Response) : Promise<Response> =>{
        let { ip, url, user, params } = req;

        try{
            let payload = singleIdValidation(params);
            let service = await deleteAlertService(payload, user);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    listAlerts : async (req : Request & { user : User }, res : Response) : Promise<Response> =>{
        let { ip, url, query, user } = req;

        try{
            let payload = generaticPaginationValidation(query);
            let service = await listAlertsService(payload, user);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    getAlert : async (req : Request & { user : User }, res : Response) : Promise<Response> =>{
        let { ip, url, user, params } = req;

        try{
            let payload = singleIdValidation(params);
            let service = await getAlertService(payload, user);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    }
}