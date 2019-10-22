/*!
 * SAI - Copyright 2019
 *  Cristian Etchebarne
 */

import express from 'express';

const app = express();

app.use(require('./weather'));
app.use(require('./login'));
app.use(require('./verification'));
app.use(require('./signup'));

module.exports = app;
