import { Request, Response } from "express";
import { log } from '../../utils/logger';
import { 
    createPairValidation,
    editPairValidation
} from "../../utils/validations/staff/trade.validation";
import { singleIdValidation } from '../../utils/validations/trades.validation';
import { getStaffActivitesValidation } from '../../utils/validations/staff/auth.validation';
import { 
    tradeHistoryService,
    allHistoryService,
    getHistoryService,
    createPairService,
    editPairService,
    deletePairService,
    listPairsService,
    getPairService
} from "../../services/staff/trade.service";
import { Staff } from "../../models/Staff";
import { generaticPaginationValidation } from "../../utils/validations/staff/user.validation";

export default {
    deletePair : async (req : Request & { staff : Staff }, res : Response) : Promise<Response> =>{
        const { ip, url, params } = req;

        try{
            let payload = singleIdValidation(params);
            let service = await deletePairService(payload);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    getPair : async (req : Request & { staff : Staff }, res : Response) : Promise<Response> =>{
        const { ip, url, params } = req;

        try{
            let payload = singleIdValidation(params);
            let service = await getPairService(payload);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    createPair : async (req : Request & { staff : Staff }, res : Response) : Promise<Response> =>{
        const { ip, url, body } = req;

        try{
            let payload = createPairValidation(body);
            let service = await createPairService(payload);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    editPair : async (req : Request & { staff : Staff }, res : Response) : Promise<Response> =>{
        const { ip, url, body, params } = req;

        try{
            let payload = editPairValidation({...body, ...params});
            let service = await editPairService(payload);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    listPairs : async (req : Request & { staff : Staff }, res : Response) : Promise<Response> =>{
        const { ip, url, query } = req;

        try{
            let payload =  generaticPaginationValidation(query);
            let service = await listPairsService(payload);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    getTrade : async (req : Request & { staff : Staff }, res : Response) : Promise<Response> =>{
        const { ip, url, params } = req;

        try{
            let payload = singleIdValidation(params);
            let service = await getHistoryService(payload);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    tradeHistory : async (req : Request & { staff : Staff }, res : Response) : Promise<Response> =>{
        const { ip, url, query, params } = req;

        try{
            let payload = getStaffActivitesValidation({...params, ...query});
            let service = await tradeHistoryService(payload);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    allHistory : async (req : Request & { staff : Staff }, res : Response) : Promise<Response> =>{
        const { ip, url, query } = req;

        try{
            let payload =  generaticPaginationValidation(query);
            let service = await allHistoryService(payload);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    }
}