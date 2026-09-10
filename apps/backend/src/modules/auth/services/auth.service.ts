import {
  AuthRequest,
  CreateUserRequest,
  User,
} from '@task-manager/shared-types';
import { IUserClient } from '../../../shared/clients/user.client.interface';
import { IAuthService } from './interfaces/auth.service.interface';
import { hash, compare } from 'bcrypt';
import { randomUUID } from 'crypto';
import { signToken } from '../../../shared/utils/jwt.util';
import { UnauthorizedError } from '../../../shared/errors/domain.error';

export class AuthService implements IAuthService {
  constructor(private readonly userClient: IUserClient) {}

  async login(data: AuthRequest): Promise<{ token: string }> {
    const user = await this.userClient.findByEmail(data.email);
    if (!user) throw new UnauthorizedError('Invalid credentials');

    const valid = await compare(data.password, user.password);
    if (!valid) throw new UnauthorizedError('Invalid credentials');

    const token = signToken({ userId: user.id, email: user.email });
    return { token };
  }

  async register(
    data: CreateUserRequest,
  ): Promise<Omit<User, 'password'> & { token: string }> {
    const hashPassword = await hash(data.password, 10);
    const now = new Date();

    const user = await this.userClient.create({
      ...data,
      id: randomUUID(),
      password: hashPassword,
      createdAt: now,
      updatedAt: now,
    });

    const token = signToken({ userId: user.id, email: user.email });

    return {
      ...user,
      token,
    };
  }

  async getProfile(email: string): Promise<Omit<User, 'password'>> {
    const { password, ...user } = await this.userClient.findByEmail(email);
    return user;
  }
}
