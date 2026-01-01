import { Injectable, signal, WritableSignal } from '@angular/core';
import { from, Observable, of, tap } from 'rxjs';
import { ChangeOrderResponse, getNewOrder, Orderi } from './order/Orderi';
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


  override getAllOrders(): WritableSignal<Orderi[]>{
    //return this.http.get <Order[]> ('https://bobsAwesomeBackEndOrderServer.com/orders')    
    let result =  of (this.orders());
    this.ordersSig$.set(result);
    return signal(this.orders());//result;
  }

    override getOrderByOrderId(orderId:number): Observable<Orderi>{
    //return this.http.get <Order> ('https://bobsAwesomeBackEndOrderServer.com/order/orderId')    
    let result = from(ORDERS.filter(ord => ord.orderId == orderId));
    return result;
  }

    override updateOrderR(order: Orderi):WritableSignal<ChangeOrderResponse| undefined> {
    let cor:ChangeOrderResponse = {orderId:0,result:false};
    let corSig: WritableSignal<ChangeOrderResponse | undefined> = signal(cor);   
    
    this.orders().forEach(ord => {
      if (ord.orderId == order.orderId){
        cor.result = true; 
        cor.orderId = ord.orderId;
         
        ord.csrApprovalDate = order.csrApprovalDate;
        ord.customerName = order.customerName;
        ord.items = order.items;
        ord.orderStatus = order.orderStatus;
      }
    });
    if (cor.result){
      corSig = signal(cor);  
      let obsOrds =  of (this.orders());
      this.ordersSig$.set(obsOrds);
    }
    else{
      console.warn('OrderService(update) could not find order ' + order.orderId );
    }
    
    return corSig; 
    } //TODO implement this


  override addNewOrder():Observable<Orderi>{
    let newOrderSig: WritableSignal<Orderi>= signal(getNewOrder());
    newOrderSig().orderId = this.nextOrderId++;
    this.orders().push(newOrderSig());
    let obsOrds =  of (this.orders());
    this.ordersSig$.set(obsOrds);
    return of(newOrderSig());
  }

}

