import { Router } from 'express';
import { Role } from '@prisma/client';
import * as storeController from '../controllers/store.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { createStoreValidator, listStoresValidator, storeIdParamValidator } from '../validators/store.validator';

const router = Router();

// Any authenticated role can browse stores (Admin, User, Store Owner all
// have some form of store visibility per the spec); only Admin can create.
router.get('/', authenticate, listStoresValidator, storeController.listStores);
router.get('/:id', authenticate, storeIdParamValidator, storeController.getStoreById);
router.post('/', authenticate, authorize(Role.ADMIN), createStoreValidator, storeController.createStore);

export default router;
