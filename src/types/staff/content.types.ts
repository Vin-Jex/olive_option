import { content_categories, content_user_categories } from "../../utils/consts";
import { FileUploadType } from '../api.types';

export interface CreateContentType{
    user_category : content_user_categories,
    category : content_categories,
    content : string,
    document?: FileUploadType
}

export interface GetContentType{
    user_category : content_user_categories,
    category : content_categories
}
