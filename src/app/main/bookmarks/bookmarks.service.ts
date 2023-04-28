import { Website } from 'common/website';
import { Observable } from 'rxjs';


export interface BookmarksService {
  addWebsite(site: Website): Observable<Website>
  getWebsites(): Observable<Website[]>
  updateWebsite(site: Website): Observable<Website>
  deleteWebsite(site: Website): Observable<Website>
}