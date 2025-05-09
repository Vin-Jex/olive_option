import { listing_order } from "../utils/consts"

export interface TradeHistoryTypes{
    page : number,
    size : number,
    q? : string,
    order : listing_order,
    period?: number,
    pending?: boolean,
    symbol?: string
}

export interface SingleIdType{
    id : any
}

export interface LeadersBoardType{
    period : number
}