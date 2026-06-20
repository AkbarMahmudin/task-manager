import type { Request, Response, NextFunction } from 'express';

// Controller hanya bertanggung jawab:
// 1. Parse request (params, body, query)
// 2. Panggil service
// 3. Format response
// Tidak ada business logic di sini
export interface ITaskController {
  getAllTasks(req: Request, res: Response, next: NextFunction): Promise<void>;
  getTaskById(req: Request, res: Response, next: NextFunction): Promise<void>;
  createTask(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateTaskStatus(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  deleteTask(req: Request, res: Response, next: NextFunction): Promise<void>;
  getAuditLogs(req: Request, res: Response, next: NextFunction): Promise<void>;
}
