import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from '@task-manager/ui/components/drawer';
import { TaskStatusBadge } from './TaskStatusBadge';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@task-manager/ui/components/item';
import {
  AlignJustifyIcon,
  ArrowRightIcon,
  Calendar,
  CalendarPlus,
  EyeIcon,
  History,
  Timeline,
  X,
} from 'lucide-react';
import { Button, buttonVariants } from '@task-manager/ui/components/button';
import { TaskDetailButtonProps } from '../types';
import { useIsMobile } from '../../../hooks/use-mobile';

export const TaskDetailButton = ({ task, ...props }: TaskDetailButtonProps) => {
  const isMobile = useIsMobile();

  return (
    <Drawer direction={isMobile ? 'bottom' : 'right'}>
      <DrawerTrigger
        className={buttonVariants({
          size: 'icon',
          variant: 'outline',
        })}
      >
        <EyeIcon />
      </DrawerTrigger>
      <DrawerContent className="overflow-hidden">
        <DrawerHeader className="bg-secondary-foreground flex flex-row items-center">
          <DrawerTitle className="text-muted flex-1">{task.title}</DrawerTitle>
          <DrawerClose
            className={buttonVariants({
              size: 'icon',
              className: 'text-foreground',
            })}
          >
            <X />
          </DrawerClose>
        </DrawerHeader>

        <div className="flex w-full max-w-md flex-col gap-0">
          <Item variant="outline" className="rounded-none">
            <ItemMedia variant="icon">
              <Timeline />
            </ItemMedia>
            <ItemContent>
              <ItemTitle className="text-xs">Status</ItemTitle>
              <ItemDescription>
                <TaskStatusBadge status={task.status} />
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button
                variant="outline"
                size="icon"
                onClick={() => props.onAuditLogOpen(task.id)}
              >
                <History />
              </Button>
            </ItemActions>
          </Item>
          <Item variant="outline" className="rounded-none">
            <ItemMedia variant="icon">
              <CalendarPlus />
            </ItemMedia>
            <ItemContent>
              <ItemTitle className="text-xs">Created</ItemTitle>
              <ItemDescription>
                {new Date(task.createdAt).toLocaleString()}
              </ItemDescription>
            </ItemContent>
          </Item>
          <Item variant="outline" className="rounded-none">
            <ItemMedia variant="icon">
              <Calendar />
            </ItemMedia>
            <ItemContent>
              <ItemTitle className="text-xs">Last Updated</ItemTitle>
              <ItemDescription>
                {new Date(task?.updatedAt ?? task.createdAt).toLocaleString()}
              </ItemDescription>
            </ItemContent>
          </Item>
          <Item variant="outline" className="rounded-none">
            <ItemMedia variant="icon">
              <AlignJustifyIcon />
            </ItemMedia>
            <ItemContent>
              <ItemTitle className="text-xs">Description</ItemTitle>
              <ItemDescription className="line-clamp-none">
                {task.description}
              </ItemDescription>
            </ItemContent>
          </Item>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
