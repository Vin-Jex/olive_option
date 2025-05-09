import { Staff } from '../../models/Staff';
import { Request, Response } from 'express';
import { 
    createContentValidation, 
    getContentValidation,
} from '../../utils/validations/staff/content.validation';
import { 
    createContentService, 
    getContentService, 
    deleteContentService,
} from '../../services/staff/content.service';
import { singleIdValidation } from '../../utils/validations/trades.validation';
import { log } from '../../utils/logger';

export default {
    createContent : async (req : Request & { staff : Staff }, res : Response) : Promise<Response> =>{
        const { url, ip, body, staff, file } = req;

        try{
            let payload = createContentValidation({...body, document : file})
            let service = await createContentService(payload);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    getContent : async (req : Request & { staff : Staff }, res : Response) : Promise<Response> =>{
        const { url, ip, params } = req;

        try{
            let payload = getContentValidation(params)
            let service = await getContentService(payload);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    deleteContent : async (req : Request & { staff : Staff }, res : Response) : Promise<Response> =>{
        const { url, ip, params } = req;

        try{
            let payload = singleIdValidation(params)
            let service = await deleteContentService(payload);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    }
}