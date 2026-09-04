import { Request, Response } from 'express';
import { Role } from '@prisma/client';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccess } from '../utils/ApiResponse';
import { parsePagination, buildMeta } from '../utils/pagination';
import * as userService from '../services/user.service';

export const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body);
  sendSuccess(res, 201, 'User created successfully.', user);
});

export const listUsers = catchAsync(async (req: Request, res: Response) => {
  const pagination = parsePagination(req.query, ['name', 'email', 'role', 'createdAt'], 'createdAt');
  const search = typeof req.query.search === 'string' ? req.query.search : undefined;
  const role = typeof req.query.role === 'string' ? (req.query.role as Role) : undefined;

  const { users, total } = await userService.listUsers({ ...pagination, search, role });
  sendSuccess(res, 200, 'Users fetched successfully.', users, buildMeta(pagination.page, pagination.limit, total));
});

export const getUserById = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.getUserById(req.params.id);
  sendSuccess(res, 200, 'User fetched successfully.', user);
});
