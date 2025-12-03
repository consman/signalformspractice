import { Injectable, signal, WritableSignal } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { Orderi } from './defs';
import { ORDERS } from './mockData';

@Injectable({
  providedIn: 'root',
})
export class OrderService {

  ordersSig$: WritableSignal<Observable<Orderi[]>> = signal( of(ORDERS));
  orders: WritableSignal<Orderi[]>= signal(ORDERS);
  nextOrderId=0;
  newOrderSig: WritableSignal<Orderi>= signal(this.getNewOrder());

  constructor(){
    this.orders.set(ORDERS);
    this.orders().forEach(o => {
      if(o.orderId && o.orderId >= this.nextOrderId){
          this.nextOrderId = o.orderId + 1;
        }
    })
  }

  getAllOrders(): Observable<Orderi[]>{
    //return this.http.get <Order[]> ('https://bobsAwesomeBackEndOrderServer.com/orders')    
    let result =  of (this.orders());
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
    this.orders().forEach(ord => {
      if (ord.orderId == order.orderId){
        result = true;
        ord.csrApprovalDate = order.csrApprovalDate;
        ord.customerName = order.customerName;
        ord.items = order.items;

        ord.orderStatus = order.orderStatus;
        //console.log('Order for '+ order.customerName + ' has been updated.')
      }
    });
    let obsOrds =  of (this.orders());
    this.ordersSig$.set(obsOrds);
    return of(result);
  }

  addNewOrder():Observable<Orderi>{
    //let newOrder = NEWORDER;
    this.newOrderSig.set(this.getNewOrder());
    this.newOrderSig().orderId = this.nextOrderId++;
    //console.log('this.getNewOrder().customerName: ' + this.getNewOrder().customerName);
    //console.log('this.newOrderSig().customerName = '+ this.newOrderSig().customerName+'  this.newOrderSig().orderId = ' + this.newOrderSig().orderId  + ' and this.nextOrderId = ' + this.nextOrderId);
    this.orders().push(this.newOrderSig());
    let obsOrds =  of (this.orders());
    this.ordersSig$.set(obsOrds);
    //console.log('Returning order with a customer name of: ' +this.newOrderSig().customerName)
    return of(this.newOrderSig());
  }

  getNewOrder(): Orderi{
    return {orderId:0,createDate:new Date (),customerName:'Customer Name Here',csrApprovalDate:new Date (0),orderStatus:'New',items:
    [{itemId:1,description:'Item Description Here', price:0,qty:0}
    ]
};
  }
}

