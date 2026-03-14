-- Consolidated database initialization
-- Single database: ai_catalog_db with multiple schemas

\c ai_catalog_db

CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS users;
CREATE SCHEMA IF NOT EXISTS catalog;
CREATE SCHEMA IF NOT EXISTS user_activity;
CREATE SCHEMA IF NOT EXISTS content;
