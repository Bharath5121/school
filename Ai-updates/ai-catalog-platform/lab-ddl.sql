-- ═══════════════════════════════════════════════════════════════════════
-- AI Lab DDL
-- ═══════════════════════════════════════════════════════════════════════

DO $$ BEGIN
  CREATE TYPE "content"."LabItemType" AS ENUM ('MODEL', 'APP');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "content"."LabCategory" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "icon" TEXT,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "isPublished" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "LabCategory_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "LabCategory_slug_key" ON "content"."LabCategory"("slug");

CREATE TABLE IF NOT EXISTS "content"."LabItem" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "tagline" TEXT,
  "description" TEXT,
  "icon" TEXT,
  "provider" TEXT,
  "type" "content"."LabItemType" NOT NULL,
  "useCases" TEXT[] DEFAULT '{}',
  "features" TEXT[] DEFAULT '{}',
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "isPublished" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "categoryId" TEXT NOT NULL,
  CONSTRAINT "LabItem_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "LabItem_categoryId_fkey"
    FOREIGN KEY ("categoryId") REFERENCES "content"."LabCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "LabItem_slug_key" ON "content"."LabItem"("slug");
CREATE INDEX IF NOT EXISTS "LabItem_categoryId_idx" ON "content"."LabItem"("categoryId");
CREATE INDEX IF NOT EXISTS "LabItem_type_idx" ON "content"."LabItem"("type");

CREATE TABLE IF NOT EXISTS "content"."LabItemChatMsg" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "itemId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "response" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "LabItemChatMsg_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "LabItemChatMsg_itemId_fkey"
    FOREIGN KEY ("itemId") REFERENCES "content"."LabItem"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "LabItemChatMsg_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "app_auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "LabItemChatMsg_itemId_createdAt_idx" ON "content"."LabItemChatMsg"("itemId", "createdAt");
CREATE INDEX IF NOT EXISTS "LabItemChatMsg_userId_idx" ON "content"."LabItemChatMsg"("userId");
