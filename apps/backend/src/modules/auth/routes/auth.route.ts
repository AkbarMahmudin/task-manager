import { Router } from 'express';
import { IAuthController } from '../controllers/interfaces/auth.controller.interface';
import { validateBody } from '../../../shared/middlewares/validate-body.middleware';
import { authSchema, createUserSchema } from '@task-manager/shared-types';

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

  return router;
}
