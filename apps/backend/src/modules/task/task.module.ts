import type { ITaskService } from './interfaces/task.service.interface';
import type { ITaskController } from './interfaces/task.controller.interface';
import type { Router } from 'express';

import { TaskRepository } from './task.repository';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { createTaskRouter } from './task.route';
import { IAuditLogClient } from '../../shared/clients/audit-log.client.interface';
import { IDbClient } from '../../shared/clients/db.client.interface';

export interface TaskModuleDependencies {
  auditLogClient: IAuditLogClient;
  dbClient: IDbClient;
}

export interface TaskModule {
  service: ITaskService;
  controller: ITaskController;
  router: Router;
}

export function createTaskModule(deps: TaskModuleDependencies): TaskModule {
  const taskRepo = new TaskRepository(deps.dbClient);

  const service = new TaskService(taskRepo, deps.auditLogClient);
  const controller = new TaskController(service);
  const router = createTaskRouter(controller);

  return { service, controller, router };
}
