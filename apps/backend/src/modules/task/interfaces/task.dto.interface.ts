import { TaskStatus } from '@task-manager/shared-types';

export interface ITaskFindAllFilter {
  status?: TaskStatus;
  userId?: string;
  page?: string;
  limit?: string;
  search?: string;
}
