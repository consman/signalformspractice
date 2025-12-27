import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { Orderi } from './order/Orderi';

@Injectable({
  providedIn: 'root',
})
export abstract class AbsOrderService {

 
  constructor(){
    console.log('Abstract service, AbsOrderService, says producion = ' + environment.production);
  }

  abstract getAllOrders(): Observable<Orderi[]>;
  abstract getOrderByOrderId(orderId:number): Observable<Orderi>;
  abstract updateOrder(order:Orderi):Observable<Boolean>;
  abstract addNewOrder(order:Orderi):Observable<Orderi>;



}
