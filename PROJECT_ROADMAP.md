# ISIT Project Roadmap

## ✅ Completed Phases

### Phase 1: Project Setup ✅
- [x] Monorepo structure (backend + frontend)
- [x] Docker Compose setup (Postgres, MinIO, MailHog)
- [x] Backend: Rust/Axum with health endpoint
- [x] Frontend: React/Vite TypeScript setup
- [x] Development tooling (linting, formatting)

### Phase 2: Database Schema ✅
- [x] Database migrations (all tables)
- [x] Seed data (roles, departments, categories)
- [x] Database connection and health checks
- [x] Automatic migration on startup

### Phase 3: Expense API (In Progress)
- [x] Domain models and DTOs
- [x] Repository layer structure
- [x] API handlers structure
- [x] Routes setup
- [ ] **Fix compilation errors** (Decimal type handling)
- [ ] Test all CRUD endpoints

---

## 🎯 Next Priority Tasks

### 1. Fix Current Issues (High Priority)
**Status:** Blocking
- [ ] Fix Decimal type compilation errors in `expense_repo.rs`
- [ ] Fix `get_by_id` and `update` methods (Option handling)
- [ ] Test API endpoints work correctly
- [ ] Verify database operations

**Estimated Time:** 1-2 hours

### 2. Complete Expense API Features (High Priority)
**Status:** Next after fixes
- [ ] Add filtering to list endpoint (by department, category, status, date range)
- [ ] Add proper error handling and validation
- [ ] Add request/response validation
- [ ] Add pagination metadata (total pages, etc.)

**Estimated Time:** 2-3 hours

### 3. Reference Data APIs (Medium Priority)
**Status:** Needed for frontend
- [ ] Create departments API (`GET /api/v1/departments`)
- [ ] Create categories API (`GET /api/v1/categories`)
- [ ] Create roles API (`GET /api/v1/roles`)
- [ ] Support hierarchical structure (parent/child relationships)

**Estimated Time:** 2-3 hours

### 4. Authentication & Authorization (High Priority)
**Status:** Critical for production
- [ ] User registration endpoint
- [ ] Login endpoint (JWT tokens)
- [ ] Password hashing (Argon2)
- [ ] JWT middleware for protected routes
- [ ] Role-based access control (RBAC)
- [ ] Refresh token mechanism

**Estimated Time:** 4-6 hours

### 5. File Upload (Document Attachments) (Medium Priority)
**Status:** Core feature
- [ ] MinIO/S3 integration
- [ ] File upload endpoint
- [ ] File validation (size, type)
- [ ] Document metadata storage
- [ ] File download endpoint
- [ ] Link documents to expenses

**Estimated Time:** 3-4 hours

### 6. Frontend Development (High Priority)
**Status:** User interface
- [ ] Set up API client (Axios/fetch)
- [ ] Create expense list page
- [ ] Create expense form (create/edit)
- [ ] Add filtering UI
- [ ] Add department/category selectors
- [ ] Add file upload component
- [ ] Add authentication UI (login/register)
- [ ] Add routing (React Router)

**Estimated Time:** 8-12 hours

### 7. Analytics & Reporting (Medium Priority)
**Status:** Business value
- [ ] Analytics endpoints (aggregations by department/category)
- [ ] Date range queries
- [ ] Export to CSV/Excel
- [ ] Dashboard data endpoints
- [ ] Frontend charts and visualizations

**Estimated Time:** 6-8 hours

### 8. Testing (Medium Priority)
**Status:** Quality assurance
- [ ] Unit tests for repositories
- [ ] Integration tests for API endpoints
- [ ] Frontend component tests
- [ ] E2E tests (optional)

**Estimated Time:** 4-6 hours

### 9. Production Readiness (Low Priority - Later)
**Status:** Deployment prep
- [ ] Environment configuration
- [ ] Error logging and monitoring
- [ ] Performance optimization
- [ ] Security hardening
- [ ] API documentation (OpenAPI/Swagger)
- [ ] Deployment scripts

**Estimated Time:** 4-6 hours

---

## 🚀 Recommended Next Steps (In Order)

### Immediate (This Week)
1. **Fix compilation errors** - Get expense API working
2. **Test expense CRUD** - Verify all endpoints work
3. **Add filtering** - Complete the list endpoint
4. **Reference data APIs** - Departments and categories for frontend

### Short Term (Next 1-2 Weeks)
5. **Authentication** - JWT-based auth system
6. **Frontend basics** - Expense list and form pages
7. **File uploads** - Document attachment feature

### Medium Term (Next Month)
8. **Frontend completion** - Full UI with all features
9. **Analytics** - Reporting and dashboards
10. **Testing** - Comprehensive test coverage

---

## 📋 Current Blockers

1. **Compilation Errors** - Decimal type handling needs fixing
   - Location: `backend/src/repositories/expense_repo.rs`
   - Issue: `try_get` method usage and Option handling
   - Solution: Use proper sqlx Row trait methods

2. **Missing User Management** - Need to create users before testing
   - Solution: Add user creation endpoint or seed a test user

---

## 🎯 Success Criteria

### MVP (Minimum Viable Product)
- [x] Database schema complete
- [ ] Expense CRUD working
- [ ] Basic authentication
- [ ] Frontend can list/create expenses
- [ ] File uploads working

### Full System
- [ ] All features implemented
- [ ] Analytics and reporting
- [ ] Role-based permissions
- [ ] Production-ready deployment
- [ ] Comprehensive testing

---

## 📝 Notes

- **Technology Stack:** Rust (Axum) + React (TypeScript) + PostgreSQL + MinIO
- **Development Approach:** Backend-first, then frontend integration
- **Testing Strategy:** Manual testing first, automated tests later
- **Deployment:** Docker Compose for local, Kubernetes/ECS for production (later)

---

## 🔄 Quick Reference

**Start Backend:**
```bash
cd backend
source ~/.cargo/env
DATABASE_URL=postgres://isit:isit@localhost:5432/isit cargo run
```

**Start Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Database Access:**
```bash
sudo docker exec -it isit_postgres psql -U isit -d isit
```

