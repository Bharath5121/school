import { useAppStore } from '@/store/app.store';
import { API_URL } from '@/lib/config';

function getHeaders(): HeadersInit {
  const token = useAppStore.getState().accessToken;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: { ...getHeaders(), ...options?.headers },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Request failed');
  return json.data;
}

export const adminApi = {
  getContentStats: () => request<any>('/home/admin/stats'),
  getDashboard: () => request<any>('/admin/dashboard/summary'),

  getUsers: (page = 1, limit = 20, role?: string) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (role) params.set('role', role);
    return request<any>(`/admin/users?${params}`);
  },
  getUser: (id: string) => request<any>(`/admin/users/${id}`),
  updateUserRole: (id: string, role: string) =>
    request<any>(`/admin/users/${id}/role`, { method: 'PUT', body: JSON.stringify({ role }) }),
  deleteUser: (id: string) =>
    request<any>(`/admin/users/${id}`, { method: 'DELETE' }),

  getIndustries: () => request<any[]>('/home/admin/industries'),
  createIndustry: (data: any) =>
    request<any>('/home/admin/industries', { method: 'POST', body: JSON.stringify(data) }),
  updateIndustry: (id: string, data: any) =>
    request<any>(`/home/admin/industries/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteIndustry: (id: string) =>
    request<any>(`/home/admin/industries/${id}`, { method: 'DELETE' }),

  getModels: (industrySlug?: string) => {
    const params = industrySlug ? `?industrySlug=${industrySlug}` : '';
    return request<any[]>(`/home/admin/models${params}`);
  },
  createModel: (data: any) =>
    request<any>('/home/admin/models', { method: 'POST', body: JSON.stringify(data) }),
  updateModel: (id: string, data: any) =>
    request<any>(`/home/admin/models/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteModel: (id: string) =>
    request<any>(`/home/admin/models/${id}`, { method: 'DELETE' }),

  getAgents: (industrySlug?: string) => {
    const params = industrySlug ? `?industrySlug=${industrySlug}` : '';
    return request<any[]>(`/home/admin/agents${params}`);
  },
  createAgent: (data: any) =>
    request<any>('/home/admin/agents', { method: 'POST', body: JSON.stringify(data) }),
  updateAgent: (id: string, data: any) =>
    request<any>(`/home/admin/agents/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteAgent: (id: string) =>
    request<any>(`/home/admin/agents/${id}`, { method: 'DELETE' }),

  getApps: (industrySlug?: string) => {
    const params = industrySlug ? `?industrySlug=${industrySlug}` : '';
    return request<any[]>(`/home/admin/apps${params}`);
  },
  createApp: (data: any) =>
    request<any>('/home/admin/apps', { method: 'POST', body: JSON.stringify(data) }),
  updateApp: (id: string, data: any) =>
    request<any>(`/home/admin/apps/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteApp: (id: string) =>
    request<any>(`/home/admin/apps/${id}`, { method: 'DELETE' }),

  getQuestions: (industrySlug?: string) => {
    const params = industrySlug ? `?industrySlug=${industrySlug}` : '';
    return request<any[]>(`/home/admin/questions${params}`);
  },
  createQuestion: (data: any) =>
    request<any>('/home/admin/questions', { method: 'POST', body: JSON.stringify(data) }),
  updateQuestion: (id: string, data: any) =>
    request<any>(`/home/admin/questions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteQuestion: (id: string) =>
    request<any>(`/home/admin/questions/${id}`, { method: 'DELETE' }),

  getBasicsTopics: () => request<any[]>('/home/admin/basics/topics'),
  getBasicsTopic: (id: string) => request<any>(`/home/admin/basics/topics/${id}`),
  createBasicsTopic: (data: any) =>
    request<any>('/home/admin/basics/topics', { method: 'POST', body: JSON.stringify(data) }),
  updateBasicsTopic: (id: string, data: any) =>
    request<any>(`/home/admin/basics/topics/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteBasicsTopic: (id: string) =>
    request<any>(`/home/admin/basics/topics/${id}`, { method: 'DELETE' }),

  createBasicsVideo: (data: any) =>
    request<any>('/home/admin/basics/videos', { method: 'POST', body: JSON.stringify(data) }),
  updateBasicsVideo: (id: string, data: any) =>
    request<any>(`/home/admin/basics/videos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteBasicsVideo: (id: string) =>
    request<any>(`/home/admin/basics/videos/${id}`, { method: 'DELETE' }),

  createBasicsArticle: (data: any) =>
    request<any>('/home/admin/basics/articles', { method: 'POST', body: JSON.stringify(data) }),
  updateBasicsArticle: (id: string, data: any) =>
    request<any>(`/home/admin/basics/articles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteBasicsArticle: (id: string) =>
    request<any>(`/home/admin/basics/articles/${id}`, { method: 'DELETE' }),

  // ─── Career Paths ────────────────────────────────────
  getCareerPaths: (industrySlug?: string) => {
    const params = industrySlug ? `?industrySlug=${industrySlug}` : '';
    return request<any[]>(`/home/admin/career-paths${params}`);
  },
  createCareerPath: (data: any) =>
    request<any>('/home/admin/career-paths', { method: 'POST', body: JSON.stringify(data) }),
  updateCareerPath: (id: string, data: any) =>
    request<any>(`/home/admin/career-paths/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCareerPath: (id: string) =>
    request<any>(`/home/admin/career-paths/${id}`, { method: 'DELETE' }),

  // ─── Career Jobs ────────────────────────────────────
  getCareerJobs: () => request<any[]>('/home/admin/career-jobs'),
  createCareerJob: (data: any) =>
    request<any>('/home/admin/career-jobs', { method: 'POST', body: JSON.stringify(data) }),
  updateCareerJob: (id: string, data: any) =>
    request<any>(`/home/admin/career-jobs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCareerJob: (id: string) =>
    request<any>(`/home/admin/career-jobs/${id}`, { method: 'DELETE' }),

  // ─── Skills ─────────────────────────────────────────
  getSkills: (industrySlug?: string) => {
    const params = industrySlug ? `?industrySlug=${industrySlug}` : '';
    return request<any[]>(`/home/admin/skills${params}`);
  },
  createSkill: (data: any) =>
    request<any>('/home/admin/skills', { method: 'POST', body: JSON.stringify(data) }),
  updateSkill: (id: string, data: any) =>
    request<any>(`/home/admin/skills/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteSkill: (id: string) =>
    request<any>(`/home/admin/skills/${id}`, { method: 'DELETE' }),

  // ─── Guides ─────────────────────────────────────────
  getGuides: (industrySlug?: string) => {
    const params = industrySlug ? `?industrySlug=${industrySlug}` : '';
    return request<any[]>(`/home/admin/guides${params}`);
  },
  createGuide: (data: any) =>
    request<any>('/home/admin/guides', { method: 'POST', body: JSON.stringify(data) }),
  updateGuide: (id: string, data: any) =>
    request<any>(`/home/admin/guides/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteGuide: (id: string) =>
    request<any>(`/home/admin/guides/${id}`, { method: 'DELETE' }),

  // ─── Prompts ────────────────────────────────────────
  getPrompts: (industrySlug?: string) => {
    const params = industrySlug ? `?industrySlug=${industrySlug}` : '';
    return request<any[]>(`/home/admin/prompts${params}`);
  },
  createPrompt: (data: any) =>
    request<any>('/home/admin/prompts', { method: 'POST', body: JSON.stringify(data) }),
  updatePrompt: (id: string, data: any) =>
    request<any>(`/home/admin/prompts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePrompt: (id: string) =>
    request<any>(`/home/admin/prompts/${id}`, { method: 'DELETE' }),

  // ─── Notebooks ────────────────────────────────────────
  getNotebooks: (industrySlug?: string) => {
    const params = industrySlug ? `?industrySlug=${industrySlug}` : '';
    return request<any[]>(`/notebooks/admin${params}`);
  },
  getNotebook: (id: string) => request<any>(`/notebooks/admin/${id}`),
  createNotebook: (data: any) =>
    request<any>('/notebooks/admin', { method: 'POST', body: JSON.stringify(data) }),
  updateNotebook: (id: string, data: any) =>
    request<any>(`/notebooks/admin/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteNotebook: (id: string) =>
    request<any>(`/notebooks/admin/${id}`, { method: 'DELETE' }),
  publishNotebook: (id: string) =>
    request<any>(`/notebooks/admin/${id}/publish`, { method: 'POST' }),
  addNotebookSource: (notebookId: string, data: any) =>
    request<any>(`/notebooks/admin/${notebookId}/sources`, { method: 'POST', body: JSON.stringify(data) }),
  deleteNotebookSource: (notebookId: string, sourceId: string) =>
    request<any>(`/notebooks/admin/${notebookId}/sources/${sourceId}`, { method: 'DELETE' }),
};
