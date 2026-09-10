import { Router } from 'express';
import { IAuthController } from './interfaces/auth.controller.interface';
import { validateBody } from '../../shared/middlewares/validate-body.middleware';
import { authSchema, createUserSchema } from '@task-manager/shared-types';
import { authenticate } from '../../shared/middlewares/authenticate.middleware';

export function createAuthRouter(controller: IAuthController) {
  const router = Router();

  router.post(
    '/login',
    validateBody(authSchema),
    controller.login.bind(controller),
  );

  router.post(
    '/register',
    validateBody(createUserSchema),
    controller.register.bind(controller),
  );

  router.get('/profile', authenticate, controller.getProfile.bind(controller));

  return router;
}
