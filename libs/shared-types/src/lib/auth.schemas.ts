import z from 'zod';

// Request Body
export const authSchema = z.object({
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
export type AuthRequest = z.infer<typeof authSchema>;
