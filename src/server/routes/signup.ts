/*!
 * SAI - Copyright 2019
 *  Cristian Etchebarne
 */

import express, { Request, Response } from 'express';
import { Document, Model } from 'mongoose';
import { DEV_ORIGIN_BASEPATH, PROD_ORIGIN_BASEPATH } from '../config/config';
import { ERROR_TYPE, setErrorResponse } from '../config/error';
import { mailer, setSignupEmailBody, setSignupEmailSubject } from '../controllers';
import { UserModel, USER_ROLE } from '../entities/models';
const User: Model<Document> = require("../entities/user");
const bcrypt = require("bcrypt");

const app = express();

/**
 * Saves the user in database and sends a confirmation email.
 * @param req: Request 
 * @param res: Response
 */
function createUser(req: Request, res: Response) {
  const { email, firstname, lastname, username, password } = req.body.user;

  User.find({}, (error: Error, users: UserModel[]) => {
    if (error) return setErrorResponse(res, ERROR_TYPE.INTERNAL);

    const NewUser = new User({
      email,
      firstname,
      lastname,
      username,
      password: bcrypt.hashSync(password, 10),
      role: (users.length) ? USER_ROLE.EMPLOYEE : USER_ROLE.ADMIN
    });

    NewUser.save().then((user: UserModel & Document) => {
      if (!user) return setErrorResponse(res, ERROR_TYPE.INTERNAL);

      const emailOptions = {
        to: [email],
        from: 'no-reply@sai.com',
        subject: setSignupEmailSubject(req.body.language),
        html: setSignupEmailBody(`${process.env.NODE_ENV === 'dev' ? DEV_ORIGIN_BASEPATH : PROD_ORIGIN_BASEPATH}/profile/${user.id}`, req.body.language)
      };

      mailer.sendMail(emailOptions, (err, response) => {
        if (err) {
          User.find({ email }).remove().exec();
          return setErrorResponse(res, ERROR_TYPE.INTERNAL);
        }
        return res.status(201).json({ ok: true, data: null, message: 'User created.' });
      });
    });
  });
}

/**
 * Endpoint: /v1/signup
 * Creates a new user and sends an email to confirm.
 */
app.post('/v1/signup', (req: Request, res: Response) => {

  User.findOne({ $or: [{ username: req.body.user.username }, { email: req.body.user.email }] }, (error: Error, user: UserModel) => {
    if (error) return setErrorResponse(res, ERROR_TYPE.INTERNAL);

    if (user) return res.status(200).json({ ok: false, data: null, message: 'FORMS_ERRORS.USER_EXISTS' });

    return createUser(req, res);
  });

});

module.exports = app;
