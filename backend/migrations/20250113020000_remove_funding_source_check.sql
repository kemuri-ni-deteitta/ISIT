-- Remove the old CHECK constraint on funding_source
-- We now use the funding_sources table for dynamic values

-- Drop all CHECK constraints on funding_source column
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT conname
        FROM pg_constraint
        WHERE conrelid = 'expenses'::regclass
        AND contype = 'c'
        AND conname LIKE '%funding%'
    ) LOOP
        EXECUTE 'ALTER TABLE expenses DROP CONSTRAINT IF EXISTS ' || quote_ident(r.conname);
    END LOOP;
END $$;

