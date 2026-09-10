import { User } from '@task-manager/shared-types';
import { IUserRepository } from '../repositories/interfaces/user.repository.interface';
import { IUserClient } from '../../../shared/clients/user.client.interface';
import { ConflictError } from '../../../shared/errors/domain.error';

export class UserClient implements IUserClient {
  constructor(private readonly repo: IUserRepository) {}

  async findByEmail(email: string): Promise<User> {
    return this.repo.findByEmail(email);
  }

  async create(user: User): Promise<Omit<User, 'password'>> {
    const exists = await this.repo.findByEmail(user.email);
    if (exists) throw new ConflictError('User already exists');

    const { password, ...result } = await this.repo.create(user);

    return result;
  }
}
