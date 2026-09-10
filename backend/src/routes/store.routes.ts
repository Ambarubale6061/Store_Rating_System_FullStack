import { Router } from 'express';
import { Role } from '@prisma/client';
import * as storeController from '../controllers/store.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import {
  createStoreValidator,
  listStoresValidator,
  storeIdParamValidator,
  updateStoreValidator,
} from '../validators/store.validator';

const router = Router();

router.get('/', authenticate, listStoresValidator, storeController.listStores);
router.get('/:id', authenticate, storeIdParamValidator, storeController.getStoreById);
router.post('/', authenticate, authorize(Role.ADMIN), createStoreValidator, storeController.createStore);
router.patch('/:id', authenticate, authorize(Role.ADMIN), updateStoreValidator, storeController.updateStore);

export default router;