import { request } from '@/lib/api-client';
import type { BasicsChapter, BasicsTopic, BasicsVideo, BasicsArticle, BasicsTopicLink } from '../types';

export const basicsApi = {
  // Chapters
  getChapters: () => request<BasicsChapter[]>('/basics/chapters'),
  getChapter: (id: string) => request<BasicsChapter>(`/basics/chapters/${id}`),
  createChapter: (data: Partial<BasicsChapter>) =>
    request<BasicsChapter>('/basics/chapters', { method: 'POST', body: JSON.stringify(data) }),
  updateChapter: (id: string, data: Partial<BasicsChapter>) =>
    request<BasicsChapter>(`/basics/chapters/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteChapter: (id: string) =>
    request<void>(`/basics/chapters/${id}`, { method: 'DELETE' }),

  // Topics
  getTopics: () => request<BasicsTopic[]>('/basics/topics'),
  getTopic: (id: string) => request<BasicsTopic>(`/basics/topics/${id}`),
  createTopic: (data: Partial<BasicsTopic>) =>
    request<BasicsTopic>('/basics/topics', { method: 'POST', body: JSON.stringify(data) }),
  updateTopic: (id: string, data: Partial<BasicsTopic>) =>
    request<BasicsTopic>(`/basics/topics/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTopic: (id: string) =>
    request<void>(`/basics/topics/${id}`, { method: 'DELETE' }),

  // Topic Links (Models, Agents, Apps)
  createTopicLink: (data: Partial<BasicsTopicLink> & { topicId: string }) =>
    request<BasicsTopicLink>('/basics/links', { method: 'POST', body: JSON.stringify(data) }),
  updateTopicLink: (id: string, data: Partial<BasicsTopicLink>) =>
    request<BasicsTopicLink>(`/basics/links/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTopicLink: (id: string) =>
    request<void>(`/basics/links/${id}`, { method: 'DELETE' }),

  // Videos
  createVideo: (data: Partial<BasicsVideo>) =>
    request<BasicsVideo>('/basics/videos', { method: 'POST', body: JSON.stringify(data) }),
  updateVideo: (id: string, data: Partial<BasicsVideo>) =>
    request<BasicsVideo>(`/basics/videos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteVideo: (id: string) =>
    request<void>(`/basics/videos/${id}`, { method: 'DELETE' }),

  // Articles
  createArticle: (data: Partial<BasicsArticle>) =>
    request<BasicsArticle>('/basics/articles', { method: 'POST', body: JSON.stringify(data) }),
  updateArticle: (id: string, data: Partial<BasicsArticle>) =>
    request<BasicsArticle>(`/basics/articles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteArticle: (id: string) =>
    request<void>(`/basics/articles/${id}`, { method: 'DELETE' }),
};
