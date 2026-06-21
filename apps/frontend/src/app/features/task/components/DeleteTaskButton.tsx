import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@task-manager/ui/components/alert-dialog';
import { buttonVariants } from '@task-manager/ui/components/button';
import { Trash } from 'lucide-react';
import { DeleteTaskButtonProps } from '../types';

export function DeleteTaskButton({
  taskId,
  taskTitle,
  onConfirm,
  isDeleting,
}: DeleteTaskButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        className={buttonVariants({
          variant: 'ghost',
          size: 'icon',
        })}
      >
        <Trash className="text-destructive" />
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Task</AlertDialogTitle>
          <AlertDialogDescription>
            Delete &quot;{taskTitle}&quot;? This cannot be undone. Audit logs
            will be preserved.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onConfirm(taskId)}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
