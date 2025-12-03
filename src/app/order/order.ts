import { Component, inject, signal, WritableSignal } from '@angular/core';
import { Item, Orderi } from '../defs'
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OrderService } from '../order-service';
import { Observable , pipe, tap} from 'rxjs';

import { Field, form, submit , required} from '@angular/forms/signals';
import { AsyncPipe , DatePipe} from '@angular/common';
import { ItemList } from '../item-list/item-list';

@Component({
  selector: 'app-order',
  imports: [RouterLink, Field, AsyncPipe, DatePipe, ItemList],
  templateUrl: './order.html',
  styleUrl: '../app.css',
})

export class Order { 

  orderService = inject(OrderService); 
  now = new Date();
  beginningOfTime = new Date(0);
  
  ordSig$: WritableSignal<Observable<Orderi>| undefined> =signal(undefined);
  orderId: WritableSignal<number> = signal(0);
  
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
  });

  orderTotal: WritableSignal<number> = signal(0);

  constructor(route: ActivatedRoute, _router: Router){

    //console.log('in constructor');

    this.orderId.set(0);
    let orderIdOrFunc = route.snapshot.paramMap.get('orderIdOrFunc');
    let tempNewOrderId: number | undefined  = 0;
    if(orderIdOrFunc == 'add'){
      //this.add.set(true);
      //console.log(' Func = add');
      
      this.ordSig$.set( this.orderService.addNewOrder().pipe(tap(o=> {
        
        tempNewOrderId = o.orderId;
        if(o.orderId) {
          this.orderId.set(o.orderId);
          //console.log(' in Func = add and the orderId = '+ o.orderId);
        }
        this.orderModel.set(o); 
        o.items.forEach(i=>{
            let temp = this.orderTotal() ;
            this.orderTotal.set(temp + (i.price * i.qty));
          });  
        })));  
    }
    else{ // not add but coming in with an existing order
      //console.log('In existing order section and param = ' + orderIdOrFunc);
      if(orderIdOrFunc){      
        let myInt = parseInt(orderIdOrFunc);
        if(myInt){
          this.orderId.set(myInt);
          this.ordSig$.set(this.orderService.getOrderByOrderId(this.orderId()).pipe(tap(o => {
            this.orderModel.set(o);   
            o.items.forEach(i=>{
              let temp = this.orderTotal() ;
              this.orderTotal.set(temp + (i.price * i.qty));
            });        
          })));      
        }
        else{
          console.warn('Cannot parse an Int from the param of ' + orderIdOrFunc);
        }
      }
      else{
        console.warn('Param is not orderId, but rather '+ orderIdOrFunc);
      } 
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
        
        //console.log(' done = '+ this.done());
        //console.log(' event.target = '+ event.target);
      }

    });
  }
}
