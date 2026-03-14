import { apiClient } from '../../../lib/api-client';

export const feedRepository = {
  getFeed: async (params: { page?: number; limit?: number; field?: string }) => {
    const response = await apiClient.get('/feed', { params });
    return response.data;
  },
  getTrending: async () => {
    const response = await apiClient.get('/feed/trending');
    return response.data;
  },
  getFields: async () => {
    const response = await apiClient.get('/feed/fields');
    return response.data;
  }
};
