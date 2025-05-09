import { Request, Response } from "express";
import { log } from '../../utils/logger';
import { 
    listTransactionsValidation,
    listWalletsValidation
} from "../../utils/validations/staff/finance.validation";
import { singleIdValidation } from '../../utils/validations/trades.validation';
import { getStaffActivitesValidation } from '../../utils/validations/staff/auth.validation';
import { 
    transactionHistoryService,
    dashboardService,
    listTransactionsService,
    listWalletsService,
    getTransactionService
} from "../../services/staff/finance.service";
import { Staff } from "../../models/Staff";

export default {
    getTransaction : async (req : Request & { staff : Staff }, res : Response) : Promise<Response> =>{
        const { ip, url, params } = req;

        try{
            let payload = singleIdValidation(params);
            let service = await getTransactionService(payload);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    listWallets  : async (req : Request & { staff : Staff }, res : Response) : Promise<Response> =>{
        const { ip, url, query } = req;

        try{
            let payload = listWalletsValidation(query);
            let service = await listWalletsService(payload);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    listTransactions : async (req : Request & { staff : Staff }, res : Response) : Promise<Response> =>{
        const { ip, url, query } = req;

        try{
            let payload = listTransactionsValidation(query);
            let service = await listTransactionsService(payload);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    dashboard : async (req : Request & { staff : Staff }, res : Response) : Promise<Response> =>{
        const { ip, url } = req;

        try{
            let service = await dashboardService();
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    transactionHistory : async (req : Request & { staff : Staff }, res : Response) : Promise<Response> =>{
        const { ip, url, query, params } = req;

        try{
            let payload = getStaffActivitesValidation({...params, ...query});
            let service = await transactionHistoryService(payload);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    }
}