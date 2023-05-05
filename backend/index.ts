import greenlock from 'greenlock-express';
import { fileURLToPath } from 'url';
import path from 'path';
import getApp from './app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __parent = path.resolve(__dirname, '../');

greenlock.init({
  packageRoot: __parent,
  maintainerEmail: "contact@favemarx.com",
  configDir: './greenlock.d',
  cluster: false
}).serve(getApp());
