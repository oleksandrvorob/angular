import { TestBed } from '@angular/core/testing';

import { DateServicesService } from './date-services.service';

describe('DateServicesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DateServicesService = TestBed.get(DateServicesService);
    expect(service).toBeTruthy();
  });
});
