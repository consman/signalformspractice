
export interface Orderi {
    orderId : number | undefined;
    createDate: Date | string;
    customerName : string;
    csrApprovalDate : Date;
    orderStatus : string ;
    items: Item[] | undefined;
}

export interface Item {
    description : string;
    price : number;
    qty : number;
}