import { Router } from 'express';
import { IUserClient } from '../../shared/clients/user.client.interface';
import { IAuthController } from './controllers/interfaces/auth.controller.interface';
import { IAuthService } from './services/interfaces/auth.service.interface';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { createAuthRouter } from './routes/auth.route';

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
