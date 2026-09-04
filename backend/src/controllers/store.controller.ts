import { Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccess } from '../utils/ApiResponse';
import { parsePagination, buildMeta } from '../utils/pagination';
import * as storeService from '../services/store.service';
import { AuthRequest } from '../types/auth-request';

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

  // Attach "myRating" only for authenticated USER-role callers browsing
  // the store list; admins listing stores don't need it.
  const currentUserId = req.user?.role === 'USER' ? req.user.id : undefined;

  const { stores, total } = await storeService.listStores({ ...pagination, search, currentUserId });
  sendSuccess(res, 200, 'Stores fetched successfully.', stores, buildMeta(pagination.page, pagination.limit, total));
});

export const getStoreById = catchAsync(async (req: AuthRequest, res: Response) => {
  const store = await storeService.getStoreById(req.params.id);
  sendSuccess(res, 200, 'Store fetched successfully.', store);
});