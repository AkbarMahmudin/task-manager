import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema, ZodError } from 'zod';
import type { ApiError } from '@task-manager/shared-types';

export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req?.body);

    if (!result.success) {
      const errorMessages = formatZodError(result.error);

      const response: ApiError = {
        success: false,
        error: errorMessages,
        code: 'VALIDATION_ERROR',
      };

      res.status(400).json(response);
      return;
    }

    req.body = result.data;
    next();
  };
}

function formatZodError(error: ZodError): string {
  const flat = error.flatten();

  const fieldErrors = Object.entries(flat.fieldErrors)
    .map(
      ([field, messages]) =>
        `${field}: ${(messages as string[] | undefined)?.join(', ')}`,
    )
    .join(' | ');

  return fieldErrors || 'Invalid request body';
}
