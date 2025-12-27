import { inject, Injectable } from '@angular/core';
import { AbsOrderService } from './abs-order-service';
import { Observable, tap } from 'rxjs';
import { Orderi } from './order/Orderi';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProdOrderService extends AbsOrderService {
  http = inject(HttpClient);

  server = 'https://tributetogerc.org';
  serverPort = '9324';

  constructor(){
    super();
    console.log('ProdOrderService says producion = ' + environment.production);
  }

  override getAllOrders(): Observable<Orderi[]> {
    return this.http.get <Orderi[]> (this.server+':'+this.serverPort+'/orders').pipe(tap(ords => {
      ords.forEach(ord => {
        //console.log('Order id '+ ord.orderId + ' has an approval date of ' + ord.csrApprovalDate);
        ord.csrApprovalDate = new Date( ord.csrApprovalDate );
      });
    }));    
  }
  override getOrderByOrderId(orderId: number): Observable<Orderi> {
    console.log('Going for get order id in Prod and order id is: '+ orderId);
    return this.http.get <Orderi> (this.server+':'+this.serverPort+'/order/'+orderId).pipe(tap(ord =>{
       ord.csrApprovalDate = new Date( ord.csrApprovalDate );
    })); 
  }
  override updateOrder(order: Orderi): Observable<any> {
    console.log('PROD! -- Attempting to update order ' + order.orderId);
    let headers = new HttpHeaders();
    headers = headers.append("Content-Type", "application/json");
    let result =  this.http.put <Boolean>(this.server+':'+this.serverPort+'/changeOrder',order,{headers: headers}).pipe(tap(bool=>{
      console.log('The result is: ' +bool);
    }));
    
    return result;
  }
  override addNewOrder(order: Orderi): Observable<Orderi>{
    return this.http.post <Orderi>(this.server+':'+this.serverPort+'/newOrder',order).pipe(tap(ord =>{
       ord.csrApprovalDate = new Date( ord.csrApprovalDate );
    }));
  }
  
}
