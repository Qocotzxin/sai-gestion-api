/*!
 * SAI - Copyright 2019
 *  Cristian Etchebarne
 */

import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import { CORS_CONFIG } from './config/config';

require('./config/config');
const compression = require('compression');
const app = express();

mongoose.connect(
  process.env.URL_DB,
  { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
  err => {
    if (err) {
      throw err;
    }
  }
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors(CORS_CONFIG));
app.use(require('./routes/index'));
app.use(compression());

app.listen(process.env.PORT, () => { });
