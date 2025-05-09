import { ResponseType } from "../../types/api.types";
import { 
    CreateContentType, 
    GetContentType, 
} from "../../types/staff/content.types";
import { Content } from '../../models/Content';
import { uploadFile } from '../../utils/file';
import { bucket_folders, messages } from '../../utils/consts';
import { SingleIdType } from '../../types/trades.types';
import fs from 'fs';
import { StatusCodes } from "http-status-codes";

export const getContentService = async (payload : GetContentType) : Promise<ResponseType> =>{
    const content = await Content.findOne({ where : { ...payload } });

    if(!content){
        throw { ok : false, message : messages.NOT_FOUND, status : StatusCodes.NOT_FOUND };
    }

    return { ok : true, message : messages.OK, status : StatusCodes.OK, body : { content } };
}

export const createContentService = async (payload : CreateContentType) : Promise<ResponseType> =>{
    let { user_category, category } = payload;

    let dbPayload : any = {...payload};

    if(dbPayload.document){
        let file = dbPayload.document;
        let buffer = fs.readFileSync(file.path);

        let url = await uploadFile(bucket_folders.content_docs, buffer, file.filename);

        dbPayload.document_url = url;
    }
    delete dbPayload.document;

    let searchContent = await Content.findOne({ where : { user_category, category } });

    if(searchContent){
        await Content.update({ ...dbPayload }, { where : { id : searchContent.id } });
    }else{
        await Content.create({...dbPayload});
    }

    return await getContentService({ user_category, category });
}

export const deleteContentService = async (payload : SingleIdType) : Promise<ResponseType> =>{
    const { id } = payload;

    await Content.destroy({ where : { id } });

    return { ok : true, message : messages.OK, status : StatusCodes.OK };
}
