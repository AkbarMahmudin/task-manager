import { Request, Response, NextFunction } from 'express';
import { ITaskController } from './interfaces/task.controller.interface';
import { ITaskService } from './interfaces/task.service.interface';
import { ApiResponse } from '@task-manager/shared-types';

export class TaskController implements ITaskController {
  constructor(private readonly service: ITaskService) {}

  async getAllTasks(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.userId ?? '';
      const tasks = await this.service.getAllTasks({ userId: '' });
      const response: ApiResponse<typeof tasks> = {
        success: true,
        data: tasks,
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getTaskById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const task = await this.service.getTaskById(String(id));
      const response: ApiResponse<typeof task> = {
        success: true,
        data: task,
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async createTask(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const data = req.body;
      const userId = req.user?.userId ?? '';
      const task = await this.service.createTask(data, userId);
      const response: ApiResponse<typeof task> = {
        success: true,
        data: task,
        message: 'New task created successfully.',
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateTaskStatus(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const data = req.body;
      const task = await this.service.updateTaskStatus(String(id), data);
      const response: ApiResponse<typeof task> = {
        success: true,
        data: task,
        message: 'Task status updated successfully.',
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateTask(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const data = req.body;
      const userId = req.user?.userId ?? '';
      const task = await this.service.updateTask(String(id), data, userId);
      const response: ApiResponse<typeof task> = {
        success: true,
        data: task,
        message: 'Task updated successfully.',
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async deleteTask(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId ?? '';
      await this.service.deleteTask(String(id), userId);
      const response: ApiResponse<null> = {
        success: true,
        data: null,
        message: 'Task deleted successfully.',
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getAuditLogs(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const auditLogs = await this.service.getAuditLogs(String(id));
      const response: ApiResponse<typeof auditLogs> = {
        success: true,
        data: auditLogs,
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
