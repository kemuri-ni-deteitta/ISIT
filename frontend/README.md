CostCenter Frontend (Next.js + Chakra UI)

## Getting Started

Configure backend URL via env var (defaults to `http://localhost:8080`):

```bash
export NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
npm run dev
```

Open http://localhost:3000 to see the UI.

Key screens (all labels in Russian):
- Управление пользователями (`/admin-panel`) — создание пользователя с тостом об успехе.
- Настройки системы (`/settings`) — список типов затрат (чтение из бэкенда).
- Учёт затрат (`/expenses`) — список расходов и диалог создания записи (привязан к бэкенду).

