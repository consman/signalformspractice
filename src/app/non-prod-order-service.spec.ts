import { TestBed } from '@angular/core/testing';
import { NonProdOrderService } from './non-prod-order-service';

describe('NonProdOrderService', () => {
  let service: NonProdOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NonProdOrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
