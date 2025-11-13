-- Add funding_source and performer fields to expenses table

ALTER TABLE expenses
ADD COLUMN IF NOT EXISTS funding_source VARCHAR(50) DEFAULT 'internal' CHECK (funding_source IN ('internal', 'external', 'grant', 'other')),
ADD COLUMN IF NOT EXISTS performer VARCHAR(255);

-- Update existing records to have default funding_source
UPDATE expenses SET funding_source = 'internal' WHERE funding_source IS NULL;

-- Add index for funding_source for filtering
CREATE INDEX IF NOT EXISTS idx_expenses_funding_source ON expenses(funding_source);

-- Add index for performer for searching
CREATE INDEX IF NOT EXISTS idx_expenses_performer ON expenses(performer);

