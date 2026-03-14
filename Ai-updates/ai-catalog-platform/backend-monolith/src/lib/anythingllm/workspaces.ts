import { anythingllmFetch } from './client';

interface WorkspaceResponse {
  workspace: {
    id: number;
    name: string;
    slug: string;
    createdAt: string;
    openAiTemp: number | null;
    openAiHistory: number;
    openAiPrompt: string | null;
  };
  message?: string;
}

interface WorkspaceListResponse {
  workspaces: Array<{
    id: number;
    name: string;
    slug: string;
    createdAt: string;
  }>;
}

export async function createWorkspace(name: string): Promise<{ slug: string; id: number }> {
  const res = await anythingllmFetch<WorkspaceResponse>('/workspace/new', {
    method: 'POST',
    body: { name },
  });
  return { slug: res.workspace.slug, id: res.workspace.id };
}

export async function getWorkspace(slug: string) {
  const res = await anythingllmFetch<WorkspaceResponse>(`/workspace/${slug}`);
  return res.workspace;
}

export async function deleteWorkspace(slug: string): Promise<void> {
  await anythingllmFetch(`/workspace/${slug}`, { method: 'DELETE' });
}

export async function listWorkspaces() {
  const res = await anythingllmFetch<WorkspaceListResponse>('/workspaces');
  return res.workspaces;
}
