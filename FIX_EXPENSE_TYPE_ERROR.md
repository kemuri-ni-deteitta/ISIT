# Fix: "Ошибка создания типа затрат"

## Problem
The error occurs because the backend was expecting a `code` field, but the frontend only sends `name`.

## Solution Applied
✅ Made `code` field optional in `CreateCategoryRequest` with `#[serde(default)]`
✅ Backend now auto-generates `code` from `name` if not provided

## Action Required: Restart Backend

The backend needs to be restarted to apply the fix:

```bash
# 1. Stop the current backend (Ctrl+C in the terminal where it's running)
# Or find and kill the process:
pkill -f "target/debug/backend"

# 2. Rebuild and restart
cd /home/ivan/ISIT/backend
cargo run
```

## Verify Fix

After restarting, test the creation:

1. Go to http://localhost:3000/settings
2. Click "Добавить"
3. Enter a name (e.g., "Тестовый тип")
4. Click "Создать"
5. Should see success toast: "Тип затрат создан"

## If Still Getting Error

Check the browser console (F12) for the actual error message. The improved error handling will now show the detailed error in the toast.

## Test Backend Directly

You can test the backend endpoint directly:

```bash
curl -X POST http://localhost:8080/api/v1/categories \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Category"}'
```

Should return:
```json
{
  "id": "...",
  "code": "test_category",
  "name": "Test Category",
  "parent_id": null,
  "active": true
}
```

