# vulkyra
Vulkyra ⚔️ — A modern, containerized Vulnerability Management Platform built with Go, React and PostgreSQL, empowering teams to proactively discover, analyze, and mitigate security vulnerabilities across their infrastructure.

## ✅ Vulkyra Development To-Do List

> **Priorities:** 🔥 High ‧ ⚠️ Medium ‧ 💤 Low  
> Use `[x]` for completed items, `[ ]` for pending ones.

---

### ⚙️ Backend (Go + Gin)

- [x] ✅ Setup basic Gin server with `/api/health`
- [x] ✅ Enable CORS middleware
- [x] ✅ Dockerfile with Air live-reload support
- [ ] 🔥 Implement JWT authentication & middleware
- [ ] 🔥 Design DB schema with GORM: users, roles, teams, assets, vulnerabilities
- [ ] ⚠️ Create REST API endpoints:
  - [ ] 🔥 `/auth/login`, `/auth/register`
  - [ ] ⚠️ `/assets`, `/vulnerabilities`, `/teams`, `/users`
- [ ] ⚠️ RBAC: Analyst, Engineer, Leadership roles with access control
- [ ] 💤 Logging middleware (request ID, method, route)
- [ ] ⚠️ Scanner parsers for Nessus/OpenVAS/Sysdig (XML/JSON)
- [ ] 💤 Background task runner (cron or queue system)

---

### 🌐 Frontend (React + Vite)

- [x] ✅ React + Vite setup with working API fetch
- [x] ✅ Dockerized frontend with live reloading
- [x] ✅ Display backend status via `/api/health`
- [ ] 🔥 Implement login page and JWT session storage
- [ ] ⚠️ Role-based dashboards:
  - [ ] 🔥 Analyst Dashboard: vuln/asset list + filters
  - [ ] ⚠️ Leadership Dashboard: charts by team/org
  - [ ] ⚠️ Engineer Dashboard: assigned vulns & remediation progress
- [ ] ⚠️ Use Recharts or Chart.js for visualization
- [ ] 💤 Add global styles, dark/light theme toggle

---

### 🐳 Docker & Dev Setup

- [x] ✅ Working Docker Compose setup (frontend + backend)
- [x] ✅ Backend volume mount with Air reload
- [ ] ⚠️ Add PostgreSQL service + seeded data
- [ ] ⚠️ `docker-compose.override.yml` for dev vs prod
- [ ] 💤 Nginx config for production frontend

---

### 🧪 Testing

- [ ] ⚠️ Add unit tests for backend (Gin + Go test)
- [ ] ⚠️ Add frontend tests (Jest + React Testing Library)
- [ ] 💤 Add `golangci-lint` for static checks
- [ ] 💤 Integrate testing into CI workflow

---

### 🧾 Documentation

- [x] ✅ Add project summary to `README.md`
- [x] ✅ Add live to-do checklist 🧠
- [ ] ⚠️ Generate API docs with Swagger/OpenAPI (FastAPI style)
- [ ] ⚠️ Add ERD/database schema diagram (ASCII or dbdiagram.io)
- [ ] 💤 Add deployment guide: `docker compose`, env vars, volumes
- [ ] 💤 Contribution guide (for future collaborators)
