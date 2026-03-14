export interface Notebook {
  id: string;
  title: string;
  description: string | null;
  category: string;
  industrySlug: string;
  gradeLevel: string | null;
  difficultyLevel: string | null;
  workspaceSlug: string | null;
  workspaceCreated: boolean;
  sourcesCount: number;
  published: boolean;
  createdAt: string;
  industry: { name: string; slug: string; icon: string; color: string };
  _count?: { sources: number; accessLogs?: number; chatMessages?: number };
  sources?: NotebookSource[];
}

export interface NotebookSource {
  id: string;
  type: string;
  title: string;
  url: string | null;
  sortOrder: number;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  message: string;
  response: string;
  createdAt: string;
}

export interface ChatSendResult {
  text: string;
  sources: Array<{ title: string; chunk: string }>;
}
