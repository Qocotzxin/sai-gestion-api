/*!
 * SAI - Copyright 2019
 *  Cristian Etchebarne
 */

import { NextFunction, Response, Request } from 'express';

/**
 * Habilita CORS
 */
export const enableCors = (req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
};
