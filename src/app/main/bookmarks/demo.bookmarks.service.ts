import { Observable, of } from "rxjs";
import { BookmarksService } from "./bookmarks.service";
import { Website } from './bookmark';
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class DemoBookmarksService implements BookmarksService {
  websites: Website[] = [
    {id: 0, name: "Google", url: "https://www.google.com", date: new Date('2018-03-26')},
    {id: 1, name: "Amazon", url: "https://www.amazon.com", date: new Date('2019-12-28')}
  ];

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