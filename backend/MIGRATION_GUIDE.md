# Database Migration Guide

## New Fields Added to Expenses Table

We've added two new fields to match the expense creation form:

1. **`funding_source`** (Источник финансирования)
   - Type: VARCHAR(50)
   - Default: 'internal'
   - Values: 'internal', 'external', 'grant', 'other'
   - Indexed for filtering

2. **`performer`** (Исполнитель)
   - Type: VARCHAR(255)
   - Optional field for storing performer/executor information
   - Indexed for searching

## How to Apply the Migration

The migration will run automatically when you start the backend, as migrations are executed on startup.

### Manual Application (if needed)

If you need to apply the migration manually:

```bash
cd /home/ivan/ISIT/backend

# Connect to PostgreSQL
psql -h localhost -U isit -d isit

# Or use the migration file directly
psql -h localhost -U isit -d isit < migrations/20250113000000_add_expense_fields.sql
```

### Verify Migration

After starting the backend, verify the migration was applied:

```sql
-- Check if columns exist
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'expenses'
AND column_name IN ('funding_source', 'performer');

-- Check indexes
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'expenses'
AND indexname LIKE '%funding_source%' OR indexname LIKE '%performer%';
```

## What Changed

### Backend Changes
- ✅ Added `funding_source` and `performer` fields to `Expense` struct
- ✅ Updated `CreateExpenseRequest` to accept new fields
- ✅ Updated `UpdateExpenseRequest` to accept new fields
- ✅ Updated repository methods (create, get_by_id, list, update) to handle new fields

### Frontend Changes
- ✅ Updated `Expense` TypeScript interface
- ✅ Updated `CreateExpenseRequest` TypeScript interface
- ✅ Updated `ExpenseDialog` to send `funding_source` and `performer`
- ✅ Updated `ExpenseList` to display `performer` and `funding_source`

## Testing

After applying the migration:

1. **Start the backend:**
   ```bash
   cd /home/ivan/ISIT/backend
   cargo run
   ```

2. **Start the frontend:**
   ```bash
   cd /home/ivan/ISIT/frontend
   npm run dev
   ```

3. **Test expense creation:**
   - Go to http://localhost:3000/expenses
   - Click "Новая запись"
   - Fill in all fields including:
     - Тип затрат (Expense type)
     - Сумма расхода (Amount)
     - Исполнитель (Performer)
     - Дата (Date)
     - Источник финансирования (Funding source)
     - Подразделение (Department)
   - Click "Подтвердить"
   - Verify the expense appears in the list with all fields

## Rollback (if needed)

If you need to rollback the migration:

```sql
ALTER TABLE expenses
DROP COLUMN IF EXISTS funding_source,
DROP COLUMN IF EXISTS performer;

DROP INDEX IF EXISTS idx_expenses_funding_source;
DROP INDEX IF EXISTS idx_expenses_performer;
```

