import { listing_order } from "../../utils/consts";

export interface GenericPaginationSchemaType{
    q?: string,
    page: number,
    size: number,
    order: listing_order,
}

export interface CreateUserType{
    full_name : string,
    email : string,
    password : string
}