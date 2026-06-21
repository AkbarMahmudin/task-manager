import { Badge } from '@task-manager/ui/components/badge';
import { type TaskStatus } from '@task-manager/shared-types';

const STATUS_CONFIG: Record<
  TaskStatus,
  {
    label: string;
    variant: 'secondary' | 'outline' | 'default' | 'destructive';
  }
> = {
  to_do: { label: 'To Do', variant: 'outline' },
  pending: { label: 'Pending', variant: 'secondary' },
  in_progress: { label: 'In Progress', variant: 'default' },
  done: { label: 'Done', variant: 'destructive' },
};

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const config = STATUS_CONFIG[status];

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
