# Mini Task Manager

Aplikasi internal untuk mengelola task sederhana dengan audit log perubahan status yang immutable.

---

## Cara Menjalankan

### Prerequisites

- Node.js >= 18
- npm >= 9

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/AkbarMahmudin/task-manager.git
cd task-manager

# Install semua dependencies dari root (berlaku untuk semua apps & libs)
npm install
```

### 2. Jalankan Backend

```bash
# Development mode (watch)
npx nx serve backend

# Backend akan berjalan di:
# http://localhost:3000/api
```

### 3. Setup Environment Frontend

Buat file `.env` di root workspace sebelum menjalankan frontend:

```bash
cp .env.example .env
```

`.env.example`:

```
VITE_API_URL=http://localhost:3000/api
```

### 4. Jalankan Frontend

```bash
# Development mode (watch) — jalankan di terminal terpisah dari backend
npx nx serve frontend

# Frontend akan berjalan di:
# http://localhost:5173
```

> Jalankan backend dan frontend **sekaligus** di dua terminal terpisah atau gunakan perintah di bawah.

```bash
# Jalankan kedua aplikasi sekaligus
npx nx run-many -t serve
```

### 5. Health Check Backend

```bash
curl http://localhost:3000/health
# { "status": "ok" }
```

### Available API Endpoints

| Method | Endpoint                | Deskripsi               |
| ------ | ----------------------- | ----------------------- |
| GET    | `/tasks`                | List semua task         |
| GET    | `/tasks/:id`            | Detail satu task        |
| POST   | `/tasks`                | Buat task baru          |
| PATCH  | `/tasks/:id/status`     | Update status task      |
| DELETE | `/tasks/:id`            | Hapus task              |
| GET    | `/tasks/:id/audit-logs` | List audit log per task |

### Contoh Request

```bash
# Buat task baru
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{ "title": "Prepare Invoice", "description": "Q4 invoice untuk client A" }'

# Update status
curl -X PATCH http://localhost:3000/tasks/<id>/status \
  -H "Content-Type: application/json" \
  -d '{ "newStatus": "pending", "actor": "john.doe" }'

# Lihat audit log
curl http://localhost:3000/tasks/<id>/audit-logs
```

### Predefined Actors (untuk dropdown)

```
john.doe | jane.smith | bob.martin | alice.jones
```

### Status Flow

```
to_do → pending → in_progress → done
```

Transisi hanya boleh maju satu langkah. Tidak bisa skip atau mundur.

---

## Arsitektur

### Monorepo Structure (NX)

```
task-manager/
├── apps/
│   ├── backend/              # Express + TypeScript
│   │   └── src/
│   │       ├── modules/
│   │       │   ├── task/            # Task module
│   │       │   │   ├── repositories/ # Data access (in-memory)
│   │       │   │   ├── services/     # Business logic
│   │       │   │   ├── controllers/  # HTTP layer
│   │       │   │   └── routes/       # Express router
│   │       │   └── audit-log/       # AuditLog module (independen)
│   │       │       ├── repositories/
│   │       │       └── services/
│   │       │           └── audit-log.client.ts  # Adapter — implements IAuditLogClient
│   │       └── shared/
│   │           ├── clients/          # Outgoing port interfaces (Port & Adapter)
│   │           │   └── audit-log.client.interface.ts
│   │           ├── errors/           # BaseError, DomainError
│   │           └── middlewares/      # validateBody, errorHandler
│   │
│   └── frontend/             # React + TypeScript + Vite
│       └── src/
│           ├── api/                  # Layer 1: HTTP contracts
│           │   ├── client.ts         # Axios instance + error normalization
│           │   ├── errors.ts         # AppError class + isAppError helper
│           │   └── task.api.ts      # Typed API functions per endpoint
│           ├── hooks/                # Layer 2: Server state (React Query)
│           │   ├── use-task.ts      # Task queries & mutations
│           │   └── use-audit-log.ts # Audit log query
│           ├── features/
│           │   └── task/            # Layer 3: UI feature
│           │       ├── components/
│           │       │   ├── AuditLogDrawer.tsx
│           │       │   ├── CreateTaskForm.tsx
│           │       │   ├── DeleteTaskButton.tsx
│           │       │   ├── TaskDetailButton.tsx
│           │       │   ├── TaskItem.tsx
│           │       │   ├── TaskList.tsx
│           │       │   ├── TaskStatusBadge.tsx
│           │       │   └── UpdateStatusDialog.tsx
│           │       ├── types         # Typed Props Components
│           │       └── index.ts      # Export TaskPage saja
│           ├── pages/
│           │   └── TaskPages.tsx            # Smart — pegang hooks & state
│           ├── providers/
│           │   └── app-providers.tsx # QueryClient + BrowserRouter
│           ├── styles/
│           │   └── globals.css       # Tailwind v4 + shadcn CSS variables
│           ├── App.tsx               # Root component (siap terima Routes)
│           └── main.tsx              # Entry point
│
└── libs/
    ├── shared-types/         # Types & Zod schemas (dikonsumsi FE dan BE)
    │   └── src/lib/
    │       ├── task.types.ts         # Constants (TASK_STATUS_ORDER, PREDEFINED_ACTORS)
    │       ├── task.schemas.ts       # Zod schemas + derived TypeScript types
    │       ├── audit-log.types.ts    # AuditLog interface
    │       └── api.types.ts          # ApiResponse, ApiError
    │
    └── ui/                   # shadcn/ui components (dikonsumsi frontend)
        └── src/
            ├── components/           # shadcn components (Button, Dialog, Sheet, dll)
            ├── lib/
            │   └── utils.ts          # cn() helper (clsx + tailwind-merge)
            └── index.ts              # Public API lib
```

### Layered Architecture (per module)

```
HTTP Request
     │
     ▼
validateBody(Zod)       ← structural validation (well-formed?)
     │
     ▼
Controller              ← parse request, format response, forward error
     │
     ▼
Service                 ← business logic, domain validation, call client port
     │
     ▼
Repository              ← data access (abstracted via interface)
     │
     ▼
In-Memory Store         ← Map<string, Task> / AuditLog[]
```

### Inter-Module Communication (Port & Adapter)

Task module dan AuditLog module berkomunikasi melalui pola **Port & Adapter** — istilah dari Hexagonal Architecture.

```
IAuditLogClient            ← Outgoing Port
(shared/clients/)            didefinisikan dari perspektif Task module:
                             "ini yang saya butuhkan, saya tidak peduli
                              bagaimana kamu menyediakannya"

AuditLogClient             ← Adapter
(audit-logs/services/)       dimiliki dan diimplementasi oleh AuditLog module
                             "possible perubahan mekanisme komunikasi terjadi di sini"
```

Alur komunikasi saat `updateTaskStatus` dipanggil:

```
TaskService
  └── auditLogClient.recordStatusChange(data)   ← panggil port
        │          (IAuditLogClient)
        │
        ▼  (resolved saat wiring di main.ts)
  AuditLogClient                                ← adapter
        └── auditLogRepo.insert(log)
```

Task module hanya tahu `IAuditLogClient` — tidak tahu `AuditLogClient` ada, tidak tahu repository AuditLog ada. Ketika mekanisme komunikasi berubah (in-process → HTTP → message broker), **hanya isi method di `AuditLogClient` yang berubah**. `TaskService` dan `IAuditLogClient` tidak tersentuh.

### Dependency Inversion

Semua layer bergantung ke interface, bukan concrete class. Concrete class hanya disebutkan satu kali di `tasks.module.ts` dan `main.ts`.

```
Controller      →  ITaskService
TaskService     →  ITaskRepository + IAuditLogClient
AuditLogClient  →  IAuditLogRepository
Repository      →  (implementasi konkret, tidak ada dependency ke layer atas)
```

Concrete class hanya disebutkan satu kali: di `tasks.module.ts`, `audit-log.module.ts`, dan `main.ts`.

---

### Frontend Layer Architecture

```
main.tsx
  └── <AppProviders>                    ← QueryClient + BrowserRouter
        └── <App />                     ← root, siap terima <Routes>
              └── <TaskPage />    ← satu-satunya yang pegang hooks
                    ├── useQuery  → api function → axios → BE
                    ├── useMutation → api function → axios → BE
                    └── passes data/callbacks ke komponen presentasi
```

Tiga layer frontend, masing-masing punya satu tanggung jawab:

| Layer        | Lokasi          | Tanggung Jawab                                                             |
| ------------ | --------------- | -------------------------------------------------------------------------- |
| **API**      | `src/api/`      | Kirim HTTP request, unwrap `ApiResponse<T>`, normalize error ke `AppError` |
| **Hooks**    | `src/hooks/`    | Cache server state, invalidasi cache, expose loading & error state         |
| **Features** | `src/features/` | Render UI, handle interaksi user, tidak tahu URL atau cache                |

Aturan dependency antar layer — hanya boleh ke bawah, tidak boleh ke atas:

```
features/  →  hooks/  →  api/  →  @task-manager/shared-types
                                         ↑
                          libs/ui  ───────┘ (untuk komponen UI)
```

### Error Normalization (Frontend)

Axios error dinormalize menjadi `AppError` di interceptor sebelum sampai ke hooks atau komponen:

```
Backend ApiError  →  interceptor  →  AppError (code + statusCode + message)
Network error     →  interceptor  →  AppError (code: VALIDATION_ERROR, statusCode: 0)
Unknown error     →  interceptor  →  AppError (fallback message)
```

Hooks dan komponen hanya perlu handle satu jenis error (`AppError`) — tidak perlu tahu axios ada.

---

## Asumsi yang Diambil

**Actor**
Tidak ada autentikasi. Actor diambil dari dropdown dengan daftar hardcoded (`PREDEFINED_ACTORS` di `shared-types`). Ini sesuai ketentuan soal — tidak perlu auth.

**Storage**
Data disimpan di in-memory (`Map` untuk Task, `Array` untuk AuditLog). Data hilang saat server restart. Ini disengaja untuk menjaga kesederhanaan — storage bisa diganti tanpa mengubah business logic karena ada Repository pattern.

**Status Awal**
Setiap task yang baru dibuat selalu dimulai dari `to_do`. Tidak ada opsi untuk memilih status awal.

**Audit Log Scope**
Audit log hanya dibuat saat status berubah (`updateTaskStatus`). Perubahan field lain seperti `title` atau `description` tidak menghasilkan log — karena requirements hanya menyebut perubahan status.

**Task Dihapus**
Ketika task dihapus, audit log-nya tetap tersimpan di memory (tidak ikut dihapus). Ini menjaga prinsip immutability log. Konsekuensinya: log dari task yang sudah dihapus tidak bisa diakses melalui `GET /tasks/:id/audit-logs` karena task-nya sudah tidak ada — tapi log-nya masih ada di store.

**Idempotent Update**
Update ke status yang sama dianggap sebagai kesalahan eksplisit — bukan silent success. Response mengembalikan `422 IDEMPOTENT_UPDATE` agar client tahu request-nya tidak menghasilkan perubahan.

**Actor di Frontend**
Daftar actor (`PREDEFINED_ACTORS`) diimport langsung dari `@task-manager/shared-types` untuk populate dropdown — bukan di-fetch dari API. Perubahan daftar actor cukup dilakukan di satu tempat dan otomatis berlaku di FE dan BE.

**Form Library**
Pada `CreateTaskForm` menggunakan `react-hook-form`. Form library bertujuan untuk menyederhanakan validasi dengan memanfaatkan global types/schema di `@task-manager/shared-types`. Validasi dilakukan menggunakan Zod schema yang sama dari `shared-types`.

**Routing**
`BrowserRouter` sudah terpasang di `AppProviders`, tapi `<Routes>` baru mendefinisikan `TaskPage` saja. Semua fitur saat ini diakses dari satu halaman via `TaskPage`. Routing bisa ditambahkan tanpa mengubah provider atau komponen yang sudah ada.

**`staleTime` Audit Log**
`useAuditLogs` menggunakan `staleTime: Infinity` — log tidak pernah di-refetch otomatis. Ini intentional karena log hanya berubah ketika `useUpdateTaskStatus` berhasil, dan invalidasi dilakukan secara manual di `onSuccess`. Background refetch untuk log dianggap tidak perlu dan buang bandwidth.

---

## Trade-off yang Dibuat

### 1. Fake Atomic vs Real Transaction

Saat `updateTaskStatus` dipanggil, ada dua operasi terpisah:

```
await taskRepo.save(task);                        // Step 1
await auditLogClient.recordStatusChange(data);    // Step 2 — tidak atomic dengan Step 1
```

Jika server crash di antara keduanya, task status sudah berubah tapi log tidak terbuat — data inconsistent. Ini **limitation yang disadari**, bukan bug yang terlewat.

Solusi proper membutuhkan database transaction yang wrap kedua operasi. Untuk scope in-memory, ini adalah trade-off yang diterima dan didokumentasikan.

### 2. AuditLog Immutability — Dijamin di Application Layer, Bukan Infrastructure

Tidak ada database constraint yang mencegah modifikasi log secara fisik. Jaminan immutability berasal dari:

- `IAuditLogRepository` tidak punya method `update()` atau `delete()`
- Tidak ada HTTP endpoint `PATCH/PUT/DELETE` untuk audit log
- `AuditLog` type menggunakan `Readonly<T>`

Ini cukup untuk mencegah kesalahan tidak disengaja, tapi tidak cukup untuk mencegah manipulasi langsung ke store. Solusi proper: database dengan `REVOKE UPDATE, DELETE ON audit_logs FROM app_user`.

### 3. AuditLog Query setelah Task Dihapus

`GET /tasks/:id/audit-logs` akan mengembalikan `404 TASK_NOT_FOUND` meski log-nya masih ada di store — karena service melakukan guard `findTaskOrThrow` sebelum query log. Ini trade-off antara:

- Konsistensi API (`/tasks/:id` tidak ada → seluruh resource di bawahnya 404)
- Akses ke historical data (log tetap tersimpan tapi tidak bisa diakses via API)

Untuk scope internal tool, ini dianggap acceptable.

### 4. `ApiResponse<T>` Unwrap di API Layer, Bukan Interceptor

Semua response dari backend dibungkus dalam `ApiResponse<T>`. Unwrap bisa dilakukan di dua tempat:

```
Opsi A (dipilih) — unwrap eksplisit di setiap api function:
  const res = await apiClient.get<ApiResponse<Task[]>>('/tasks');
  return res.data.data;

Opsi B — unwrap otomatis di response interceptor:
  interceptor: return response.data.data
  api function: return res.data  ← TypeScript tidak bisa infer ini dengan benar
```

Opsi A dipilih karena TypeScript generic inference bekerja lebih baik — setiap function punya return type yang eksplisit dan bisa di-trace. Interceptor yang melakukan unwrap membuat type chain menjadi ambigu dan menyulitkan debugging.

### 5. `useUpdateTaskStatus` — `taskId` di Variables, Bukan Parameter Hook

```typescript
// ❌ taskId di parameter hook:
const mutation = useUpdateTaskStatus(taskId);
// Harus buat instance baru per task — tidak bisa di-share di TaskPage

// ✅ taskId di variables (dipilih):
const mutation = useUpdateTaskStatus();
mutation.mutate({ taskId, data });
// Satu instance, bisa dipakai untuk task manapun di list
```

Karena `TaskPage` me-render satu mutation untuk seluruh list (bukan per-task), taskId perlu masuk sebagai bagian dari data yang dimutasi — bukan dikunci saat hook dibuat.

### 6. `selectedTaskId` Diangkat ke `TaskPage`, Bukan Lokal di `TaskItem`

State "task mana yang audit log-nya terbuka" perlu berada di `TaskPage` karena dua alasan:

- `useAuditLogs(selectedTaskId)` dipanggil di container — hook butuh tahu `selectedTaskId`
- Hanya satu audit log sheet yang boleh terbuka sekaligus — logika ini tidak bisa ada di `TaskItem` individual

Trade-off: `TaskItem` menerima `isSelected` dan `onSelectTask` sebagai props — sedikit lebih verbose, tapi state ownership menjadi jelas.

---

## Reasoning: Tiga Pertanyaan Utama

### 1. Bagaimana Memastikan Audit Log Tidak Ter-modifikasi?

Ada tiga lapisan proteksi, dari yang paling lemah ke yang paling kuat:

**Layer 1 — TypeScript `Readonly<T>`**
Object `AuditLog` tidak bisa di-mutate setelah dibuat di level type system.

**Layer 2 — Interface Segregation**
`IAuditLogRepository` hanya punya `insert()` dan `findByTaskId()`. Tidak ada `update()` atau `delete()`. Method yang tidak ada tidak bisa dipanggil — kesalahan menjadi compile error.

**Layer 3 — Tidak Ada HTTP Endpoint untuk Mutasi Log**
Tidak ada `PUT /audit-logs/:id` atau `DELETE /audit-logs/:id` di router manapun.

Ketiga lapisan ini melindungi dari **kesalahan tidak disengaja**. Untuk jaminan yang lebih kuat di production, solusi yang tepat adalah database-level constraint (`INSERT-only table`, `REVOKE UPDATE, DELETE`).

---

### 2. Bagian Paling Berisiko Jika Digunakan Banyak User

**Race condition di `updateTaskStatus`.**

Skenario:

```
User A baca Task#1 → status: "to_do"   ─┐
User B baca Task#1 → status: "to_do"   ─┘ (bersamaan)

Keduanya lolos validasi transition to_do → pending
Keduanya write → salah satu overwrite yang lain
Hasilnya: dua audit log untuk satu transisi, atau log tidak konsisten dengan status akhir
```

Risiko lain:

- Server crash antara `taskRepo.save()` dan `auditLogClient.recordStatusChange()` → status berubah tapi tidak ada log
- In-memory store tumbuh tak terbatas → memory leak di production jangka panjang

Mitigasi jangka pendek: mutex/lock per `taskId` untuk serialisasi concurrent update.
Solusi proper: database transaction + optimistic locking (version field pada Task entity).

---

### 3. Jika Sistem Berkembang, Bagian Mana yang Direfactor Pertama?

**Prioritas #1 — Ganti "fake atomic" dengan real transaction.**
Ini correctness issue, bukan feature. Harus diselesaikan sebelum apapun:

```typescript
// Target setelah refactor:
await db.transaction(async (trx) => {
  await taskRepo.save(task, trx);
  await auditLogRepo.insert(log, trx);
});
```

**Prioritas #2 — Arsitektur: Modular Monolith tetap, bukan langsung microservices.**

Alasan tidak langsung microservices:

- Distributed transaction jauh lebih kompleks dari DB transaction
- Operational overhead tidak sebanding dengan benefit di tahap ini
- Modular Monolith dengan Port & Adapter sudah memberikan separation of concern yang cukup

Struktur saat ini sudah module-based. Yang berubah saat sistem berkembang:

```
Sekarang (in-process adapter):      Kalau perlu split service:
AuditLogClient
  └── auditLogRepo.insert(log)       └── fetch('http://audit-log-svc/logs', ...)

IAuditLogClient tidak berubah.
TaskService tidak berubah.
Hanya isi method AuditLogClient yang berubah.
```

**Kapan baru pertimbangkan microservices:**

- Task dan AuditLog perlu deploy/scale independen
- Tim yang mengerjakan sudah berbeda
- Volume event terlalu besar untuk in-process handling

---

## Jika Ada Waktu Lebih

Urutan berdasarkan impact tertinggi terlebih dahulu:

**Correctness**

- Tambah database nyata (SQLite cukup) untuk menggantikan in-memory store, sehingga atomic transaction bisa diterapkan
- Tambah optimistic locking pada Task entity (`version` field) untuk menangani concurrent update

**Reliability**

- Implementasi retry mechanism di `AuditLogClient.recordStatusChange()` — kalau insert gagal, ada mekanisme untuk mencoba ulang sebelum throw
- Tambah request ID di setiap response untuk traceability

**Developer Experience**

- Unit test untuk `TaskService` — terutama untuk case: idempotency, invalid transition, concurrent update
- Integration test untuk setiap endpoint dengan supertest
- OpenAPI/Swagger documentation otomatis dari Zod schemas

**Observability**

- Structured logging (JSON) dengan level (info, warn, error)
- Tambah `GET /tasks/:id/audit-logs` dengan pagination — kalau task hidup lama, log bisa sangat banyak

**Frontend**

- Tambah toast notification (shadcn `Sonner`) untuk feedback sukses/gagal operasi — saat ini tidak ada feedback visual setelah mutasi
- Tambah optimistic update di `useUpdateTaskStatus` — update UI sebelum response BE datang agar terasa lebih responsif
- Aktifkan routing dan pisahkan halaman detail task jika fitur berkembang

---

## Penggunaan AI

AI digunakan secara ekstensif dalam project ini — mulai dari perencanaan arsitektur, penentuan struktur folder, penulisan interface, hingga drafting README ini sendiri.

### Apa yang dibantu AI:

- Menyusun dan memverbalisasi keputusan arsitektur (layered architecture, Port & Adapter, manual DI)
- Mendraft interface dan template kode per layer
- Membantu menjaga konsistensi penamaan dan pola across seluruh codebase
- Merumuskan trade-off dan asumsi dalam bahasa yang terstruktur

### Apa yang tidak bisa digantikan AI:

AI tidak tahu konteks bisnis spesifik, tidak bisa memvalidasi bahwa output-nya benar dan tidak bertanggung jawab atas hasilnya. Semua keputusan tetap harus dipahami dan dipertahankan oleh yang menulisnya.

### Bagaimana saya memvalidasinya:

Pertama, saya mampu menjelaskan setiap keputusan dari prinsip dasarnya — bukan hafalan. Kalau ada yang bertanya "kenapa IAuditLogRepository tidak extend IBaseRepository?", jawabannya bukan karena AI bilang begitu, tapi karena Interface Segregation Principle dan audit log bersifat append-only by design.

Kedua, saya melakukan cross-check konsistensi secara manual:

```bash
Apakah setiap interface punya concrete class yang implement-nya? ✅
Apakah dependency hanya mengalir satu arah (tidak ada circular)? ✅
Apakah shared-types tidak import dari backend atau frontend? ✅
Apakah wiring DI hanya ada di module files dan main.ts? ✅
Apakah query key hierarchy React Query konsisten dengan invalidasi? ✅
```

Ketiga, saya bisa men-trace alur data end-to-end dari HTTP request sampai ke store dan kembali ke UI — tanpa melihat catatan. Itu standar validasi saya: kalau tidak bisa jelaskan tanpa bantuan, berarti belum benar-benar dipahami.

### Sikap saya terhadap AI dalam konteks ini:

AI adalah alat untuk mempercepat eksternalisasi pemikiran dan menjaga konsistensi dokumentasi. Bukan pengganti pemahaman. Kalau saya tidak bisa mempertahankan setiap keputusan dalam sesi review, maka penggunaan AI tidak memberikan nilai — hanya memberikan ilusi produktivitas. Dalam proses belajarpun saya tidak mengizinkan AI untuk menulis kode langsung kedalam project agar tidak membuat pemahaman saya tumpul karena pemanfaatan AI.

## Tech Stack

| Layer                      | Technology                                       |
| -------------------------- | ------------------------------------------------ |
| Monorepo                   | NX                                               |
| Backend                    | Node.js + Express + TypeScript                   |
| Frontend                   | React + TypeScript + Vite                        |
| UI Framework               | Tailwind CSS v4 + shadcn/ui                      |
| Server State               | TanStack React Query v5                          |
| HTTP Client                | Axios                                            |
| Routing                    | React Router v6 (terpasang, belum aktif)         |
| Validation                 | Zod — shared antara FE dan BE via `shared-types` |
| Storage                    | In-Memory (Map + Array)                          |
| Inter-Module Communication | Port & Adapter (IAuditLogClient)                 |
| Type Safety                | TypeScript strict mode                           |
