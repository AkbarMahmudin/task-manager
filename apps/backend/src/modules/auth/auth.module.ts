import { Router } from 'express';
import { IUserClient } from '../../shared/clients/user.client.interface';
import { IAuthController } from './interfaces/auth.controller.interface';
import { IAuthService } from './interfaces/auth.service.interface';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { createAuthRouter } from './auth.route';

export interface AuthModuleDependencies {
  userClient: IUserClient;
}

export interface AuthModule {
  service: IAuthService;
  controller: IAuthController;
  router: Router;
}

export function createAuthModule(deps: AuthModuleDependencies): AuthModule {
  const service = new AuthService(deps.userClient);
  const controller = new AuthController(service);
  const router = createAuthRouter(controller);

  return { service, controller, router };
}
