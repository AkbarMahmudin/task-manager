import { TaskStatus, Task } from '@task-manager/shared-types';
import { ITaskRepository } from './interfaces/task.repository.interface';

export class TaskRepository implements ITaskRepository {
  private readonly store = new Map<string, Task>();

  async findAll(filter?: { status?: TaskStatus }): Promise<Task[]> {
    const tasks = Array.from(this.store.values());

    return tasks;
  }

  async findById(id: string): Promise<Task | null> {
    return this.store.get(id) ?? null;
  }

  async save(entity: Task): Promise<void> {
    this.store.set(entity.id, entity);
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id);
  }
}
