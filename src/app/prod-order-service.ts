import { computed, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { AbsOrderService } from './abs-order-service';
import { ChangeOrderResponse, getNewOrder, Orderi } from './order/Orderi';

import { httpResource, HttpResourceRequest } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProdOrderService extends AbsOrderService {

  server = 'https://tributetogerc.org';
  serverPort = '9324';

  // prepare for getOrderByOrderId:
  targetOrderId = signal (999);
  private getOrderResource = httpResource<Orderi>( () =>this.server+':'+this.serverPort+'/order/'+this.targetOrderId());
  order = computed(() => this.getOrderResource.value);

  // prepare for getAllOrders:
  dummy = signal(73923234234);
  allOrdersResource = httpResource<Orderi[]>(() =>{
    const request: HttpResourceRequest ={
      url : this.server+':'+this.serverPort+'/orders?'+this.dummy(),
      method: 'GET'
    };
    return request;
  });
  orders = computed(() => this.allOrdersResource.value ?? [] as Orderi[] );

  // prepare for updateOrder:
  private targetOrderForUpdateSig = signal<Orderi | null>(null);
  updateOrderResource = httpResource<ChangeOrderResponse | undefined>(() => {     
    if(!this.targetOrderForUpdateSig()) return undefined; //do this so an unitended to to the server is not made when this class is instantiated.  
    const request: HttpResourceRequest = {
      url: this.server+':'+this.serverPort+'/changeOrder?',
      method: 'PUT',
      body: this.targetOrderForUpdateSig() 
    };
    return request;
  }); 

  // prepare for addNewOrder:
  private targetOrderForAddSig = signal<Orderi | null>(null);
  addOrderResource = httpResource<Orderi | undefined>(() => {     
    if(!this.targetOrderForAddSig()) return undefined;  
    const request: HttpResourceRequest = {
      url: this.server+':'+this.serverPort+'/newOrder',
      method: 'PUT',
      body: this.targetOrderForAddSig() 
    };
    return request;
  }); 

  constructor(){
    super();
    //console.log('ProdOrderService says producion = ' + environment.production);
  }

  override addNewOrder(): WritableSignal<Orderi | undefined>{
    this.targetOrderForAddSig.set(getNewOrder());
    return this.addOrderResource.value;
  }
 
  override updateOrder(order: Orderi):WritableSignal<ChangeOrderResponse | undefined> {
    this.targetOrderForUpdateSig.set(order);
    return this.updateOrderResource.value;
  }

  override getOrderByOrderId(orderId: number): WritableSignal<Orderi | undefined> {
    //console.log('Prod service - getOrderByOrderId - for Id = ' + orderId);
    if (orderId > 0){
      this.targetOrderId.set(orderId);
    }
    let result = this.getOrderResource.value ;
    const aDate = result()?.csrApprovalDate; 
    const ord = result();
    return result;
  }
    
  override getAllOrders(): WritableSignal<Orderi[] | undefined> {
    //console.log('Prod getAllOrders() ... ');
    this.dummy.set(new Date().getTime());
    let result = this.allOrdersResource.value;
    //console.log('Prod getAllOrders() .. this.orders()()?.length= ' + result()?.length);
    return result;
  }

 
}
