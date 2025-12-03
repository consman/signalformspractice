import { ComponentFixture, TestBed } from '@angular/core/testing';
import { routes } from '../app.routes';
import { ActivatedRoute, provideRouter } from '@angular/router';

export const FAKE_ROUTE = {
  snapshot: { paramMap: {get: () => 'order'}}
};

import { Order } from './order';

describe('Order', () => {
  let component: Order;
  let fixture: ComponentFixture<Order>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Order],
      providers:[{provide: ActivatedRoute, useValue: FAKE_ROUTE},provideRouter(routes)]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Order);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
