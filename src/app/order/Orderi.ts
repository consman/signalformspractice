import { applyEach, max, minLength, required, schema } from '@angular/forms/signals';
import { Item, itemSchema, itemz } from '../item-list/itemList';

export interface Orderi {
    orderId : number | undefined;
    createDate: Date | string;
    customerName : string;
    csrApprovalDate : Date;
    orderStatus : string ;
    items: Item[];
}

export interface ChangeOrderResponse {
  orderId : number | undefined;
  result: boolean;
}

export const beginningOfTime: Date  = new Date(0);
export const now: Date  = new Date();

export const initialOrder: Orderi = {
    orderId : NaN,
    createDate : '',
    customerName: '',
    csrApprovalDate: beginningOfTime,
    orderStatus: '',
    items: itemz
  };

 export const orderSchema = schema<Orderi>( (rootPath) =>{
    required(rootPath.customerName, {message:'Customer Name is required.'});
    //max(rootPath.createDate, now, {message:''});
    minLength(rootPath.customerName,5, {message:'The customer name must be at least 5 characters long.'});
    applyEach(rootPath.items,itemSchema);
 }); 

 export function getNewOrder(): Orderi{
   return {orderId:0,createDate:new Date (),customerName:'Customer Name Here',csrApprovalDate:new Date (0),orderStatus:'New',items:
     [{itemId:1,description:'Item Description Here', price:0,qty:0}
     ]
   };
}