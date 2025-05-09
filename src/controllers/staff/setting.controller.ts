import { Request, Response } from "express";
import { Staff } from "../../models/Staff";
import { 
    createUpdateSettingValidation,
    blockIpValidation,
    createCustomProfitOutcomeValidation,
    editCustomProfitOutcomeValidation,
    createComissionValidation,
    editComissionValidation
} from "../../utils/validations/staff/setting.validation";
import { 
    createUpdateSettingService,
    getSettingsService,
    blockIpService,
    unblockIpService,
    listBlockedIpsService,
    createCustomProfitOutcomeService,
    editCustomProfitOutcomeService,
    deleteCustomProfitOutcomeService,
    listCustomProfitOutcomesService,
    createComissionService,
    editComissionService,
    deleteComissionService,
    listComissionsService
} from "../../services/staff/setting.service";
import { log } from "../../utils/logger";
import { singleIdValidation } from '../../utils/validations/trades.validation';
import { generaticPaginationValidation } from '../../utils/validations/staff/user.validation';

export default {
    listCustomProfitOutcomes : async (req : Request & { staff : Staff }, res : Response) : Promise<Response> =>{
        const { url, ip, query } = req;

        try{
            let payload = generaticPaginationValidation(query);
            let service = await listCustomProfitOutcomesService(payload);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    deleteCustomProfitOutcome : async (req : Request & { staff : Staff }, res : Response) : Promise<Response> =>{
        const { url, ip, params } = req;

        try{
            let payload = singleIdValidation(params);
            let service = await deleteCustomProfitOutcomeService(payload);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    editCustomProfitOutcome : async (req : Request & { staff : Staff }, res : Response) : Promise<Response> =>{
        const { url, ip, body, params } = req;

        try{
            let payload = editCustomProfitOutcomeValidation({...body, ...params});
            let service = await editCustomProfitOutcomeService(payload);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    createCustomProfitOutcome : async (req : Request & { staff : Staff }, res : Response) : Promise<Response> =>{
        const { url, ip, body } = req;

        try{
            let payload = createCustomProfitOutcomeValidation(body);
            let service = await createCustomProfitOutcomeService(payload);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    createComission : async (req : Request & { staff : Staff }, res : Response) : Promise<Response> =>{
        const { url, ip, body } = req;

        try{
            let payload = createComissionValidation(body);
            let service = await createComissionService(payload);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    editComission : async (req : Request & { staff : Staff }, res : Response) : Promise<Response> =>{
        const { url, ip, body, params } = req;

        try{
            let payload = editComissionValidation({...body, ...params});
            let service = await editComissionService(payload);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    deleteComission : async (req : Request & { staff : Staff }, res : Response) : Promise<Response> =>{
        const { url, ip, params } = req;

        try{
            let payload = singleIdValidation(params);
            let service = await deleteComissionService(payload);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    listComissions : async (req : Request & { staff : Staff }, res : Response) : Promise<Response> =>{
        const { url, ip, query } = req;

        try{
            let payload = generaticPaginationValidation(query);
            let service = await listComissionsService(payload);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    listBlockedIps : async (req : Request & { staff : Staff }, res : Response) : Promise<Response> =>{
        const { url, ip, query } = req;

        try{
            let payload = generaticPaginationValidation(query);
            let service = await listBlockedIpsService(payload);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    blockIp : async (req : Request & { staff : Staff }, res : Response) : Promise<Response> =>{
        const { url, ip, body } = req;

        try{
            let payload = blockIpValidation(body);
            let service = await blockIpService(payload);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    unblockIp : async (req : Request & { staff : Staff }, res : Response) : Promise<Response> =>{
        const { url, ip, params } = req;

        try{
            let payload = singleIdValidation(params);
            let service = await unblockIpService(payload);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    createUpdateSetting : async (req : Request & { staff : Staff }, res : Response) : Promise<Response> =>{
        const { url, ip, body } = req;

        try{
            let payload = createUpdateSettingValidation(body);
            let service = await createUpdateSettingService(payload);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    getSettings : async (req : Request & { staff : Staff }, res : Response) : Promise<Response> =>{
        const { url, ip, body } = req;

        try{
            let service = await getSettingsService();
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    }
}