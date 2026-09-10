import {
  AuthRequest,
  CreateUserRequest,
  User,
} from '@task-manager/shared-types';

export interface IAuthService {
  login(data: AuthRequest): Promise<{
    token: string;
  }>;

  register(data: CreateUserRequest): Promise<Omit<User, 'password'>>;
}
