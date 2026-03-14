-- Skill progress tracking for students
-- Run inside auth_db

CREATE SCHEMA IF NOT EXISTS user_activity;

DO $$ BEGIN
    CREATE TYPE user_activity."SkillStatus" AS ENUM ('NOT_STARTED', 'EXPLORING', 'LEARNED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS user_activity.skill_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    skill_id TEXT NOT NULL,
    status user_activity."SkillStatus" DEFAULT 'NOT_STARTED',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, skill_id)
);

CREATE INDEX IF NOT EXISTS idx_skill_progress_user ON user_activity.skill_progress(user_id);
