import { BaseError } from './base.error';
import type { ApiError } from '@task-manager/shared-types';

// Domain errors: kesalahan karena aturan bisnis dilanggar
export class DomainError extends BaseError {
  readonly statusCode = 422;
  readonly code: ApiError['code'];

  constructor(message: string, code: ApiError['code']) {
    super(message);
    this.code = code;
  }
}
