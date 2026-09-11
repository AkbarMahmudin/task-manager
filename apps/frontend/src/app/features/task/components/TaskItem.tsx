import { TableRow, TableCell } from '@task-manager/ui/components/table';
import { TASK_STATUS_ORDER } from '@task-manager/shared-types';
import { UpdateStatusSelect } from './UpdateStatusSelect';
import { DeleteTaskButton } from './DeleteTaskButton';
import { TaskDetailButton } from './TaskDetailButton';
import { TaskItemProps } from '../types';
import { UpdateTaskForm } from './UpdateTaskForm';

export function TaskItem({ task, isSelected, ...props }: TaskItemProps) {
  const isLastStatus =
    TASK_STATUS_ORDER.indexOf(task.status as never) ===
    TASK_STATUS_ORDER.length - 1;

  return (
    <TableRow data-selected={isSelected}>
      <TableCell className={`${isLastStatus && 'line-through'}`}>
        {task.title}
      </TableCell>
      <TableCell>
        <UpdateStatusSelect
          defaultStatus={task.status}
          onSelect={(data) => {
            props.onUpdateStatus(task.id, data);
          }}
          isSubmitting={props.isUpdatingStatus}
        />
      </TableCell>
      <TableCell>
        {new Date(task?.updatedAt ?? task.createdAt).toLocaleString()}
      </TableCell>
      <TableCell className="flex justify-center gap-1.5">
        {/* Delete */}
        <DeleteTaskButton
          taskId={task.id}
          taskTitle={task.title}
          onConfirm={props.onDelete}
          isDeleting={props.isDeleting}
        />

        {/* Update */}
        <UpdateTaskForm
          isSubmitting={props.isUpdating}
          onSubmit={props.onUpdate}
          task={task}
        />

        {/* Detail */}
        <TaskDetailButton
          task={task}
          onAuditLogOpen={() => props.onSelectTask(task.id)}
        />
      </TableCell>
    </TableRow>
  );
}
