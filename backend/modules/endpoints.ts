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
      mysqlPool.getBookmarks(1, (err, websites) => res.send(websites))
  );
  
  app.post(endpoint,
    forOhForBlocker,
    (req: Request<any, any, Website>, res: Response<Website>) =>
      mysqlPool.addBookmark(1, req.body, (err, result) => res.send(result))
  );
  
  app.put(endpointWithId,
    forOhForBlocker,
    (req: Request<{id: string}, any, Website>, res: Response<Website>) => 
      mysqlPool.updateBookmark(1, req.body, (err, result) => res.send(result))
  );
  
  app.delete(endpointWithId,
    forOhForBlocker,
    (req: Request<{id: string}, any, Website>, res: Response<boolean>) => 
      mysqlPool.deleteBookmark(1, Number(req.params.id), (err, result) => res.send(result))
  );
}