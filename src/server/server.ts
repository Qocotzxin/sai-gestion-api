/*!
 * SAI - Copyright 2019
 *  Cristian Etchebarne
 */

import express from 'express';
import bodyParser from 'body-parser';

require('./config/config');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require('./routes/index'));

app.listen(process.env.PORT, () => {
  console.log('Listening port 3000');
});
