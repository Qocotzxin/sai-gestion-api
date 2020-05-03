/*!
 * SAI - Copyright 2019
 *  Cristian Etchebarne
 */

import express, { Request, Response } from 'express';
import jwt from "jsonwebtoken";
import { ERROR_TYPE, setErrorResponse } from '../../config/error';
import { UserModel, USER_STATUS } from '../../entities/models';
const User = require("../../entities/user");
const bcrypt = require("bcrypt");
const app = express();

const createToken = (user: UserModel) => {
  return jwt.sign({ user }, process.env.TOKEN_SEED, {
    expiresIn: process.env.TOKEN_EXPIRATION
  });
};

/**
 * Endpoint: /v1/user/login
 * Login endpoint that returns a jwt in case user is authorized.
 */
app.post('/v1/user/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  User.findOne({ $or: [{ username }, { email: username }], $and: [{ status: USER_STATUS.ACTIVE }] },
    (error: Error, user: UserModel) => {
      if (error) return setErrorResponse(res, ERROR_TYPE.INTERNAL);

      if (!user || !bcrypt.compareSync(password, user.password)) return setErrorResponse(res, ERROR_TYPE.UNAUTHORIZED);

      const token = createToken(user);

      return res.status(200).json({
        ok: true, data:
        {
          username,
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          preferences: user.preferences,
          role: user.role,
          token
        }, message: 'User authorized'
      });
    });

});

module.exports = app;
