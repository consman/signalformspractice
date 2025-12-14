import { Component, inject, Renderer2, signal, WritableSignal } from '@angular/core';
import { Orderi , initialOrder, orderSchema} from './Orderi';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OrderService } from '../order-service';
import { Observable , of, tap} from 'rxjs';

import { Field, form, submit } from '@angular/forms/signals';
import { AsyncPipe , DatePipe} from '@angular/common'; //, JsonPipe
import { ItemList } from '../item-list/item-list';
import { Item } from '../item-list/itemList';

@Component({
  selector: 'app-order',
  imports: [RouterLink, Field, AsyncPipe, DatePipe, ItemList], //, JsonPipe
  templateUrl: './order.html',
  styleUrl: '../app.css',
})

export class Order { 

  orderService = inject(OrderService); 
  now = new Date();
  nowB = (Math.round(this.now.getTime()/(1000*60*60*24)) * 1000 *60*60*24);
  
  ordSig$: WritableSignal<Observable<Orderi>| undefined> =signal(undefined);
  orderId: WritableSignal<number> = signal(0);
  
  result: WritableSignal<string> = signal('');
  done: WritableSignal<boolean> = signal(false);

  orderModel = signal<Orderi>(initialOrder);
  orderForm = form(this.orderModel, orderSchema);

  orderTotal: WritableSignal<number> = signal(0);

  constructor(route: ActivatedRoute, _router: Router,private renderer: Renderer2){

    this.orderId.set(0);
    let orderIdOrFunc = route.snapshot.paramMap.get('orderIdOrFunc');
    let tempNewOrderId: number | undefined  = 0;
    if(orderIdOrFunc == 'add'){
      
      this.ordSig$.set( this.orderService.addNewOrder().pipe(tap(o=> {
        
        tempNewOrderId = o.orderId;
        if(o.orderId) {
          this.orderId.set(o.orderId);
        }
        this.orderModel.set(o); 
        o.items.forEach(i=>{
            let temp = this.orderTotal() ;
            this.orderTotal.set(temp + (i.price * i.qty));
          });  
        })));  
    }
    else{ // not add but coming in with an existing order
      
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
          console.warn('Cannot parse an Int from the of ' + orderIdOrFunc);
        }
      }
      else{
        console.warn('Param is not orderId, but rather '+ orderIdOrFunc); 
      } 
    }
  }

  onSubmit(event: Event): void{
    event.preventDefault();
    if (event.type == 'submit'){
      
      submit(this.orderForm, async () => {        
        const orderM = this.orderModel();
        let updateResult = this.orderService.updateOrder(orderM);
        if (updateResult){ //TODO this is really an observable of an order - not a boolean 
          
          this.result.set('Success!');
          this.done.set(true);
        }
        else {
          this.result.set('Order not updated. Something went wrong. Please check the remote service.');
        }

      });
    }
  }

  getNewOrderFromOldOrder(old:Orderi):Orderi{
    return {
      orderId: old.orderId,
      orderStatus: old.orderStatus,
      createDate: old.createDate,
      customerName: old.customerName,
      csrApprovalDate: old.csrApprovalDate,
      items: old.items      
    }
  }

  addNewItem():void{
    
    let newItem = getNewItem(this.orderModel().items.length + 1);//first item number is 1, not 0
    let tempOrd = this.orderModel();
    tempOrd.items.push(newItem);
    this.ordSig$.set(of(tempOrd));

    //TODO Fix this hack!
    let newLength = this.orderForm().value().items.length;
    let id= '#itemdesc_'+(newLength-2);
    this.renderer.selectRootElement(id).focus();
    id= '#itemqty_'+(newLength-2);
    this.renderer.selectRootElement(id).focus();
      setTimeout(() =>{
        id= '#itemdesc_'+(newLength-1);
        this.renderer.selectRootElement(id).focus();        
      }, 8); // app runs fine with only 1 ms delay, but need to bump to 7 at least for Unit tests to pass    
  }
}

export function getNewItem(newId:number): Item  { 
  return{
    itemId:newId, description:'New Item', qty:1, price:1
  }
};
