/*!
 * SAI - Copyright 2019
 *  Cristian Etchebarne
 */

import { Schema, model } from 'mongoose';
import { emailValidatorFn } from '../utils/functions/custom-validators';
import { USER_ROLE, USER_STATUS } from './models';
const userRoles = {
  values: ['ADMIN', 'EMPLOYEE'],
  message: '{VALUE} it not a valid role.',
};

const userStatus = {
  values: ['PENDING', 'APPROVED', 'INACTIVE'],
  message: '{VALUE} it not a valid status.',
};

/**
 * User schema
 */
const userSchema = new Schema(
  {
    username: {
      index: true,
      type: String,
      unique: [true, 'Username already exists.'],
      required: false,
      minlength: 3,
      maxlength: 50,
      sparse: true,
    },
    email: {
      type: String,
      unique: [true, 'Email already exists'],
      required: [true, 'Email is mandatory.'],
      validate: emailValidatorFn,
    },
    firstName: {
      type: String,
      required: [true, 'First name is mandatory.'],
      minlength: 3,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is mandatory.'],
      minlength: 3,
      maxlength: 50,
    },
    password: {
      type: String,
      required: [true, 'Password is mandatory.'],
    },
    image: {
      type: String,
    },
    role: {
      type: USER_ROLE,
      enum: userRoles,
    },
    status: {
      type: USER_STATUS,
      default: USER_STATUS.PENDING,
      enum: userStatus,
    },
    preferences: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

module.exports = model('User', userSchema);
