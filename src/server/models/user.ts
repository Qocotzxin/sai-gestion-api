/*!
 * SAI - Copyright 2019
 *  Cristian Etchebarne
 */

const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const userRoles = {
  values: ['ADMIN', 'USER'],
  message: '{VALUE} it not a valid role'
}

export interface User {
  username: string;
  email: string;
  password: string;
}

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
  password: {
    type: String,
    required: [true, "Password is mandatory"]
  },
});

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
