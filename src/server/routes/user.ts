/*!
 * SAI - Copyright 2019
 *  Cristian Etchebarne
 */

import {
  userExists,
  userLogin,
  userSignup,
  userStatus,
  sendActivationEmail,
} from '@/controllers/userControllers';
import express from 'express';

const app = express();

app.post('/v1/user/signup', userSignup);
app.post('/v1/user/login', userLogin);
app.post('/v1/user/activation-email', sendActivationEmail);
app.get('/v1/user/verify', userExists);
app.get('/v1/user/status', userStatus);

module.exports = app;
