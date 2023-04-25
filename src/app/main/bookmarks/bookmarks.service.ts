import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Website } from './website';

@Injectable({
  providedIn: 'root'
})
export class BookmarksService {

  readonly endpoint = '/websites'

  constructor(private httpClient: HttpClient) { }

  getWebsites(): Observable<Website[]> {
    return this.httpClient.get<Website[]>(this.endpoint);
  }

  addWebsite(site: Website): Observable<Website> {
    return this.httpClient.post<Website>(this.endpoint, site);
  }

  updateWebsite(site: Website): Observable<Website> {
    return this.httpClient.put<Website>(this.endpoint, site);
  }

  deleteWebsite(site: Website): Observable<Website> {
    return this.httpClient.delete<Website>(`${this.endpoint}/${site.id}`);
  }
}
