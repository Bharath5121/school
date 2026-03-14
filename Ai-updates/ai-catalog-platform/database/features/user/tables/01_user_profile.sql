-- User Profile Tables

-- 1. Profiles
CREATE TABLE IF NOT EXISTS users.profiles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    avatar_url TEXT,
    bio TEXT,
    preferences JSONB DEFAULT '{
        "theme": "emerald",
        "notifications": {
            "email": true,
            "push": false
        }
    }',
    grade_level TEXT,
    stream TEXT,
    parent_email TEXT,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    learning_style JSONB,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. User Interests (Career paths)
CREATE TABLE IF NOT EXISTS users.user_interests (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    field_name TEXT NOT NULL, -- MEDICINE, ENGINEERING, etc.
    interest_level INTEGER DEFAULT 5, -- 1-10
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, field_name)
);

-- 3. User Locations (Multiple locations support)
CREATE TABLE IF NOT EXISTS users.locations (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    label TEXT DEFAULT 'Primary', -- Home, School, etc.
    city TEXT,
    country TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
