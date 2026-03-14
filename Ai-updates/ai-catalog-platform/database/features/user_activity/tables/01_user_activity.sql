-- 02_user_activity.sql
-- Run inside auth_db

CREATE SCHEMA IF NOT EXISTS user_activity;

CREATE TABLE IF NOT EXISTS user_activity.bookmarks (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    feed_item_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, feed_item_id)
);

CREATE TABLE IF NOT EXISTS user_activity.reading_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    feed_item_id UUID NOT NULL,
    time_spent_seconds INT DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    last_read_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, feed_item_id)
);
