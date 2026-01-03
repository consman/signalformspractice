import { Component, inject, Renderer2, signal, WritableSignal } from '@angular/core';
import { Orderi , getNewOrder, initialOrder, orderSchema} from './Orderi';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable , of, tap} from 'rxjs';

import { Field, form, submit } from '@angular/forms/signals';
import { AsyncPipe , DatePipe} from '@angular/common'; //, JsonPipe
import { ItemList } from '../item-list/item-list';
import { Item } from '../item-list/itemList';
import { AbsOrderService } from '../abs-order-service';

@Component({
  selector: 'app-order',
  imports: [RouterLink, Field, AsyncPipe, DatePipe, ItemList], //, JsonPipe
  templateUrl: './order.html',
  styleUrl: '../app.css',
})

export class Order {

  orderService = inject(AbsOrderService);
  now = new Date();
  today = getBasicDateString(this.now);
  startOfToday: Date = new Date(this.today);

  ordSig$: WritableSignal<Observable<Orderi>| undefined> =signal(undefined);
  orderId: WritableSignal<number> = signal(0);

  result: WritableSignal<string> = signal('');
  done: WritableSignal<boolean> = signal(false);
  savedOrdStatus$: Observable<Boolean> = of(false); 

  orderModel = signal<Orderi>(initialOrder);
  orderForm = form(this.orderModel, orderSchema);

  orderTotal: WritableSignal<number> = signal(0);

  constructor(route: ActivatedRoute, _router: Router,private renderer: Renderer2){

    this.orderId.set(0);
    let orderIdOrFunc = route.snapshot.paramMap.get('orderIdOrFunc');
    //console.log('orderIdOrFunc = ' + orderIdOrFunc);
    let tempNewOrderId: number | undefined  = 0;
    if(orderIdOrFunc == 'add'){

      this.ordSig$.set( this.orderService.addNewOrder(getNewOrder()).pipe(tap(o=> {

        tempNewOrderId = o.orderId;
        if(o.orderId) {
          this.orderId.set(o.orderId);
        }
        this.orderModel.set(o);
        this.updateOrderTotal(o);
        })));
    }
    else{ //here we are just retrieving an existing order
      if(orderIdOrFunc){
        //console.log('Going for orderIdOrFunc '+ orderIdOrFunc);
        let myInt = parseInt(orderIdOrFunc);
        if(myInt){
          this.orderId.set(myInt);
          this.ordSig$.set(this.orderService.getOrderByOrderId(this.orderId()).pipe(tap(o => {
            this.orderModel.set(o);
            this.updateOrderTotal(o);
            //console.log('o.csrApprovalDate.getTime() = '+o.csrApprovalDate.getTime());
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

  updateOrderTotal(o:Orderi):void{
    let temp = 0;
    o.items.forEach(i=>{
       //this.orderTotal() ;
      temp = temp + (i.price * i.qty);
    });
    this.orderTotal.set(temp);
  }

  
  onSubmit(event: Event): void{
    event.preventDefault();
    if (event.type == 'submit'){
      submit(this.orderForm, async () => {
        const orderM = this.orderModel();
        this.result.set('Order not updated. Something went wrong. Please check the remote service.');
        this.savedOrdStatus$ = this.orderService.updateOrder(orderM).pipe(tap(bool=>{
          console.log('Going for update order ');
          if (bool) {
            this.result.set('Success!');
          }          
          this.done.set(true);
        }));        
      });
    }
    else{
      console.log('The event type = ' +event.type);
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

    let itemsLength = this.orderForm.items().value().length;
    let newItem =getNewItem(itemsLength + 1);
    this.orderModel.update(order => {
      order.items = [...order.items, newItem];
      return {...order};
    })
  }

  deleteItem(itemId:number):void{
    //console.log('Deleting itemId = ' +itemId);
    let fItems = this.orderForm.items().value();
    let target: Item | undefined;
    fItems.forEach(i=>{
      if (i.itemId == itemId){
        target = i;
      }
    });
    if(target){
      let ind = fItems.findIndex((i:Item) =>{return target?.itemId == i.itemId} );
      fItems.splice(ind,1);
      this.orderModel.update(order => {
        order.items = [...fItems];
        return {...order}
      });
    }
  }

    consOrderModelItems(): void {
      this.orderModel().items.forEach(i =>{
        console.log('M item id = ' + i.itemId + ' items desc = ' +i.description);
      });
      this.orderForm().value().items.forEach(i =>{
        console.log('F item id = ' + i.itemId + ' items desc = ' +i.description);
      });
      console.log('F this.orderForm().value().csrApprovalDate.getTime() = ' + this.orderForm().value().csrApprovalDate.getTime());
  }

}

export function getBasicDateString(d:Date): string{
    let mo = ''+(d.getMonth()+1);
    if ((d.getMonth()+1) < 10){
        mo = '0'+mo;
    }
    let da = ''+(d.getDate());
    if( d.getDate() < 10){
        da = '0'+da;
    }
    return ''+d.getFullYear() +'-' + mo + '-'+ da;
}

export function getNewItem(newId:number): Item  {
  return{
    itemId:newId, description:'New Item', qty:1, price:1
  }
};
