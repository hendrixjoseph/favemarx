declare module 'greenlock-express' {
  import { Express } from 'express';

  export interface opts {
      packageRoot: string;
      maintainerEmail: string;
      configDir: string;
      cluster: boolean;
      workers?: number;
  }
  
  export interface serve {
      ready: (app?: Express) => serve;
      master: (app?: Express) => serve;
      serve: (app: (req: any, res: any) => void) => void;
  }
  
  export interface greenlock {
      init: (o: (opts | (() => opts))) => serve;
  }
  
  const gl: greenlock;
  
  export default gl;
}