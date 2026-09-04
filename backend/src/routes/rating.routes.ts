import { Router } from 'express';
import { Role } from '@prisma/client';
import * as ratingController from '../controllers/rating.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { submitRatingValidator, storeIdParamValidator } from '../validators/rating.validator';

const router = Router();

router.use(authenticate);

router.post('/', authorize(Role.USER), submitRatingValidator, ratingController.submitRating);
router.get(
  '/store/:storeId',
  authorize(Role.STORE_OWNER, Role.ADMIN),
  storeIdParamValidator,
  ratingController.listRatersForStore
);

export default router;
