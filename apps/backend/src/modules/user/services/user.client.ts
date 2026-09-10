import { User } from '@task-manager/shared-types';
import { IUserRepository } from '../repositories/interfaces/user.repository.interface';
import { IUserClient } from '../../../shared/clients/user.client.interface';

export class UserClient implements IUserClient {
  constructor(private readonly repo: IUserRepository) {}

  async findByEmail(email: string): Promise<User> {
    return this.repo.findByEmail(email);
  }

  async create(user: User): Promise<Omit<User, 'password'>> {
    const { password, ...result } = await this.repo.create(user);

    return result;
  }
}
