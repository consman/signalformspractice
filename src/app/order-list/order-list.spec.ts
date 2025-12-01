import { ComponentFixture, TestBed } from '@angular/core/testing';
import { routes } from '../app.routes';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { OrderList } from './order-list';
import { Observable } from 'rxjs';
import { Orderi } from '../defs';

export const FAKE_ROUTE = {
  snapshot: { paramMap: {get: () => 'order/:600'}}
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

  it('should create a new order', () => {
    component.addNewOrder();
    expect(component.newOrderButtonClick() == true);
  });
});
