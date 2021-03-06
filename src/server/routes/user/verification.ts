/*!
 * SAI - Copyright 2019
 *  Cristian Etchebarne
 */

import express, { Request, Response } from 'express';
import { ERROR_TYPE, setErrorResponse } from '../../config/error';
import { UserModel } from '../../entities/models';
const User = require("../../entities/user");

const app = express();

/**
 * Endpoint: /v1/verify/:field
 * Verifies if email/username exists.
 */
app.get('/v1/user/verify', (req: Request, res: Response) => {
  const email = req.query.email;
  const username = req.query.username;

  User.findOne(email ? { email } : { username }, (error: Error, user: UserModel) => {
    if (error) return setErrorResponse(res, ERROR_TYPE.INTERNAL);

    if (user) return res.status(200).json({ ok: true, data: { exists: true }, message: 'A user already exists associated with this information.' });

    return res.status(200).json({ ok: true, data: { exists: false }, message: 'No user associated with this information.' });
  });

});

/**
 * Endpoint: /v1/user/status/:ID
 * Verifies if email/username exists.
 */
app.get('/v1/user/status', (req: Request, res: Response) => {
  const ID = req.query.ID;

  User.findById(ID, (error: Error, user: UserModel) => {
    if (error) return setErrorResponse(res, ERROR_TYPE.INTERNAL);

    if (user) return res.status(200).json({ ok: true, data: { status: user.status } });

    return res.status(200).json({ ok: true, data: { status: false } });
  });

});

module.exports = app;
