# 🚀 Startup Guide - ISIT Expense Management System

## Prerequisites

1. **PostgreSQL** must be running (via Docker)
2. **Backend** (Rust) must be running on port 8080
3. **Frontend** (Next.js) must be running on port 3000

---

## Step 1: Start PostgreSQL Database

```bash
cd /home/ivan/ISIT
sudo docker compose up -d postgres
```

Wait 10-15 seconds for PostgreSQL to initialize, then verify:
```bash
sudo docker compose ps postgres
```

---

## Step 2: Start Backend (Rust)

**IMPORTANT:** Make sure you're in the correct directory!

```bash
cd /home/ivan/ISIT/backend
```

Create/check `.env` file:
```bash
cat > .env << EOF
DATABASE_URL=postgres://isit:isit@localhost:5432/isit
SERVER_PORT=8080
ALLOWED_ORIGINS=http://localhost:3000
RUST_LOG=info
EOF
```

Start the backend:
```bash
cargo run
```

**Verify backend is running:**
- Open another terminal and run: `curl http://localhost:8080/healthz`
- Should return: `{"status":"ok","database":"ok"}`

---

## Step 3: Start Frontend (Next.js)

**IMPORTANT:** Make sure you're using the NEW frontend folder, NOT the old one!

```bash
cd /home/ivan/ISIT/frontend
```

Set environment variable and start:
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080 npm run dev
```

**Or create a `.env.local` file:**
```bash
echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:8080" > .env.local
npm run dev
```

---

## Step 4: Access the Application

Open your browser and go to:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080/healthz

---

## ⚠️ Troubleshooting

### Problem: "Port 3000 already in use"
**Solution:** Kill all frontend processes:
```bash
pkill -f "next dev"
pkill -f "vite"
```

### Problem: "Port 8080 already in use"
**Solution:** Kill the backend process:
```bash
pkill -f "cargo run"
# Or find the process:
ps aux | grep backend
kill <PID>
```

### Problem: "Can't connect to database"
**Solution:** 
1. Check PostgreSQL is running: `sudo docker compose ps postgres`
2. If not running: `sudo docker compose up -d postgres`
3. Wait 10-15 seconds for initialization

### Problem: "Still seeing old frontend"
**Solution:**
1. **STOP ALL frontend processes:**
   ```bash
   pkill -f "next dev"
   pkill -f "vite"
   ```

2. **Verify you're in the correct directory:**
   ```bash
   pwd
   # Should show: /home/ivan/ISIT/frontend
   # NOT: /home/ivan/ISIT/CostCenter-frontend
   # NOT: /home/ivan/ISIT/frontend_old_*
   ```

3. **Clear browser cache** (Ctrl+Shift+R or Cmd+Shift+R)

4. **Start ONLY the new frontend:**
   ```bash
   cd /home/ivan/ISIT/frontend
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8080 npm run dev
   ```

---

## 📁 Directory Structure

```
/home/ivan/ISIT/
├── backend/              ← Rust backend (port 8080)
├── frontend/              ← NEW Next.js frontend (port 3000) ✅ USE THIS
├── CostCenter-frontend/  ← OLD template (DO NOT USE)
└── frontend_old_*/       ← OLD Vite frontend (DO NOT USE)
```

---

## ✅ Quick Start (All Services)

Run these commands in separate terminals:

**Terminal 1 - PostgreSQL:**
```bash
cd /home/ivan/ISIT
sudo docker compose up -d postgres
```

**Terminal 2 - Backend:**
```bash
cd /home/ivan/ISIT/backend
cargo run
```

**Terminal 3 - Frontend:**
```bash
cd /home/ivan/ISIT/frontend
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080 npm run dev
```

---

## 🎯 Verify Everything Works

1. **Backend health:** `curl http://localhost:8080/healthz`
2. **Frontend:** Open http://localhost:3000
3. **Check expenses page:** Click "Учёт затрат" in the menu
4. **Check settings:** Click "Настройки системы" in the menu

---

## 📝 Notes

- The **NEW frontend** is in `/home/ivan/ISIT/frontend/`
- It uses **Next.js 16** with **Chakra UI v3**
- All pages are in Russian as per Figma design
- Backend API is at `http://localhost:8080`

