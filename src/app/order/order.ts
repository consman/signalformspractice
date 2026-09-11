import { Component, inject, signal, WritableSignal, effect } from '@angular/core';
import { ChangeOrderResponse, Orderi , getNewOrder, initialOrder, orderSchema} from './Orderi';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { FormField, form, submit } from '@angular/forms/signals';
import { DatePipe} from '@angular/common'; //, JsonPipe
import { ItemList } from '../item-list/item-list';
import { Item } from '../item-list/itemList';
import { AbsOrderService } from '../abs-order-service';

@Component({
  imports: [RouterLink, FormField, DatePipe, ItemList],
  selector: 'app-order',
  styleUrl: '../app.css',
  templateUrl: './order.html',
})
export class Order {
  orderService = inject(AbsOrderService);
  now = new Date();
  today = getBasicDateString(this.now);
  startOfToday: Date = new Date(this.today);

  ordSig: WritableSignal<Orderi| undefined> =signal(undefined);
  orderId: WritableSignal<number> = signal(0);

  result: WritableSignal<string> = signal('');
  done: WritableSignal<boolean> = signal(false);

  orderModel = signal<Orderi>(initialOrder);
  orderForm = form(this.orderModel, orderSchema);

  orderTotal: WritableSignal<number> = signal(0);   
  corSig: WritableSignal<ChangeOrderResponse | undefined> = signal(undefined); 

  constructor(route: ActivatedRoute, _router: Router){

    this.orderId.set(0);
    let orderIdOrFunc = route.snapshot.paramMap.get('orderIdOrFunc');
    if(orderIdOrFunc == 'add'){      
      this.ordSig =this.orderService.addNewOrder(); 
    }
    else{ //here we are just retrieving an existing order
      if(orderIdOrFunc){
        let myInt = parseInt(orderIdOrFunc);
        if(myInt){
          this.orderId.set(myInt);
          this.ordSig = this.orderService.getOrderByOrderId(this.orderId());
          const ordFromServer = this.ordSig();
        }
        else{
          console.warn('Cannot parse an Int from the of ' + orderIdOrFunc);
        }
      }
      else{
        console.warn('Param is not orderId, but rather '+ orderIdOrFunc);
      }
    }
    
    effect(() => {
      const prog = this.orderService.getUpdateInProgressSig();
        if( this.done() && !prog()){
          if( this.corSig && this.corSig()?.result ) {            
            this.result.set('Success!');
          }
          else {
            this.result.set('Order not updated. Something went wrong. Please check the remote service.');
          }
        }        
    });

    effect(() =>{  
      const ordFromServer = this.ordSig();           
      if(ordFromServer) {
        ordFromServer.csrApprovalDate = new Date(ordFromServer.csrApprovalDate);
        const orderSigOrderId = ordFromServer.orderId; // ordFromServer?.orderId;
        if (orderSigOrderId && orderSigOrderId > 0){
          this.orderId.set(orderSigOrderId);
          this.orderModel.set(ordFromServer);
          this.updateOrderTotal(ordFromServer);
        }        
      }
    });
  }

  updateOrderTotal(o:Orderi | undefined ):void{
    let temp = 0;
    if(o){
      o.items.forEach(i=>{
        temp = temp + (i.price * i.qty);
      });
      this.orderTotal.set(temp);
    }
  }

  onSubmit(event: Event): void{
    event.preventDefault();
    if (event.type == 'submit'){
      submit(this.orderForm, async () => {
        const orderM = this.orderModel();
        this.corSig = this.orderService.updateOrder(orderM);
        this.done.set(true); 
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

    let itemsLength = this.orderForm.items().value().length;
    let newItem =getNewItem(itemsLength + 1);
    this.orderModel.update(order => {
      order.items = [...order.items, newItem];
      return {...order};
    })
  }

  deleteItem(itemId:number):void{
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

}
