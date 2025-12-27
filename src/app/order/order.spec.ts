import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

export const FAKE_ROUTE = {
  snapshot: { paramMap: {get: () => '502'}}
};

import { Order } from './order';
import { NonProdOrderService } from '../non-prod-order-service';
import { AbsOrderService } from '../abs-order-service';

describe('Order', () => {
  let component: Order;
  let fixture: ComponentFixture<Order>;
    let nonProdOrderService = new NonProdOrderService();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Order],
      providers:[{provide: ActivatedRoute, useValue: FAKE_ROUTE},
      {provide:AbsOrderService, useValue:nonProdOrderService}]  
    })
    .compileComponents();

    fixture = TestBed.createComponent(Order);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component.orderId()).toEqual(502);
  });

  it('should provide the orderId of the order', () => {
    expect(component.orderId()).toEqual(502);
  });

  it('should provide the item Id of the items in the order', () => {
    expect(component.orderForm.items().value()[0].itemId).toEqual(1);
    expect(component.orderForm.items().value()[3].itemId).toEqual(4);
  });

  it('should provide the number of the items in the order', () => {
    expect(component.orderForm.items.length).toEqual(4);
  });

  it('should provide the description of the item in the order', () => {
    expect(component.orderModel().items[0].description).toEqual('Android');
  });

  it('should be able to gracefully add another item to the item list', () => {
    component.addNewItem();
    expect(component.orderModel().items.length).toEqual(5);
  });

  it('should be able to delete an item from the item list', () => {
    component.deleteItem(3);
    setTimeout(() =>{
      expect(component.orderModel().items.length).toEqual(3);
    },200);    
  });
});
