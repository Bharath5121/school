export interface LLMWorkspace {
  id: number;
  name: string;
  slug: string;
  vectorTag: string | null;
  createdAt: string;
  openAiTemp: number | null;
  openAiHistory: number;
  lastUpdatedAt: string;
  threads: LLMThread[];
}

export interface LLMThread {
  id: number;
  name: string;
  slug: string;
  user_id: number | null;
  workspace_id: number;
}

export interface LLMChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  sources?: LLMSource[];
}

export interface LLMSource {
  title: string;
  url?: string;
  published?: string;
  description?: string;
  chunkSource?: string;
}

export interface LLMChatResponse {
  id: string;
  type: 'textResponse' | 'abort' | 'error';
  textResponse: string;
  sources: LLMSource[];
  close: boolean;
  error: string | null;
}

export interface LLMDocumentUploadResult {
  success: boolean;
  error: string | null;
  documents: { id: string; location: string }[];
}

export interface LLMHealthStatus {
  online: boolean;
  version?: string;
  models?: string[];
}
