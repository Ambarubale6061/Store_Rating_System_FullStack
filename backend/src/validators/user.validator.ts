import { body, param, query } from 'express-validator';
import { Role } from '@prisma/client';
import { validate } from './validate';
import { nameRule, emailRule, addressRule, passwordRule } from './rules';

export const createUserValidator = [
  nameRule,
  emailRule,
  addressRule,
  passwordRule('password'),
  body('role')
    .optional()
    .isIn(Object.values(Role))
    .withMessage(`Role must be one of: ${Object.values(Role).join(', ')}.`),
  validate,
];

export const listUsersValidator = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('sortBy').optional().isIn(['name', 'email', 'role', 'createdAt']),
  query('sortOrder').optional().isIn(['asc', 'desc']),
  query('search').optional().trim(),
  query('role').optional().isIn(Object.values(Role)),
  validate,
];

export const userIdParamValidator = [
  param('id').isUUID().withMessage('Invalid user id.'),
  validate,
];
