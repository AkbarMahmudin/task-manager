import { User } from '@task-manager/shared-types';
import { IUserRepository } from './interfaces/user.repository.interface';
import { IDbClient } from '../../shared/clients/db.client.interface';
import { users } from '../../db/schema';
import { eq } from 'drizzle-orm';

export class UserRepository implements IUserRepository {
  constructor(private readonly dbClient: IDbClient) {}

  async create(user: User): Promise<User> {
    const db = this.dbClient.getDb();
    const [result] = await db
      .insert(users)
      .values(user as any)
      .returning();

    return result as unknown as User;
  }

  async findByEmail(email: string): Promise<User> {
    const db = this.dbClient.getDb();

    const [result] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    return result as unknown as User;
  }
}
