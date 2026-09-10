import { Response } from 'express';
import { AuthRequest } from '../types/auth-request';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccess } from '../utils/ApiResponse';
import { parsePagination, buildMeta } from '../utils/pagination';
import * as storeService from '../services/store.service';

export const createStore = catchAsync(async (req: AuthRequest, res: Response) => {
  const store = await storeService.createStore(req.body);
  sendSuccess(res, 201, 'Store created successfully.', store);
});

export const listStores = catchAsync(async (req: AuthRequest, res: Response) => {
  const pagination = parsePagination(
    req.query,
    ['name', 'email', 'address', 'createdAt', 'averageRating'],
    'createdAt'
  );
  const search = typeof req.query.search === 'string' ? req.query.search : undefined;

  const currentUserId = req.user?.role === 'USER' ? req.user.id : undefined;

  const { stores, total } = await storeService.listStores({ ...pagination, search, currentUserId });
  sendSuccess(res, 200, 'Stores fetched successfully.', stores, buildMeta(pagination.page, pagination.limit, total));
});

export const getStoreById = catchAsync(async (req: AuthRequest, res: Response) => {
  const store = await storeService.getStoreById(req.params.id);
  sendSuccess(res, 200, 'Store fetched successfully.', store);
});

export const updateStore = catchAsync(async (req: AuthRequest, res: Response) => {
  const store = await storeService.updateStore(req.params.id, req.body);
  sendSuccess(res, 200, 'Store updated successfully.', store);
});