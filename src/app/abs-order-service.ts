import { Injectable, Signal, WritableSignal,Service } from '@angular/core';
import { environment } from '../environments/environment';
import { ChangeOrderResponse, Orderi } from './order/Orderi';

@Service()
export abstract class AbsOrderService {


  abstract getAllOrders(): WritableSignal<Orderi[] | undefined>;
  abstract getOrderByOrderId(orderId:number): WritableSignal<Orderi | undefined>;
  abstract addNewOrder(): WritableSignal<Orderi | undefined>;
  abstract updateOrder (order:Orderi): WritableSignal<ChangeOrderResponse | undefined>;
  abstract getUpdateInProgressSig(): Signal<boolean>;

}
