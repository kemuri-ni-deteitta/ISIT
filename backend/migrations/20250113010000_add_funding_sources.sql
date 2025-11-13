-- Funding sources reference
CREATE TABLE IF NOT EXISTS funding_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_funding_sources_active ON funding_sources(active);
CREATE INDEX IF NOT EXISTS idx_funding_sources_code ON funding_sources(code);

-- Seed a default source if not exists
INSERT INTO funding_sources (code, name, active)
VALUES ('internal', 'Внутренний бюджет', true)
ON CONFLICT (code) DO NOTHING;


