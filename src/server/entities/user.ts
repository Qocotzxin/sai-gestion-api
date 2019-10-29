/*!
 * SAI - Copyright 2019
 *  Cristian Etchebarne
 */

import { USER_ROLE, USER_STATUS } from "./models";

const mongoose = require("mongoose");
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
    unique: true,
    required: [true, "Username is mandatory"]
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is mandatory"]
  },
  firstname: {
    type: String,
    required: [true, "First name is mandatory"]
  },
  lastname: {
    type: String,
    required: [true, "Last name is mandatory"]
  },
  password: {
    type: String,
    required: [true, "Password is mandatory"]
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
    default: "PENDING",
    enum: userStatus
  }
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
