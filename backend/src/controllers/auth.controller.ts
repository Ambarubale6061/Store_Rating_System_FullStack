import { Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccess } from '../utils/ApiResponse';
import * as authService from '../services/auth.service';
import { AuthRequest } from '../types/auth-request';

export const signup = catchAsync(async (req: AuthRequest, res: Response) => {
  const result = await authService.signup(req.body);
  sendSuccess(res, 201, 'Account created successfully.', result);
});

export const login = catchAsync(async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  sendSuccess(res, 200, 'Logged in successfully.', result);
});

export const refresh = catchAsync(async (req: AuthRequest, res: Response) => {
  const { refreshToken } = req.body;
  const tokens = await authService.refreshAccessToken(refreshToken);
  sendSuccess(res, 200, 'Token refreshed successfully.', tokens);
});

export const logout = catchAsync(async (_req: AuthRequest, res: Response) => {
  sendSuccess(res, 200, 'Logged out successfully.');
});

export const changePassword = catchAsync(async (req: AuthRequest, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  await authService.changePassword(req.user!.id, oldPassword, newPassword);
  sendSuccess(res, 200, 'Password changed successfully.');
});

export const getMe = catchAsync(async (req: AuthRequest, res: Response) => {
  const profile = await authService.getProfile(req.user!.id);
  sendSuccess(res, 200, 'Profile fetched successfully.', profile);
});