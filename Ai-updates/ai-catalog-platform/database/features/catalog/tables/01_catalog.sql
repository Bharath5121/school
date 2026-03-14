-- Catalog and Feed Tables

-- 1. Categories
CREATE TABLE IF NOT EXISTS catalog.categories (
    slug TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. AI Tools / Resources
CREATE TABLE IF NOT EXISTS catalog.tools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    url TEXT,
    category_slug TEXT REFERENCES catalog.categories(slug) ON DELETE SET NULL,
    tags TEXT[] DEFAULT '{}',
    thumbnail_url TEXT,
    is_trending BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3,2) DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Feed Items (Tailored for users)
DO $$ BEGIN
    CREATE TYPE catalog.content_type AS ENUM ('MODEL', 'ADVANCEMENT', 'AGENT', 'PRODUCT', 'LEARNING', 'CAREER', 'GUIDE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS catalog.feed_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT,
    summary TEXT, -- 3-line plain English summary
    content_type catalog.content_type NOT NULL,
    target_role auth."UserRole" DEFAULT 'STUDENT',
    field_slug TEXT REFERENCES catalog.categories(slug) ON DELETE CASCADE,
    career_impact_score INTEGER CHECK (career_impact_score BETWEEN 0 AND 10),
    career_impact_text TEXT,
    metadata JSONB DEFAULT '{}',
    published_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. User Bookmarks
CREATE TABLE IF NOT EXISTS catalog.bookmarks (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tool_id UUID REFERENCES catalog.tools(id) ON DELETE CASCADE,
    feed_item_id UUID REFERENCES catalog.feed_items(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT one_target_check CHECK (
        (tool_id IS NOT NULL AND feed_item_id IS NULL) OR
        (tool_id IS NULL AND feed_item_id IS NOT NULL)
    ),
    UNIQUE (user_id, tool_id),
    UNIQUE (user_id, feed_item_id)
);
