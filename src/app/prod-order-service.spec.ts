import { TestBed } from '@angular/core/testing';
import { ProdOrderService } from './prod-order-service';

describe('ProdOrderService', () => {
  let service: ProdOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProdOrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
