import { TaskStatus, Task } from '@task-manager/shared-types';
import { ITaskRepository } from './interfaces/task.repository.interface';
import { IDbClient } from '../../../shared/clients/db.client.interface';
import { tasks } from '../../../db/schema';
import { and, eq } from 'drizzle-orm';

export class TaskRepository implements ITaskRepository {
  constructor(private readonly dbClient: IDbClient) {}

  async findAll(filter?: { status?: TaskStatus }): Promise<Task[]> {
    const db = this.dbClient.getDb();
    const result = await db.select().from(tasks);

    return result.map((row) => row as Task);
  }

  async findById(id: string): Promise<Task | null> {
    const db = this.dbClient.getDb();
    const [result] = await db.select().from(tasks).where(eq(tasks.id, id));

    return result as Task;
  }

  async create(entity: Task): Promise<void> {
    const db = this.dbClient.getDb();

    await db.insert(tasks).values(entity as any);
  }

  async update(id: string, entity: Partial<Task>): Promise<void> {
    const db = this.dbClient.getDb();

    await db
      .update(tasks)
      .set(entity as any)
      .where(eq(tasks.id, id));
  }

  async delete(id: string): Promise<void> {
    await this.dbClient.getDb().delete(tasks).where(eq(tasks.id, id));
  }
}
