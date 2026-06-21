import { useState } from 'react';
import { Button } from '@task-manager/ui/components/button';
import { TaskStatusBadge } from './TaskStatusBadge';
import { TableRow, TableCell } from '@task-manager/ui/components/table';
import { TASK_STATUS_ORDER } from '@task-manager/shared-types';
import { Pencil } from 'lucide-react';
import { UpdateStatusDialog } from './UpdateStatusDialog';
import { DeleteTaskButton } from './DeleteTaskButton';
import { TaskDetailButton } from './TaskDetailButton';
import { TaskItemProps } from '../types';

export function TaskItem({ task, isSelected, ...props }: TaskItemProps) {
  const [updateStatusOpen, setUpdateStatusOpen] = useState(false);

  const isLastStatus =
    TASK_STATUS_ORDER.indexOf(task.status as never) ===
    TASK_STATUS_ORDER.length - 1;

  return (
    <TableRow data-selected={isSelected}>
      <TableCell className={`${isLastStatus && 'line-through'}`}>
        {task.title}
      </TableCell>
      <TableCell>
        <TaskStatusBadge status={task.status} />
      </TableCell>
      <TableCell>
        {new Date(task?.updatedAt ?? task.createdAt).toLocaleString()}
      </TableCell>
      <TableCell>
        {/* Update Status */}
        <Button
          variant="outline"
          size="icon"
          disabled={isLastStatus}
          onClick={() => setUpdateStatusOpen(true)}
        >
          <Pencil />
        </Button>

        <UpdateStatusDialog
          open={updateStatusOpen}
          onOpenChange={setUpdateStatusOpen}
          task={task}
          onConfirm={(data) => {
            props.onUpdateStatus(task.id, data);
            setUpdateStatusOpen(false);
          }}
          isSubmitting={props.isUpdatingStatus}
        />

        {/* Delete */}
        <DeleteTaskButton
          taskId={task.id}
          taskTitle={task.title}
          onConfirm={props.onDelete}
          isDeleting={props.isDeleting}
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
