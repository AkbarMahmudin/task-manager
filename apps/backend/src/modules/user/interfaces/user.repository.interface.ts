import { User } from '@task-manager/shared-types';

export interface IUserRepository {
  findByEmail(email: string): Promise<User>;
  create(user: User): Promise<User>;
}
