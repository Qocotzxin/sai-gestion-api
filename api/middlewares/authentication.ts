/*!
 * SAI - Copyright 2019
 *  Cristian Etchebarne
 */

import { NextFunction, Request, Response } from 'express';
import jsonwebtoken, { DecodeOptions, JsonWebTokenError } from 'jsonwebtoken';
import { ERROR_TYPE, setErrorResponse } from '../config/error';

/**
 * Verifies token
 */
const tokenVerify = (req: Request, res: Response, next: NextFunction) => {
  const token = req.get('Authorization'); //Header name to retrieve

  jsonwebtoken.verify(
    token,
    process.env.TOKEN_SEED,
    (err: JsonWebTokenError, decoded: DecodeOptions) => {
      if (err)
        return setErrorResponse(res, ERROR_TYPE.FORBIDDEN);
      next();
    }
  );
};

module.exports = {
  tokenVerify,
};
