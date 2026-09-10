export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  code:
    | 'INVALID_TRANSITION'
    | 'TASK_NOT_FOUND'
    | 'VALIDATION_ERROR'
    | 'IDEMPOTENT_UPDATE'
    | 'UNAUTHORIZED'
    | 'CONFLICT'
    | 'FORBIDDEN'
    | 'FAILED_PROCESS'
    | 'BAD_REQUEST'
    | 'NOT_FOUND';
}
