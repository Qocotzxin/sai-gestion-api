/*!
 * SAI - Copyright 2019
 *  Cristian Etchebarne
 */

import express, { Request, Response } from 'express';
import mongoose, { Document, Model } from 'mongoose';
import { ERROR_TYPE, setErrorResponse } from '../../config/error';
import { mailer, setSignupEmailBody, setSignupEmailSubject } from '../../controllers';
import { UserModel, USER_ROLE } from '../../entities/models';
import { passwordValidatorFn } from '../../utils/functions/custom-validators';
const User: Model<Document> = require("../../entities/user");
const bcrypt = require("bcrypt");

const app = express();

/**
 * Saves the user in database and sends a confirmation email.
 * @param req: Request 
 * @param res: Response
 */
function createUser(req: Request, res: Response) {
  const { email, firstname, lastname, username, password, preferences } = req.body.user;

  User.find({}, (e: Error, users: Document[]) => {
    if (e) {
      return setErrorResponse(res, ERROR_TYPE.INTERNAL);
    }

    // Password validation is not through mongoose.
    if (!passwordValidatorFn(password)) {
      return setErrorResponse(res, ERROR_TYPE.BAD_REQUEST, "Password does not comply with required criteria.");
    }

    const NewUser = new User({
      email,
      firstname,
      lastname,
      username,
      password: bcrypt.hashSync(password, 10),
      role: (users.length) ? USER_ROLE.EMPLOYEE : USER_ROLE.ADMIN,
      preferences
    });

    NewUser.save({}, (saveError: mongoose.Error.ValidationError, savedUser: Document & UserModel) => {
      if (saveError) return setErrorResponse(res, ERROR_TYPE.BAD_REQUEST, saveError.message);
      if (!savedUser) return setErrorResponse(res, ERROR_TYPE.INTERNAL);

      const emailOptions = {
        to: [email],
        from: 'no-reply@sai.com',
        subject: setSignupEmailSubject(savedUser.preferences.lang),
        html: setSignupEmailBody(`${process.env.ORIGIN_BASEPATH}/profile/${savedUser.id}`, savedUser.preferences.lang)
      };

      mailer.sendMail(emailOptions, (err, response) => {
        if (err) {
          User.findOneAndDelete({ email }, (error: Error, doc: Document) => {
            return setErrorResponse(res, ERROR_TYPE.INTERNAL, 'User could not created due to email failure.');
          });
        } else {
          return res.status(201).json({ ok: true, data: null, message: 'User created.' });
        }
      });
    });
  });
}

/**
 * Endpoint: /v1/user/signup
 * Creates a new user and sends an email to confirm.
 */
app.post('/v1/user/signup', (req: Request, res: Response) => {

  if (req.body.user) {

    User.findOne({ $or: [{ email: req.body.user.email }, { username: req.body.user.username }] }, (error: Error, user: UserModel) => {
      if (error) return setErrorResponse(res, ERROR_TYPE.INTERNAL);

      if (user) return setErrorResponse(res, ERROR_TYPE.USER_EXISTS, 'N/A', 'warning');

      return createUser(req, res);
    });

  } else {
    return setErrorResponse(res, ERROR_TYPE.BAD_REQUEST, 'User does not exist in body object.');
  }
});

module.exports = app; 
