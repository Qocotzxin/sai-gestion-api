/*!
 * SAI - Copyright 2019
 *  Cristian Etchebarne
 */

import { CorsOptions } from 'cors';

/**
 * URL de IPInfo con token incluido
 */
export const IPINFO_URL = 'https://ipinfo.io';

/**
 * Token para IPInfo
 */
export const IPINFO_TOKEN = `?token=${process.env.IP_INFO_API_KEY}`;

/**
 * Data de Open Weather API
 */
export const OW_BASEPATH = 'https://api.openweathermap.org/data/2.5/weather?';
export const OW_PARAMS = `&appid=${process.env.OPEN_WEATHER_API_KEY}&lang=es&units=metric`;

/**
 * Configuracion para CORS
 */
export const CORS_CONFIG: CorsOptions = {
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'X-Access-Token',
  ],
  credentials: true,
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  origin: process.env.ORIGIN_BASEPATH,
  preflightContinue: false,
};
