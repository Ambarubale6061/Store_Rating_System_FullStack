import { Router } from 'express';
import { Role } from '@prisma/client';
import * as userController from '../controllers/user.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { createUserValidator, listUsersValidator, userIdParamValidator } from '../validators/user.validator';

const router = Router();

// All user-management routes are admin-only.
router.use(authenticate, authorize(Role.ADMIN));

router.post('/', createUserValidator, userController.createUser);
router.get('/', listUsersValidator, userController.listUsers);
router.get('/:id', userIdParamValidator, userController.getUserById);

export default router;
