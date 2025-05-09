import { listing_order, promotional_material_section_types, promotional_material_types } from '../../utils/consts';
import { FileUploadType } from '../api.types';

export interface CreateSectionType{
    name : string,
    type : promotional_material_section_types,
    thumbnail : FileUploadType
}

export interface EditSectionType{
    id : number,
    name?: string,
    type?: promotional_material_section_types,
    thumbnail?: FileUploadType
}

export interface CreateMaterialType{
    language : string,
    size : string,
    media : FileUploadType,
    section_id : number,
    type : promotional_material_types
}

export interface EditMaterialType{
    id : number,
    language?: string,
    size?: string,
    media?: FileUploadType,
    section_id?: number,
    type?: promotional_material_types
}

export interface ListMaterialsType{
    q?: string,
    size : number,
    page : number,
    order : listing_order,
    section_id: number
}

export interface ListSectionsType{
    q?: string,
    size : number,
    page : number,
    order : listing_order,
    type?: promotional_material_section_types
}