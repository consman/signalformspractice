
export interface Orderi {
    orderId : number | undefined;
    createDate: Date | string;
    customerName : string;
    csrApprovalDate : Date;
    orderStatus : string ;
    items: Item[];
}

export interface Item {
    itemId: number;
    description : string;
    price : number;
    qty : number;
}