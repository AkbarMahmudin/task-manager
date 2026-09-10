import type { Request, Response, NextFunction } from 'express';

export interface IAuthController {
  login(req: Request, res: Response, next: NextFunction): Promise<void>;
  register(req: Request, res: Response, next: NextFunction): Promise<void>;
  getProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
}
