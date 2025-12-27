import { TestBed } from '@angular/core/testing';

import { AbsOrderService } from './abs-order-service';

describe('AbsOrderService', () => {
  let service: AbsOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AbsOrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
