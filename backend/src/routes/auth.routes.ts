import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { authenticate } from '../middlewares/authenticate';
import {
  signupValidator,
  loginValidator,
  changePasswordValidator,
  refreshTokenValidator,
} from '../validators/auth.validator';

const router = Router();

router.post('/signup', signupValidator, authController.signup);
router.post('/login', loginValidator, authController.login);
router.post('/refresh', refreshTokenValidator, authController.refresh);
router.post('/logout', authenticate, authController.logout);
router.post('/change-password', authenticate, changePasswordValidator, authController.changePassword);
router.get('/me', authenticate, authController.getMe);

export default router;
