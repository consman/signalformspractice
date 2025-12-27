import { NonProdOrderService } from "./non-prod-order-service";
import { ProdOrderService } from "./prod-order-service";


export function orderServiceFactory(isProd: boolean): 
  NonProdOrderService | ProdOrderService {

    console.log('Running orderServiceFactory.. isProd = '+ isProd);
    if (isProd){
        return new ProdOrderService();
    }
    else {
        return new NonProdOrderService();
    }
  }