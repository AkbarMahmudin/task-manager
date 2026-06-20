// ──────────────────────────────────────────────
// TaskStatus: urutan ini adalah domain rule
// Urutan array ini ADALAH sumber kebenaran untuk
// validasi transisi — bukan hanya tipe data
// ──────────────────────────────────────────────
export const TASK_STATUS_ORDER = [
  'to_do',
  'pending',
  'in_progress',
  'done',
] as const;

export const PREDEFINED_ACTORS = [
  'john.doe',
  'jane.smith',
  'bob.martin',
  'alice.jones',
] as const;
