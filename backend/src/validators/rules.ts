import { body } from 'express-validator';

/**
 * Shared field-level validation rules, reused across auth/user/store/rating
 * validators so the constraints (length, format) are defined exactly once.
 */

export const nameRule = body('name')
  .trim()
  .isLength({ min: 20, max: 60 })
  .withMessage('Name must be between 20 and 60 characters.');

export const emailRule = body('email')
  .trim()
  .isEmail()
  .withMessage('A valid email address is required.')
  .normalizeEmail();

export const addressRule = body('address')
  .trim()
  .isLength({ min: 1, max: 400 })
  .withMessage('Address is required and must be at most 400 characters.');

// 8-16 chars, at least one uppercase letter, at least one special character.
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\/;'])[\s\S]{8,16}$/;

export function passwordRule(field = 'password') {
  return body(field)
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be between 8 and 16 characters.')
    .matches(PASSWORD_REGEX)
    .withMessage('Password must include at least one uppercase letter and one special character.');
}

export const ratingValueRule = body('rating')
  .isInt({ min: 1, max: 5 })
  .withMessage('Rating must be an integer between 1 and 5.')
  .toInt();
