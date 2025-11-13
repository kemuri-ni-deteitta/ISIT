# ISIT — Operational Expenses Information System

Monorepo for backend (Rust/Axum) and frontend (React/TypeScript) with PostgreSQL and MinIO for local development.

## Prerequisites
- Docker + Docker Compose
- Rust (stable) and Node.js (optional for local dev outside Docker)

## Quickstart (Docker)
1. Build and start:
   - `docker compose up --build`
2. Open:
   - Frontend: http://localhost:5173
   - Backend health: http://localhost:8080/healthz
   - Postgres: localhost:5432 (user/pass/db: `isit`)
   - MinIO Console: http://localhost:9001 (admin/adminadmin)
   - MailHog UI: http://localhost:8025

## Local dev (without Docker)
Backend:
1. `cd backend`
2. `cp .env.example .env` (edit if needed)
3. `cargo run`
4. Backend will run on http://localhost:8080

Frontend:
1. `cd frontend`
2. `npm install`
3. `npm run dev`
4. Frontend will run on http://localhost:5173 with proxy to backend.

## Structure
```
/backend   - Axum service, health endpoint, Dockerfile
/frontend  - Vite React TS app, proxy to backend, Dockerfile
docker-compose.yml - Postgres, MinIO, MailHog, backend, frontend
```

## Next
- Add DB migrations and repositories
- Implement auth (JWT)
- Define OpenAPI spec and generate client


