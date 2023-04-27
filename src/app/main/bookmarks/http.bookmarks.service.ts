import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Website } from './bookmark';
import { BookmarksService } from './bookmarks.service';

@Injectable({
  providedIn: 'root'
})
export class HttpBookmarksService implements BookmarksService {

  readonly endpoint = '/websites'

  readonly mapper = map<Website, Website>(site => this.mapDate(site))

  constructor(private httpClient: HttpClient) { }

  getWebsites(): Observable<Website[]> {
    return this.httpClient.get<Website[]>(this.endpoint).pipe(
      map(sites => sites.map(site => this.mapDate(site)))
    );
  }

  addWebsite(site: Website): Observable<Website> {
    this.ensureUrlHasHttp(site);

    return this.httpClient.post<Website>(this.endpoint, site).pipe(this.mapper);
  }

  updateWebsite(site: Website): Observable<Website> {
    this.ensureUrlHasHttp(site);

    return this.httpClient.put<Website>(this.endpointWithId(site), site).pipe(this.mapper);;
  }

  deleteWebsite(site: Website): Observable<Website> {
    return this.httpClient.delete<Website>(this.endpointWithId(site));
  }

  private endpointWithId(site: Website) {
    return `${this.endpoint}/${site.id}`;
  }

  private ensureUrlHasHttp(site: Website) {
    if (!site.url.startsWith('http')) {
      site.url = 'https://' + site.url;
    }
  }

  private mapDate(site: Website): Website {
    site.date = new Date(site.date);
    return site;
  }
}
