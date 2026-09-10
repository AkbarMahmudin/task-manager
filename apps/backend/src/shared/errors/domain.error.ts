import { BaseError } from './base.error';
import type { ApiError } from '@task-manager/shared-types';

// Domain errors: kesalahan karena aturan bisnis dilanggar
export class DomainError extends BaseError {
  statusCode = 422;
  code: ApiError['code'];

  constructor(message: string, code: ApiError['code']) {
    super(message);
    this.code = code;
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message: string) {
    super(message, 'UNAUTHORIZED');
    this.statusCode = 401;
  }
}
