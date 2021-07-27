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
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export interface UserPreferences {
  lang: string;
  tz: string;
  darkTheme: boolean;
}

export interface UserModel {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: USER_ROLE;
  status: USER_STATUS;
  preferences: UserPreferences;
}