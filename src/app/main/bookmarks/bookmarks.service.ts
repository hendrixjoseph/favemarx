import { Observable } from 'rxjs';
import { Website } from './bookmark';

export interface BookmarksService {
  addWebsite(site: Website): Observable<Website>
  getWebsites(): Observable<Website[]>
  updateWebsite(site: Website): Observable<Website>
  deleteWebsite(site: Website): Observable<Website>
}