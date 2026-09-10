import { body, param, query } from 'express-validator';
import { validate } from './validate';
import { nameRule, emailRule, addressRule } from './rules';


const storeProfileFieldRules = [
  body('phone')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 20 })
    .withMessage('Phone number must be at most 20 characters.')
    .matches(/^[0-9+\-\s()]{7,20}$/)
    .withMessage('Enter a valid phone number.'),

  body('description')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be at most 1000 characters.'),

  body('businessHours')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 200 })
    .withMessage('Business hours must be at most 200 characters.'),

  body('logoUrl')
    .optional({ nullable: true })
    .trim()
    .isURL()
    .withMessage('Logo URL must be a valid URL.')
    .isLength({ max: 500 })
    .withMessage('Logo URL must be at most 500 characters.'),

  body('categories')
    .optional()
    .isArray({ max: 10 })
    .withMessage('Categories must be a list of at most 10 items.'),
  body('categories.*')
    .isString()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each category must be between 1 and 50 characters.'),

  body('services')
    .optional()
    .isArray({ max: 20 })
    .withMessage('Services must be a list of at most 20 items.'),
  body('services.*')
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Each service must be between 1 and 100 characters.'),
];

export const createStoreValidator = [
  nameRule,
  emailRule,
  addressRule,
  body('ownerId').isUUID().withMessage('A valid ownerId (store owner user id) is required.'),
  ...storeProfileFieldRules,
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

export const updateStoreValidator = [
  param('id').isUUID().withMessage('Invalid store id.'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 20, max: 60 })
    .withMessage('Name must be between 20 and 60 characters.'),
  body('email').optional().trim().isEmail().withMessage('A valid email address is required.').normalizeEmail(),
  body('address')
    .optional()
    .trim()
    .isLength({ min: 1, max: 400 })
    .withMessage('Address must be at most 400 characters.'),
  ...storeProfileFieldRules,
  validate,
];