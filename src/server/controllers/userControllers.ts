import { ERROR_TYPE, setErrorResponse } from '@/config/error';
import { UserModel, USER_ROLE, USER_STATUS } from 'src/server/schemas/models';
import { passwordValidatorFn } from '@/utils/functions/custom-validators';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import mongoose, { Document, Model } from 'mongoose';
import {
  mailer,
  setSignupEmailBody,
  setSignupEmailSubject,
} from './mailControllers';

const User: Model<Document> = require('@/schemas/user');

/**
 * Creates an authentication token.
 */
function createToken(user: UserModel) {
  return jwt.sign({ user }, process.env.TOKEN_SEED, {
    expiresIn: process.env.TOKEN_EXPIRATION,
  });
}

/**
 * Performs login process. It uses hashed password and creates
 * a token if the user and password are correct.
 */
export function userLogin(req: Request, res: Response) {
  const { username, password } = req.body;

  User.findOne(
    {
      $or: [{ username }, { email: username }],
      $and: [{ status: USER_STATUS.ACTIVE }],
    },
    (error: Error, user: UserModel) => {
      if (error) return setErrorResponse(res, ERROR_TYPE.INTERNAL);

      if (!user || !bcrypt.compareSync(password, user.password))
        return setErrorResponse(res, ERROR_TYPE.UNAUTHORIZED);

      const token = createToken(user);

      return res.status(200).json({
        ok: true,
        data: {
          username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          preferences: user.preferences,
          role: user.role,
          token,
        },
        message: 'User authorized',
      });
    }
  );
}

/**
 * Saves the user in database and sends a confirmation email.
 */
function createUser(req: Request, res: Response) {
  const { email, firstName, lastName, password, preferences } = req.body.user;

  // Password validation is not through mongoose.
  if (!passwordValidatorFn(password)) {
    return setErrorResponse(
      res,
      ERROR_TYPE.BAD_REQUEST,
      'Password does not comply with required criteria. At least 1 uppercase, 1 number & 1 lowercase are required.'
    );
  }

  const NewUser = new User({
    email,
    firstName,
    lastName,
    password: bcrypt.hashSync(password, 10),
    // TODO: Review this condition once approval & payment process are defined.
    role: USER_ROLE.ADMIN,
    preferences,
  });

  NewUser.save(
    {},
    (
      saveError: mongoose.Error.ValidationError,
      savedUser: Document & UserModel
    ) => {
      if (saveError)
        return setErrorResponse(res, ERROR_TYPE.BAD_REQUEST, saveError.message);
      if (!savedUser) return setErrorResponse(res, ERROR_TYPE.INTERNAL);

      mailer.sendMail(getActivationEmailOptions(savedUser), (err, response) => {
        if (err) {
          User.findOneAndDelete(
            { email },
            {},
            (error: Error, doc: Document) => {
              return setErrorResponse(
                res,
                ERROR_TYPE.BAD_GATEWAY,
                error.toString()
              );
            }
          );
        } else {
          return res
            .status(201)
            .json({ ok: true, data: null, message: 'User created.' });
        }
      });
    }
  );
}

/**
 * Process the sign up request from a user.
 */
export function userSignup(req: Request, res: Response) {
  if (req.body.user) {
    User.findOne(
      {
        email: req.body.user.email,
      },
      (error: Error, user: UserModel) => {
        if (error)
          return setErrorResponse(res, ERROR_TYPE.INTERNAL, error.message);

        if (user)
          return setErrorResponse(
            res,
            ERROR_TYPE.USER_EXISTS,
            'N/A',
            'warning'
          );

        return createUser(req, res);
      }
    );
  } else {
    return setErrorResponse(
      res,
      ERROR_TYPE.BAD_REQUEST,
      'User does not exist in body object.'
    );
  }
}

/**
 * Retrieves user status.
 */
export function userStatus(req: Request, res: Response) {
  const ID = req.query.ID;

  User.findById(ID, (error: Error, user: UserModel) => {
    if (error) return setErrorResponse(res, ERROR_TYPE.INTERNAL, error.message);

    return res.status(200).json({
      ok: true,
      data: { status: user ? user.status : false },
      message: 'User status retrieved.',
    });
  });
}

/**
 * Verifies if email/username exists.
 */
export function userExists(req: Request, res: Response) {
  const email = req.query.email;
  const username = req.query.username;

  User.findOne(
    email ? { email } : { username },
    (error: Error, user: UserModel) => {
      if (error)
        return setErrorResponse(res, ERROR_TYPE.INTERNAL, error.message);

      if (user)
        return res.status(200).json({
          ok: true,
          data: { exists: true },
          message: 'It already exists a user associated with this information.',
        });

      return res.status(200).json({
        ok: true,
        data: { exists: false },
        message: 'No user associated with this information.',
      });
    }
  );
}

/**
 * Sends the activation email to the specified user email.
 */
export function sendActivationEmail(req: Request, res: Response) {
  const email = req.body.email;

  User.findOne(
    {
      email,
      status: USER_STATUS.PENDING,
    },
    (error: Error, user: UserModel) => {
      if (error || !user) {
        return setErrorResponse(
          res,
          ERROR_TYPE.ACTIVATION_EMAIL_FAILED,
          error ? error.message : 'No user associated to this email address.'
        );
      }

      mailer.sendMail(getActivationEmailOptions(user), (err, response) => {
        if (err) {
          return setErrorResponse(
            res,
            ERROR_TYPE.BAD_GATEWAY,
            error.message || error.toString()
          );
        }

        return res.status(200).json({
          ok: true,
          data: { sent: true },
          message: 'Activation email has been successfully sent.',
        });
      });
    }
  );
}

/**
 * Retrieves the options needed to send an activation email.
 */
function getActivationEmailOptions(user: UserModel) {
  const lang = user.preferences ? user.preferences.lang : 'es';
  return {
    to: [user.email],
    from: 'cristianmetchebarne@gmail.com',
    subject: setSignupEmailSubject(lang),
    html: setSignupEmailBody(
      `${process.env.ORIGIN_BASEPATH}/profile/${user.id}`,
      lang
    ),
  };
}
