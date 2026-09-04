import { Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccess } from '../utils/ApiResponse';
import { parsePagination, buildMeta } from '../utils/pagination';
import * as ratingService from '../services/rating.service';
import { AuthRequest } from '../types/auth-request';

export const submitRating = catchAsync(async (req: AuthRequest, res: Response) => {
  const { storeId, rating } = req.body;
  const result = await ratingService.submitOrUpdateRating(req.user!.id, storeId, rating);
  sendSuccess(res, 200, 'Rating submitted successfully.', result);
});

export const listRatersForStore = catchAsync(async (req: AuthRequest, res: Response) => {
  const { storeId } = req.params;

  // Store owners may only view raters for their own store; admins may view any.
  if (req.user!.role === 'STORE_OWNER') {
    await ratingService.assertUserOwnsStore(req.user!.id, storeId);
  }

  const pagination = parsePagination(req.query, ['createdAt'], 'createdAt');
  const { raters, total } = await ratingService.listRatersForStore(storeId, pagination);
  sendSuccess(res, 200, 'Raters fetched successfully.', raters, buildMeta(pagination.page, pagination.limit, total));
});