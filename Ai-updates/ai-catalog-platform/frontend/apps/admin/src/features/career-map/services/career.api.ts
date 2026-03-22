import { request } from '@/lib/api-client';
import type { CareerPath, CareerJob } from '../types';

export const careerApi = {
  getPaths: () => request<CareerPath[]>('/career-map/paths'),
  getPath: (id: string) => request<CareerPath>(`/career-map/paths/${id}`),
  createPath: (data: Partial<CareerPath>) =>
    request<CareerPath>('/career-map/paths', { method: 'POST', body: JSON.stringify(data) }),
  updatePath: (id: string, data: Partial<CareerPath>) =>
    request<CareerPath>(`/career-map/paths/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePath: (id: string) =>
    request<void>(`/career-map/paths/${id}`, { method: 'DELETE' }),

  getJobs: () => request<CareerJob[]>('/career-map/jobs'),
  getJob: (id: string) => request<CareerJob>(`/career-map/jobs/${id}`),
  createJob: (data: Partial<CareerJob>) =>
    request<CareerJob>('/career-map/jobs', { method: 'POST', body: JSON.stringify(data) }),
  updateJob: (id: string, data: Partial<CareerJob>) =>
    request<CareerJob>(`/career-map/jobs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteJob: (id: string) =>
    request<void>(`/career-map/jobs/${id}`, { method: 'DELETE' }),
};
