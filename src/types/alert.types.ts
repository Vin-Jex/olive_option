export interface CreateAlertType{
    ticker : string,
    amount : number
}

export interface EditAlertType{
    id : number,
    ticker?: string,
    amount?: number
}