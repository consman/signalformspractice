import { ComponentFixture, TestBed } from '@angular/core/testing';
//import { routes } from '../app.routes';
import { ActivatedRoute } from '@angular/router';

export const FAKE_ROUTE = {
  snapshot: { paramMap: {get: () => '502'}}
};

import { Order } from './order';

describe('Order', () => {
  let component: Order;
  let fixture: ComponentFixture<Order>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Order],
      providers:[{provide: ActivatedRoute, useValue: FAKE_ROUTE}]
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
    expect(component.orderForm.items.length).toEqual(4);
  });

  it('should provide the number of the items in the order', () => {
    expect(component.orderForm.items.length).toEqual(4);
  });

  it('should provide the description of the item in the order', () => {
    expect(component.orderModel().items[0].description).toEqual('Android');
  });
});
