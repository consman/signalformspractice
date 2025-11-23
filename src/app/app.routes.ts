import { Routes } from '@angular/router';
import { Order } from './order/order';
import { OrderList } from './order-list/order-list';

export const routes: Routes = [
    { path: '', component: OrderList},
    { path: 'order/:orderId', component: Order},
    { path: 'orders', component: OrderList},
];
