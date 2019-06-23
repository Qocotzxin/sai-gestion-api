/*!
 * SAI - Copyright 2019
 *  Cristian Etchebarne
 */

import { CorsOptions } from 'cors';

const localDB = 'mongodb://localhost:27017/coffe';
const productionDB = process.env.MONGO_URI;

export const corsConfig: CorsOptions = {
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'X-Access-Token',
  ],
  credentials: true,
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  origin: 'https://sai-gestion-app.herokuapp.com/',
  preflightContinue: false,
};

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
process.env.URL_DB = process.env.NODE_ENV === 'dev' ? localDB : productionDB;

/**
 * Expiracion del token
 */
process.env.TOKEN_EXPIRATION = '30 days';

/**
 * Seed del token
 */
process.env.TOKEN_SEED = process.env.TOKEN_SEED || 'pchowypbldepymipkmzzyjsc';
