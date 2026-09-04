import { Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccess } from '../utils/ApiResponse';
import * as dashboardService from '../services/dashboard.service';
import { AuthRequest } from '../types/auth-request';

export const getAdminStats = catchAsync(async (_req: AuthRequest, res: Response) => {
  const stats = await dashboardService.getAdminDashboardStats();
  sendSuccess(res, 200, 'Dashboard stats fetched successfully.', stats);
});

export const getStoreOwnerStats = catchAsync(async (req: AuthRequest, res: Response) => {
  const stats = await dashboardService.getStoreOwnerDashboardStats(req.user!.id);
  sendSuccess(res, 200, 'Store owner dashboard fetched successfully.', stats);
});