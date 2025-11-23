import { Component, signal, inject} from '@angular/core';
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

  constructor(){
    this.orders$ = this.orderService.getAllOrders();
  }

  getOrderTotal(ord:Orderi):number{
    let result =0 ;
    ord.items?.forEach(i=>{result= result +( i.price * i.qty)});
    return result;
  }

}
