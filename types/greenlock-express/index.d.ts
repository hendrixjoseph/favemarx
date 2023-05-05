declare module 'greenlock-express' {
  import { Express } from 'express';

  type opts = {
    packageRoot: string,
    maintainerEmail: string,
    configDir: string,
    cluster: boolean
  }

  type serve = {
    ready: (app?: Express) => serve;
    master: (app?: Express) => serve;
    serve: (app: Express) => void;
  }

  const greenlock: {
    init: (fn: (() => opts) | opts ) => serve;
  }

  export default greenlock;
}