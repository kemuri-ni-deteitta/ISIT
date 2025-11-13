# PostgreSQL Access Commands

## Database Connection Info
- **Container name:** `isit_postgres`
- **Database:** `isit`
- **User:** `isit`
- **Password:** `isit`
- **Port:** `5432` (mapped to host)

---

## Method 1: Access via Docker Container (Recommended)

### Connect to PostgreSQL inside the container:

```bash
sudo docker exec -it isit_postgres psql -U isit -d isit
```

This will open an interactive psql session.

### Alternative (if container name is different):

```bash
sudo docker exec -it $(sudo docker ps -q -f name=postgres) psql -U isit -d isit
```

---

## Method 2: Access from Host (if psql client is installed)

### Install psql client (if not installed):

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install postgresql-client
```

**Fedora/RHEL:**
```bash
sudo dnf install postgresql
```

### Connect from host:

```bash
psql -h localhost -p 5432 -U isit -d isit
```

When prompted, enter password: `isit`

### Or with password in command (less secure):

```bash
PGPASSWORD=isit psql -h localhost -p 5432 -U isit -d isit
```

---

## Useful psql Commands

Once connected, you can use these commands:

### Check current database and user:
```sql
SELECT current_database(), current_user;
```

### List all tables:
```sql
\dt
```

### Describe expenses table:
```sql
\d expenses
```

### Check if new columns exist:
```sql
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'expenses'
AND column_name IN ('funding_source', 'performer');
```

### View all expenses:
```sql
SELECT id, category_id, amount, incurred_on, funding_source, performer
FROM expenses
ORDER BY incurred_on DESC
LIMIT 10;
```

### Check migration status:
```sql
SELECT * FROM _sqlx_migrations ORDER BY installed_on DESC;
```

### Exit psql:
```sql
\q
```

---

## Quick Commands Reference

### Start PostgreSQL (if not running):
```bash
cd /home/ivan/ISIT
sudo docker compose up -d postgres
```

### Check if PostgreSQL is running:
```bash
sudo docker compose ps postgres
```

### View PostgreSQL logs:
```bash
sudo docker compose logs postgres
```

### Stop PostgreSQL:
```bash
sudo docker compose stop postgres
```

### Restart PostgreSQL:
```bash
sudo docker compose restart postgres
```

---

## Example: Verify Migration Applied

```bash
# Connect to database
sudo docker exec -it isit_postgres psql -U isit -d isit

# Then run:
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'expenses'
AND column_name IN ('funding_source', 'performer');

# Should show:
# funding_source | character varying(50) | 'internal'::character varying
# performer      | character varying(255) | NULL
```

---

## Troubleshooting

### "container not found" error:
```bash
# Check if container is running
sudo docker ps | grep postgres

# If not running, start it:
sudo docker compose up -d postgres

# Wait a few seconds, then try again
```

### "connection refused" error:
```bash
# Check if port 5432 is available
sudo lsof -i :5432

# Check container logs
sudo docker compose logs postgres
```

### "password authentication failed":
- Make sure you're using the correct password: `isit`
- Check docker-compose.yml for the correct credentials

