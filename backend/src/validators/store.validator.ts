import { param, query } from 'express-validator';
import { validate } from './validate';
import { nameRule, emailRule, addressRule } from './rules';
import { body } from 'express-validator';

export const createStoreValidator = [
  nameRule,
  emailRule,
  addressRule,
  body('ownerId').isUUID().withMessage('A valid ownerId (store owner user id) is required.'),
  validate,
];

export const listStoresValidator = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('sortBy').optional().isIn(['name', 'email', 'address', 'createdAt', 'averageRating']),
  query('sortOrder').optional().isIn(['asc', 'desc']),
  query('search').optional().trim(),
  validate,
];

export const storeIdParamValidator = [
  param('id').isUUID().withMessage('Invalid store id.'),
  validate,
];
