import z from 'zod';

// User
export const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
});

// Request Body
export const createUserSchema = z.object({
  name: z
    .string({ message: 'Name is required' })
    .min(1, 'Name cannot be empty')
    .max(255, 'Name cannot exceed 255 characters'),
  email: z
    .string({ message: 'Email is required' })
    .email({ message: 'Email invalid format' })
    .min(1, 'Email cannot be empty')
    .max(255, 'Email cannot exceed 255 characters'),
  password: z
    .string({ message: 'Password is required' })
    .min(1, 'Password cannot be empty')
    .max(16, 'Password cannot exceed 16 characters'),
});

export const updateUserSchema = z.object({
  name: z
    .string({ message: 'Name is required' })
    .min(1, 'Name cannot be empty')
    .max(255, 'Name cannot exceed 255 characters')
    .optional(),
  email: z
    .string({ message: 'Email is required' })
    .email({ message: 'Email invalid format' })
    .min(1, 'Email cannot be empty')
    .max(255, 'Email cannot exceed 255 characters')
    .optional(),
  password: z
    .string({ message: 'Password is required' })
    .min(1, 'Password cannot be empty')
    .max(8, 'Password cannot exceed 8 characters')
    .optional(),
});

export const authUserSchema = z.object({
  email: z
    .string({ message: 'Email is required' })
    .email({ message: 'Email invalid format' })
    .min(1, 'Email cannot be empty')
    .max(255, 'Email cannot exceed 255 characters'),
  password: z
    .string({ message: 'Password is required' })
    .min(1, 'Password cannot be empty')
    .max(8, 'Password cannot exceed 8 characters'),
});

/**
 * Delivered TypeScript Types
 */
export type User = z.infer<typeof userSchema>;
export type CreateUserRequest = z.infer<typeof createUserSchema>;
export type UpdateUserRequest = z.infer<typeof updateUserSchema>;
export type AuthUserRequest = z.infer<typeof authUserSchema>;
