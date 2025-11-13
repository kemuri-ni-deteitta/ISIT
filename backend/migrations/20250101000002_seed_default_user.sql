-- Create a default user for testing/development
-- Password hash is for "password123" (you should change this in production)
INSERT INTO users (id, email, password_hash, full_name, status)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'admin@isit.local',
    '$argon2id$v=19$m=65536,t=3,p=4$dummy$hash', -- Placeholder hash, replace with real hash when auth is implemented
    'System Administrator',
    'active'
)
ON CONFLICT (id) DO NOTHING;

