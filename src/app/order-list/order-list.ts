import { Component, signal, inject,  WritableSignal} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { Orderi } from '../defs';
import { OrderService } from '../order-service';
import { AsyncPipe, DatePipe, CurrencyPipe} from '@angular/common';

@Component({
  selector: 'app-order-list',
  imports: [AsyncPipe,DatePipe,CurrencyPipe,RouterLink],
  templateUrl: './order-list.html',
  styleUrl: '../app.css',
})
export class OrderList {

  orderService = inject(OrderService); 
  orders$: Observable<Orderi[]>; 
  orderTotalsMap: Map <number,number> = new Map();
  orderTotalsMapSig: WritableSignal<Map<number,number>> = signal(this.orderTotalsMap); 

  constructor(){
    this.orders$ = this.orderService.getAllOrders().pipe(tap(ords =>{
      ords.forEach(o=>{
        this.addTotals(o);
      });
    }));
  }

  addTotals(order:Orderi) :void{
    let tempTotal = 0;
    order.items.forEach(i => {
      tempTotal = tempTotal +(i.qty * i.price);      
    });
    if(order.orderId !=undefined){
      this.orderTotalsMapSig().set(order.orderId,tempTotal);
    }
  }
}
