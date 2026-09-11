import { Task } from '@task-manager/shared-types';
import { ITaskRepository } from './interfaces/task.repository.interface';
import { IDbClient } from '../../shared/clients/db.client.interface';
import { tasks } from '../../db/schema';
import { and, count, eq, ilike, SQL } from 'drizzle-orm';
import {
  ITaskFindAllFilter,
  TaskWithMeta,
} from './interfaces/task.dto.interface';

export class TaskRepository implements ITaskRepository {
  constructor(private readonly dbClient: IDbClient) {}

  async findAll(): Promise<Task[]> {
    const db = this.dbClient.getDb();
    const conditions: SQL[] = [];

    const result = await db
      .select()
      .from(tasks)
      .where(and(...conditions));

    return result.map((row) => row as Task);
  }

  async findAllWithPagination(
    filter: ITaskFindAllFilter,
  ): Promise<TaskWithMeta> {
    const db = this.dbClient.getDb();

    const { userId, page = '1', limit = '20', search } = filter;
    const offset = (+page - 1) * +limit;

    const conditions: SQL[] = [];
    if (userId) {
      conditions.push(eq(tasks.userId, userId));
    }

    if (search) {
      conditions.push(ilike(tasks.title, `%${search}%`));
    }

    const result = await db
      .select()
      .from(tasks)
      .where(and(...conditions))
      .limit(+limit)
      .offset(offset);

    const [totalResult] = await db
      .select({ count: count() })
      .from(tasks)
      .where(and(...conditions));

    const data = result.map((row) => row as Task);
    const totalData = totalResult.count;
    const totalPages = Math.ceil(totalData / +limit);

    return {
      data,
      meta: {
        page: +page,
        limit: +limit,
        totalData,
        totalPages,
      },
    };
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
