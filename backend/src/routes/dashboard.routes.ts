import { Router } from 'express';
import { Role } from '@prisma/client';
import * as dashboardController from '../controllers/dashboard.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';

const router = Router();

router.use(authenticate);

router.get('/admin', authorize(Role.ADMIN), dashboardController.getAdminStats);
router.get('/store-owner', authorize(Role.STORE_OWNER), dashboardController.getStoreOwnerStats);

export default router;
