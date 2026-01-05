import { computed, effect, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { AbsOrderService } from './abs-order-service';
import { ChangeOrderResponse, getNewOrder, Orderi } from './order/Orderi';

import { httpResource, HttpResourceRequest } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProdOrderService extends AbsOrderService {

  server = 'https://tributetogerc.org';
  serverPort = '9324';

  // prepare for updateOrder:
  private targetOrderForUpdateSig = signal<Orderi | null>(null);
  private updateInProgressSig: Signal<boolean> = signal(true);

  updateOrderResource = httpResource<ChangeOrderResponse | undefined>(() => {     
    if(!this.targetOrderForUpdateSig()) return undefined; //do this so an unitended to to the server is not made when this class is instantiated.  
    const request: HttpResourceRequest = {
      url: this.server+':'+this.serverPort+'/changeOrder?',
      method: 'PUT',
      body: this.targetOrderForUpdateSig(),
      reportProgress: true
    };
    return request;
  }); 

  // prepare for addNewOrder:
  private targetOrderForAddSig = signal<Orderi | null>(null);
  addOrderResource = httpResource<Orderi | undefined>(() => {     
    if(!this.targetOrderForAddSig()) return undefined;  
    const request: HttpResourceRequest = {
      url: this.server+':'+this.serverPort+'/newOrder',
      method: 'POST',
      body: this.targetOrderForAddSig() 
    };
    return request;
  }); 

  constructor(){
    super();
  }

  override addNewOrder(): WritableSignal<Orderi | undefined>{
    this.targetOrderForAddSig.set(getNewOrder());
    return this.addOrderResource.value;
  }
 
  override updateOrder(order: Orderi):WritableSignal<ChangeOrderResponse | undefined> {
    this.updateInProgressSig = signal(true);
    this.targetOrderForUpdateSig.set(order);
    this.updateInProgressSig = this.updateOrderResource.isLoading;
    return this.updateOrderResource.value;
  }

  override getOrderByOrderId(orderId: number): WritableSignal<Orderi | undefined> {
    let result = httpResource<Orderi>( ()=>'https://tributetogerc.org:9324/order/'+orderId);
    return result.value;
  }
    
  override getAllOrders(): WritableSignal<Orderi[] | undefined> {
    let result = httpResource<Orderi[]>( ()=>'https://tributetogerc.org:9324/orders');
    return result.value;
  }

    override getUpdateInProgressSig(): Signal<boolean> {
    return this.updateInProgressSig;
  }
 
}
