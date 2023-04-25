import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Website } from './bookmark';

@Injectable({
  providedIn: 'root'
})
export class BookmarksService {

  readonly endpoint = '/websites'

  readonly mapper = map<Website, Website>(site => this.mapDate(site))

  constructor(private httpClient: HttpClient) { }

  getWebsites(): Observable<Website[]> {
    return this.httpClient.get<Website[]>(this.endpoint).pipe(
      map(sites => sites.map(site => this.mapDate(site)))
    );
  }

  addWebsite(site: Website): Observable<Website> {
    return this.httpClient.post<Website>(this.endpoint, site).pipe(this.mapper);
  }

  updateWebsite(site: Website): Observable<Website> {
    return this.httpClient.put<Website>(`${this.endpoint}/${site.id}`, site).pipe(this.mapper);;
  }

  deleteWebsite(site: Website): Observable<Website> {
    return this.httpClient.delete<Website>(`${this.endpoint}/${site.id}`);
  }

  private mapDate(site: Website): Website {
    site.date = new Date(site.date);
    return site;
  }
}
