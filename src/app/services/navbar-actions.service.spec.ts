import { TestBed } from '@angular/core/testing';

import { NavbarActionsService } from './navbar-actions.service';

describe('NavbarActionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NavbarActionsService = TestBed.get(NavbarActionsService);
    expect(service).toBeTruthy();
  });
});
