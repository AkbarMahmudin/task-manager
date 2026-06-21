import type { ApiError } from '@task-manager/shared-types';

export class AppError extends Error {
  readonly code: ApiError['code'];
  readonly statusCode: number;

  constructor(message: string, code: ApiError['code'], statusCode: number) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function toAppError(error: unknown): AppError {
  if (isAppError(error)) return error;

  return new AppError('Unexpected error occurred', 'VALIDATION_ERROR', 0);
}
