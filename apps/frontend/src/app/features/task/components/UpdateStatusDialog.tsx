import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@task-manager/ui/components/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@task-manager/ui/components/dialog';
import {
  TASK_STATUS_ORDER,
  PREDEFINED_ACTORS,
  type Actor,
} from '@task-manager/shared-types';
import { TaskStatusBadge } from './TaskStatusBadge';
import { Button } from '@task-manager/ui/components/button';
import { UpdateStatusDialogProps } from '../types';

export function UpdateStatusDialog({
  open,
  onOpenChange,
  task,
  onConfirm,
  isSubmitting,
}: UpdateStatusDialogProps) {
  const [actor, setActor] = useState<Actor | ''>('');

  const currentIndex = TASK_STATUS_ORDER.indexOf(task.status as never);
  const nextStatus = TASK_STATUS_ORDER[currentIndex + 1];

  function handleConfirm() {
    if (!actor || !nextStatus) return;
    onConfirm({ newStatus: nextStatus, actor });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Status</DialogTitle>
          <DialogDescription>{task.title}</DialogDescription>
        </DialogHeader>

        {/* Visualisasi transisi */}
        <div>
          <TaskStatusBadge status={task.status} />
          <span>→</span>
          {nextStatus && <TaskStatusBadge status={nextStatus} />}
        </div>

        {/* Actor dropdown */}
        <div>
          <Select value={actor} onValueChange={(val) => setActor(val as Actor)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Who is making this change?" />
            </SelectTrigger>
            <SelectContent>
              {PREDEFINED_ACTORS.map((a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!actor || isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Confirm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
