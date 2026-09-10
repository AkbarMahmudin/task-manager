import { TaskStatus, Task } from '@task-manager/shared-types';
import {
  ITaskFindAllFilter,
  ITaskRepository,
} from './interfaces/task.repository.interface';
import { IDbClient } from '../../shared/clients/db.client.interface';
import { tasks } from '../../db/schema';
import { and, eq, SQL } from 'drizzle-orm';

export class TaskRepository implements ITaskRepository {
  constructor(private readonly dbClient: IDbClient) {}

  async findAll(filter: ITaskFindAllFilter): Promise<Task[]> {
    const db = this.dbClient.getDb();

    const conditions: SQL[] = [];
    if (filter?.userId) {
      conditions.push(eq(tasks.userId, filter?.userId));
    }

    const result = await db
      .select()
      .from(tasks)
      .where(and(...conditions));

    return result.map((row) => row as Task);
  }

  async findById(id: string): Promise<Task | null> {
    const db = this.dbClient.getDb();
    const [result] = await db.select().from(tasks).where(eq(tasks.id, id));

    return result as Task;
  }

  async create(entity: Task): Promise<Task> {
    const db = this.dbClient.getDb();

    const [result] = await db
      .insert(tasks)
      .values(entity as any)
      .returning();

    return result as unknown as Task;
  }

  async update(id: string, entity: Partial<Task>): Promise<Task> {
    const db = this.dbClient.getDb();

    const [result] = await db
      .update(tasks)
      .set(entity as any)
      .where(eq(tasks.id, id))
      .returning();

    return result as unknown as Task;
  }

  async delete(id: string): Promise<void> {
    await this.dbClient.getDb().delete(tasks).where(eq(tasks.id, id));
  }
}
