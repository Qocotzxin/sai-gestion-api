/*!
 * SAI - Copyright 2019
 *  Cristian Etchebarne
 */

import express, { Request, Response } from 'express';
import jwt from "jsonwebtoken";
import { ERROR_TYPE, setErrorResponse } from '../config/error';
import { UserModel } from '../entities/models';
const User = require("../entities/user");
const bcrypt = require("bcrypt");
const app = express();

const createToken = (user: UserModel) => {
  return jwt.sign({ user }, process.env.TOKEN_SEED, {
    expiresIn: process.env.TOKEN_EXPIRATION
  });
};

/**
 * Endpoint: /v1/login
 * Login endpoint that returns a jwt in case user is authorized.
 */
app.post('/v1/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  User.findOne({ username, password }, (error: Error, user: UserModel) => {
    if (error) return setErrorResponse(res, ERROR_TYPE.INTERNAL);

    if (!user) return setErrorResponse(res, ERROR_TYPE.UNAUTHORIZED);

    if (!bcrypt.compareSync(password, user.password)) {
      return setErrorResponse(res, ERROR_TYPE.FORBIDDEN);
    }

    const token = createToken(user);

    return res.status(200).json({ ok: true, data: { username, email: user.email, token }, message: 'User authorized' });
  });

});

module.exports = app;
