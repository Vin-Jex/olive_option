import { listing_order } from "../../utils/consts";

export interface CreateFaqCategoryType{
    name : string
}

export interface EditFaqCategoryType{
    name : string,
    id : number
}

export interface CreateFaqType{
    category : number,
    question : string,
    answer : string
}

export interface EditFaqType{
    id : number,
    category?: number,
    question?: string,
    answer?: string
}

export interface ListFaqsType{
    q?: string,
    page: number,
    size: number,
    order: listing_order,
    category?: number
}