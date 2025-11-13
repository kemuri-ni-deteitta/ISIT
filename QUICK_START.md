# 🚀 Quick Start Guide

## Ports

- **Backend (Rust):** Port **8080** ✅ Already running
- **Frontend (Next.js):** Port **3000** ← You need to start this

## Start Frontend (Step by Step)

### 1. Stop any old processes
```bash
pkill -f vite
pkill -f "next dev"
```

### 2. Navigate to the NEW frontend folder
```bash
cd /home/ivan/ISIT/frontend
```

### 3. Verify you're in the right place
```bash
pwd
# Should show: /home/ivan/ISIT/frontend

ls package.json
# Should show: package.json
```

### 4. Start the frontend
```bash
npm run dev
```

### 5. Wait for this message:
```
▲ Next.js 16.0.1
- Local:        http://localhost:3000
```

### 6. Open your browser
Go to: **http://localhost:3000** (NOT port 8000 or 8080!)

---

## ✅ What You Should See

1. **Main page** with "Главная" title
2. **Navigation menu** (hamburger icon) with:
   - Главная
   - Учёт затрат
   - Аналитика и отчётность
   - Управление пользователями
   - Настройки системы

---

## ❌ Common Mistakes

- ❌ Looking at port 8000 (doesn't exist)
- ❌ Looking at port 8080 (that's the backend API)
- ❌ Running from `CostCenter-frontend/` folder
- ❌ Running from `frontend_old_*/` folder

## ✅ Correct

- ✅ Run from `/home/ivan/ISIT/frontend/`
- ✅ Look at **http://localhost:3000**
- ✅ Backend API is at **http://localhost:8080**

---

## Troubleshooting

**If you see Vite instead of Next.js:**
```bash
# Kill everything
pkill -f vite
pkill -f next

# Make sure you're in the right folder
cd /home/ivan/ISIT/frontend

# Clear cache
rm -rf .next node_modules/.cache

# Start again
npm run dev
```

**If port 3000 is already in use:**
```bash
# Find what's using it
lsof -i :3000

# Kill it
kill <PID>

# Or kill all Next.js processes
pkill -f "next dev"
```

