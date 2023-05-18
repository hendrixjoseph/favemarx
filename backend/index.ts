import greenlock from 'greenlock-express';
import { fileURLToPath } from 'url';
import path from 'path';
import getApp from './app.js';
import express from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __parent = path.resolve(__dirname, '../');

const app = getApp();

greenlock.init({
  packageRoot: __parent,
  maintainerEmail: "contact@favemarx.com",
  configDir: './greenlock.d',
  cluster: false
}).serve(app);
