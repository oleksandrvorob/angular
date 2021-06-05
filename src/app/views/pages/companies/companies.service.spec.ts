import { TestBed } from '@angular/core/testing';

import { CompaniesService } from './companies.service';

describe('CompaniesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CompaniesService = TestBed.get(CompaniesService);
    expect(service).toBeTruthy();
  });
});
