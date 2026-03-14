import { z } from 'zod';

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const idParamSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'ID is required'),
  }),
});

export const industrySlugQuerySchema = z.object({
  query: z.object({
    industrySlug: z.string().regex(slugPattern, 'Invalid slug format').optional(),
  }),
});

export const createIndustrySchema = z.object({
  body: z.object({
    name: z.string().min(1).max(200),
    slug: z.string().regex(slugPattern).max(100),
    description: z.string().max(2000).optional(),
    icon: z.string().max(50).optional(),
    color: z.string().max(50).optional(),
  }).strict(),
});

export const updateIndustrySchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    name: z.string().min(1).max(200).optional(),
    slug: z.string().regex(slugPattern).max(100).optional(),
    description: z.string().max(2000).optional(),
    icon: z.string().max(50).optional(),
    color: z.string().max(50).optional(),
  }).strict(),
});

export const createModelSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(300),
    slug: z.string().regex(slugPattern).max(200).optional(),
    description: z.string().max(5000).optional(),
    builtBy: z.string().max(200).optional(),
    builtByRole: z.string().max(200).optional(),
    builder: z.string().max(200).optional(),
    difficultyLevel: z.string().max(50).optional(),
    gradeLevel: z.array(z.string()).optional(),
    modelType: z.string().max(100).optional(),
    releaseYear: z.string().max(10).optional(),
    parameters: z.string().max(100).optional(),
    inputType: z.array(z.string()).optional(),
    outputType: z.array(z.string()).optional(),
    whatItDoes: z.string().max(5000).optional(),
    whatItAutomates: z.string().max(5000).optional(),
    skillsNeeded: z.array(z.string()).optional(),
    useCaseTags: z.array(z.string()).optional(),
    whatToLearnFirst: z.string().max(5000).optional(),
    realWorldExample: z.string().max(2000).optional(),
    releaseDate: z.string().optional(),
    isFree: z.boolean().optional(),
    tryUrl: z.string().url().max(2000).optional().or(z.literal('')),
    notebookLmUrl: z.string().url().max(2000).optional().or(z.literal('')),
    youtubeUrl: z.string().url().max(2000).optional().or(z.literal('')),
    udemyUrl: z.string().url().max(2000).optional().or(z.literal('')),
    sourceUrl: z.string().url().max(2000).optional().or(z.literal('')),
    huggingFaceUrl: z.string().url().max(2000).optional().or(z.literal('')),
    learnUrl: z.string().url().max(2000).optional().or(z.literal('')),
    careerImpact: z.string().max(2000).optional(),
    whatToLearn: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    sortOrder: z.coerce.number().int().optional(),
    isPublished: z.boolean().optional(),
    industrySlug: z.string().regex(slugPattern).max(100),
  }),
});

export const createAgentSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(300),
    slug: z.string().regex(slugPattern).max(200).optional(),
    description: z.string().max(5000).optional(),
    builtBy: z.string().max(200).optional(),
    builtByRole: z.string().max(200).optional(),
    builder: z.string().max(200).optional(),
    difficultyLevel: z.string().max(50).optional(),
    gradeLevel: z.array(z.string()).optional(),
    agentType: z.string().max(100).optional(),
    whatItDoes: z.string().max(5000).optional(),
    whatItAutomates: z.string().max(5000).optional(),
    humanJobItHelps: z.string().max(500).optional(),
    humanPartnership: z.string().max(500).optional(),
    skillsNeeded: z.array(z.string()).optional(),
    inputType: z.array(z.string()).optional(),
    outputType: z.array(z.string()).optional(),
    useCaseTags: z.array(z.string()).optional(),
    whatToLearnFirst: z.string().max(5000).optional(),
    realWorldExample: z.string().max(2000).optional(),
    isFree: z.boolean().optional(),
    tryUrl: z.string().url().max(2000).optional().or(z.literal('')),
    notebookLmUrl: z.string().url().max(2000).optional().or(z.literal('')),
    youtubeUrl: z.string().url().max(2000).optional().or(z.literal('')),
    udemyUrl: z.string().url().max(2000).optional().or(z.literal('')),
    sourceUrl: z.string().url().max(2000).optional().or(z.literal('')),
    huggingFaceUrl: z.string().url().max(2000).optional().or(z.literal('')),
    learnUrl: z.string().url().max(2000).optional().or(z.literal('')),
    careerImpact: z.string().max(2000).optional(),
    sortOrder: z.coerce.number().int().optional(),
    isPublished: z.boolean().optional(),
    industrySlug: z.string().regex(slugPattern).max(100),
  }),
});

export const createAppSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(300),
    slug: z.string().regex(slugPattern).max(200).optional(),
    description: z.string().max(5000).optional(),
    builtBy: z.string().max(200).optional(),
    builtByRole: z.string().max(500).optional(),
    developer: z.string().max(200).optional(),
    whoUsesIt: z.string().max(500).optional(),
    isFree: z.boolean().optional(),
    tryUrl: z.string().url().max(2000).optional().or(z.literal('')),
    appUrl: z.string().url().max(2000).optional().or(z.literal('')),
    careerImpact: z.string().max(2000).optional(),
    sortOrder: z.coerce.number().int().optional(),
    isPublished: z.boolean().optional(),
    industrySlug: z.string().regex(slugPattern).max(100),
  }),
});

export const createGuideSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(500),
    description: z.string().max(5000).optional(),
    difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional(),
    timeRequired: z.string().max(100).optional(),
    toolsNeeded: z.array(z.string()).optional(),
    whatYouLearn: z.string().max(50000).optional(),
    steps: z.any().optional(),
    isPublished: z.boolean().optional(),
    industrySlug: z.string().regex(slugPattern).max(100),
  }),
});

export const createPromptSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(500),
    promptText: z.string().min(1).max(10000),
    useCase: z.string().max(500).optional(),
    category: z.string().max(200).optional(),
    industrySlug: z.string().regex(slugPattern).max(100),
  }),
});

export const createCareerPathSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(300),
    description: z.string().max(5000).optional(),
    aiImpactSummary: z.string().max(5000).optional(),
    sortOrder: z.coerce.number().int().optional(),
    industrySlug: z.string().regex(slugPattern).max(100),
  }),
});

export const createCareerJobSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(300),
    salaryRangeMin: z.coerce.number().int().optional(),
    salaryRangeMax: z.coerce.number().int().optional(),
    currency: z.string().max(10).optional(),
    demand: z.enum(['GROWING', 'STABLE', 'AT_RISK']).optional(),
    requiredDegree: z.string().max(500).optional(),
    requiredSkills: z.array(z.string()).optional(),
    futureSkills: z.array(z.string()).optional(),
    howAiChanges: z.string().max(5000).optional(),
    googleUrl: z.string().url().optional().or(z.literal('')),
    notebookLmUrl: z.string().url().optional().or(z.literal('')),
    timeline: z.enum(['NOW', 'YEAR_2030', 'FUTURE']).optional(),
    sortOrder: z.coerce.number().int().optional(),
    careerPathId: z.string().min(1),
  }),
});

export const createSkillSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(300),
    description: z.string().max(5000).optional(),
    level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional(),
    whyItMatters: z.string().max(2000).optional(),
    learnUrl: z.string().url().max(2000).optional().or(z.literal('')),
    notebookLmUrl: z.string().url().optional().or(z.literal('')),
    timeToLearn: z.string().max(100).optional(),
    category: z.string().max(200).optional(),
    sortOrder: z.coerce.number().int().optional(),
    industrySlug: z.string().regex(slugPattern).max(100),
  }),
});

export const createQuestionSchema = z.object({
  body: z.object({
    text: z.string().min(1).max(2000),
    category: z.string().max(200).optional(),
    industrySlug: z.string().regex(slugPattern).max(100),
  }).strict(),
});

export const createBasicsTopicSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(500),
    slug: z.string().regex(slugPattern).max(200),
    description: z.string().max(5000).optional(),
    industrySlug: z.string().regex(slugPattern).max(100).optional(),
  }).strict(),
});

export const createBasicsVideoSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(500),
    url: z.string().url().max(2000),
    duration: z.string().max(50).optional(),
    topicId: z.string().min(1),
  }).strict(),
});

export const createBasicsArticleSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(500),
    url: z.string().url().max(2000),
    source: z.string().max(200).optional(),
    topicId: z.string().min(1),
  }).strict(),
});
