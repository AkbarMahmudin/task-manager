import { Request, Response, NextFunction } from 'express';
import { IAuthController } from './interfaces/auth.controller.interface';
import { IAuthService } from '../services/interfaces/auth.service.interface';
import { ApiResponse } from '@task-manager/shared-types';

export class AuthController implements IAuthController {
  constructor(private readonly service: IAuthService) {}

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = req.body;
      const result = await this.service.login(data);
      const response: ApiResponse<typeof result> = {
        success: true,
        data: result,
        message: 'User authenticated successfully.',
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const data = req.body;
      const user = await this.service.register(data);
      const response: ApiResponse<typeof user> = {
        success: true,
        data: user,
        message: 'New user created successfully.',
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getProfile(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const email = req.user?.email ?? '';
      const user = await this.service.getProfile(email);
      const response: ApiResponse<typeof user> = {
        success: true,
        data: user,
        message: 'User retrieved successfully.',
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
