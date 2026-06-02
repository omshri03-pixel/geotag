-- schema.sql
-- Run this script inside pgAdmin 4 Query Tool to set up your PostgreSQL Database.

-- 1. Create Users table (with default local user)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL DEFAULT 'Buzz Agency Admin',
    email VARCHAR(255) UNIQUE NOT NULL DEFAULT 'admin@buzzagency.com',
    plan VARCHAR(50) DEFAULT 'Agency',
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Insert the default local administrator account
INSERT INTO users (id, name, email, plan, role)
VALUES (1, 'Buzz Agency Admin', 'admin@buzzagency.com', 'Agency', 'superadmin')
ON CONFLICT (email) DO NOTHING;

-- 3. Create Projects table
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE DEFAULT 1,
    name VARCHAR(255) NOT NULL,
    client_name VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create Images log table for process tracking
CREATE TABLE IF NOT EXISTS images (
    id SERIAL PRIMARY KEY,
    project_id INT REFERENCES projects(id) ON DELETE CASCADE,
    original_filename VARCHAR(255) NOT NULL,
    output_filename VARCHAR(255),
    file_size INT,
    status VARCHAR(50) DEFAULT 'pending',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    business_name VARCHAR(255),
    keywords TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
