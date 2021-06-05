import { TestBed } from '@angular/core/testing';

import { AccountBooksService } from './account-books.service';

describe('AccountBooksService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AccountBooksService = TestBed.get(AccountBooksService);
    expect(service).toBeTruthy();
  });
});
