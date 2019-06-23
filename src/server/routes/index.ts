/*!
 * SAI - Copyright 2019
 *  Cristian Etchebarne
 */

import express from 'express';

const app = express();

app.use(require('./weather'));

module.exports = app;
