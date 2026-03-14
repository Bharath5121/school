-- Notifications Schema

-- 1. Notification Templates
CREATE TABLE IF NOT EXISTS notification.templates (
    slug TEXT PRIMARY KEY,
    title_template TEXT NOT NULL,
    body_template TEXT NOT NULL,
    target_action TEXT, -- URL or deep link
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. User Notifications
CREATE TABLE IF NOT EXISTS notification.user_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    type TEXT NOT NULL, -- SYSTEM, TOOL_UPDATE, NEW_FEED_ITEM
    is_read BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Notification Preferences (Decoupled from Profile for high frequency updates)
CREATE TABLE IF NOT EXISTS notification.preferences (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email_enabled BOOLEAN DEFAULT TRUE,
    push_enabled BOOLEAN DEFAULT FALSE,
    digest_frequency TEXT DEFAULT 'DAILY', -- INSTANT, DAILY, WEEKLY
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
