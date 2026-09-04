import { apiClient } from './apiClient';
import type { ApiSuccess } from '@/types/api.types';

export interface AdminStats {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
}

export interface StoreOwnerStats {
  stores: { id: string; name: string; email: string; address: string; averageRating: number; totalRatings: number }[];
  totalRatings: number;
  averageRating: number;
}

export const dashboardService = {
  async getAdminStats(): Promise<AdminStats> {
    const res = await apiClient.get<ApiSuccess<AdminStats>>('/dashboard/admin');
    return res.data.data;
  },

  async getStoreOwnerStats(): Promise<StoreOwnerStats> {
    const res = await apiClient.get<ApiSuccess<StoreOwnerStats>>('/dashboard/store-owner');
    return res.data.data;
  },
};
