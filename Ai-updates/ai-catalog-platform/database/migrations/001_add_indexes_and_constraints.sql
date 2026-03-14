-- Migration: Add missing indexes and constraints for production performance
-- Run against auth_db

-- Sessions: fast lookup by user and expiry cleanup
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON auth.sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON auth.sessions(expires_at) WHERE is_revoked = false;

-- Refresh tokens: fast lookup by user and expiry cleanup
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON auth.refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires_at ON auth.refresh_tokens(expires_at) WHERE is_revoked = false;

-- Auth tokens: expiry cleanup
CREATE INDEX IF NOT EXISTS idx_auth_tokens_user_id ON auth.auth_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_tokens_expires_at ON auth.auth_tokens(expires_at);

-- Access token blacklist: expiry cleanup
CREATE INDEX IF NOT EXISTS idx_atb_expires_at ON auth.access_token_blacklist(expires_at);

-- Bookmarks: user lookup
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON user_activity.bookmarks(user_id);

-- Reading history: user lookup, time-based queries
CREATE INDEX IF NOT EXISTS idx_reading_history_user_id ON user_activity.reading_history(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_history_last_read ON user_activity.reading_history(last_read_at DESC);

-- Skill progress: already has idx_skill_progress_user from migration 02
-- Career explored: already has idx_career_explored_user from migration 03

-- Role constraint on users table
DO $$ BEGIN
  ALTER TABLE auth.users ADD CONSTRAINT chk_users_role
    CHECK (role IN ('STUDENT', 'PARENT', 'TEACHER', 'ADMIN'));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
