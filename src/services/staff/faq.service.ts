import { ResponseType } from "../../types/api.types";
import { 
    CreateFaqCategoryType, 
    CreateFaqType, 
    EditFaqCategoryType, 
    EditFaqType, 
    ListFaqsType
} from "../../types/staff/faq.types";
import { Faq } from '../../models/Faq';
import { FaqCategory } from '../../models/FaqCategory';
import { messages } from '../../utils/consts';
import { SingleIdType } from '../../types/trades.types';
import { StatusCodes } from "http-status-codes";
import { GenericPaginationSchemaType } from "../../types/staff/user.types";
import { Op } from "sequelize";

export const deleteFaqCategoryService = async (payload : SingleIdType) : Promise<ResponseType> =>{
    const { id } = payload;

    await FaqCategory.destroy({ where : { id } });

    return { ok : true, message : messages.OK, status : StatusCodes.OK };
}

export const createFaqCategoryService = async (payload : CreateFaqCategoryType) : Promise<ResponseType> =>{
    const { name } = payload;

    let category = await FaqCategory.findOne({ where : { name } });

    if(!category){
        category = await FaqCategory.create({ name });
    }

    return { ok : true, message : messages.OK, status : StatusCodes.OK, body : { category } }
}

export const editFaqCategoryService = async (payload : EditFaqCategoryType) : Promise<ResponseType> =>{
    const { id, name } = payload;

    let category = await FaqCategory.findOne({ where : { id } });

    if(!category){
        throw { ok : false, message : messages.NOT_FOUND, status : StatusCodes.NOT_FOUND };
    }

    category.name = name;
    await category.save();

    return { ok : true, message : messages.OK, status : StatusCodes.OK, body : { category } };
}

export const listFaqCategoriesService = async (payload : GenericPaginationSchemaType) : Promise<ResponseType> =>{
    let { q, size, page, order } = payload;

    let where : any = {}

    if(q){
        where.name = { [Op.like] : '%'+q+'%' };
    }

    let categories = await FaqCategory.findAll({ where, limit : size, offset : page, order : [['id', order]] });
    let total_count = await FaqCategory.count({ where });
    let total_pages = Math.ceil(total_count / size);

    if (page > 1) {
        page = (Math.ceil(page / size)) + 1;
    } else {
        page = 1;
    }

    return { ok: true, status: StatusCodes.OK, body: { page, size, total_count, total_pages, categories }, message: messages.OK }

}

export const getFaqService = async (payload : SingleIdType) : Promise<ResponseType> =>{
    const { id } = payload;

    let faq = await Faq.findOne({ where : { id }, include : [{ model : FaqCategory, as : 'category' }] });

    if(!faq){
        throw { ok : false, message : messages.NOT_FOUND, status : StatusCodes.NOT_FOUND };
    }

    return { ok : true, message : messages.OK, status : StatusCodes.OK, body : { faq } };
}

export const createFaqService = async (payload : CreateFaqType) : Promise<ResponseType> =>{
    const { category } = payload;

    let searchCategory = await FaqCategory.findOne({ where : { id : category } });

    if(!searchCategory){
        throw { ok : false, message : messages.INVALID_CATEGORY, status : StatusCodes.BAD_REQUEST }
    }

    let dbPayload : any = payload;
    dbPayload.category_id = searchCategory.id;
    delete dbPayload.category;
    
    let faq = await Faq.findOne({ where : { category_id : dbPayload.category_id, question : dbPayload.question } });

    if(faq){
        throw { ok : false, message : messages.FAQ_ALREADY_CREATED, status : StatusCodes.BAD_REQUEST }
    }

    faq = await Faq.create({...dbPayload});

    return await getFaqService({ id : faq.id });
}

export const editFaqService = async (payload : EditFaqType) : Promise<ResponseType> =>{
    const { id } = payload;

    let searchFaq : any = await Faq.findOne({ where : { id } });

    if(!searchFaq){
        throw { ok : false, message : messages.NOT_FOUND, status : StatusCodes.NOT_FOUND };
    }

    let dbPayload : any = payload;
    delete dbPayload.id;

    let keys = Object.keys(dbPayload);

    for(let i = 0; i < keys.length; i++){
        let key = keys[i];

        if(key == "category"){
            let category = dbPayload[key];
            let searchCategory = await FaqCategory.findOne({ where : { id : category } });

            if(!searchCategory){
                throw { ok : false, message : messages.INVALID_CATEGORY, status : StatusCodes.BAD_REQUEST }
            }

            dbPayload.category_id = searchCategory.id
            delete dbPayload.category;
            continue;
        }

        searchFaq[key] = dbPayload[key];
    }

    await searchFaq.save();

    return await getFaqService({ id : searchFaq.id });
}

export const deleteFaqService = async (payload : SingleIdType) : Promise<ResponseType> =>{
    const { id } = payload;
    
    await Faq.destroy({ where : { id } });

    return { ok : true, message : messages.OK, status : StatusCodes.OK };
}

export const listFaqsService = async (payload : ListFaqsType) : Promise<ResponseType> =>{
    let { q, size, page, order, category } = payload;

    let where : any = { }

    if(q){
        where.question = { [Op.like] : '%'+q+'%' }
    }

    if(category){
        where.category_id = category;
    }

    let faqs = await Faq.findAll({ where, limit : size, offset : page, order : [['id', order]], include : [{ model : FaqCategory, as : 'category' }] });
    let total_count = await Faq.count({ where });
    let total_pages = Math.ceil(total_count / size);

    if (page > 1) {
        page = (Math.ceil(page / size)) + 1;
    } else {
        page = 1;
    }

    return { ok: true, status: StatusCodes.OK, body: { page, size, total_count, total_pages, faqs }, message: messages.OK }
}