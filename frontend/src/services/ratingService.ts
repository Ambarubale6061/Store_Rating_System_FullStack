import { apiClient } from './apiClient';
import type { ApiMeta, ApiSuccess } from '@/types/api.types';
import type { StoreRater, SubmitRatingPayload } from '@/types/rating.types';

export const ratingService = {
  async submit(payload: SubmitRatingPayload) {
    const res = await apiClient.post('/ratings', payload);
    return res.data.data;
  },

  async listRaters(
    storeId: string,
    params: { page?: number; limit?: number; sortOrder?: 'asc' | 'desc' }
  ): Promise<{ raters: StoreRater[]; meta: ApiMeta }> {
    const res = await apiClient.get<ApiSuccess<StoreRater[]>>(`/ratings/store/${storeId}`, { params });
    return { raters: res.data.data, meta: res.data.meta! };
  },
};
