import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { ChangeOrderResponse, getNewOrder, Orderi } from './order/Orderi';
import { ORDERS } from './mockData';
import { AbsOrderService } from './abs-order-service';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NonProdOrderService extends AbsOrderService {

  orders: WritableSignal<Orderi[]>= signal([]);
  nextOrderId=0;

  constructor(){
    super();
    //console.log('NonProdOrderService says producion = ' + environment.production);
    this.orders.set(ORDERS);
    this.orders().forEach(o => {
      if(o.orderId && o.orderId >= this.nextOrderId){
          this.nextOrderId = o.orderId + 1;
        }
    })
  }

  override getAllOrders(): WritableSignal<Orderi[]>{
    
    let result = signal(this.orders());
    const allOrds = this.orders();
    //console.log('Going for NonProdOrderService getAllOrders() and the number of order is: ' + allOrds.length+ ' and the customer name in the last order is: ' + allOrds[allOrds.length -1].customerName);
    return result;
  }

  override getOrderByOrderId(orderId:number): WritableSignal<Orderi | undefined>{
    let results = ORDERS.filter(ord => ord.orderId == orderId);
    let result: WritableSignal<Orderi| undefined> =signal(results[0]);  
  return result;
  }

  override updateOrder(order: Orderi):WritableSignal<ChangeOrderResponse| undefined> {
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
    }
    else{
      console.warn('OrderService(update) could not find order ' + order.orderId );
    }      
    return corSig; 
  } 

  override addNewOrder():WritableSignal<Orderi | undefined>{   
    let newOrderSig: WritableSignal<Orderi>= signal(getNewOrder());
    newOrderSig().orderId = this.nextOrderId++;
    this.orders().push(newOrderSig());
    //console.log('non prod / add new order');
    return newOrderSig;
  }


  override getUpdateInProgressSig(): Signal<boolean> {
    return signal(false);
  }

}

