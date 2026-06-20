import { Task, TaskStatus } from '@task-manager/shared-types';
import { IBaseRepository } from '../../../../shared/interfaces/base.repository.interface';

export interface ITaskRepository extends IBaseRepository<Task, string> {
  findAll(filter?: { status?: TaskStatus }): Promise<Task[]>;
}
