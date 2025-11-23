import { Component, inject, signal, WritableSignal } from '@angular/core';
import { Item, Orderi } from '../defs'
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OrderService } from '../order-service';
import { Observable , pipe, tap} from 'rxjs';

import { Field, form, submit , required} from '@angular/forms/signals';
import { AsyncPipe , DatePipe} from '@angular/common';

@Component({
  selector: 'app-order',
  imports: [RouterLink, Field, AsyncPipe, DatePipe],
  templateUrl: './order.html',
  styleUrl: '../app.css',
})

export class Order { 

  orderService = inject(OrderService); 
  
  ord$: Observable<Orderi> | undefined;
  orderId: WritableSignal<number> = signal(0);
  beginningOfTime = new Date(0);
  now = new Date();
  result: WritableSignal<string> = signal('');
  done: WritableSignal<boolean> = signal(false);
  itemz: Item[]=[{itemId:0,description:'',qty:0, price:0}];

  orderModel = signal<Orderi>({ 
    orderId : 0,
    createDate : '',
    customerName: '',
    csrApprovalDate: this.beginningOfTime,
    orderStatus: '',
    items: this.itemz
  });

  orderForm = form(this.orderModel, (fieldPath) => {
    required(fieldPath.customerName,{message:' Customer Name is required.'}); 
    required(fieldPath.items, {message:' At least one item is required.'})   
  });

  constructor(route: ActivatedRoute,
    _router: Router){
      
    let param = route.snapshot.paramMap.get('orderId');
    if(param){
      let myInt = parseInt(param);
      if(myInt){
        this.orderId.set(myInt);
        this.ord$ = this.orderService.getOrderByOrderId(this.orderId()).pipe(tap(o => {
          this.orderModel.set(o);           
        }));        
      }
      else{
        console.warn('Cannot parse an Int from the param of ' + param);
      }
    }
    else{
      console.warn('Param is missing.');
    }
    
  }

  onSubmit(event: Event): void{
    event.preventDefault();
    submit(this.orderForm, async () => {
      
      const orderM = this.orderModel();
      let updateResult = this.orderService.updateOrder(orderM);
      if (updateResult){
        this.result.set('Success!');
        this.done.set(true);
        console.log(' done = '+ this.done());
      }

    });
  }

}
