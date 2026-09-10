import { Router } from 'express';
import { ITaskController } from '../controllers/interfaces/task.controller.interface';
import { validateBody } from '../../../shared/middlewares/validate-body.middleware';
import {
  createTaskSchema,
  updateTaskStatusSchema,
} from '@task-manager/shared-types';
import { authenticate } from '../../../shared/middlewares/authenticate.middleware';

export function createTaskRouter(controller: ITaskController) {
  const router = Router();

  router.use(authenticate);

  router.post(
    '/',
    validateBody(createTaskSchema),
    controller.createTask.bind(controller),
  );

  router.get('/', controller.getAllTasks.bind(controller));

  router.get('/:id', controller.getTaskById.bind(controller));

  router.patch(
    '/:id/status',
    validateBody(updateTaskStatusSchema),
    controller.updateTaskStatus.bind(controller),
  );

  router.delete('/:id', controller.deleteTask.bind(controller));

  router.get('/:id/audit-logs', controller.getAuditLogs.bind(controller));

  return router;
}
