import { Request, Response } from "express";
import { Staff } from "../../models/Staff";
import { 
    createSectionValidation, 
    editSectionValidation,
    createMaterialValidation,
    editMaterialValidation,
    listMaterialsValidation,
    listSectionsValidation
} from "../../utils/validations/staff/promotion.validation";
import { 
    createSectionService, 
    editSectionService, 
    deleteSectionService,
    listSectionsService,
    getSectionService,
    createMaterialService,
    editMaterialService,
    deleteMaterialService,
    listMaterialsService,
    getMaterialService
} from "../../services/staff/promotion.service";
import { log } from "../../utils/logger";
import { singleIdValidation } from '../../utils/validations/trades.validation';

export default {
    getMaterial : async (req : Request & { staff : Staff }, res : Response) : Promise<Response> =>{
        const { url, ip, params } = req;

        try{
            let payload = singleIdValidation(params)
            let service = await getMaterialService(payload);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    listMaterials : async (req : Request & { staff : Staff }, res : Response) : Promise<Response> =>{
        const { url, ip, query, staff } = req;

        try{
            let payload = listMaterialsValidation(query)
            let service = await listMaterialsService(payload);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    deleteMaterial : async (req : Request & { staff : Staff }, res : Response) : Promise<Response> =>{
        const { url, ip, params, staff } = req;

        try{
            let payload = singleIdValidation(params)
            let service = await deleteMaterialService(payload);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    createMaterial : async (req : Request & { staff : Staff }, res : Response) : Promise<Response> =>{
        const { url, ip, staff, body, file } = req;

        try{
            let payload = createMaterialValidation({...body, media : file})
            let service = await createMaterialService(payload);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    editMaterial : async (req : Request & { staff : Staff }, res : Response) : Promise<Response> =>{
        const { url, ip, staff, body, file, params } = req;

        try{
            let payload = editMaterialValidation({...body, media : file, ...params})
            let service = await editMaterialService(payload);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    listSections : async (req : Request & { staff : Staff }, res : Response) : Promise<Response> =>{
        const { url, ip, staff, query } = req;

        try{
            let payload = listSectionsValidation(query)
            let service = await listSectionsService(payload);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    getSection : async (req : Request & { staff : Staff }, res : Response) : Promise<Response> =>{
        const { url, ip, params } = req;

        try{
            let payload = singleIdValidation(params)
            let service = await getSectionService(payload);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    createSection : async (req : Request & { staff : Staff }, res : Response) : Promise<Response> =>{
        const { url, ip, body, staff, file } = req;

        try{
            let payload = createSectionValidation({...body, thumbnail : file})
            let service = await createSectionService(payload);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    editSection : async (req : Request & { staff : Staff }, res : Response) : Promise<Response> =>{
        const { url, ip, body, staff, file, params } = req;

        try{
            let payload = editSectionValidation({...body, ...params, thumbnail : file})
            let service = await editSectionService(payload);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    },
    deleteSection : async (req : Request & { staff : Staff }, res : Response) : Promise<Response> =>{
        const { url, ip, params, staff } = req;

        try{
            let payload = singleIdValidation(params)
            let service = await deleteSectionService(payload);
            return res.status(service.status).json({...service});
        }catch(error : any){
            log('error', { error, ip, url });
            return res.status(error.status).json({...error});
        }
    }
}