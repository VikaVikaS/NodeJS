// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from './router';
import { initDB } from './db';

const app = express();

app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(router);

const run = async () => {
  await initDB();
  app.listen(3000, () => {
    console.info('Your app is listening on port 3000');
  });
};

run();
