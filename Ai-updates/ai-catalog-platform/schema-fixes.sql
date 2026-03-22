-- Schema hardening fixes: timestamps on link tables, missing indexes

-- Add createdAt to DiscoveryLink
ALTER TABLE catalog.discovery_links
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- Add createdAt to BasicsTopicLink
ALTER TABLE content."BasicsTopicLink"
  ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now();

-- Add index on ClassChat.userId
CREATE INDEX CONCURRENTLY IF NOT EXISTS class_chats_user_id_idx
  ON user_activity.class_chats (user_id);

-- Add index on Bookmark.feedItemId
CREATE INDEX CONCURRENTLY IF NOT EXISTS bookmarks_feed_item_id_idx
  ON user_activity.bookmarks (feed_item_id);
