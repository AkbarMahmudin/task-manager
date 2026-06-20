import type { ITaskService } from './services/interfaces/task.service.interface';
import type { ITaskController } from './controllers/interfaces/task.controller.interface';
import type { Router } from 'express';

import { TaskRepository } from './repositories/task.repository';
import { TaskService } from './services/task.service';
import { TaskController } from './controllers/task.controller';
import { createTaskRouter } from './routes/task.route';
import { IAuditLogClient } from '../../shared/clients/audit-log.client.interface';

export interface TaskModuleDependencies {
  auditLogClient: IAuditLogClient;
}

export interface TaskModule {
  service: ITaskService;
  controller: ITaskController;
  router: Router;
}

export function createTaskModule(deps: TaskModuleDependencies): TaskModule {
  const taskRepo = new TaskRepository();

  const service = new TaskService(taskRepo, deps.auditLogClient);
  const controller = new TaskController(service);
  const router = createTaskRouter(controller);

  return { service, controller, router };
}
