/*!
 * SAI - Copyright 2019
 *  Cristian Etchebarne
 */

import { Response } from 'express';

/**
 * Error types as string to provide
 * an easy way to map it.
 */
export enum ERROR_TYPE {
  /**
   * Error code: 401
   */
  UNAUTHORIZED = 'UNAUTHORIZED',
  /**
   * Error code: 403
   */
  FORBIDDEN = 'FORBIDDEN',
  /**
   * Error code: 404
   */
  NOT_FOUND = 'NOT_FOUND',
  /**
   * Error code: 500
   */
  INTERNAL = 'INTERNAL',
  /**
   * Error code: 503
   */
  CONNECTION = 'CONNECTION',
  /**
   * Error code: 0
   */
  UNKNOWN = 'UNKNOWN',
}

/**
 * Error object that contains every possible error
 * sent by the api, including code and message
 * prepared for translation on front end.
 */
export const ERROR = {
  UNAUTHORIZED: {
    CODE: 401,
    MESSAGE: 'ERRORS.UNAUTHORIZED'
  },
  FORBIDDEN: {
    CODE: 403,
    MESSAGE: 'ERRORS.FORBIDDEN'
  },
  NOT_FOUND: {
    CODE: 404,
    MESSAGE: 'ERRORS.NOT_FOUND'
  },
  INTERNAL: {
    CODE: 500,
    MESSAGE: 'ERRORS.INTERNAL'
  },
  CONNECTION: {
    CODE: 503,
    MESSAGE: 'ERRORS.CONNECTION'
  },
  UNKNOWN: {
    CODE: 0,
    MESSAGE: 'ERRORS.UNKNOWN'
  }
};

/**
 * Returns a unified error response.
 * @param res: Response 
 * @param type: ERROR_TYPE
 */
export function setErrorResponse(res: Response, type: ERROR_TYPE): Response {
  return res.status(ERROR[type].CODE).json({ ok: false, message: ERROR[type].MESSAGE });
}