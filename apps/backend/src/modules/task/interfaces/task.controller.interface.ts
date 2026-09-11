import type { Request, Response, NextFunction } from 'express';

export interface ITaskController {
  getAllTasks(req: Request, res: Response, next: NextFunction): Promise<void>;
  getTaskById(req: Request, res: Response, next: NextFunction): Promise<void>;
  createTask(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateTask(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateTaskStatus(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  deleteTask(req: Request, res: Response, next: NextFunction): Promise<void>;
  getAuditLogs(req: Request, res: Response, next: NextFunction): Promise<void>;
}
