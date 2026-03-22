-- Feed Interactions Tables

-- 1. Views / Impressions (High volume, decoupled)
CREATE TABLE IF NOT EXISTS catalog.impressions (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    item_type TEXT NOT NULL, -- TOOL, FEED_ITEM
    item_id UUID NOT NULL,
    ip_address INET,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Likes / Upvotes
CREATE TABLE IF NOT EXISTS catalog.interactions (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    item_type TEXT NOT NULL,
    item_id UUID NOT NULL,
    interaction_type TEXT NOT NULL, -- LIKE, SHARE, CLICK
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, item_type, item_id, interaction_type)
);

-- 3. Comments
CREATE TABLE IF NOT EXISTS catalog.comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    item_type TEXT NOT NULL,
    item_id UUID NOT NULL,
    parent_id UUID REFERENCES catalog.comments(id) ON DELETE CASCADE, -- Nesting
    content TEXT NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
