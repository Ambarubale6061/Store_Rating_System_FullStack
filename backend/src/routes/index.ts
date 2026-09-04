import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import storeRoutes from './store.routes';
import ratingRoutes from './rating.routes';
import dashboardRoutes from './dashboard.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/stores', storeRoutes);
router.use('/ratings', ratingRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
