import { Injectable, signal, WritableSignal } from '@angular/core';
import { from, Observable, of, tap } from 'rxjs';
import { getNewOrder, Orderi } from './order/Orderi';
import { ORDERS } from './mockData';
import { AbsOrderService } from './abs-order-service';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NonProdOrderService extends AbsOrderService {

  ordersSig$: WritableSignal<Observable<Orderi[]>> = signal( of([]));
  orders: WritableSignal<Orderi[]>= signal([]);
  nextOrderId=0;

  constructor(){
    super();
    console.log('NonProdOrderService says producion = ' + environment.production);
    this.orders.set(ORDERS);
    this.orders().forEach(o => {
      if(o.orderId && o.orderId >= this.nextOrderId){
          this.nextOrderId = o.orderId + 1;
        }
    })
  }


  override getAllOrders(): Observable<Orderi[]>{
    //return this.http.get <Order[]> ('https://bobsAwesomeBackEndOrderServer.com/orders')    
    let result =  of (this.orders()).pipe(tap(ords => {
          ords.forEach(ord => {
            console.log('Order id '+ ord.orderId + ' has an approval date of ' + ord.csrApprovalDate);
          });
        }));
    this.ordersSig$.set(result);
    return result;
  }

    override getOrderByOrderId(orderId:number): Observable<Orderi>{
    //return this.http.get <Order> ('https://bobsAwesomeBackEndOrderServer.com/order/orderId')    
    let result = from(ORDERS.filter(ord => ord.orderId == orderId));
    return result;
  }

    override updateOrder(order:Orderi):Observable<Boolean>{

    let result = false;    
    console.log('NonPROD -- Attempting to update order ' + order.orderId);
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
    return of(result); 
  }

  override addNewOrder():Observable<Orderi>{
    let newOrderSig: WritableSignal<Orderi>= signal(getNewOrder());
    newOrderSig().orderId = this.nextOrderId++;
    this.orders().push(newOrderSig());
    let obsOrds =  of (this.orders());
    this.ordersSig$.set(obsOrds);
    return of(newOrderSig());
  }

}

