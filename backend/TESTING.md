# Testing Guide - Expense API

## What We Built

We created a complete **Expense Management API** with the following components:

### 1. **Domain Models** (`src/domain/expense.rs`)
- `Expense` - The main data structure representing an expense
- `ExpenseStatus` - Enum for expense status (pending, approved, rejected, paid)
- `CreateExpenseRequest` - DTO for creating new expenses
- `UpdateExpenseRequest` - DTO for updating expenses
- `ExpenseListResponse` - Response with pagination info

### 2. **Repository Layer** (`src/repositories/expense_repo.rs`)
Database operations:
- `create()` - Insert new expense
- `get_by_id()` - Get expense by UUID
- `list()` - List expenses with pagination
- `update()` - Update existing expense
- `delete()` - Delete expense

### 3. **API Handlers** (`src/http/expense_handlers.rs`)
HTTP request handlers:
- `list_expenses` - GET /api/v1/expenses
- `create_expense` - POST /api/v1/expenses
- `get_expense` - GET /api/v1/expenses/:id
- `update_expense` - PUT /api/v1/expenses/:id
- `delete_expense` - DELETE /api/v1/expenses/:id

### 4. **Routes** (`src/main.rs`)
All routes are mounted under `/api/v1/expenses`

## How to Test

### Step 1: Start the Backend

```bash
cd /home/ivan/ISIT/backend
source ~/.cargo/env
DATABASE_URL=postgres://isit:isit@localhost:5432/isit RUST_LOG=info SERVER_PORT=8080 ALLOWED_ORIGINS=http://localhost:5173 cargo run
```

Wait for: `Starting server on http://0.0.0.0:8080`

### Step 2: Get Valid IDs from Database

First, get valid department and category IDs to use in requests:

```bash
# Get department IDs
sudo docker exec -it isit_postgres psql -U isit -d isit -c "SELECT id, code, name FROM departments;"

# Get category IDs
sudo docker exec -it isit_postgres psql -U isit -d isit -c "SELECT id, code, name FROM categories;"
```

**Example IDs from seed data:**
- Department: `10000000-0000-0000-0000-000000000002` (IT)
- Category: `20000000-0000-0000-0000-000000000001` (Travel Expenses)

### Step 3: Test API Endpoints

#### 3.1. Create an Expense (POST)

```bash
curl -X POST http://localhost:8080/api/v1/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "department_id": "10000000-0000-0000-0000-000000000002",
    "category_id": "20000000-0000-0000-0000-000000000001",
    "amount": "150.50",
    "currency": "USD",
    "incurred_on": "2025-01-12",
    "description": "Business trip to conference"
  }'
```

**Expected Response:**
```json
{
  "id": "...",
  "department_id": "10000000-0000-0000-0000-000000000002",
  "category_id": "20000000-0000-0000-0000-000000000001",
  "amount": "150.50",
  "currency": "USD",
  "incurred_on": "2025-01-12",
  "description": "Business trip to conference",
  "status": "pending",
  "created_by": "...",
  "created_at": "...",
  "updated_at": "..."
}
```

**Save the `id` from the response for next tests!**

#### 3.2. List All Expenses (GET)

```bash
curl http://localhost:8080/api/v1/expenses?page=1&page_size=10
```

**Expected Response:**
```json
{
  "expenses": [...],
  "total": 1,
  "page": 1,
  "page_size": 10
}
```

#### 3.3. Get Single Expense (GET)

Replace `EXPENSE_ID` with the ID from step 3.1:

```bash
curl http://localhost:8080/api/v1/expenses/EXPENSE_ID
```

#### 3.4. Update Expense (PUT)

```bash
curl -X PUT http://localhost:8080/api/v1/expenses/EXPENSE_ID \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Updated description",
    "status": "approved"
  }'
```

#### 3.5. Delete Expense (DELETE)

```bash
curl -X DELETE http://localhost:8080/api/v1/expenses/EXPENSE_ID
```

**Expected:** Status 204 (No Content)

### Step 4: Verify in Database

```bash
sudo docker exec -it isit_postgres psql -U isit -d isit -c "SELECT id, amount, description, status FROM expenses;"
```

## Test Scenarios

### Scenario 1: Create Multiple Expenses
Create 3-4 expenses with different departments and categories to test listing.

### Scenario 2: Update Status Flow
1. Create expense (status: pending)
2. Update to "approved"
3. Update to "paid"

### Scenario 3: Error Handling
Try invalid requests:
```bash
# Missing required field
curl -X POST http://localhost:8080/api/v1/expenses \
  -H "Content-Type: application/json" \
  -d '{"amount": "100"}'

# Invalid UUID
curl http://localhost:8080/api/v1/expenses/invalid-uuid

# Non-existent expense
curl http://localhost:8080/api/v1/expenses/00000000-0000-0000-0000-000000000999
```

## What Each Component Does

### Domain Layer
- Defines the data structures
- Handles serialization/deserialization (JSON)
- Validates data types

### Repository Layer
- Abstracts database operations
- Uses SQLx for type-safe queries
- Returns Rust types, not raw SQL results

### HTTP Handlers
- Extract data from HTTP requests
- Call repository methods
- Format responses
- Handle errors and status codes

### Routes
- Map URLs to handler functions
- Handle HTTP methods (GET, POST, PUT, DELETE)
- Pass database pool to handlers via State

## Architecture Flow

```
HTTP Request
    ↓
Router (main.rs)
    ↓
Handler (expense_handlers.rs)
    ↓
Repository (expense_repo.rs)
    ↓
Database (PostgreSQL)
    ↓
Response flows back up
```

This separation makes the code:
- **Testable** - Each layer can be tested independently
- **Maintainable** - Changes in one layer don't affect others
- **Scalable** - Easy to add features or change implementations

