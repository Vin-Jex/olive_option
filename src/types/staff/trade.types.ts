export interface CreatePairType{
    category : string,
    base_asset : string,
    quote_asset : string,
    is_active?: boolean
}

export interface EditPairType{
    id : number,
    category?: string,
    base_asset?: string,
    quote_asset?: string,
    is_active?: boolean
}