import { TestBed } from '@angular/core/testing';

import { BankingService } from './banking.service';

describe('BankingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BankingService = TestBed.get(BankingService);
    expect(service).toBeTruthy();
  });
});
