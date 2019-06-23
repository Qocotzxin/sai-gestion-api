/*!
 * SAI - Copyright 2019
 *  Cristian Etchebarne
 */

import jsonwebtoken, { JsonWebTokenError, DecodeOptions } from 'jsonwebtoken';
import { NextFunction, Response, Request } from 'express';

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
        return res.status(401).json({ err: { message: 'Invalid token' } });
      next();
    }
  );
};

module.exports = {
  tokenVerify,
};
