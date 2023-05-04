import { Website } from 'common/website';
import {Express, Request, RequestHandler, Response} from 'express';
import { BookmarksDb } from './mysql/bookmarks.db.js';
import { getMySqlPool } from './mysql/mysql.init.js';

const endpoint = '/websites';
const endpointWithId = '/websites/:id';

const forOhForBlocker: RequestHandler = (req, res, next) => req.user ? next() : res.status(404).send();

export function initalizeEndpoints(app: Express) {
  const mysqlPool = new BookmarksDb(getMySqlPool());

  app.get(endpoint,
    forOhForBlocker, 
    (req: Request, res: Response<Website[]>) =>
      mysqlPool.getBookmarks(req.user!.id, websites => res.send(websites))
  );
  
  app.post(endpoint,
    forOhForBlocker,
    (req: Request<any, any, Website>, res: Response<Website>) =>
      mysqlPool.addBookmark(req.user!.id, req.body, website => res.send(website))
  );
  
  app.put(endpointWithId,
    forOhForBlocker,
    (req: Request<{id: string}, any, Website>, res: Response<Website>) => 
      mysqlPool.updateBookmark(req.user!.id, req.body, website => res.send(website))
  );
  
  app.delete(endpointWithId,
    forOhForBlocker,
    (req: Request<{id: string}, any, Website>, res: Response<boolean>) => 
      mysqlPool.deleteBookmark(req.user!.id, Number(req.params.id), success => res.send(success))
  );
}