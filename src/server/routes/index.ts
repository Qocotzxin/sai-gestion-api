/*!
 * SAI - Copyright 2019
 *  Cristian Etchebarne
 */

import express from 'express';

const app = express();

app.use(require('./weather'));
app.use(require('./user/login'));
app.use(require('./user/verification'));
app.use(require('./user/signup'));

module.exports = app;
