import { Injectable, InjectionToken } from '@angular/core';
import { LocalStorageBookmarksService } from './localstorage.bookmarks.service';
import { BookmarksService } from './bookmarks.service';
import { HttpBookmarksService } from './http.bookmarks.service';

@Injectable({
  providedIn: 'root'
})
export class BookmarksFactoryService {

  useDemo = false;

  constructor(private localStorageBookmarksService: LocalStorageBookmarksService,
              private httpBookmarksService: HttpBookmarksService) { }

  getService(): BookmarksService {
    if (this.useDemo) {
      return this.localStorageBookmarksService;
    } else {
      return this.httpBookmarksService;
    }
  }
}

export const bookmarksServiceProvider = {
  provide: new InjectionToken<BookmarksService>('bookmarksService'),
  useFactory: (factory: BookmarksFactoryService) => factory.getService(),
  deps: [BookmarksFactoryService]
};
