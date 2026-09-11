import { UserRepository } from './user.repository';
import { IDbClient } from '../../shared/clients/db.client.interface';
import { IUserClient } from '../../shared/clients/user.client.interface';
import { UserClient } from './user.client';

export interface UserModuleDependencies {
  dbClient: IDbClient;
}

export interface UserModule {
  client: IUserClient;
}

export function createUserModule(deps: UserModuleDependencies): UserModule {
  const userRepo = new UserRepository(deps.dbClient);

  const client = new UserClient(userRepo);

  return { client };
}
