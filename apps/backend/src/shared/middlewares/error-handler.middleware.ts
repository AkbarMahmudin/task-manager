import type { Request, Response, NextFunction } from 'express';
import type { ApiError } from '@task-manager/shared-types';
import { DomainError } from '../errors/domain.error';
import { BaseError } from '../errors/base.error';

export function errorHandlerMiddleware(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // ── Case 1: Domain error (aturan bisnis dilanggar) ────────────────
  if (error instanceof DomainError) {
    const response: ApiError = {
      success: false,
      error: error.message,
      code: error.code,
    };
    res.status(error.statusCode).json(response);
    return;
  }

  // ── Case 2: Base error (custom error lain yang kita definisikan) ──
  if (error instanceof BaseError) {
    const response: ApiError = {
      success: false,
      error: error.message,
      code: 'VALIDATION_ERROR',
    };
    res.status(error.statusCode).json(response);
    return;
  }

  // ── Case 3: Unknown error (bug, crash library, dll) ───────────────
  // Jangan expose detail error ke client di production
  console.error('[Unhandled Error]', error);

  const response: ApiError = {
    success: false,
    error: 'An unexpected error occurred',
    code: 'VALIDATION_ERROR',
  };
  res.status(500).json(response);
}
