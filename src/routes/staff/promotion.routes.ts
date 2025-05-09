import { Router, Request, Response } from 'express';
import controller from '../../controllers/staff/promotion.controller';
import { verifyStaff, promotionalStaff } from '../../middlewares/staff';
import { uploadThumbnail, uploadMedia } from '../../middlewares/multer';

const routes : Router = Router();


routes.get('/section', async (req : any, res : Response) : Promise<Response> =>{ 
    /*
        #swagger.parameters["q"] = { in : 'query', type : 'string' }
        #swagger.parameters["type"] = { in : 'query', type : 'string' }
        #swagger.parameters["page"] = { in : 'query', type : 'number' }
        #swagger.parameters["size"] = { in : 'query', type : 'number' }
        #swagger.parameters["order"] = { in : 'query', type : 'string', description : "asc or desc" }
        #swagger.responses[200] = { schema : { $ref : '#/definitions/ListPromotionSectionsResponse' } }
    */
    return await controller.listSections(req, res); 
});
routes.get('/section/:id', async (req : any, res : Response) : Promise<Response> =>{ 
    /*
        #swagger.responses[200] = { schema : { $ref : '#/definitions/GetPromotionSectionResponse' } }
    */
    return await controller.getSection(req, res); 
});
routes.get('/', async (req : any, res : Response) : Promise<Response> =>{ 
    /*
        #swagger.parameters["q"] = { in : 'query', type : 'string' }
        #swagger.parameters["page"] = { in : 'query', type : 'number' }
        #swagger.parameters["size"] = { in : 'query', type : 'number' }
        #swagger.parameters["section_id"] = { in : 'query', type : 'number' }
        #swagger.parameters["order"] = { in : 'query', type : 'string', description : "asc or desc" }
        #swagger.responses[200] = { schema : { $ref : '#/definitions/ListMaterialsResponse' } }
    */
    return await controller.listMaterials(req, res); 
});
routes.get('/:id', async (req : any, res : Response) : Promise<Response> =>{ 
    /*
        #swagger.responses[200] = { schema : { $ref : '#/definitions/GetMaterialResponse' } }
    */
    return await controller.getMaterial(req, res); 
});


routes.use(verifyStaff);
routes.use(promotionalStaff);
routes.post('/section', uploadThumbnail, async (req : any, res : Response) : Promise<Response> =>{ 
    /*
        #swagger.consumes = ['multipart/form-data']  
        #swagger.parameters['thumbnail'] = {
            in: 'formData',
            type: 'file',
            required: 'true'
        }
        #swagger.parameters['name'] = {
            in: 'formData',
            type: 'text',
            required: 'true'
        }
        #swagger.parameters['type'] = {
            in: 'formData',
            type: 'text',
            required: 'true'
        }
        #swagger.responses[200] = { schema : { $ref : '#/definitions/GetPromotionSectionResponse' } }
    */
    return await controller.createSection(req, res); 
})
routes.put('/section/:id', uploadThumbnail, async (req : any, res : Response) : Promise<Response> =>{ 
    /*
        #swagger.consumes = ['multipart/form-data']  
        #swagger.parameters['thumbnail'] = {
            in: 'formData',
            type: 'file',
            required: 'true'
        }
        #swagger.parameters['name'] = {
            in: 'formData',
            type: 'text',
            required: 'true'
        }
        #swagger.parameters['type'] = {
            in: 'formData',
            type: 'text',
            required: 'true'
        }
        #swagger.responses[200] = { schema : { $ref : '#/definitions/GetPromotionSectionResponse' } }
    */
    return await controller.editSection(req, res); 
})
routes.delete('/section/:id', async (req : any, res : Response) : Promise<Response> =>{ 
    return await controller.deleteSection(req, res); 
});

routes.post('/', uploadMedia, async (req : any, res : Response) : Promise<Response> =>{ 
    /*
        #swagger.consumes = ['multipart/form-data']  
        #swagger.parameters['media'] = {
            in: 'formData',
            type: 'file',
            required: 'true'
        }
        #swagger.parameters['type'] = {
            in: 'formData',
            type: 'text',
            required: 'true'
        }
        #swagger.parameters['language'] = {
            in: 'formData',
            type: 'text',
            required: 'true'
        }
        #swagger.parameters['size'] = {
            in: 'formData',
            type: 'text',
            required: 'true'
        }
        #swagger.parameters['section_id'] = {
            in: 'formData',
            type: 'text',
            required: 'true'
        }
        #swagger.responses[200] = { schema : { $ref : '#/definitions/GetMaterialResponse' } }
    */
    return await controller.createMaterial(req, res); 
})
routes.put('/:id', uploadMedia, async (req : any, res : Response) : Promise<Response> =>{ 
    /*
        #swagger.consumes = ['multipart/form-data']  
        #swagger.parameters['media'] = {
            in: 'formData',
            type: 'file',
            required: 'true'
        }
        #swagger.parameters['type'] = {
            in: 'formData',
            type: 'text',
            required: 'true'
        }
        #swagger.parameters['language'] = {
            in: 'formData',
            type: 'text',
            required: 'true'
        }
        #swagger.parameters['size'] = {
            in: 'formData',
            type: 'text',
            required: 'true'
        }
        #swagger.parameters['section_id'] = {
            in: 'formData',
            type: 'text',
            required: 'true'
        }
        #swagger.responses[200] = { schema : { $ref : '#/definitions/GetMaterialResponse' } }
    */
    return await controller.editMaterial(req, res); 
})
routes.delete('/:id', async (req : any, res : Response) : Promise<Response> =>{ return await controller.deleteMaterial(req, res); })

export default routes;