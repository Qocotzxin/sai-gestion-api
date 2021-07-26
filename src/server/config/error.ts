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
   * Error code: 400
   */
  BAD_REQUEST = 'BAD_REQUEST',
  /**
   * Error code: 401
   */
  UNAUTHORIZED = 'UNAUTHORIZED',
  /**
   * Error code: 401 (User not found, email can't be sent).
   */
  ACTIVATION_EMAIL_FAILED = 'ACTIVATION_EMAIL_FAILED',
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
   * Error code: 502
   */
  BAD_GATEWAY = 'BAD_GATEWAY',
  /**
   * Error code: 503
   */
  CONNECTION = 'CONNECTION',
  /**
   * Error code: 0
   */
  UNKNOWN = 'UNKNOWN',
  /**
   * Error code: 400 (User exists case)
   */
  USER_EXISTS = 'USER_EXISTS',
}

/**
 * Error object that contains every possible error
 * sent by the api, including code and message
 * prepared for translation on front end.
 */
export const ERROR = {
  BAD_REQUEST: {
    CODE: 400,
    MESSAGE: 'HTTP_ERRORS.BAD_REQUEST',
  },
  UNAUTHORIZED: {
    CODE: 401,
    MESSAGE: 'HTTP_ERRORS.UNAUTHORIZED',
  },
  FORBIDDEN: {
    CODE: 403,
    MESSAGE: 'HTTP_ERRORS.FORBIDDEN',
  },
  NOT_FOUND: {
    CODE: 404,
    MESSAGE: 'HTTP_ERRORS.NOT_FOUND',
  },
  INTERNAL: {
    CODE: 500,
    MESSAGE: 'HTTP_ERRORS.INTERNAL',
  },
  BAD_GATEWAY: {
    CODE: 502,
    MESSAGE: 'HTTP_ERRORS.BAD_GATEWAY',
  },
  CONNECTION: {
    CODE: 503,
    MESSAGE: 'HTTP_ERRORS.CONNECTION',
  },
  UNKNOWN: {
    CODE: 0,
    MESSAGE: 'HTTP_ERRORS.UNKNOWN',
  },
  USER_EXISTS: {
    CODE: 400,
    MESSAGE: 'FORM_ERROR.USER_EXISTS',
  },
  ACTIVATION_EMAIL_FAILED: {
    CODE: 401,
    MESSAGE: 'DATA_ERROR.ACTIVATION_EMAIL_FAILED',
  },
};

/**
 * Returns a unified error response.
 * @param res: Response
 * @param type: ERROR_TYPE
 */
export function setErrorResponse(
  res: Response,
  type: ERROR_TYPE,
  description?: string,
  notificationType?: string
): Response {
  return res.status(ERROR[type].CODE).json({
    ok: false,
    message: ERROR[type].MESSAGE,
    description: description || 'N/A',
    type: notificationType,
  });
}
