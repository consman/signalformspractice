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
  today = getBasicDateString(this.now); 
  startOfToday: Date = new Date(this.today);
  
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
    //console.log('orderIdOrFunc = ' + orderIdOrFunc);
    let tempNewOrderId: number | undefined  = 0;
    if(orderIdOrFunc == 'add'){
      
      this.ordSig$.set( this.orderService.addNewOrder().pipe(tap(o=> {
        
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
      //this.orderModel().items.splice(3,1);
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
      //console.log('Save after delete item H');
    }
    else{
      console.log('The event type = ' +event.type);
    }
    //console.log('Save after delete item I');
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
    this.orderModel().items.push(newItem);
    //this.reRenderItems('newItem');
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
      //console.log('The index in deleteItem = ' + ind);

      fItems.splice(ind,1);
      //console.log('The length of fItems after splice = ' + fItems.length);
      

      let tempOrd = this.orderModel();
      let newOrd = this.getNewOrderFromOldOrder(tempOrd);
      newOrd.items = fItems;
      this.ordSig$.set(this.orderService.updateOrder(newOrd).pipe(tap(o=>{
        this.orderModel.set(o);        
      })) );
    }
    this.reRenderItems('deleteItem');
  }


  reRenderItems(func:string): void {

    //TODO Fix this hack! IT simulates the user clicking on some of the existing field so that the 
    let tempOrd = this.orderModel();

    //let newLength = tempOrd.items.length > 1 ? tempOrd.items.length : 1;
    let ind = 0;
    if (func =='deleteItem'){      
      ind = tempOrd.items.length-1
    }
    if(func !='deleteItem' || tempOrd.items.length > 0){ 
      //console.log('func= ' + func + ' tempOrd.items.length = ' + tempOrd.items.length);
      let id= '#itemprc_'+ind;
      if  (!(func == 'newItem' && tempOrd.items.length < 2)) {
        
        this.renderer.selectRootElement(id).focus();
        id= '#itemqty_'+ind;
        this.renderer.selectRootElement(id).focus();
      }   
        setTimeout(() =>{
          id= '#itemdesc_'+ind;
          this.renderer.selectRootElement(id).focus();        
        }, 100); // app runs fine with only 1 ms delay, but need to bump to 7 at least for Unit tests to pass         
    }
    
  }

    consOrderModelItems(): void {
      this.orderModel().items.forEach(i =>{
        console.log('M item id = ' + i.itemId + ' items desc = ' +i.description);
      });
      this.orderForm().value().items.forEach(i =>{
        console.log('F item id = ' + i.itemId + ' items desc = ' +i.description);
      });
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
