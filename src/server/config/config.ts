/*!
 * SAI - Copyright 2019
 *  Cristian Etchebarne
 */

const localDB = 'mongodb://localhost:27017/coffe';
const productionDB = process.env.MONGO_URI;

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
