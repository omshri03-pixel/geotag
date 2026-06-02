-- ============================================================
--  GEO TAGGER BUZZ E — Supabase / PostgreSQL Schema
--  Run this in: Supabase Dashboard → SQL Editor → New Query
--  Or use psql / pgAdmin with your SUPABASE_DB_URL
-- ============================================================

-- 1. USERS table
CREATE TABLE IF NOT EXISTS users (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(255) NOT NULL DEFAULT 'Buzz Agency Admin',
    email      VARCHAR(255) UNIQUE NOT NULL,
    plan       VARCHAR(50)  DEFAULT 'Free',        -- Free | Pro | Agency
    role       VARCHAR(50)  DEFAULT 'user',         -- user | admin | superadmin
    created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- Seed default superadmin account
INSERT INTO users (id, name, email, plan, role)
VALUES (1, 'Buzz Agency Admin', 'admin@buzzagency.com', 'Agency', 'superadmin')
ON CONFLICT (email) DO NOTHING;


-- 2. PROJECTS table
CREATE TABLE IF NOT EXISTS projects (
    id          SERIAL PRIMARY KEY,
    user_id     INT          REFERENCES users(id) ON DELETE CASCADE DEFAULT 1,
    name        VARCHAR(255) NOT NULL,
    client_name VARCHAR(255),
    notes       TEXT,
    created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);


-- 3. IMAGES log table
CREATE TABLE IF NOT EXISTS images (
    id                SERIAL PRIMARY KEY,
    project_id        INT            REFERENCES projects(id) ON DELETE CASCADE,
    original_filename VARCHAR(255)   NOT NULL,
    output_filename   VARCHAR(255),
    file_size         INT,
    status            VARCHAR(50)    DEFAULT 'pending',   -- pending | success | failed
    latitude          DECIMAL(10, 8),
    longitude         DECIMAL(11, 8),
    business_name     VARCHAR(255),
    keywords          TEXT,
    created_at        TIMESTAMP      DEFAULT CURRENT_TIMESTAMP
);


-- 4. SAVED LOCATIONS (preset shortcuts) table
CREATE TABLE IF NOT EXISTS saved_locations (
    id         SERIAL PRIMARY KEY,
    user_id    INT            REFERENCES users(id) ON DELETE CASCADE DEFAULT 1,
    name       VARCHAR(255)   NOT NULL,
    lat        DECIMAL(10, 8) NOT NULL,
    lng        DECIMAL(11, 8) NOT NULL,
    city       VARCHAR(255)   DEFAULT '',
    created_at TIMESTAMP      DEFAULT CURRENT_TIMESTAMP
);


-- ─── Indexes for performance ───────────────────────────────
CREATE INDEX IF NOT EXISTS idx_images_project_id   ON images(project_id);
CREATE INDEX IF NOT EXISTS idx_images_status        ON images(status);
CREATE INDEX IF NOT EXISTS idx_projects_user_id     ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_locations_user ON saved_locations(user_id);


-- ─── Row Level Security (Supabase RLS) ────────────────────
-- Enable RLS on all tables (best practice on Supabase)
ALTER TABLE users           ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects        ENABLE ROW LEVEL SECURITY;
ALTER TABLE images          ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_locations ENABLE ROW LEVEL SECURITY;

-- Allow full access via service_role key (used server-side via DATABASE_URL)
-- These policies allow the Next.js API routes (which use the service role connection) 
-- to read/write all rows without restriction.
CREATE POLICY "service_role full access on users"
    ON users FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "service_role full access on projects"
    ON projects FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "service_role full access on images"
    ON images FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "service_role full access on saved_locations"
    ON saved_locations FOR ALL USING (true) WITH CHECK (true);
