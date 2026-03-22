-- Add BasicsChapter table
CREATE TABLE IF NOT EXISTS "content"."BasicsChapter" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BasicsChapter_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "BasicsChapter_slug_key" ON "content"."BasicsChapter"("slug");

-- Add chapterId, difficulty, xp columns to BasicsTopic
ALTER TABLE "content"."BasicsTopic" ADD COLUMN IF NOT EXISTS "chapterId" TEXT;
ALTER TABLE "content"."BasicsTopic" ADD COLUMN IF NOT EXISTS "difficulty" TEXT NOT NULL DEFAULT 'beginner';
ALTER TABLE "content"."BasicsTopic" ADD COLUMN IF NOT EXISTS "xp" INTEGER NOT NULL DEFAULT 40;

-- FK and index
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'BasicsTopic_chapterId_fkey'
  ) THEN
    ALTER TABLE "content"."BasicsTopic"
      ADD CONSTRAINT "BasicsTopic_chapterId_fkey"
      FOREIGN KEY ("chapterId") REFERENCES "content"."BasicsChapter"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "BasicsTopic_chapterId_idx" ON "content"."BasicsTopic"("chapterId");
