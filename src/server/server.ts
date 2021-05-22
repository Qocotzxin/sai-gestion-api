/*!
 * SAI - Copyright 2019
 *  Cristian Etchebarne
 */
import * as dotenv from 'dotenv';
dotenv.config();
import compression from 'compression';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import { CORS_CONFIG } from './config/config';

const app = express();

mongoose.connect(
  process.env.DB_URL,
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

app.listen(process.env.PORT, () => { 
  console.log(`Listening server on port ${process.env.PORT}`);
});
