import { Component, signal, inject,  WritableSignal, effect} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Orderi } from '../order/Orderi';
import { DatePipe, CurrencyPipe} from '@angular/common';
import { AbsOrderService } from '../abs-order-service';

@Component({
  imports: [DatePipe,CurrencyPipe,RouterLink],
  selector: 'app-order-list',
  styleUrl: '../app.css',
  templateUrl: './order-list.html',
})
export class OrderList {

  orderService = inject(AbsOrderService); 
  ordersSig: WritableSignal<Orderi[] | undefined> = signal(undefined); 
  orderTotalsMap: Map <number,number> = new Map();
  orderTotalsMapSig: WritableSignal<Map<number,number>> = signal(this.orderTotalsMap); 
  
  constructor(){

    this.ordersSig = this.orderService.getAllOrders();

    effect(() =>{
      this.ordersSig()?.forEach(o=>{
        this.addTotals(o);        
      });
    });
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
