import type { TaskStatus, Actor } from './task.schemas.js';

// ──────────────────────────────────────────────
// AuditLog — Readonly by design
// Readonly<T> bukan hanya style choice:
// ini sinyal eksplisit bahwa object ini tidak
// boleh di-mutate setelah dibuat
// ──────────────────────────────────────────────
export type AuditLog = Readonly<{
  id: string;
  taskId: string;
  actor: Actor;
  fromStatus: TaskStatus;
  toStatus: TaskStatus;
  changedAt: Date;
  description: string; // e.g: 'john.doe changed "Prepare Invoice" from to_do to pending'
}>;
