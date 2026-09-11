import { Task, TaskStatus } from '@task-manager/shared-types';

export interface ITaskFindAllFilter {
  status?: TaskStatus;
  userId?: string;
  page?: string;
  limit?: string;
  search?: string;
}

export interface TaskWithMeta {
  data: Task[];
  meta: {
    page: number;
    limit: number;
    totalData: number;
    totalPages: number;
  };
}
