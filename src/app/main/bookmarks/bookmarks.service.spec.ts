import { TestBed } from '@angular/core/testing';

import { HttpBookmarksService } from './http.bookmarks.service';

describe('BookmarksService', () => {
  let service: HttpBookmarksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpBookmarksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
