import { apiClient } from './apiClient';
import type { ApiMeta, ApiSuccess } from '@/types/api.types';
import type { AdminUser, CreateUserPayload } from '@/types/user.types';

export interface ListUsersParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  role?: string;
}

export const userService = {
  async create(payload: CreateUserPayload): Promise<AdminUser> {
    const res = await apiClient.post<ApiSuccess<AdminUser>>('/users', payload);
    return res.data.data;
  },

  async list(params: ListUsersParams): Promise<{ users: AdminUser[]; meta: ApiMeta }> {
    const res = await apiClient.get<ApiSuccess<AdminUser[]>>('/users', { params });
    return { users: res.data.data, meta: res.data.meta! };
  },

  async getById(id: string): Promise<AdminUser> {
    const res = await apiClient.get<ApiSuccess<AdminUser>>(`/users/${id}`);
    return res.data.data;
  },
};
