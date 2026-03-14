import axios from 'axios';
import { Industry, PlatformStats } from '../types/industry.types';
import { IndustryDetail } from '../types/content.types';
import { API_URL } from '@/lib/config';

export const homeApi = {
  getIndustries: async (): Promise<Industry[]> => {
    const response = await axios.get(`${API_URL}/home/industries`);
    return response.data.data;
  },

  getStats: async (): Promise<PlatformStats> => {
    const response = await axios.get(`${API_URL}/home/stats`);
    return response.data.data;
  },

  getIndustryDetail: async (slug: string): Promise<IndustryDetail> => {
    const response = await axios.get(`${API_URL}/home/industries/${slug}/all`);
    return response.data.data;
  },

  getIndustryMetadata: async (slug: string): Promise<Industry> => {
    const response = await axios.get(`${API_URL}/home/industries/${slug}`);
    return response.data.data;
  }
};
