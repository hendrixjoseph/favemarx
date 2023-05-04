import { Observable, combineLatest, map, of } from "rxjs";
import { BookmarksService } from "./bookmarks.service";
import { Injectable, OnInit } from "@angular/core";
import { Website } from "common/website";

const defaultSites: Website[] = [
  {name: "Google", url: "https://www.google.com", date: new Date("2018-03-26")},
  {name: "Amazon", url: "https://www.amazon.com", date: new Date("2019-12-28")}
];

@Injectable({
  providedIn: 'root'
})
export class DemoBookmarksService implements BookmarksService {

  addWebsite(site: Website): Observable<Website> {
    const nextId = Math.floor(Date.now() * Math.random());
    site.id = nextId;
    localStorage.setItem(site.id.toString(), JSON.stringify(site));
    return of(site);
  }

  getWebsites(): Observable<Website[]> {
    const websites: Website[] = Object.values(localStorage)
      .filter(json => json.includes('{'))
      .map(json => JSON.parse(json));

    if (websites.length === 0) {
      return combineLatest(defaultSites.map(site => this.addWebsite(site)));
    } else {
      websites.forEach(site => {
        site.date = new Date(site.date);
      })
      return of(websites);
    }
  }

  updateWebsite(site: Website): Observable<Website> {
    localStorage.setItem(site.id!.toString(), JSON.stringify(site));
    return of(site);
  }

  deleteWebsite(site: Website): Observable<Website> {
    localStorage.removeItem(site.id!.toString());
    return of(site);
  }
}