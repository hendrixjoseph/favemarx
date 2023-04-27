import { Observable, of } from "rxjs";
import { BookmarksService } from "./bookmarks.service";
import { Website } from './bookmark';

export class DemoBookmarksService implements BookmarksService {
  websites: Website[] = [];

  addWebsite(site: Website): Observable<Website> {
    site.id = new Date().getTime()
    this.websites.push(site);
    return of(site);
  }

  getWebsites(): Observable<Website[]> {
    return of(this.websites);
  }

  updateWebsite(site: Website): Observable<Website> {
    const index = this.websites.findIndex(s => s.id === site.id);
    this.websites[index] = site;
    return of(site);
  }

  deleteWebsite(site: Website): Observable<Website> {
    this.websites = this.websites.filter(s => s.id === site.id);
    return of(site);
  }
}