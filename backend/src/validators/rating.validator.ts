import { body, param } from 'express-validator';
import { validate } from './validate';
import { ratingValueRule } from './rules';

export const submitRatingValidator = [
  body('storeId').isUUID().withMessage('A valid storeId is required.'),
  ratingValueRule,
  validate,
];

export const storeIdParamValidator = [
  param('storeId').isUUID().withMessage('Invalid store id.'),
  validate,
];
