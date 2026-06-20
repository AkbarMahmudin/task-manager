# Mini Task Manager

Aplikasi internal untuk mengelola task sederhana dengan audit log perubahan status yang immutable.

---

## Cara Menjalankan

### Prerequisites

- Node.js >= 18
- npm >= 9

### 1. Clone & Install Dependencies

```bash
git clone <repository-url>
cd task-manager

# Install semua dependencies dari root (berlaku untuk semua apps & libs)
npm install
```

### 2. Jalankan Backend

```bash
# Development mode (watch)
npx nx serve backend

# Backend akan berjalan di:
# http://localhost:3000
```

### 3. Health Check

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
| PUT    | `/tasks/:id/status`     | Update status task      |
| DELETE | `/tasks/:id`            | Hapus task              |
| GET    | `/tasks/:id/audit-logs` | List audit log per task |

### Contoh Request

```bash
# Buat task baru
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{ "title": "Prepare Invoice", "description": "Q4 invoice untuk client A" }'

# Update status
curl -X PUT http://localhost:3000/tasks/<id>/status \
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
│   └── backend/              # Express + TypeScript
│       └── src/
│           ├── modules/
│           │   ├── task/            # Task module
│           │   │   ├── repositories/ # Data access (in-memory)
│           │   │   ├── services/     # Business logic
│           │   │   ├── controllers/  # HTTP layer
│           │   │   └── routes/       # Express router
│           │   └── audit-log/       # AuditLog module (independen)
│           │       ├── repositories/
│           │       └── services/
│           │           └── audit-log.client.ts  # Adapter — implements IAuditLogClient
│           └── shared/
│               ├── clients/          # Outgoing port interfaces (Port & Adapter)
│               │   └── audit-log.client.interface.ts
│               ├── errors/           # BaseError, DomainError
│               └── middlewares/      # validateBody, errorHandler
│
└── libs/
    └── shared-types/         # Types, Zod schemas
        └── src/lib/
            ├── task.types.ts         # Constants (TASK_STATUS_ORDER, PREDEFINED_ACTORS)
            ├── task.schemas.ts       # Zod schemas + derived TypeScript types
            ├── audit-log.types.ts    # AuditLog interface
            └── api.types.ts          # ApiResponse, ApiError
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

Semua layer bergantung ke interface, bukan concrete class. Concrete class hanya disebutkan satu kali di `task.module.ts` dan `main.ts`.

```
Controller      →  ITaskService
TaskService     →  ITaskRepository + IAuditLogClient
AuditLogClient  →  IAuditLogRepository
Repository      →  (implementasi konkret, tidak ada dependency ke layer atas)
```

Concrete class hanya disebutkan satu kali: di `task.module.ts`, `audit-log.module.ts`, dan `main.ts`.

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
- Tidak ada HTTP endpoint `PUT/DELETE` untuk audit log
- `AuditLog` type menggunakan `Readonly<T>`

Ini cukup untuk mencegah kesalahan tidak disengaja, tapi tidak cukup untuk mencegah manipulasi langsung ke store. Solusi proper: database dengan `REVOKE UPDATE, DELETE ON audit_logs FROM app_user`.

### 3. AuditLog Query setelah Task Dihapus

`GET /tasks/:id/audit-logs` akan mengembalikan `404 TASK_NOT_FOUND` meski log-nya masih ada di store — karena service melakukan guard `findTaskOrThrow` sebelum query log. Ini trade-off antara:

- Konsistensi API (`/tasks/:id` tidak ada → seluruh resource di bawahnya 404)
- Akses ke historical data (log tetap tersimpan tapi tidak bisa diakses via API)

Untuk scope internal tool, ini dianggap acceptable.

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

---

## Tech Stack

| Layer                      | Technology                       |
| -------------------------- | -------------------------------- |
| Monorepo                   | NX                               |
| Backend                    | Node.js + Express + TypeScript   |
| Validation                 | Zod (shared antara FE dan BE)    |
| Storage                    | In-Memory (Map + Array)          |
| Inter-Module Communication | Port & Adapter (IAuditLogClient) |
| Type Safety                | TypeScript strict mode           |
