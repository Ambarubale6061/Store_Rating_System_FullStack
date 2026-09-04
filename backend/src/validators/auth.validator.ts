import { body } from 'express-validator';
import { validate } from './validate';
import { nameRule, emailRule, addressRule, passwordRule } from './rules';

export const signupValidator = [
  nameRule,
  emailRule,
  addressRule,
  passwordRule('password'),
  validate,
];

export const loginValidator = [
  emailRule,
  body('password').notEmpty().withMessage('Password is required.'),
  validate,
];

export const changePasswordValidator = [
  body('oldPassword').notEmpty().withMessage('Current password is required.'),
  passwordRule('newPassword'),
  validate,
];

export const refreshTokenValidator = [
  body('refreshToken').notEmpty().withMessage('Refresh token is required.'),
  validate,
];
