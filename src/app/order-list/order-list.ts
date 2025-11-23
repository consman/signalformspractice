import { Component, signal, inject, Signal, computed, WritableSignal} from '@angular/core';
import { RouterLink,RouterOutlet } from '@angular/router';
import { from, Observable, of } from 'rxjs';
import { Orderi } from '../defs';
import { OrderService } from '../order-service';
import { AsyncPipe, DatePipe, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-order-list',
  imports: [AsyncPipe,DatePipe,CurrencyPipe,RouterLink],
  templateUrl: './order-list.html',
  styleUrl: '../app.css',
})
export class OrderList {

  orderService = inject(OrderService); 
  orders$: Observable<Orderi[]>; 
  ordersSignal: Signal<Orderi[]| undefined>;
  ordersComputedSignal: Signal<Orderi[]| undefined> | undefined;

  constructor(){
    this.orders$ = this.orderService.getAllOrders();
    this.ordersSignal = this.orderService.getAllOrdersSignal();

    // work on this later after we get the toSignal working in the template
    this.ordersComputedSignal = computed( ()=>{
    //return this.addTotals(this.ordersSignal());
    return this.ordersSignal();
    });
  }

  getOrderTotal(ord:Orderi):number{
    let result =0 ;
    ord.items?.forEach(i=>{result= result +( i.price * i.qty)});
    return result;
  }

  addTotals(origSig:Signal<Orderi[]| undefined>):Signal<Orderi[]| undefined>{
    let order: Orderi = {orderId:1,orderStatus:'New',createDate:'',customerName:'',csrApprovalDate:new Date(), items:new Array()}; 
    let orderArr = new Array();
    orderArr.push(order);
    let response:  WritableSignal<Orderi[]> = signal(orderArr);
    return response;
  }

}
