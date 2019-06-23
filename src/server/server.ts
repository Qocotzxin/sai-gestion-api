/*!
 * SAI - Copyright 2019
 *  Cristian Etchebarne
 */

import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { corsConfig } from './config/config';

require('./config/config');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors(corsConfig));
app.use(require('./routes/index'));

app.listen(process.env.PORT, () => {
  console.log('Listening port 3000');
});
