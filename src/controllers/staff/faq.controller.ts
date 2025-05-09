import { Staff } from '../../models/Staff';
import { Request, Response } from 'express';
import { 
    createFaqCategoryValidation,
    editFaqCategoryValidation,
    createFaqValidation,
    editFaqValidation,
    listFaqsValidation
} from '../../utils/validations/staff/faq.validation';
import { 
    createFaqCategoryService,
    deleteFaqCategoryService,
    editFaqCategoryService,
    listFaqCategoriesService,
    createFaqService,
    editFaqService,
    deleteFaqService,
    listFaqsService,
    getFaqService
} from '../../services/staff/faq.service';
import { singleIdValidation } from '../../utils/validations/trades.validation';
import { generaticPaginationValidation } from '../../utils/validations/staff/user.validation';
import { log } from '../../utils/logger';

export default {
    createFaqCategory : async (req : Request & { staff : Staff }, res : Response) : Promise<Response> =>{
        const { url, ip, body } = req;

        try{
            let payload = createFaqCategoryValidation(body)
            let service = await createFaqCategoryService(payload);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    editFaqCategory : async (req : Request & { staff : Staff }, res : Response) : Promise<Response> =>{
        const { url, ip, body, params } = req;

        try{
            let payload = editFaqCategoryValidation({...body, ...params})
            let service = await editFaqCategoryService(payload);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    deleteFaqCategory : async (req : Request & { staff : Staff }, res : Response) : Promise<Response> =>{
        const { url, ip, params } = req;

        try{
            let payload = singleIdValidation(params)
            let service = await deleteFaqCategoryService(payload);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    listFaqCategories : async (req : Request & { staff : Staff }, res : Response) : Promise<Response> =>{
        const { ip, url, query } = req;

        try{
            let payload = generaticPaginationValidation(query);
            let service = await listFaqCategoriesService(payload);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    createFaq : async (req : Request & { staff : Staff }, res : Response) : Promise<Response> =>{
        const { ip, url, body } = req;

        try{
            let payload = createFaqValidation(body);
            let service = await createFaqService(payload);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    editFaq : async (req : Request & { staff : Staff }, res : Response) : Promise<Response> =>{
        const { ip, url, body, params } = req;

        try{
            let payload = editFaqValidation({...body, ...params});
            let service = await editFaqService(payload);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    deleteFaq : async (req : Request & { staff : Staff }, res : Response) : Promise<Response> =>{
        const { ip, url, params } = req;

        try{
            let payload = singleIdValidation(params);
            let service = await deleteFaqService(payload);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    listFaqs : async (req : Request & { staff : Staff }, res : Response) : Promise<Response> =>{
        const { ip, url, query } = req;

        try{
            let payload = listFaqsValidation(query);
            let service = await listFaqsService(payload);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    getFaq : async (req : Request & { staff : Staff }, res : Response) : Promise<Response> =>{
        const { ip, url, params } = req;

        try{
            let payload = singleIdValidation(params);
            let service = await getFaqService(payload);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    }
}