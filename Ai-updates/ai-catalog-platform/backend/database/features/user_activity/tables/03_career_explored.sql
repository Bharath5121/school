-- Career exploration tracking for students
-- Run inside auth_db

CREATE SCHEMA IF NOT EXISTS user_activity;

CREATE TABLE IF NOT EXISTS user_activity.career_explored (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    career_job_id TEXT NOT NULL,
    explored_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, career_job_id)
);

CREATE INDEX IF NOT EXISTS idx_career_explored_user ON user_activity.career_explored(user_id);
