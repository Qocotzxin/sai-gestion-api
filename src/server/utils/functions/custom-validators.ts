/*!
 * SAI - Copyright 2019
 *  Cristian Etchebarne
 */

/**
 * Validates password regex (1 uppercase, 1 number, 1 lowercase).
 * @param value: string 
 */
export function passwordValidatorFn(value: string): boolean {
  return /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*/.test(value);
};

/**
 * Validates email regex.
 * @param value: string 
 */
export function emailValidatorFn(value: string): boolean {
  return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value);
}