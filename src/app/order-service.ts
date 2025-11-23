import { Injectable } from '@angular/core';
import { filter, from, Observable, of } from 'rxjs';
import { Orderi } from './defs';
import { ORDERS } from './mockData';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  
  getAllOrders(): Observable<Orderi[]>{
    //return this.http.get <Order[]> ('https://bobsAwesomeBackEndOrderServer.com/orders')
    return of (ORDERS);
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
}
