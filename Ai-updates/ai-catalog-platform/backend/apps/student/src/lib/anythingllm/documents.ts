import { anythingllmFetch } from './client';

interface UploadResponse {
  success: boolean;
  error: string | null;
  documents?: Array<{ location: string; title: string }>;
}

interface EmbeddingResponse {
  workspace: { slug: string };
  message?: string;
}

export async function uploadLink(url: string): Promise<{ location: string; title: string } | null> {
  const res = await anythingllmFetch<UploadResponse>('/document/create-link', {
    method: 'POST',
    body: { link: url },
  });

  if (!res.success || !res.documents?.length) {
    throw new Error(res.error || 'Failed to upload link to AnythingLLM');
  }

  return res.documents[0];
}

export async function uploadFile(formData: FormData): Promise<{ location: string; title: string } | null> {
  const res = await anythingllmFetch<UploadResponse>('/document/upload', {
    method: 'POST',
    body: formData,
    isFormData: true,
  });

  if (!res.success || !res.documents?.length) {
    throw new Error(res.error || 'Failed to upload file to AnythingLLM');
  }

  return res.documents[0];
}

export async function addToWorkspace(
  workspaceSlug: string,
  docPaths: string[],
): Promise<void> {
  await anythingllmFetch<EmbeddingResponse>(
    `/workspace/${workspaceSlug}/update-embeddings`,
    {
      method: 'POST',
      body: { adds: docPaths, deletes: [] },
    },
  );
}
