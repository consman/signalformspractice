import { Injectable, signal, WritableSignal } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { getNewOrder, Orderi } from './order/Orderi';
import { ORDERS } from './mockData';

@Injectable({
  providedIn: 'root',
})
export class OrderService {

  ordersSig$: WritableSignal<Observable<Orderi[]>> = signal( of(ORDERS));
  orders: WritableSignal<Orderi[]>= signal(ORDERS);
  nextOrderId=0;
  newOrderSig: WritableSignal<Orderi>= signal(getNewOrder());

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

  updateOrder(order:Orderi):Observable<Orderi>{

    let result = false;
    //console.log('Going for update order and the numbr of items is: ' +order.items.length);
    this.orders().forEach(ord => {
      if (ord.orderId == order.orderId){
        result = true;
        ord.csrApprovalDate = order.csrApprovalDate;
        ord.customerName = order.customerName;
        ord.items = order.items;

        ord.orderStatus = order.orderStatus;
      }
    });
    if (result){
      let obsOrds =  of (this.orders());
      this.ordersSig$.set(obsOrds);
    }
    else{
      console.warn('OrderService(update) could not find order ' + order.orderId );
    }
    return of(order); 
  }

  addNewOrder():Observable<Orderi>{
    this.newOrderSig.set(getNewOrder());
    this.newOrderSig().orderId = this.nextOrderId++;
    this.orders().push(this.newOrderSig());
    let obsOrds =  of (this.orders());
    this.ordersSig$.set(obsOrds);
    return of(this.newOrderSig());
  }

}

