import { TestBed } from '@angular/core/testing';

import { PaymentRunService } from './payment-run.service';

describe('PaymentRunService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PaymentRunService = TestBed.get(PaymentRunService);
    expect(service).toBeTruthy();
  });
});
