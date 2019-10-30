/*!
 * SAI - Copyright 2019
 *  Cristian Etchebarne
 */

import { CorsOptions } from 'cors';
// import { KEYS } from './keys';

/**
 * URL de la DB de desarrollo
 */
const DEV_DB = 'mongodb://localhost:27017/sai-gestion-api';

/**
 * URL de la DB de produccion
 */
const PROD_DB = process.env.MONGO_URI;

/**
 * URL de origen para setear en CORS (desarrollo)
 */
export const DEV_ORIGIN_BASEPATH = 'http://localhost:4200';

/**
 * URL de origen para setear en CORS (produccion)
 */
export const PROD_ORIGIN_BASEPATH = 'https://sai-gestion-app.herokuapp.com';

/**
 * Puerto
 */
process.env.PORT = process.env.PORT || '3000';

/**
 * Entorno
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/**
 * URL de la base de datos
 */
process.env.URL_DB = process.env.NODE_ENV === 'dev' ? DEV_DB : PROD_DB;

/**
 * Expiracion del token
 */
process.env.TOKEN_EXPIRATION = '1 hour';

/**
 * Seed del token
 */
process.env.TOKEN_SEED = process.env.TOKEN_SEED;

/**
 * URL de IPInfo con token incluido
 */
export const IPINFO_URL = 'https://ipinfo.io';

/**
 * Token para IPInfo
 */
export const IPINFO_TOKEN = `?token=${process.env.IP_INFO_API_KEY}`;

/**
 * Sendgrid API KEY.
 */
export const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

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
  origin: process.env.NODE_ENV === 'dev' ? DEV_ORIGIN_BASEPATH : PROD_ORIGIN_BASEPATH,
  preflightContinue: false,
};
