import { Injectable } from '@angular/core';
import { DemoBookmarksService } from './demo.bookmarks.service';
import { BookmarksService } from './bookmarks.service';
import { HttpBookmarksService } from './http.bookmarks.service';

@Injectable({
  providedIn: 'root'
})
export class BookmarksFactoryService {

  useDemo = false;

  constructor(private demoBookmarksService: DemoBookmarksService,
              private httpBookmarksService: HttpBookmarksService) { }

  getService(): BookmarksService {
    if (this.useDemo) {
      return this.demoBookmarksService;
    } else {
      return this.httpBookmarksService;
    }
  }
}
