import { Website } from 'common/website';
import {Express, Request, RequestHandler, Response} from 'express';

const endpoint = '/websites';
const endpointWithId = '/websites/:id';

const forOhForBlocker: RequestHandler = (req, res, next) => req.user ? next() : res.status(404).send();

export function initalizeEndpoints(app: Express) {
  app.get(endpoint,
    forOhForBlocker, 
    (req: Request, res: Response<Website[]>) => {
      let websites: Website[] = [
        {id: 0, name: "Google", url: "https://www.google.com", date: new Date('2018-03-26')},
        {id: 1, name: "Amazon", url: "https://www.amazon.com", date: new Date('2019-12-28')}
      ];
  
      res.send(websites);
  });
  
  app.post(endpoint,
    forOhForBlocker,
    (req: Request<any, any, Website>, res: Response<Website>) => {
    let website = req.body;
    website.id = new Date().getTime();
    res.send(website);
  });
  
  app.put(endpointWithId,
    forOhForBlocker,
    (req: Request<{id: string}, any, Website>, res: Response<Website>) => {
    res.send(req.body);
  });
  
  app.delete(endpointWithId,
    forOhForBlocker,
    (req, res) => {
    res.send();
  });
}