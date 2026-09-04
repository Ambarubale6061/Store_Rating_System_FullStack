import { apiClient } from './apiClient';
import type { ApiMeta, ApiSuccess } from '@/types/api.types';
import type { CreateStorePayload, Store } from '@/types/store.types';

export interface ListStoresParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export const storeService = {
  async create(payload: CreateStorePayload): Promise<Store> {
    const res = await apiClient.post<ApiSuccess<Store>>('/stores', payload);
    return res.data.data;
  },

  async list(params: ListStoresParams): Promise<{ stores: Store[]; meta: ApiMeta }> {
    const res = await apiClient.get<ApiSuccess<Store[]>>('/stores', { params });
    return { stores: res.data.data, meta: res.data.meta! };
  },

  async getById(id: string): Promise<Store> {
    const res = await apiClient.get<ApiSuccess<Store>>(`/stores/${id}`);
    return res.data.data;
  },
};
