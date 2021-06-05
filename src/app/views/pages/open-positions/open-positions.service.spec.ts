import { TestBed } from '@angular/core/testing';

import { OpenPositionsService } from './open-positions.service';

describe('OpenPositionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OpenPositionsService = TestBed.get(OpenPositionsService);
    expect(service).toBeTruthy();
  });
});
