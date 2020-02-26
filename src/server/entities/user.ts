/*!
 * SAI - Copyright 2019
 *  Cristian Etchebarne
 */

import * as mongoose from "mongoose";
import { emailValidatorFn } from "../utils/functions/custom-validators";
import { USER_ROLE, USER_STATUS } from "./models";
const uniqueValidator = require("mongoose-unique-validator");
const userRoles = {
  values: ['ADMIN', 'EMPLOYEE'],
  message: '{VALUE} it not a valid role.'
};

const userStatus = {
  values: ['PENDING', 'APPROVED', 'INACTIVE'],
  message: '{VALUE} it not a valid status.'
};

const Schema = mongoose.Schema;

/**
 * User schema
 */
const userSchema = new Schema({
  username: {
    type: String,
    unique: [true, "Username already exists."],
    required: false,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    unique: [true, "Email already exists"],
    required: [true, "Email is mandatory."],
    validate: emailValidatorFn
  },
  firstname: {
    type: String,
    required: [true, "First name is mandatory."],
    minlength: 3,
    maxlength: 50
  },
  lastname: {
    type: String,
    required: [true, "Last name is mandatory."],
    minlength: 3,
    maxlength: 50
  },
  password: {
    type: String,
    required: [true, "Password is mandatory."],
  },
  image: {
    type: String,
    required: false
  },
  role: {
    type: USER_ROLE,
    enum: userRoles
  },
  status: {
    type: USER_STATUS,
    default: USER_STATUS.PENDING,
    enum: userStatus
  },
  preferences: Schema.Types.Mixed
}, { timestamps: true });

/**
 * Avoids returning password in responses
 */
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
}

/**
 * Sets plugin to validate unique fields
 */
userSchema.plugin(uniqueValidator, { message: '{PATH} must be unique.' });

module.exports = mongoose.model("User", userSchema);
