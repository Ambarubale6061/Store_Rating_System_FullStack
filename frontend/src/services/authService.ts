import { apiClient } from './apiClient';
import type { AuthResponse, AuthUser, ChangePasswordPayload, LoginPayload, SignupPayload } from '@/types/auth.types';
import type { ApiSuccess } from '@/types/api.types';

export const authService = {
  async signup(payload: SignupPayload): Promise<AuthResponse> {
    const res = await apiClient.post<ApiSuccess<AuthResponse>>('/auth/signup', payload);
    return res.data.data;
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const res = await apiClient.post<ApiSuccess<AuthResponse>>('/auth/login', payload);
    return res.data.data;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },

  async changePassword(payload: ChangePasswordPayload): Promise<void> {
    await apiClient.post('/auth/change-password', payload);
  },

  async getMe(): Promise<AuthUser> {
    const res = await apiClient.get<ApiSuccess<AuthUser>>('/auth/me');
    return res.data.data;
  },
};
