import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { AbsOrderService } from './abs-order-service';
import { Observable, tap } from 'rxjs';
import { Orderi } from './order/Orderi';

import { HttpClient, HttpHeaders, httpResource, HttpResourceRequest } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProdOrderService extends AbsOrderService {
  http = inject(HttpClient);

  server = 'https://tributetogerc.org';
  serverPort = '9324';

  private targetOrderForUpdateSig = signal<Orderi | null>(null);

  updateOrderResource = httpResource<Boolean | undefined>(() => {     
    if(!this.targetOrderForUpdateSig()) return undefined; //do this so an unitended to to the server is not made when this class is instantiated.  
    const request: HttpResourceRequest = {
      url: this.server+':'+this.serverPort+'/changeOrder',
      method: 'PUT',
      body: this.targetOrderForUpdateSig() 
    };
    return request;
    });

  constructor(){
    super();
    console.log('ProdOrderService says producion = ' + environment.production);
  }

  override getAllOrders(): Observable<Orderi[]> {
    return this.http.get <Orderi[]> (this.server+':'+this.serverPort+'/orders');    
  }
  override getOrderByOrderId(orderId: number): Observable<Orderi> {
    
    return this.http.get <Orderi> (this.server+':'+this.serverPort+'/order/'+orderId).pipe(tap(ord =>{
       ord.csrApprovalDate = new Date( ord.csrApprovalDate );
    })); 
  }

  override updateOrderR(order: Orderi):WritableSignal<Boolean | undefined> {
    this.targetOrderForUpdateSig.set(order);  
    return this.updateOrderResource.value;
  }

  override addNewOrder(order: Orderi): Observable<Orderi>{
    return this.http.post <Orderi>(this.server+':'+this.serverPort+'/newOrder',order).pipe(tap(ord =>{
       ord.csrApprovalDate = new Date( ord.csrApprovalDate );
    }));
  }
  
}
