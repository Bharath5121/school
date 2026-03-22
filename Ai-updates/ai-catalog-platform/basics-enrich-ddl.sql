-- ═══════════════════════════════════════════════════════════════════════
-- Enrich BasicsTopic with discovery-like fields + new link/chat tables
-- ═══════════════════════════════════════════════════════════════════════

-- 1. Add new columns to BasicsTopic
ALTER TABLE "content"."BasicsTopic"
  ADD COLUMN IF NOT EXISTS "videoUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "videoTitle" TEXT,
  ADD COLUMN IF NOT EXISTS "notebookLmUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "notebookDescription" TEXT,
  ADD COLUMN IF NOT EXISTS "architectureDescription" TEXT,
  ADD COLUMN IF NOT EXISTS "architectureDiagramUrl" TEXT;

-- 2. Create BasicsLinkType enum
DO $$ BEGIN
  CREATE TYPE "content"."BasicsLinkType" AS ENUM ('MODEL', 'AGENT', 'APP');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 3. Create BasicsTopicLink table
CREATE TABLE IF NOT EXISTS "content"."BasicsTopicLink" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "topicId" TEXT NOT NULL,
  "type" "content"."BasicsLinkType" NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "redirectUrl" TEXT,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "BasicsTopicLink_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "BasicsTopicLink_topicId_fkey"
    FOREIGN KEY ("topicId") REFERENCES "content"."BasicsTopic"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "BasicsTopicLink_topicId_idx" ON "content"."BasicsTopicLink"("topicId");

-- 4. Create BasicsTopicChatMsg table
CREATE TABLE IF NOT EXISTS "content"."BasicsTopicChatMsg" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "topicId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "response" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "BasicsTopicChatMsg_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "BasicsTopicChatMsg_topicId_fkey"
    FOREIGN KEY ("topicId") REFERENCES "content"."BasicsTopic"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "BasicsTopicChatMsg_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "app_auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "BasicsTopicChatMsg_topicId_createdAt_idx" ON "content"."BasicsTopicChatMsg"("topicId", "createdAt");
CREATE INDEX IF NOT EXISTS "BasicsTopicChatMsg_userId_idx" ON "content"."BasicsTopicChatMsg"("userId");
