import { TestBed } from '@angular/core/testing';

import { ContractorsService } from './contractors.service';

describe('ContractorsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ContractorsService = TestBed.get(ContractorsService);
    expect(service).toBeTruthy();
  });
});
