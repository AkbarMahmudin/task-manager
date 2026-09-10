import { User } from '@task-manager/shared-types';

export interface IUserClient {
  findByEmail(email: string): Promise<User>;
  create(user: User): Promise<Omit<User, 'password'>>;
}
