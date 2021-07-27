/*!
 * SAI - Copyright 2019
 *  Cristian Etchebarne
 */

import { weatherData } from '@/controllers/weatherController';
import express from 'express';
const app = express();

app.post('/v1/weather/current', weatherData);

module.exports = app;
