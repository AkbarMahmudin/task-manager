import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@task-manager/ui/components/table';
import { TaskItem } from './TaskItem';
import { TaskListProps } from '../types';

export const TaskList = ({ tasks, ...props }: TaskListProps) => {
  return (
    <section>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-left">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              isSelected={props.selectedTaskId === task.id}
              onSelectTask={props.onSelectTask}
              onUpdate={props.onUpdate}
              onUpdateStatus={props.onUpdateStatus}
              onDelete={props.onDelete}
              isUpdating={props.isUpdating}
              isUpdatingStatus={props.isUpdatingStatus}
              isDeleting={props.isDeleting}
            />
          ))}
        </TableBody>
      </Table>
    </section>
  );
};
