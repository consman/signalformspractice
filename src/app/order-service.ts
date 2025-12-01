import { Injectable, signal, WritableSignal } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { Orderi } from './defs';
import { ORDERS } from './mockData';

@Injectable({
  providedIn: 'root',
})
export class OrderService {

  ordersSig$: WritableSignal<Observable<Orderi[]>> = signal( of(ORDERS));
  orders: Orderi[];
  nextOrderId=0;

  constructor(){
    this.orders = ORDERS;
    this.orders.forEach(o => {
      if(o.orderId && o.orderId >= this.nextOrderId){
          this.nextOrderId = o.orderId + 1;
        }
    })
  }

  getAllOrders(): Observable<Orderi[]>{
    //return this.http.get <Order[]> ('https://bobsAwesomeBackEndOrderServer.com/orders')    
    let result =  of (this.orders);
    this.ordersSig$.set(result);
    return result;
  }

  getOrderByOrderId(orderId:number): Observable<Orderi>{
    //return this.http.get <Order> ('https://bobsAwesomeBackEndOrderServer.com/order/orderId')    
    let result = from(ORDERS.filter(ord => ord.orderId == orderId));
    return result;
  }

  updateOrder(order:Orderi):Observable<boolean>{

    let result = false;
    ORDERS.forEach(ord => {
      if (ord.orderId == order.orderId){
        result = true;
        ord.csrApprovalDate = order.csrApprovalDate;
        ord.customerName = order.customerName;
        ord.items = order.items;

        ord.orderStatus = order.orderStatus;
        console.log('Order for '+ order.customerName + ' has been updated.')
      }
    });
    return of(result);
  }

  addNewOrder():Observable<Orderi>{
    let newOrder = NEWORDER;
    newOrder.orderId = this.nextOrderId++;
    console.log('newOrder.orderId = ' + newOrder.orderId  + ' and this.nextOrderId = ' + this.nextOrderId);
    return of(newOrder);
  }
  
}

export const NEWORDER: Orderi =
{orderId:0,createDate:new Date (),customerName:'Customer Name',csrApprovalDate:new Date (0),orderStatus:'New',items:
    [{itemId:1,description:'Description', price:0,qty:0}
    ]
};