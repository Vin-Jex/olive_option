export interface ListTickersType{
    symbol?: string
}

export interface PinTickerType{
    symbol : string,
    full_data : { [key : string]: any }
}

export interface GetTickerType{
    ticker : string
}