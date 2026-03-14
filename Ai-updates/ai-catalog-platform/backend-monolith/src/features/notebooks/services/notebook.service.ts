import { NotebookCategory, SourceType, Prisma } from '@prisma/client';
import { NotebookRepository } from '../repositories/notebook.repository';
import { AppError } from '../../../shared/errors/AppError';
import * as anythingllm from '../../../lib/anythingllm';
import type { ChatSource } from '../../../lib/anythingllm';
import { logger } from '../../../shared/logger/logger';

const FREE_DAILY_ACCESS_LIMIT = 5;

export class NotebookService {
  private repo = new NotebookRepository();

  // ─── Admin: Master Notebooks ───────────────────────────

  async getAllNotebooks(industrySlug?: string) {
    return this.repo.findAll(industrySlug);
  }

  async getNotebookById(id: string) {
    const notebook = await this.repo.findById(id);
    if (!notebook) throw new AppError('Notebook not found', 404);
    return notebook;
  }

  async createNotebook(data: {
    industrySlug: string;
    category: string;
    title: string;
    description?: string;
    gradeLevel?: string;
    difficultyLevel?: string;
    createdBy: string;
  }) {
    const notebook = await this.repo.create({
      ...data,
      category: data.category as NotebookCategory,
    });

    try {
      const workspace = await anythingllm.createWorkspace(data.title);
      await this.repo.update(notebook.id, {
        workspaceSlug: workspace.slug,
        workspaceCreated: true,
      });
      logger.info(`Workspace created for notebook ${notebook.id}: ${workspace.slug}`);
    } catch (err) {
      logger.error(`Failed to create AnythingLLM workspace for notebook ${notebook.id}:`, err);
    }

    return this.repo.findById(notebook.id);
  }

  async updateNotebook(id: string, data: {
    title?: string;
    description?: string;
    gradeLevel?: string;
    difficultyLevel?: string;
    published?: boolean;
  }) {
    await this.getNotebookById(id);
    return this.repo.update(id, data);
  }

  async deleteNotebook(id: string) {
    const notebook = await this.getNotebookById(id);

    if (notebook.workspaceSlug) {
      try {
        await anythingllm.deleteWorkspace(notebook.workspaceSlug);
        logger.info(`Workspace deleted for notebook ${id}: ${notebook.workspaceSlug}`);
      } catch (err) {
        logger.error(`Failed to delete AnythingLLM workspace for notebook ${id}:`, err);
      }
    }

    return this.repo.delete(id);
  }

  async publishNotebook(id: string) {
    const notebook = await this.getNotebookById(id);
    if (!notebook.workspaceCreated) {
      throw new AppError('Cannot publish: workspace has not been created yet', 400);
    }
    return this.repo.update(id, { published: true });
  }

  // ─── Admin: Sources ────────────────────────────────────

  async addSource(notebookId: string, data: {
    type: string;
    title: string;
    url?: string;
    metadata?: Prisma.InputJsonValue;
    sortOrder?: number;
  }) {
    await this.getNotebookById(notebookId);
    const source = await this.repo.addSource({
      notebookId,
      type: data.type as SourceType,
      title: data.title,
      url: data.url || undefined,
      metadata: data.metadata,
      sortOrder: data.sortOrder ?? 0,
    });
    await this.repo.incrementSourcesCount(notebookId);
    return source;
  }

  async deleteSource(notebookId: string, sourceId: string) {
    await this.getNotebookById(notebookId);
    const source = await this.repo.findSourceById(sourceId);
    if (!source || source.notebookId !== notebookId) {
      throw new AppError('Source not found in this notebook', 404);
    }
    await this.repo.deleteSource(sourceId);
    await this.repo.decrementSourcesCount(notebookId);
    return { deleted: true };
  }

  async uploadLinkSource(notebookId: string, type: string, url: string, title?: string) {
    const notebook = await this.getNotebookById(notebookId);
    if (!notebook.workspaceSlug) {
      throw new AppError('Workspace not created for this notebook', 400);
    }

    const doc = await anythingllm.uploadLink(url);
    if (!doc) throw new AppError('Failed to upload link to AnythingLLM', 500);

    await anythingllm.addToWorkspace(notebook.workspaceSlug, [doc.location]);

    const source = await this.repo.addSource({
      notebookId,
      type: type as SourceType,
      title: title || doc.title || url,
      url,
      metadata: { anythingllmLocation: doc.location } as Prisma.InputJsonValue,
    });

    await this.repo.incrementSourcesCount(notebookId);
    return source;
  }

  async uploadFileSource(notebookId: string, file: Express.Multer.File) {
    const notebook = await this.getNotebookById(notebookId);
    if (!notebook.workspaceSlug) {
      throw new AppError('Workspace not created for this notebook', 400);
    }

    const formData = new FormData();
    const uint8 = new Uint8Array(file.buffer);
    const blob = new Blob([uint8], { type: file.mimetype });
    formData.append('file', blob, file.originalname);

    const doc = await anythingllm.uploadFile(formData);
    if (!doc) throw new AppError('Failed to upload file to AnythingLLM', 500);

    await anythingllm.addToWorkspace(notebook.workspaceSlug, [doc.location]);

    const source = await this.repo.addSource({
      notebookId,
      type: 'PDF' as SourceType,
      title: file.originalname,
      metadata: { anythingllmLocation: doc.location } as Prisma.InputJsonValue,
    });

    await this.repo.incrementSourcesCount(notebookId);
    return source;
  }

  // ─── Student: Chat ─────────────────────────────────────

  async sendChat(userId: string, notebookId: string, message: string): Promise<{ text: string; sources: ChatSource[] }> {
    const notebook = await this.getNotebookById(notebookId);
    if (!notebook.published) throw new AppError('Notebook is not published', 404);
    if (!notebook.workspaceSlug) throw new AppError('Notebook chat not available', 400);

    await this.repo.logAccess(userId, notebookId);

    const result = await anythingllm.sendChat(notebook.workspaceSlug, message, userId);

    if (result.error) {
      throw new AppError(`AI response error: ${result.error}`, 500);
    }

    await this.repo.saveChatMessage({
      userId,
      notebookId,
      workspaceSlug: notebook.workspaceSlug,
      message,
      response: result.text,
    });

    return {
      text: result.text,
      sources: result.sources,
    };
  }

  async getChatHistory(userId: string, notebookId: string) {
    await this.getNotebookById(notebookId);
    return this.repo.getChatHistory(userId, notebookId);
  }

  async clearChatHistory(userId: string, notebookId: string) {
    await this.getNotebookById(notebookId);
    await this.repo.clearChatHistory(userId, notebookId);
    return { cleared: true };
  }

  // ─── Student: Access ───────────────────────────────────

  async getNotebookAccess(
    userId: string,
    industrySlug: string,
    category: string,
    isPremium = false,
  ) {
    const notebooks = await this.repo.findPublishedByCategory(category as NotebookCategory);
    const notebook = notebooks.find(n => n.industrySlug === industrySlug);

    if (!notebook) {
      throw new AppError('No published notebook found for this category', 404);
    }

    if (!notebook.workspaceSlug) {
      throw new AppError('Notebook chat is not yet configured', 404);
    }

    if (!isPremium) {
      const todayCount = await this.repo.countUserAccessToday(userId);
      if (todayCount >= FREE_DAILY_ACCESS_LIMIT) {
        throw new AppError(
          `Daily limit reached (${FREE_DAILY_ACCESS_LIMIT}/day). Upgrade for unlimited access.`,
          429,
        );
      }
    }

    await this.repo.logAccess(userId, notebook.id);

    return {
      notebookId: notebook.id,
      title: notebook.title,
      description: notebook.description,
      industryName: notebook.industry.name,
      workspaceSlug: notebook.workspaceSlug,
    };
  }

  async logNotebookOpen(userId: string, notebookId: string) {
    const notebook = await this.repo.findById(notebookId);
    if (notebook) {
      await this.repo.logAccess(userId, notebook.id);
    }
    return { logged: true };
  }

  async getAccessHistory(userId: string) {
    return this.repo.getUserAccessHistory(userId);
  }

  async getPublishedByCategory(category: string) {
    return this.repo.findPublishedByCategory(category as NotebookCategory);
  }

  async getPublishedNotebooks(filters?: { gradeLevel?: string; difficultyLevel?: string }) {
    return this.repo.findPublishedNotebooks(filters);
  }
}
