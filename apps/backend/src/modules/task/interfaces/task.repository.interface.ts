import { Task } from '@task-manager/shared-types';
import { IBaseRepository } from '../../../shared/interfaces/base.repository.interface';
import { ITaskFindAllFilter } from './task.dto.interface';

export interface ITaskRepository extends IBaseRepository<Task, string> {
  findAll(filter?: ITaskFindAllFilter): Promise<Task[]>;
}
