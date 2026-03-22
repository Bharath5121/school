import { z } from 'zod';
import {
  createChapterSchema,
  updateChapterSchema,
  createBasicsTopicSchema,
  updateBasicsTopicSchema,
  createBasicsVideoSchema,
  updateBasicsVideoSchema,
  createBasicsArticleSchema,
  updateBasicsArticleSchema,
  createTopicLinkSchema,
  updateTopicLinkSchema,
} from '../validators/basics.validator';

export type CreateChapterDto = z.infer<typeof createChapterSchema>['body'];
export type UpdateChapterDto = z.infer<typeof updateChapterSchema>['body'];

export type CreateBasicsTopicDto = z.infer<typeof createBasicsTopicSchema>['body'];
export type UpdateBasicsTopicDto = z.infer<typeof updateBasicsTopicSchema>['body'];

export type CreateBasicsVideoDto = z.infer<typeof createBasicsVideoSchema>['body'];
export type UpdateBasicsVideoDto = z.infer<typeof updateBasicsVideoSchema>['body'];

export type CreateBasicsArticleDto = z.infer<typeof createBasicsArticleSchema>['body'];
export type UpdateBasicsArticleDto = z.infer<typeof updateBasicsArticleSchema>['body'];

export type CreateTopicLinkDto = z.infer<typeof createTopicLinkSchema>['body'];
export type UpdateTopicLinkDto = z.infer<typeof updateTopicLinkSchema>['body'];
