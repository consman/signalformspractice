import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

export const FAKE_ROUTE = {
  snapshot: { paramMap: {get: () => '502'}}
};

export const DELAY_TIME_BECAUSE_OF_USING_SIGNALS = 221;//TODO fix this when they come up with a statement to mitigate fast Unit tests of slow Signals.

import { Order } from './order';
import { NonProdOrderService } from '../non-prod-order-service';
import { AbsOrderService } from '../abs-order-service';
import { ApplicationRef, provideZonelessChangeDetection } from '@angular/core';

describe('Order', () => {
  let component: Order;
  let fixture: ComponentFixture<Order>;
  let nonProdOrderService = new NonProdOrderService();

  beforeEach(async () => {
    
    await TestBed.configureTestingModule({
      imports: [Order],
      providers:[provideZonelessChangeDetection(),{provide: ActivatedRoute, useValue: FAKE_ROUTE},
      {provide:AbsOrderService, useValue:nonProdOrderService}]  
    })
    .compileComponents();
    const appRef = TestBed.inject(ApplicationRef);

    fixture = TestBed.createComponent(Order);
    component = fixture.componentInstance;
    await fixture.whenStable();
    appRef.tick();
  });

  it('should create', () => {
    expect(component.orderId()).toEqual(502);
  });

  it('should provide the orderId of the order', () => {
    expect(component.orderId()).toEqual(502);
  });

  it('should provide the item Id of the items in the order', () => {
    //TestBed.flushEffects(); //deprecated in v21
    //TestBed.tick(); //useless 
    //const appRef = TestBed.inject(ApplicationRef); //useless
    //appRef.tick();
    setTimeout(()=>{      
      expect(component.orderForm.items().value()[0].itemId).toEqual(1);
      expect(component.orderForm.items().value()[3].itemId).toEqual(4);
    }, DELAY_TIME_BECAUSE_OF_USING_SIGNALS);  
  });

  it('should provide the number of the items in the order', () => {
    setTimeout(()=>{
      expect(component.orderForm.items.length).toEqual(4);
    }, DELAY_TIME_BECAUSE_OF_USING_SIGNALS); 
  });

  it('should provide the description of the item in the order', () => {
    setTimeout(()=>{
      expect(component.orderModel().items[0].description).toEqual('Android');
    }, DELAY_TIME_BECAUSE_OF_USING_SIGNALS);   
  });

  it('should be able to gracefully add another item to the item list', () => {
    component.addNewItem();
    setTimeout(()=>{
      expect(component.orderModel().items.length).toEqual(5);
    }, DELAY_TIME_BECAUSE_OF_USING_SIGNALS); 
  });

  it('should be able to delete an item from the item list', () => {
    component.deleteItem(3);
    setTimeout(() =>{
      expect(component.orderModel().items.length).toEqual(3);
    },DELAY_TIME_BECAUSE_OF_USING_SIGNALS);    
  });
});
