-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "app_auth";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "catalog";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "content";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "user_activity";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "user_network";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "users";

-- CreateEnum
CREATE TYPE "app_auth"."UserRole" AS ENUM ('STUDENT', 'PARENT', 'TEACHER', 'ADMIN');

-- CreateEnum
CREATE TYPE "catalog"."FeedContentType" AS ENUM ('MODEL', 'ADVANCEMENT', 'AGENT', 'PRODUCT', 'LEARNING', 'CAREER', 'GUIDE');

-- CreateEnum
CREATE TYPE "user_activity"."SkillStatus" AS ENUM ('NOT_STARTED', 'EXPLORING', 'LEARNED');

-- CreateEnum
CREATE TYPE "content"."DifficultyLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "content"."JobDemand" AS ENUM ('GROWING', 'STABLE', 'AT_RISK');

-- CreateEnum
CREATE TYPE "content"."JobTimeline" AS ENUM ('NOW', 'YEAR_2030', 'FUTURE');

-- CreateEnum
CREATE TYPE "content"."NotebookCategory" AS ENUM ('MODELS', 'AGENTS', 'APPS', 'CLASS');

-- CreateEnum
CREATE TYPE "content"."SourceType" AS ENUM ('URL', 'PDF', 'TEXT', 'VIDEO', 'YOUTUBE');

-- CreateTable
CREATE TABLE "app_auth"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "role" "app_auth"."UserRole" NOT NULL DEFAULT 'STUDENT',
    "email_verified_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users"."profiles" (
    "user_id" TEXT NOT NULL,
    "avatar_url" TEXT,
    "bio" TEXT,
    "grade_level" TEXT,
    "stream" TEXT,
    "parent_email" TEXT,
    "onboarding_completed" BOOLEAN NOT NULL DEFAULT false,
    "learning_style" JSONB,
    "preferences" JSONB NOT NULL DEFAULT '{"theme": "emerald", "notifications": {"email": true, "push": false}}',
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "users"."user_interests" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "field_name" TEXT NOT NULL,
    "interest_level" INTEGER NOT NULL DEFAULT 5,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_interests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalog"."feed_items" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "content_type" "catalog"."FeedContentType" NOT NULL,
    "target_role" "app_auth"."UserRole" NOT NULL DEFAULT 'STUDENT',
    "field_slug" TEXT NOT NULL,
    "summary" TEXT,
    "career_impact_score" INTEGER,
    "career_impact_text" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "published_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feed_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_activity"."bookmarks" (
    "user_id" TEXT NOT NULL,
    "feed_item_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bookmarks_pkey" PRIMARY KEY ("user_id","feed_item_id")
);

-- CreateTable
CREATE TABLE "user_activity"."reading_history" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "feed_item_id" TEXT NOT NULL,
    "time_spent_seconds" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "last_read_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reading_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_activity"."skill_progress" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "skill_id" TEXT NOT NULL,
    "status" "user_activity"."SkillStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "skill_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_activity"."career_explored" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "career_job_id" TEXT NOT NULL,
    "explored_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "career_explored_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_activity"."content_bookmarks" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "content_type" TEXT NOT NULL,
    "content_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_bookmarks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content"."Industry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "gradient" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Industry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content"."AIModel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "builtBy" TEXT NOT NULL,
    "built_by_role" TEXT NOT NULL DEFAULT '',
    "industrySlug" TEXT NOT NULL,
    "difficulty_level" "content"."DifficultyLevel" NOT NULL DEFAULT 'BEGINNER',
    "grade_level" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "model_type" TEXT NOT NULL DEFAULT '',
    "release_year" TEXT NOT NULL DEFAULT '',
    "parameters" TEXT NOT NULL DEFAULT '',
    "input_type" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "output_type" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "what_it_does" TEXT NOT NULL DEFAULT '',
    "what_it_automates" TEXT NOT NULL DEFAULT '',
    "skills_needed" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "use_case_tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "careerImpact" TEXT NOT NULL,
    "what_to_learn_first" TEXT NOT NULL DEFAULT '',
    "real_world_example" TEXT NOT NULL DEFAULT '',
    "isFree" BOOLEAN NOT NULL DEFAULT false,
    "tryUrl" TEXT,
    "notebook_lm_url" TEXT,
    "youtube_url" TEXT,
    "udemy_url" TEXT,
    "source_url" TEXT,
    "hugging_face_url" TEXT,
    "releaseDate" TIMESTAMP(3),
    "whatToLearn" TEXT[],
    "tags" TEXT[],
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AIModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content"."AIAgent" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "builtBy" TEXT NOT NULL,
    "built_by_role" TEXT NOT NULL DEFAULT '',
    "industrySlug" TEXT NOT NULL,
    "difficulty_level" "content"."DifficultyLevel" NOT NULL DEFAULT 'BEGINNER',
    "grade_level" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "agent_type" TEXT NOT NULL DEFAULT '',
    "whatItDoes" TEXT NOT NULL,
    "what_it_automates" TEXT NOT NULL DEFAULT '',
    "humanJobItHelps" TEXT NOT NULL,
    "human_partnership" TEXT NOT NULL DEFAULT '',
    "skillsNeeded" TEXT[],
    "input_type" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "output_type" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "use_case_tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "careerImpact" TEXT NOT NULL,
    "what_to_learn_first" TEXT NOT NULL DEFAULT '',
    "real_world_example" TEXT NOT NULL DEFAULT '',
    "isFree" BOOLEAN NOT NULL DEFAULT false,
    "tryUrl" TEXT,
    "notebook_lm_url" TEXT,
    "youtube_url" TEXT,
    "udemy_url" TEXT,
    "source_url" TEXT,
    "hugging_face_url" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AIAgent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content"."AIApp" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "builtBy" TEXT NOT NULL,
    "builtByRole" TEXT NOT NULL,
    "industrySlug" TEXT NOT NULL,
    "whoUsesIt" TEXT NOT NULL,
    "tryUrl" TEXT,
    "isFree" BOOLEAN NOT NULL DEFAULT false,
    "careerImpact" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AIApp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content"."PredefinedQuestion" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "industrySlug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PredefinedQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content"."BasicsTopic" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "concepts" TEXT[],
    "keyTakeaways" TEXT[],
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BasicsTopic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content"."BasicsVideo" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "topicId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BasicsVideo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content"."BasicsArticle" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "topicId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BasicsArticle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content"."Guide" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "difficulty" "content"."DifficultyLevel" NOT NULL DEFAULT 'BEGINNER',
    "timeRequired" TEXT NOT NULL,
    "toolsNeeded" TEXT[],
    "industrySlug" TEXT NOT NULL,
    "whatYouLearn" TEXT NOT NULL,
    "steps" JSONB NOT NULL DEFAULT '[]',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Guide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content"."PromptTemplate" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "useCase" TEXT NOT NULL,
    "industrySlug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PromptTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content"."CareerPath" (
    "id" TEXT NOT NULL,
    "industrySlug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "aiImpactSummary" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CareerPath_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content"."CareerJob" (
    "id" TEXT NOT NULL,
    "careerPathId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "salaryRangeMin" INTEGER NOT NULL,
    "salaryRangeMax" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "demand" "content"."JobDemand" NOT NULL DEFAULT 'GROWING',
    "requiredDegree" TEXT NOT NULL,
    "requiredSkills" TEXT[],
    "futureSkills" TEXT[],
    "howAiChanges" TEXT NOT NULL,
    "timeline" "content"."JobTimeline" NOT NULL DEFAULT 'NOW',
    "google_url" TEXT,
    "notebook_lm_url" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CareerJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content"."Skill" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "industrySlug" TEXT NOT NULL,
    "level" "content"."DifficultyLevel" NOT NULL DEFAULT 'BEGINNER',
    "whyItMatters" TEXT NOT NULL,
    "learnUrl" TEXT,
    "notebook_lm_url" TEXT,
    "timeToLearn" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content"."master_notebooks" (
    "id" TEXT NOT NULL,
    "industrySlug" TEXT NOT NULL,
    "category" "content"."NotebookCategory" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "workspace_slug" TEXT,
    "workspace_created" BOOLEAN NOT NULL DEFAULT false,
    "grade_level" TEXT,
    "difficulty_level" TEXT,
    "sources_count" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "master_notebooks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content"."notebook_sources" (
    "id" TEXT NOT NULL,
    "notebook_id" TEXT NOT NULL,
    "type" "content"."SourceType" NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT,
    "file_path" TEXT,
    "metadata" JSONB,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notebook_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_activity"."notebook_access_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "notebook_id" TEXT NOT NULL,
    "accessed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notebook_access_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_activity"."notebook_chat_messages" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "notebook_id" TEXT NOT NULL,
    "workspace_slug" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notebook_chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_network"."parent_child_links" (
    "parent_id" TEXT NOT NULL,
    "child_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "parent_child_links_pkey" PRIMARY KEY ("parent_id","child_id")
);

-- CreateTable
CREATE TABLE "user_network"."teacher_notes" (
    "id" TEXT NOT NULL,
    "teacher_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "parent_id" TEXT,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "teacher_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_activity"."class_chats" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "channel" TEXT NOT NULL DEFAULT 'general',
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "class_chats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "app_auth"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_interests_user_id_field_name_key" ON "users"."user_interests"("user_id", "field_name");

-- CreateIndex
CREATE INDEX "feed_items_field_slug_idx" ON "catalog"."feed_items"("field_slug");

-- CreateIndex
CREATE INDEX "bookmarks_user_id_idx" ON "user_activity"."bookmarks"("user_id");

-- CreateIndex
CREATE INDEX "reading_history_user_id_idx" ON "user_activity"."reading_history"("user_id");

-- CreateIndex
CREATE INDEX "reading_history_last_read_at_idx" ON "user_activity"."reading_history"("last_read_at");

-- CreateIndex
CREATE UNIQUE INDEX "reading_history_user_id_feed_item_id_key" ON "user_activity"."reading_history"("user_id", "feed_item_id");

-- CreateIndex
CREATE INDEX "skill_progress_user_id_idx" ON "user_activity"."skill_progress"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "skill_progress_user_id_skill_id_key" ON "user_activity"."skill_progress"("user_id", "skill_id");

-- CreateIndex
CREATE INDEX "career_explored_user_id_idx" ON "user_activity"."career_explored"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "career_explored_user_id_career_job_id_key" ON "user_activity"."career_explored"("user_id", "career_job_id");

-- CreateIndex
CREATE INDEX "content_bookmarks_user_id_idx" ON "user_activity"."content_bookmarks"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "content_bookmarks_user_id_content_type_content_id_key" ON "user_activity"."content_bookmarks"("user_id", "content_type", "content_id");

-- CreateIndex
CREATE UNIQUE INDEX "Industry_name_key" ON "content"."Industry"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Industry_slug_key" ON "content"."Industry"("slug");

-- CreateIndex
CREATE INDEX "AIModel_industrySlug_idx" ON "content"."AIModel"("industrySlug");

-- CreateIndex
CREATE INDEX "AIAgent_industrySlug_idx" ON "content"."AIAgent"("industrySlug");

-- CreateIndex
CREATE INDEX "AIApp_industrySlug_idx" ON "content"."AIApp"("industrySlug");

-- CreateIndex
CREATE INDEX "PredefinedQuestion_industrySlug_idx" ON "content"."PredefinedQuestion"("industrySlug");

-- CreateIndex
CREATE UNIQUE INDEX "BasicsTopic_slug_key" ON "content"."BasicsTopic"("slug");

-- CreateIndex
CREATE INDEX "BasicsVideo_topicId_idx" ON "content"."BasicsVideo"("topicId");

-- CreateIndex
CREATE INDEX "BasicsArticle_topicId_idx" ON "content"."BasicsArticle"("topicId");

-- CreateIndex
CREATE INDEX "Guide_industrySlug_idx" ON "content"."Guide"("industrySlug");

-- CreateIndex
CREATE INDEX "PromptTemplate_industrySlug_idx" ON "content"."PromptTemplate"("industrySlug");

-- CreateIndex
CREATE INDEX "CareerPath_industrySlug_idx" ON "content"."CareerPath"("industrySlug");

-- CreateIndex
CREATE INDEX "CareerJob_careerPathId_idx" ON "content"."CareerJob"("careerPathId");

-- CreateIndex
CREATE INDEX "Skill_industrySlug_idx" ON "content"."Skill"("industrySlug");

-- CreateIndex
CREATE INDEX "master_notebooks_industrySlug_idx" ON "content"."master_notebooks"("industrySlug");

-- CreateIndex
CREATE INDEX "master_notebooks_published_idx" ON "content"."master_notebooks"("published");

-- CreateIndex
CREATE INDEX "master_notebooks_grade_level_idx" ON "content"."master_notebooks"("grade_level");

-- CreateIndex
CREATE INDEX "notebook_sources_notebook_id_idx" ON "content"."notebook_sources"("notebook_id");

-- CreateIndex
CREATE INDEX "notebook_access_logs_user_id_notebook_id_idx" ON "user_activity"."notebook_access_logs"("user_id", "notebook_id");

-- CreateIndex
CREATE INDEX "notebook_access_logs_user_id_accessed_at_idx" ON "user_activity"."notebook_access_logs"("user_id", "accessed_at");

-- CreateIndex
CREATE INDEX "notebook_chat_messages_user_id_notebook_id_idx" ON "user_activity"."notebook_chat_messages"("user_id", "notebook_id");

-- CreateIndex
CREATE INDEX "notebook_chat_messages_notebook_id_created_at_idx" ON "user_activity"."notebook_chat_messages"("notebook_id", "created_at");

-- CreateIndex
CREATE INDEX "teacher_notes_teacher_id_idx" ON "user_network"."teacher_notes"("teacher_id");

-- CreateIndex
CREATE INDEX "teacher_notes_student_id_idx" ON "user_network"."teacher_notes"("student_id");

-- CreateIndex
CREATE INDEX "teacher_notes_parent_id_idx" ON "user_network"."teacher_notes"("parent_id");

-- CreateIndex
CREATE INDEX "class_chats_channel_created_at_idx" ON "user_activity"."class_chats"("channel", "created_at");

-- AddForeignKey
ALTER TABLE "users"."profiles" ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users"."user_interests" ADD CONSTRAINT "user_interests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"."profiles"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_activity"."bookmarks" ADD CONSTRAINT "bookmarks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_activity"."bookmarks" ADD CONSTRAINT "bookmarks_feed_item_id_fkey" FOREIGN KEY ("feed_item_id") REFERENCES "catalog"."feed_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_activity"."reading_history" ADD CONSTRAINT "reading_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_activity"."reading_history" ADD CONSTRAINT "reading_history_feed_item_id_fkey" FOREIGN KEY ("feed_item_id") REFERENCES "catalog"."feed_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_activity"."skill_progress" ADD CONSTRAINT "skill_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_activity"."career_explored" ADD CONSTRAINT "career_explored_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_activity"."content_bookmarks" ADD CONSTRAINT "content_bookmarks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content"."AIModel" ADD CONSTRAINT "AIModel_industrySlug_fkey" FOREIGN KEY ("industrySlug") REFERENCES "content"."Industry"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content"."AIAgent" ADD CONSTRAINT "AIAgent_industrySlug_fkey" FOREIGN KEY ("industrySlug") REFERENCES "content"."Industry"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content"."AIApp" ADD CONSTRAINT "AIApp_industrySlug_fkey" FOREIGN KEY ("industrySlug") REFERENCES "content"."Industry"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content"."PredefinedQuestion" ADD CONSTRAINT "PredefinedQuestion_industrySlug_fkey" FOREIGN KEY ("industrySlug") REFERENCES "content"."Industry"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content"."BasicsVideo" ADD CONSTRAINT "BasicsVideo_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "content"."BasicsTopic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content"."BasicsArticle" ADD CONSTRAINT "BasicsArticle_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "content"."BasicsTopic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content"."Guide" ADD CONSTRAINT "Guide_industrySlug_fkey" FOREIGN KEY ("industrySlug") REFERENCES "content"."Industry"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content"."PromptTemplate" ADD CONSTRAINT "PromptTemplate_industrySlug_fkey" FOREIGN KEY ("industrySlug") REFERENCES "content"."Industry"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content"."CareerPath" ADD CONSTRAINT "CareerPath_industrySlug_fkey" FOREIGN KEY ("industrySlug") REFERENCES "content"."Industry"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content"."CareerJob" ADD CONSTRAINT "CareerJob_careerPathId_fkey" FOREIGN KEY ("careerPathId") REFERENCES "content"."CareerPath"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content"."Skill" ADD CONSTRAINT "Skill_industrySlug_fkey" FOREIGN KEY ("industrySlug") REFERENCES "content"."Industry"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content"."master_notebooks" ADD CONSTRAINT "master_notebooks_industrySlug_fkey" FOREIGN KEY ("industrySlug") REFERENCES "content"."Industry"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content"."notebook_sources" ADD CONSTRAINT "notebook_sources_notebook_id_fkey" FOREIGN KEY ("notebook_id") REFERENCES "content"."master_notebooks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_activity"."notebook_access_logs" ADD CONSTRAINT "notebook_access_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_activity"."notebook_access_logs" ADD CONSTRAINT "notebook_access_logs_notebook_id_fkey" FOREIGN KEY ("notebook_id") REFERENCES "content"."master_notebooks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_activity"."notebook_chat_messages" ADD CONSTRAINT "notebook_chat_messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_activity"."notebook_chat_messages" ADD CONSTRAINT "notebook_chat_messages_notebook_id_fkey" FOREIGN KEY ("notebook_id") REFERENCES "content"."master_notebooks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_network"."parent_child_links" ADD CONSTRAINT "parent_child_links_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "app_auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_network"."parent_child_links" ADD CONSTRAINT "parent_child_links_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "app_auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_network"."teacher_notes" ADD CONSTRAINT "teacher_notes_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "app_auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_network"."teacher_notes" ADD CONSTRAINT "teacher_notes_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "app_auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_network"."teacher_notes" ADD CONSTRAINT "teacher_notes_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "app_auth"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_activity"."class_chats" ADD CONSTRAINT "class_chats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- ═══════════════════════════════════════════════════════════════════════
-- SUPABASE AUTH TRIGGER: Auto-create user + profile on signup
-- ═══════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO "app_auth"."users" (
    "id", "email", "full_name", "role", "created_at", "updated_at"
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'STUDENT')::"app_auth"."UserRole",
    NOW(),
    NOW()
  );

  INSERT INTO "users"."profiles" (
    "user_id", "grade_level", "onboarding_completed", "preferences", "updated_at"
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'gradeLevel', NULL),
    false,
    '{"theme": "emerald", "notifications": {"email": true, "push": false}}'::jsonb,
    NOW()
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ═══════════════════════════════════════════════════════════════════════
-- SEED: Industries
-- ═══════════════════════════════════════════════════════════════════════

INSERT INTO "content"."Industry" ("id", "name", "slug", "description", "icon", "color", "gradient", "isActive", "sortOrder", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(), 'Healthcare & Medicine', 'healthcare', 'AI transforming diagnostics, drug discovery, patient care, and medical research', '🏥', '#10B981', 'from-emerald-500 to-teal-600', true, 1, NOW(), NOW()),
  (gen_random_uuid(), 'Finance & Banking', 'finance', 'AI revolutionizing fraud detection, algorithmic trading, risk assessment, and personal finance', '💰', '#3B82F6', 'from-blue-500 to-indigo-600', true, 2, NOW(), NOW()),
  (gen_random_uuid(), 'Education & Learning', 'education', 'AI personalizing education, automating grading, and creating adaptive learning experiences', '📚', '#8B5CF6', 'from-violet-500 to-purple-600', true, 3, NOW(), NOW()),
  (gen_random_uuid(), 'Technology & Software', 'technology', 'AI advancing code generation, cybersecurity, cloud computing, and software development', '💻', '#06B6D4', 'from-cyan-500 to-blue-600', true, 4, NOW(), NOW()),
  (gen_random_uuid(), 'Creative Arts & Media', 'creative-arts', 'AI transforming content creation, music, film, gaming, and digital art', '🎨', '#EC4899', 'from-pink-500 to-rose-600', true, 5, NOW(), NOW()),
  (gen_random_uuid(), 'Manufacturing & Robotics', 'manufacturing', 'AI optimizing production lines, quality control, supply chains, and industrial automation', '🏭', '#F59E0B', 'from-amber-500 to-orange-600', true, 6, NOW(), NOW()),
  (gen_random_uuid(), 'Transportation & Logistics', 'transportation', 'AI powering autonomous vehicles, route optimization, and smart transportation systems', '🚗', '#EF4444', 'from-red-500 to-rose-600', true, 7, NOW(), NOW()),
  (gen_random_uuid(), 'Agriculture & Food', 'agriculture', 'AI improving crop yields, precision farming, food safety, and sustainable agriculture', '🌾', '#22C55E', 'from-green-500 to-emerald-600', true, 8, NOW(), NOW()),
  (gen_random_uuid(), 'Energy & Environment', 'energy', 'AI optimizing renewable energy, smart grids, climate modeling, and environmental monitoring', '⚡', '#14B8A6', 'from-teal-500 to-cyan-600', true, 9, NOW(), NOW()),
  (gen_random_uuid(), 'Legal & Compliance', 'legal', 'AI streamlining legal research, contract analysis, compliance monitoring, and case prediction', '⚖️', '#6366F1', 'from-indigo-500 to-violet-600', true, 10, NOW(), NOW()),
  (gen_random_uuid(), 'Retail & E-Commerce', 'retail', 'AI personalizing shopping experiences, inventory management, and customer service automation', '🛍️', '#F97316', 'from-orange-500 to-amber-600', true, 11, NOW(), NOW()),
  (gen_random_uuid(), 'Science & Research', 'science', 'AI accelerating scientific discovery, drug development, materials science, and space exploration', '🔬', '#A855F7', 'from-purple-500 to-indigo-600', true, 12, NOW(), NOW());
