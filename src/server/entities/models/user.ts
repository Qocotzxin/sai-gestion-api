/*!
 * SAI - Copyright 2019
 *  Cristian Etchebarne
 */

export enum USER_ROLE {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE'
}

export enum USER_STATUS {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  INACTIVE = 'INACTIVE'
}

export interface UserModel {
  id: string;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  role: USER_ROLE;
  status: USER_STATUS;
}