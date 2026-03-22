import { anythingllmFetch } from './client';

export interface ChatSource {
  title: string;
  chunk: string;
}

interface ChatResponse {
  id: string;
  type: string;
  textResponse: string;
  sources: ChatSource[];
  close: boolean;
  error: string | null;
}

export async function sendChat(
  workspaceSlug: string,
  message: string,
  sessionId: string,
): Promise<{ text: string; sources: ChatSource[]; error: string | null }> {
  const res = await anythingllmFetch<ChatResponse>(
    `/workspace/${workspaceSlug}/chat`,
    {
      method: 'POST',
      body: { message, mode: 'chat', sessionId },
    },
  );

  return {
    text: res.textResponse,
    sources: res.sources || [],
    error: res.error,
  };
}
