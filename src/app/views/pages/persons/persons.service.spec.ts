import { TestBed } from '@angular/core/testing';

import { PersonsService } from './persons.service';

describe('PersonsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PersonsService = TestBed.get(PersonsService);
    expect(service).toBeTruthy();
  });
});
