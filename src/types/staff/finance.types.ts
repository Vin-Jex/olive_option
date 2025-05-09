import { listing_order, transaction_statuses, transaction_type } from "../../utils/consts"

export interface ListWalletsType{
    user_id?: number,
    q?: string,
    page: number,
    size: number,
    order: listing_order
}

export interface ListTransactionType{
    q?: string,
    page: number,
    size: number,
    order: listing_order,
    transaction_type?: transaction_type,
    transaction_status?: transaction_statuses,
    period?: Date,
    payment_method?: string,
    min_amount?: number
}