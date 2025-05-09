import { Request, Response } from "express";
import { log } from '../../utils/logger';
import { 
    generaticPaginationValidation,
    createUserValidation
} from "../../utils/validations/staff/user.validation";
import { singleIdValidation } from '../../utils/validations/trades.validation';
import { 
    listUsersService,
    createUserService,
    deleteUserService,
    toggleStatusService,
    getUserService
} from "../../services/staff/user.service";
import { Staff } from "../../models/Staff";

export default {
    getUser : async (req : Request & { staff : Staff }, res : Response) : Promise<Response> =>{
        const { ip, url, params } = req;

        try{
            let payload = singleIdValidation(params);
            let service = await getUserService(payload);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    toggleStatus : async (req : Request & { staff : Staff }, res : Response) : Promise<Response> =>{
        const { ip, url, params } = req;

        try{
            let payload = singleIdValidation(params);
            let service = await toggleStatusService(payload);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    deleteUser : async (req : Request & { staff : Staff }, res : Response) : Promise<Response> =>{
        const { ip, url, params } = req;

        try{
            let payload = singleIdValidation(params);
            let service = await deleteUserService(payload);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    createUser : async (req : Request & { staff : Staff }, res : Response) : Promise<Response> =>{
        const { ip, url, body } = req;

        try{
            let payload = createUserValidation(body);
            let service = await createUserService(payload);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    listUsers : async (req : Request & { staff : Staff }, res : Response) : Promise<Response> =>{
        const { ip, url, query } = req;

        try{
            let payload = generaticPaginationValidation(query);
            let service = await listUsersService(payload);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
}