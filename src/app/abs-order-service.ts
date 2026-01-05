import { Injectable, Signal, WritableSignal } from '@angular/core';
import { environment } from '../environments/environment';
import { ChangeOrderResponse, Orderi } from './order/Orderi';

@Injectable({
  providedIn: 'root',
})
export abstract class AbsOrderService {

 
  constructor(){
    //console.log('Abstract service, AbsOrderService, says producion = ' + environment.production);
  }

  abstract getAllOrders(): WritableSignal<Orderi[] | undefined>;
  abstract getOrderByOrderId(orderId:number): WritableSignal<Orderi | undefined>;
  abstract addNewOrder(): WritableSignal<Orderi | undefined>;
  abstract updateOrder (order:Orderi): WritableSignal<ChangeOrderResponse | undefined>;
  abstract getUpdateInProgressSig(): Signal<boolean>;


}
