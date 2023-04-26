import express, {Request, Response} from 'express';

const app = express();

app.use(express.json());

const endpoint = '/websites';
const endpointWithId = '/websites/:id';

export interface Website {
  id?: number,
  name: string,
  url: string,
  date: Date
}

app.get(endpoint, (req, res: Response<Website[]>) => {
  let websites: Website[] = [
    {id: 0, name: "Google", url: "https://www.google.com", date: new Date()},
    {id: 1, name: "Amazon", url: "https://www.amazon.com", date: new Date()}
  ];

  res.send(websites);
});

app.post(endpoint, (req: Request<any, any, Website>, res: Response<Website>) => {
  let website = req.body;
  website.id = new Date().getTime();
  res.send(website);
});

app.put(endpointWithId, (req: Request<{id: string}, any, Website>, res: Response<Website>) => {
  res.send(req.body);
});

app.delete(endpointWithId, (req, res) => {
  res.send();
});

app.listen(8080, ():void => {
  console.log(`Server Running here 👉 http://localhost:8080`);
});