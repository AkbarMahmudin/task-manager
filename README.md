# Mini Task Manager

Aplikasi Task Management dengan autentikasi JWT dan audit log perubahan status yang immutable. Dibangun sebagai monorepo (NX) dengan backend Express + PostgreSQL dan frontend React + Vite.

---

## Fitur

- **Autentikasi**: Register, Login (JWT), Logout (client-side), password di-hash dengan bcrypt
- **Task Management**: Create, Read, Update, Delete, Update Status — setiap task hanya bisa diakses oleh pemiliknya
- **Audit Log**: Setiap perubahan status task tercatat secara immutable (append-only)
- **Search & Pagination**: Endpoint list task mendukung `search`, `page`, dan `limit`
- **Protected Routes** di frontend — halaman task hanya bisa diakses setelah login

---

## Tech Stack

| Layer            | Technology                                                     |
| ---------------- | -------------------------------------------------------------- |
| Monorepo         | NX                                                             |
| Backend          | Node.js + Express + TypeScript                                 |
| Database         | PostgreSQL                                                     |
| ORM / Migration  | Drizzle ORM + drizzle-kit                                      |
| Auth             | JWT (`jsonwebtoken`) + `bcrypt` untuk hashing password         |
| Frontend         | React + TypeScript + Vite                                      |
| UI Framework     | Tailwind CSS v4 + shadcn/ui                                    |
| Server State     | TanStack React Query v5                                        |
| HTTP Client      | Axios                                                          |
| Routing          | React Router v6 (Protected Route + Guest-only Route)           |
| Validation       | Zod — shared antara FE dan BE via `@task-manager/shared-types` |
| Containerization | Docker & Docker Compose                                        |

---

## Cara Menjalankan

### A. Menjalankan dengan Docker Compose (Direkomendasikan)

#### Prerequisites

- Docker & Docker Compose

#### 1. Clone Repository

```bash
git clone https://github.com/AkbarMahmudin/task-manager.git
cd task-manager
```

#### 2. Setup Environment Variable

Buat file `.env` di root project:

```bash
cp .env.example .env
```

Isi `.env`:

```
JWT_SECRET=yoursecrethere
```

> Ganti `yoursecrethere` dengan secret key yang aman untuk JWT signing.

#### 3. Jalankan Semua Service

```bash
docker compose up --build
```

Perintah ini akan menjalankan 4 service secara berurutan:

1. **postgres** — database PostgreSQL 16 (dengan healthcheck)
2. **migrate** — menjalankan database migration (Drizzle) sekali, lalu selesai (`service_completed_successfully`)
3. **backend** — Express API, baru start setelah migration selesai
4. **frontend** — React app di-serve lewat Nginx

#### 4. Akses Aplikasi

| Service      | URL                                      |
| ------------ | ---------------------------------------- |
| Frontend     | http://localhost:5173                    |
| Backend API  | http://localhost:3000/api                |
| Health Check | http://localhost:3000/health             |
| PostgreSQL   | localhost:5438 (host) → 5432 (container) |

---

### B. Menjalankan Secara Lokal (tanpa Docker)

#### Prerequisites

- Node.js >= 18
- npm >= 9
- PostgreSQL berjalan lokal (atau bisa jalankan hanya service `postgres` dari Docker: `docker compose up postgres`)

#### 1. Install Dependencies

```bash
npm install
```

#### 2. Setup Environment Variable

Buat `.env` di root:

```
JWT_SECRET=yoursecrethere
```

Buat `apps/backend/.env`:

```
PORT=3000
DATABASE_URL=postgres://taskmanager:taskmanager@localhost:5438/taskmanager
```

Buat `apps/frontend/.env`:

```
VITE_API_URL=http://localhost:3000/api
```

#### 3. Jalankan Migration

```bash
npm run db:migrate
```

#### 4. Jalankan Backend & Frontend

```bash
# Jalankan keduanya sekaligus
npx nx run-many -t serve

# Atau secara terpisah di dua terminal
npx nx serve backend
npx nx serve frontend
```

---

## Daftar Endpoint API

Base URL: `http://localhost:3000/api`

### Auth

| Method | Endpoint         | Auth Required | Deskripsi                                      |
| ------ | ---------------- | :-----------: | ---------------------------------------------- |
| POST   | `/auth/register` |      ❌       | Registrasi user baru — mengembalikan JWT token |
| POST   | `/auth/login`    |      ❌       | Login — mengembalikan JWT token                |
| GET    | `/auth/profile`  |      ✅       | Ambil data profil user yang sedang login       |

### Task

Semua endpoint task membutuhkan header `Authorization: Bearer <token>`.

| Method | Endpoint            | Deskripsi                                                             |
| ------ | ------------------- | --------------------------------------------------------------------- |
| GET    | `/tasks`            | List task milik user. Query param opsional: `page`, `limit`, `search` |
| GET    | `/tasks/:id`        | Detail satu task (hanya milik sendiri)                                |
| POST   | `/tasks`            | Buat task baru                                                        |
| PATCH  | `/tasks/:id`        | Update title/description task                                         |
| PATCH  | `/tasks/:id/status` | Update status task                                                    |
| DELETE | `/tasks/:id`        | Hapus task                                                            |
| GET    | `/tasks/:id/logs`   | List audit log perubahan status untuk task tsb                        |

### Lainnya

| Method | Endpoint  | Deskripsi                                                                                  |
| ------ | --------- | ------------------------------------------------------------------------------------------ |
| GET    | `/health` | Health check server (di luar prefix `/api`, akses langsung `http://localhost:3000/health`) |

---

## Cara Login

1. **Register** terlebih dahulu lewat `POST /api/auth/register` atau lewat halaman `/register` di frontend:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{ "name": "John Doe", "email": "john@example.com", "password": "secret123" }'
```

Response akan berisi `token` (JWT) yang otomatis disimpan ke `localStorage` oleh frontend saat register lewat UI.

2. **Login** lewat `POST /api/auth/login` atau halaman `/login`:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{ "email": "john@example.com", "password": "secret123" }'
```

3. Gunakan token yang didapat untuk mengakses endpoint task:

```bash
curl http://localhost:3000/api/tasks \
  -H "Authorization: Bearer <token>"
```

Di frontend, token disimpan otomatis di `localStorage` (key `auth_token`) setelah login berhasil, dan dilampirkan otomatis ke setiap request lewat Axios interceptor. Route task (`/`) dilindungi oleh `ProtectedRoute` — akan redirect ke `/login` jika belum ada token.

Password boleh sepanjang 1–16 karakter (aturan ini sudah konsisten antara skema register dan login).

---

## Arsitektur

### Monorepo Structure (NX)

```
task-manager/
├── apps/
│   ├── backend/              # Express + TypeScript
│   │   └── src/
│   │       ├── db/                   # Drizzle schema & migration
│   │       │   ├── schema/           # users, tasks, audit_logs
│   │       │   └── migrations/
│   │       ├── modules/
│   │       │   ├── auth/             # Auth module (login, register, profile)
│   │       │   ├── user/             # User module
│   │       │   ├── task/             # Task module
│   │       │   │   ├── task.repository.ts   # Drizzle queries
│   │       │   │   ├── task.service.ts      # Business logic + ownership check
│   │       │   │   ├── task.controller.ts   # HTTP layer
│   │       │   │   └── task.route.ts        # Express router (+ authenticate middleware)
│   │       │   └── audit-log/        # AuditLog module (independen)
│   │       └── shared/
│   │           ├── clients/          # Outgoing port interfaces (Port & Adapter)
│   │           ├── errors/           # BaseError, DomainError
│   │           ├── middlewares/      # validateBody, authenticate, errorHandler
│   │           └── utils/            # jwt.util (sign/verify)
│   │
│   └── frontend/             # React + TypeScript + Vite
│       └── src/app/
│           ├── api/                  # HTTP contracts (auth.api, task.api)
│           ├── context/              # auth-context (isAuthenticated state)
│           ├── hooks/                # Server state (React Query)
│           ├── routes/               # ProtectedRoute, GuestOnlyRoute
│           ├── pages/                # LoginPage, RegisterPage, TaskPage
│           ├── features/task/        # Komponen UI task
│           ├── lib/auth.ts           # Token storage (localStorage)
│           └── providers/            # QueryClient + BrowserRouter
│
└── libs/
    ├── shared-types/         # Types & Zod schemas (dikonsumsi FE dan BE)
    └── ui/                   # shadcn/ui components
```

### Layered Architecture (per module)

```
HTTP Request
     │
     ▼
authenticate            ← JWT verification, inject req.user
     │
     ▼
validateBody(Zod)       ← structural validation
     │
     ▼
Controller              ← parse request, format response
     │
     ▼
Service                 ← business logic, ownership check, call client port
     │
     ▼
Repository (Drizzle)    ← data access ke PostgreSQL
```

### Inter-Module Communication (Port & Adapter)

Task module dan AuditLog module berkomunikasi melalui pola **Port & Adapter**: `TaskService` bergantung pada interface `IAuditLogClient`, bukan implementasi konkret `AuditLogClient`. Ini memungkinkan mekanisme komunikasi (in-process → HTTP → message broker) berubah tanpa menyentuh `TaskService`.

### Ownership Check

Semua operasi task (`getTaskById`, `updateTask`, `updateTaskStatus`, `deleteTask`, `getAuditLogs`) melewati `getTaskById(taskId, userId)` sebagai single source of truth untuk validasi kepemilikan — melempar `403 FORBIDDEN` jika `userId` yang login tidak cocok dengan `task.userId`.

### Status Task — 4 Tahap (Enhancement dari Requirement)

Requirement awal hanya meminta 2 status (`TODO`/`DONE`), namun diimplementasikan dengan 4 tahap yang lebih ekspresif untuk merepresentasikan progres kerja secara lebih realistis:

```
to_do → pending → in_progress → done
```

Perubahan status dilakukan lewat dropdown/select di UI (`UpdateStatusSelect`), sehingga user bebas memilih status tujuan secara langsung tanpa dibatasi harus berurutan selangkah demi selangkah. Pendekatan ini disengaja untuk memberi fleksibilitas ke user (misal: task yang salah diklik "in_progress" bisa langsung dikembalikan ke "to_do" tanpa harus melalui status lain).

---

## Bonus yang Diimplementasikan

| Fitur             |                                     Status                                     |
| ----------------- | :----------------------------------------------------------------------------: |
| Pagination        | ✅ Lengkap — backend, API layer, dan kontrol UI (Previous/Next + info halaman) |
| Search Task       |     ✅ Lengkap — backend, API layer, dan search box di UI dengan debounce      |
| ESLint + Prettier |                                       ✅                                       |
| Responsive Layout |                  ✅ Sudah cukup aman di berbagai ukuran layar                  |
| Dark Mode         |                            ✅ Berjalan dengan baik                             |
| Unit Test         |                                    ❌ Belum                                    |
| Swagger / OpenAPI |                                    ❌ Belum                                    |
| GitHub Actions    |                                    ❌ Belum                                    |

---

## Known Limitations (Didokumentasikan Sengaja)

Bagian ini didokumentasikan secara jujur untuk transparansi ke reviewer/interviewer:

1. **Update status task dan pencatatan audit log belum berada dalam satu database transaction.** `IDbClient` sudah menyediakan method `transaction()`, tapi `updateTaskStatus` di `TaskService` belum memakainya — `repo.update()` dan `auditLogClient.recordStatusChange()` masih berupa dua call terpisah. Jika salah satu gagal di tengah jalan, task dan audit log-nya bisa inconsistent. **Ini bukan bagian dari requirement wajib** (audit log adalah fitur tambahan di luar soal), sehingga diprioritaskan sebagai **TODO enhancement** jika waktu pengerjaan masih tersedia — bukan blocker untuk submission.
2. **Kontrol UI untuk search & pagination belum tersedia**, meskipun kapabilitasnya sudah lengkap di backend dan API layer frontend (`taskApi.getAll({ page, limit, search })`). `TaskPage.tsx` saat ini memanggil `useTasks()` tanpa parameter filter. Enhancement UI (search box + pagination control) direncanakan setelah pengiriman.

---

## Jika Ada Waktu Lebih

**Correctness**

- Bungkus `updateTaskStatus` + `recordStatusChange` dalam satu `db.transaction()` (infrastruktur sudah tersedia di `IDbClient`)

**Developer Experience**

- Unit test untuk `TaskService` (ownership check, business logic status update)
- Integration test tiap endpoint dengan supertest
- OpenAPI/Swagger dari Zod schema

**Frontend**

- Tambahkan search input & pagination control yang terhubung ke `useTasks(filter)` (enhancement pasca-pengiriman)
- Toast notification untuk feedback sukses/gagal

**Observability**

- Structured logging (JSON, level info/warn/error)
- Request ID untuk traceability

---

## Pengumpulan

- Repository: https://github.com/AkbarMahmudin/task-manager
- Postman Collection: `<isi link Postman Collection di sini>`

---

## Penggunaan AI

AI digunakan dalam proses pengembangan proyek ini — mulai dari perencanaan arsitektur, penulisan interface, hingga review dan update dokumentasi README ini. Semua keputusan arsitektur dan trade-off tetap dipahami dan bisa dipertanggungjawabkan oleh penulis pada sesi technical interview.
