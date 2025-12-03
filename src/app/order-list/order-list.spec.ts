import { ComponentFixture, TestBed } from '@angular/core/testing';
import { routes } from '../app.routes';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { OrderList } from './order-list';
import { Orderi } from '../defs';

export const FAKE_ROUTE = {
  snapshot: { paramMap: {get: () => 'orders'}}
};

export const FAKEORDER: Orderi =
{orderId:400,createDate:new Date (),customerName:'Unit Test',csrApprovalDate:new Date (0),orderStatus:'New',items:
    [{itemId:1,description:'Description - Unit Test', price:9,qty:7},
     {itemId:2,description:'Description - Unit Test Other Item', price:5,qty:2}
    ]
};

describe('OrderList', () => {
  let component: OrderList;
  let fixture: ComponentFixture<OrderList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderList],
      providers:[{provide: ActivatedRoute, useValue: FAKE_ROUTE},provideRouter(routes)]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should Add the total', () => {
    component.addTotals(FAKEORDER);
    expect(component.orderTotalsMapSig().get(400)).toEqual(73);
  });

});
