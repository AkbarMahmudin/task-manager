import { z } from 'zod';
import { TASK_STATUS_ORDER, PREDEFINED_ACTORS } from './task.types.js';

// Task Status
export const taskStatusSchema = z.enum(
  TASK_STATUS_ORDER as unknown as [string, ...string[]],
);

// Actor
export const actorSchema = z.enum(
  PREDEFINED_ACTORS as unknown as [string, ...string[]],
);

// Task
export const taskSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().optional(),
  status: taskStatusSchema,
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
});

// Request Body
export const createTaskSchema = z.object({
  title: z
    .string({ message: 'Title is required' })
    .min(1, 'Title cannot be empty')
    .max(255, 'Title cannot exceed 255 characters'),
  description: z
    .string()
    .max(1000, 'Description cannot exceed 1000 characters')
    .optional(),
});

export const updateTaskStatusSchema = z.object({
  newStatus: taskStatusSchema,
  actor: actorSchema,
});

/**
 * Delivered TypeScript Types
 */
export type TaskStatus = z.infer<typeof taskStatusSchema>;
export type Actor = z.infer<typeof actorSchema>;
export type Task = z.infer<typeof taskSchema>;
export type CreateTaskRequest = z.infer<typeof createTaskSchema>;
export type UpdateTaskStatusRequest = z.infer<typeof updateTaskStatusSchema>;
