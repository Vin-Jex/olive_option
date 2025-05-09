import { ResponseType } from "../../types/api.types";
import { CreateMaterialType, CreateSectionType, EditMaterialType, EditSectionType, ListMaterialsType, ListSectionsType } from "../../types/staff/promotion.types";
import { PromotionalMaterialSection } from "../../models/PromotionalMaterialSection";
import { PromotionalMaterial } from "../../models/PromotionalMaterial";
import { messages, bucket_folders } from "../../utils/consts";
import { StatusCodes } from "http-status-codes";
import fs from 'fs';
import { uploadFile } from '../../utils/file';
import { SingleIdType } from "../../types/trades.types";
import { GenericPaginationSchemaType } from "../../types/staff/user.types";
import { Op } from "sequelize";

export const createSectionService = async (payload : CreateSectionType) : Promise<ResponseType> =>{
    const { name } = payload;

    let section = await PromotionalMaterialSection.findOne({ where : { name } });

    if(section){
        throw { ok : false, message : messages.DUPLICATE_SECTION, status : StatusCodes.BAD_REQUEST };
    }

    let dbPayload : any = {...payload};

    let file = dbPayload.thumbnail;
    let buffer = fs.readFileSync(file.path);

    let url = await uploadFile(bucket_folders.promotional_materials_section_thumbnails, buffer, file.filename);

    dbPayload.thumbnail_url = url;

    section = await PromotionalMaterialSection.create({...dbPayload});

    return { ok : true, message : messages.OK, status : StatusCodes.OK, body : { section } };
}

export const editSectionService = async (payload : EditSectionType) : Promise<ResponseType> =>{
    const { id, name, type, thumbnail } = payload;

    let section = await PromotionalMaterialSection.findOne({ where : { id } });

    if(!section){
        throw { ok : false, message : messages.NOT_FOUND, status : StatusCodes.NOT_FOUND };
    }

    if(name){
        section.name = name;
    }

    if(type){
        section.type = type;
    }

    if(thumbnail){
        let file = thumbnail;
        let buffer = fs.readFileSync(file.path);
    
        let url = await uploadFile(bucket_folders.promotional_materials_section_thumbnails, buffer, file.filename);
    
        section.thumbnail_url = url;
    }

    await section.save();

    return { ok : true, message : messages.OK, status : StatusCodes.OK, body : { section } };
}

export const deleteSectionService = async (payload : SingleIdType) : Promise<ResponseType> =>{
    const { id } = payload;

    let section = await PromotionalMaterialSection.findOne({ where : { id } });

    if(!section){
        throw { ok : false, message : messages.NOT_FOUND, status : StatusCodes.NOT_FOUND };
    }

    await PromotionalMaterial.destroy({ where : { section_id : section.id } });
    await PromotionalMaterialSection.destroy({ where : { id } });

    return { ok : true, message : messages.OK, status : StatusCodes.OK };
}

export const listSectionsService = async (payload : ListSectionsType) : Promise<ResponseType> =>{
    let { q, size, page, order, type } = payload;

    let where : any = {  };

    if(q){
        where.name = { [Op.like] : '%'+q+'%' }
    }

    if(type){
        where.type = type;
    }

    let sections = await PromotionalMaterialSection.findAll({ where, limit : size, offset : page, order : [['id', order]] });
    let total_count = await PromotionalMaterialSection.count({ where });
    let total_pages = Math.ceil(total_count / size);

    if (page > 1) {
        page = (Math.ceil(page / size)) + 1;
    } else {
        page = 1;
    }

    return { ok: true, status: StatusCodes.OK, body: { page, size, total_count, total_pages, sections }, message: messages.OK }
}

export const getSectionService = async (payload : SingleIdType) : Promise<ResponseType> =>{
    const { id } = payload;

    let section = await PromotionalMaterialSection.findOne({ where : { id } });

    if(!section){
        throw { ok : false, message : messages.NOT_FOUND, status : StatusCodes.NOT_FOUND };
    }

    return { ok : true, message : messages.OK, status : StatusCodes.OK, body : { section } };
}

export const createMaterialService = async (payload : CreateMaterialType) : Promise<ResponseType> =>{
    const { media, section_id } = payload;

    await getSectionService({ id : section_id });

    let dbPayload : any = {...payload};

    let file = media;
    let buffer = fs.readFileSync(file.path);

    let url = await uploadFile(bucket_folders.promotional_materials_media, buffer, file.filename);

    dbPayload.media_url = url;

    let material = await PromotionalMaterial.create({...dbPayload});

    return { ok : true, message : messages.OK, status : StatusCodes.OK, body : { material } };
}

export const editMaterialService = async (payload : EditMaterialType) : Promise<ResponseType> =>{
    const { id, section_id, media } = payload;

    let material : any = await PromotionalMaterial.findOne({ where : { id } });

    if(!material){
        throw { ok : false, message : messages.NOT_FOUND, status : StatusCodes.NOT_FOUND };
    }

    let normalPayload : any = {...payload};
    delete normalPayload.id;
    delete normalPayload.section_id;
    delete normalPayload.media;

    let keys = Object.keys(normalPayload);

    for(let i = 0; i < keys.length; i++){
        material[keys[i]] = normalPayload[keys[i]];
    }

    if(section_id){
        await getSectionService({ id : section_id });
        material['section_id'] = section_id; 
    }

    if(media){
        let file = media;
        let buffer = fs.readFileSync(file.path);
    
        let url = await uploadFile(bucket_folders.promotional_materials_media, buffer, file.filename);
    
        material.media_url = url;
    }

    await material.save();

    return { ok : true, message : messages.OK, status : StatusCodes.OK, body : { material } };
}

export const deleteMaterialService = async (payload : SingleIdType) : Promise<ResponseType> =>{
    const { id } = payload;

    let material = await PromotionalMaterial.findOne({ where : { id } });

    if(!material){
        throw { ok : false, message : messages.NOT_FOUND, status : StatusCodes.NOT_FOUND };
    }

    await PromotionalMaterial.destroy({ where : { id } });

    return { ok : true, message : messages.OK, status : StatusCodes.OK };
}

export const listMaterialsService = async (payload : ListMaterialsType) : Promise<ResponseType> =>{
    let { section_id, page, size, q, order } = payload;

    let where : any = { section_id };

    let materials = await PromotionalMaterial.findAll({ where, limit : size, offset : page, order : [['id', order]] });
    let total_count = await PromotionalMaterial.count({ where });
    let total_pages = Math.ceil(total_count / size);

    if (page > 1) {
        page = (Math.ceil(page / size)) + 1;
    } else {
        page = 1;
    }

    return { ok: true, status: StatusCodes.OK, body: { page, size, total_count, total_pages, materials }, message: messages.OK }
}

export const getMaterialService = async (payload : SingleIdType) : Promise<ResponseType> =>{
    const { id } = payload;

    let material = await PromotionalMaterial.findOne({ where : { id } });

    if(!material){
        throw { ok : false, message : messages.NOT_FOUND, status : StatusCodes.NOT_FOUND };
    }
    
    return { ok : true, message : messages.OK, status : StatusCodes.OK, body : { material } };
}