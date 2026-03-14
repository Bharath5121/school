-- ================================================================
-- Migration: Copy data from old microservice DBs to ai_catalog_db
-- Run each section independently so one failure doesn't block all
-- ================================================================

-- 1. Clear conflicting seeded data
DELETE FROM catalog.feed_items;
DELETE FROM content."Industry";

-- ----------------------------------------------------------------
-- 2. AUTH data (auth_db -> auth schema)
-- ----------------------------------------------------------------

-- 2a. Users
INSERT INTO auth.users (id, email, full_name, role, email_verified_at, failed_login_attempts, locked_until, deleted_at, created_at, updated_at)
SELECT id, email, name, role::text::auth."UserRole", "emailVerified", "failedLoginAttempts", "lockedUntil", "deletedAt", "createdAt", "updatedAt"
FROM dblink('dbname=auth_db', '
  SELECT id, email, name, role::text, "emailVerified", "failedLoginAttempts", "lockedUntil", "deletedAt", "createdAt", "updatedAt"
  FROM "User"
') AS t(id text, email text, name text, role text, "emailVerified" timestamp, "failedLoginAttempts" int, "lockedUntil" timestamp, "deletedAt" timestamp, "createdAt" timestamp, "updatedAt" timestamp)
ON CONFLICT (id) DO NOTHING;

-- 2b. User Secrets (password was in User table in old schema)
INSERT INTO auth.user_secrets (user_id, password_hash, recovery_codes, last_password_change, updated_at)
SELECT id, "passwordHash", '[]'::jsonb, "createdAt", "updatedAt"
FROM dblink('dbname=auth_db', '
  SELECT id, "passwordHash", "createdAt", "updatedAt"
  FROM "User"
') AS t(id text, "passwordHash" text, "createdAt" timestamp, "updatedAt" timestamp)
ON CONFLICT (user_id) DO NOTHING;

-- 2c. Sessions (use createdAt as fallback for updated_at)
INSERT INTO auth.sessions (id, user_id, user_agent, ip_address, is_revoked, expires_at, created_at, updated_at)
SELECT id, "userId", "userAgent", "ipAddress", "isRevoked",
  "expiresAt",
  "createdAt",
  COALESCE("updatedAt", "createdAt")
FROM dblink('dbname=auth_db', '
  SELECT id, "userId", "userAgent", "ipAddress", "isRevoked", "expiresAt", "createdAt", "updatedAt"
  FROM "Session"
') AS t(id text, "userId" text, "userAgent" text, "ipAddress" text, "isRevoked" boolean, "expiresAt" timestamp, "createdAt" timestamp, "updatedAt" timestamp)
ON CONFLICT (id) DO NOTHING;

-- 2d. Refresh Tokens
INSERT INTO auth.refresh_tokens (id, token, user_id, expires_at, revoked, created_at)
SELECT id, token, "userId", "expiresAt", "isRevoked", "createdAt"
FROM dblink('dbname=auth_db', '
  SELECT id, token, "userId", "expiresAt", "isRevoked", "createdAt"
  FROM "RefreshToken"
') AS t(id text, token text, "userId" text, "expiresAt" timestamp, "isRevoked" boolean, "createdAt" timestamp)
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------
-- 3. CONTENT data (home_db -> content schema)
-- ----------------------------------------------------------------

-- 3a. Industries
INSERT INTO content."Industry" (id, name, slug, description, icon, color, gradient, "isActive", "sortOrder", "createdAt")
SELECT id, name, slug, description, icon, color, gradient, "isActive", "sortOrder", "createdAt"
FROM dblink('dbname=home_db', '
  SELECT id, name, slug, description, icon, color, gradient, "isActive", "sortOrder", "createdAt"
  FROM "Industry"
') AS t(id text, name text, slug text, description text, icon text, color text, gradient text, "isActive" boolean, "sortOrder" int, "createdAt" timestamp)
ON CONFLICT (id) DO NOTHING;

-- 3b. AI Models
INSERT INTO content."AIModel" (id, name, "builtBy", description, "industrySlug", "isFree", "tryUrl", "careerImpact", "createdAt")
SELECT id, name, "builtBy", description, "industrySlug", "isFree", "tryUrl", "careerImpact", "createdAt"
FROM dblink('dbname=home_db', '
  SELECT id, name, "builtBy", description, "industrySlug", "isFree", "tryUrl", "careerImpact", "createdAt"
  FROM "AIModel"
') AS t(id text, name text, "builtBy" text, description text, "industrySlug" text, "isFree" boolean, "tryUrl" text, "careerImpact" text, "createdAt" timestamp)
ON CONFLICT (id) DO NOTHING;

-- 3c. AI Agents
INSERT INTO content."AIAgent" (id, name, "builtBy", description, "industrySlug", "isFree", "tryUrl", "useCases", "createdAt")
SELECT id, name, "builtBy", description, "industrySlug", "isFree", "tryUrl", "useCases", "createdAt"
FROM dblink('dbname=home_db', '
  SELECT id, name, "builtBy", description, "industrySlug", "isFree", "tryUrl", "useCases", "createdAt"
  FROM "AIAgent"
') AS t(id text, name text, "builtBy" text, description text, "industrySlug" text, "isFree" boolean, "tryUrl" text, "useCases" jsonb, "createdAt" timestamp)
ON CONFLICT (id) DO NOTHING;

-- 3d. News Items
INSERT INTO content."NewsItem" (id, title, summary, "sourceUrl", "industrySlug", "publishedAt", "createdAt")
SELECT id, title, summary, "sourceUrl", "industrySlug", "publishedAt", "createdAt"
FROM dblink('dbname=home_db', '
  SELECT id, title, summary, "sourceUrl", "industrySlug", "publishedAt", "createdAt"
  FROM "NewsItem"
') AS t(id text, title text, summary text, "sourceUrl" text, "industrySlug" text, "publishedAt" timestamp, "createdAt" timestamp)
ON CONFLICT (id) DO NOTHING;

-- 3e. AI Apps
INSERT INTO content."AIApp" (id, name, company, description, "industrySlug", "isFree", "appUrl", "targetAudience", "builtByRole", "createdAt")
SELECT id, name, company, description, "industrySlug", "isFree", "appUrl", "targetAudience", "builtByRole", "createdAt"
FROM dblink('dbname=home_db', '
  SELECT id, name, company, description, "industrySlug", "isFree", "appUrl", "targetAudience", "builtByRole", "createdAt"
  FROM "AIApp"
') AS t(id text, name text, company text, description text, "industrySlug" text, "isFree" boolean, "appUrl" text, "targetAudience" text, "builtByRole" text, "createdAt" timestamp)
ON CONFLICT (id) DO NOTHING;

-- 3f. Predefined Questions
INSERT INTO content."PredefinedQuestion" (id, question, answer, "industrySlug", "createdAt")
SELECT id, question, answer, "industrySlug", "createdAt"
FROM dblink('dbname=home_db', '
  SELECT id, question, answer, "industrySlug", "createdAt"
  FROM "PredefinedQuestion"
') AS t(id text, question text, answer text, "industrySlug" text, "createdAt" timestamp)
ON CONFLICT (id) DO NOTHING;

-- 3g. Basics Topics
INSERT INTO content."BasicsTopic" (id, title, slug, description, "industrySlug", "sortOrder", "createdAt")
SELECT id, title, slug, description, "industrySlug", "sortOrder", "createdAt"
FROM dblink('dbname=home_db', '
  SELECT id, title, slug, description, "industrySlug", "sortOrder", "createdAt"
  FROM "BasicsTopic"
') AS t(id text, title text, slug text, description text, "industrySlug" text, "sortOrder" int, "createdAt" timestamp)
ON CONFLICT (id) DO NOTHING;

-- 3h. Basics Videos
INSERT INTO content."BasicsVideo" (id, title, "videoUrl", "thumbnailUrl", "durationSec", "topicId", "sortOrder", "createdAt")
SELECT id, title, "videoUrl", "thumbnailUrl", "durationSec", "topicId", "sortOrder", "createdAt"
FROM dblink('dbname=home_db', '
  SELECT id, title, "videoUrl", "thumbnailUrl", "durationSec", "topicId", "sortOrder", "createdAt"
  FROM "BasicsVideo"
') AS t(id text, title text, "videoUrl" text, "thumbnailUrl" text, "durationSec" int, "topicId" text, "sortOrder" int, "createdAt" timestamp)
ON CONFLICT (id) DO NOTHING;

-- 3i. Basics Articles
INSERT INTO content."BasicsArticle" (id, title, body, "readTimeMins", "topicId", "sortOrder", "createdAt")
SELECT id, title, body, "readTimeMins", "topicId", "sortOrder", "createdAt"
FROM dblink('dbname=home_db', '
  SELECT id, title, body, "readTimeMins", "topicId", "sortOrder", "createdAt"
  FROM "BasicsArticle"
') AS t(id text, title text, body text, "readTimeMins" int, "topicId" text, "sortOrder" int, "createdAt" timestamp)
ON CONFLICT (id) DO NOTHING;

-- 3j. Guides
INSERT INTO content."Guide" (id, title, slug, difficulty, "timeRequired", "toolsNeeded", description, steps, "industrySlug", "createdAt")
SELECT id, title, slug, difficulty::text::content."GuideDifficulty", "timeRequired", "toolsNeeded", description, steps, "industrySlug", "createdAt"
FROM dblink('dbname=home_db', '
  SELECT id, title, slug, difficulty::text, "timeRequired", "toolsNeeded", description, steps, "industrySlug", "createdAt"
  FROM "Guide"
') AS t(id text, title text, slug text, difficulty text, "timeRequired" text, "toolsNeeded" text[], description text, steps jsonb, "industrySlug" text, "createdAt" timestamp)
ON CONFLICT (id) DO NOTHING;

-- 3k. Prompt Templates
INSERT INTO content."PromptTemplate" (id, title, prompt, "useCase", "industrySlug", "createdAt")
SELECT id, title, prompt, "useCase", "industrySlug", "createdAt"
FROM dblink('dbname=home_db', '
  SELECT id, title, prompt, "useCase", "industrySlug", "createdAt"
  FROM "PromptTemplate"
') AS t(id text, title text, prompt text, "useCase" text, "industrySlug" text, "createdAt" timestamp)
ON CONFLICT (id) DO NOTHING;

-- 3l. Career Paths
INSERT INTO content."CareerPath" (id, title, description, "aiImpactSummary", "industrySlug", "createdAt")
SELECT id, title, description, "aiImpactSummary", "industrySlug", "createdAt"
FROM dblink('dbname=home_db', '
  SELECT id, title, description, "aiImpactSummary", "industrySlug", "createdAt"
  FROM "CareerPath"
') AS t(id text, title text, description text, "aiImpactSummary" text, "industrySlug" text, "createdAt" timestamp)
ON CONFLICT (id) DO NOTHING;

-- 3m. Career Jobs
INSERT INTO content."CareerJob" (id, title, "salaryRangeMin", "salaryRangeMax", currency, demand, "requiredDegree", "requiredSkills", "futureSkills", "howAiChanges", timeline, "careerPathId", "createdAt")
SELECT id, title, "salaryRangeMin", "salaryRangeMax", currency, demand::text::content."JobDemand", "requiredDegree", "requiredSkills", "futureSkills", "howAiChanges", timeline::text::content."JobTimeline", "careerPathId", "createdAt"
FROM dblink('dbname=home_db', '
  SELECT id, title, "salaryRangeMin", "salaryRangeMax", currency, demand::text, "requiredDegree", "requiredSkills", "futureSkills", "howAiChanges", timeline::text, "careerPathId", "createdAt"
  FROM "CareerJob"
') AS t(id text, title text, "salaryRangeMin" int, "salaryRangeMax" int, currency text, demand text, "requiredDegree" text, "requiredSkills" text[], "futureSkills" text[], "howAiChanges" text, timeline text, "careerPathId" text, "createdAt" timestamp)
ON CONFLICT (id) DO NOTHING;

-- 3n. Skills
INSERT INTO content."Skill" (id, name, description, level, "whyItMatters", "learnUrl", "timeToLearn", category, "industrySlug", "createdAt")
SELECT id, name, description, level::text::content."SkillLevel", "whyItMatters", "learnUrl", "timeToLearn", category, "industrySlug", "createdAt"
FROM dblink('dbname=home_db', '
  SELECT id, name, description, level::text, "whyItMatters", "learnUrl", "timeToLearn", category, "industrySlug", "createdAt"
  FROM "Skill"
') AS t(id text, name text, description text, level text, "whyItMatters" text, "learnUrl" text, "timeToLearn" text, category text, "industrySlug" text, "createdAt" timestamp)
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------
-- 4. FEED data (feed_db -> catalog schema)
-- ----------------------------------------------------------------
INSERT INTO catalog.feed_items (id, title, content, content_type, target_role, field_slug, summary, views, metadata, published_at, created_at, updated_at)
SELECT
  id, title, content,
  (CASE type
    WHEN 'NEWS' THEN 'ADVANCEMENT'
    WHEN 'TOOL' THEN 'PRODUCT'
    WHEN 'GUIDE' THEN 'GUIDE'
    WHEN 'MODEL' THEN 'MODEL'
    ELSE 'ADVANCEMENT'
  END)::catalog."FeedContentType",
  'STUDENT'::auth."UserRole",
  (CASE field
    WHEN 'MEDICINE' THEN 'medicine'
    WHEN 'ENGINEERING' THEN 'engineering'
    WHEN 'ART' THEN 'art-design'
    WHEN 'LAW' THEN 'law'
    WHEN 'GAMING' THEN 'gaming'
    WHEN 'BUSINESS' THEN 'business-finance'
    WHEN 'SCIENCE' THEN 'science'
    ELSE 'science'
  END),
  summary, views,
  jsonb_build_object('source', source, 'url', url),
  "createdAt", "createdAt", "updatedAt"
FROM dblink('dbname=feed_db', '
  SELECT id, title, content, type::text, field::text, summary, source, url, views, "createdAt", "updatedAt"
  FROM "FeedItem"
') AS t(id text, title text, content text, type text, field text, summary text, source text, url text, views int, "createdAt" timestamp, "updatedAt" timestamp)
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------
-- 5. Verify counts
-- ----------------------------------------------------------------
SELECT 'auth.users' as tbl, count(*) FROM auth.users
UNION ALL SELECT 'auth.user_secrets', count(*) FROM auth.user_secrets
UNION ALL SELECT 'auth.sessions', count(*) FROM auth.sessions
UNION ALL SELECT 'auth.refresh_tokens', count(*) FROM auth.refresh_tokens
UNION ALL SELECT 'content.Industry', count(*) FROM content."Industry"
UNION ALL SELECT 'content.AIModel', count(*) FROM content."AIModel"
UNION ALL SELECT 'content.AIAgent', count(*) FROM content."AIAgent"
UNION ALL SELECT 'content.NewsItem', count(*) FROM content."NewsItem"
UNION ALL SELECT 'content.AIApp', count(*) FROM content."AIApp"
UNION ALL SELECT 'content.PredefinedQuestion', count(*) FROM content."PredefinedQuestion"
UNION ALL SELECT 'content.BasicsTopic', count(*) FROM content."BasicsTopic"
UNION ALL SELECT 'content.BasicsVideo', count(*) FROM content."BasicsVideo"
UNION ALL SELECT 'content.BasicsArticle', count(*) FROM content."BasicsArticle"
UNION ALL SELECT 'content.Guide', count(*) FROM content."Guide"
UNION ALL SELECT 'content.PromptTemplate', count(*) FROM content."PromptTemplate"
UNION ALL SELECT 'content.CareerPath', count(*) FROM content."CareerPath"
UNION ALL SELECT 'content.CareerJob', count(*) FROM content."CareerJob"
UNION ALL SELECT 'content.Skill', count(*) FROM content."Skill"
UNION ALL SELECT 'catalog.feed_items', count(*) FROM catalog.feed_items
ORDER BY tbl;
