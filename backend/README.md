# Backend - ISIT Expense Management System

Rust backend using Axum and PostgreSQL.

## Setup

### 1. Start PostgreSQL (via Docker)

```bash
cd /home/ivan/ISIT
sudo docker compose up -d postgres
```

Wait ~10 seconds for Postgres to initialize, then verify:
```bash
sudo docker compose ps postgres
```

### 2. Environment Variables

Create a `.env` file in the `backend/` directory (or set environment variables):

```bash
# Database connection
DATABASE_URL=postgres://isit:isit@localhost:5432/isit

# Server configuration  
SERVER_PORT=8080
ALLOWED_ORIGINS=http://localhost:5173

# Logging
RUST_LOG=info
```

**Database credentials** (from docker-compose.yml):
- User: `isit`
- Password: `isit`
- Database: `isit`
- Host: `localhost`
- Port: `5432`

### 3. Run the Backend

```bash
cd backend
source ~/.cargo/env
cargo run
```

Or with explicit environment variables:
```bash
cd backend
source ~/.cargo/env
DATABASE_URL=postgres://isit:isit@localhost:5432/isit RUST_LOG=info SERVER_PORT=8080 ALLOWED_ORIGINS=http://localhost:5173 cargo run
```

### 4. Verify

- Health check: `curl http://localhost:8080/healthz`
- Should return: `{"status":"ok","database":"ok"}`

## Troubleshooting

**"password authentication failed"**
- Make sure Postgres is running: `sudo docker compose ps postgres`
- If not running: `sudo docker compose up -d postgres`
- Wait 10-15 seconds for initialization
- If still failing, recreate the database:
  ```bash
  sudo docker compose down postgres
  sudo docker volume rm isit_pgdata
  sudo docker compose up -d postgres
  ```

**"connection refused"**
- Postgres container isn't running or not ready
- Check: `sudo docker compose logs postgres`

## Development

- Migrations: Automatically run on startup
- Migrations location: `migrations/`
- Database pool: Max 10 connections

