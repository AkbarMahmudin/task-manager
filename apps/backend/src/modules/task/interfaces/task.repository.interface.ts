import { Task, TaskStatus } from '@task-manager/shared-types';
import { IBaseRepository } from '../../../shared/interfaces/base.repository.interface';

export interface ITaskRepository extends IBaseRepository<Task, string> {
  findAll(filter?: ITaskFindAllFilter): Promise<Task[]>;
}

export interface ITaskFindAllFilter {
  status?: TaskStatus;
  userId?: string;
  page?: number;
  limit?: number;
}
