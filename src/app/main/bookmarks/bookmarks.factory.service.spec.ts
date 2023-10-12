import { TestBed } from '@angular/core/testing';

import { BookmarksFactoryService } from './bookmarks.factory.service';

describe('BookmarksFactoryService', () => {
  let service: BookmarksFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookmarksFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
