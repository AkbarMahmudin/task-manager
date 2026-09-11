import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@task-manager/ui/components/drawer';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@task-manager/ui/components/item';
import { TaskStatusBadge } from './TaskStatusBadge';
import { Separator } from '@task-manager/ui/components/separator';
import { buttonVariants } from '@task-manager/ui/components/button';
import { X } from 'lucide-react';
import { AuditLogDrawerProps } from '../types';
import { useIsMobile } from '../../../hooks/use-mobile';

export const AuditLogDrawer = ({
  logs,
  open,
  onOpenChange,
}: AuditLogDrawerProps) => {
  const isMobile = useIsMobile();

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      direction={isMobile ? 'bottom' : 'right'}
    >
      <DrawerContent>
        <DrawerHeader className="flex flex-row items-center">
          <DrawerTitle className="flex-1">History</DrawerTitle>
          <DrawerClose
            className={buttonVariants({
              size: 'icon',
              variant: 'ghost',
            })}
          >
            <X />
          </DrawerClose>
        </DrawerHeader>

        <div className="p-4">
          {!logs?.length && (
            <Item variant="outline">
              <ItemContent>
                <ItemDescription className="italic">
                  Does'nt change histories
                </ItemDescription>
              </ItemContent>
            </Item>
          )}

          {logs?.map((log) => (
            <Item variant="outline" key={log.id} className="my-1">
              <ItemContent>
                <ItemTitle>
                  {/* Visualisasi transisi */}
                  <div>
                    <TaskStatusBadge status={log.fromStatus} />
                    <span>→</span>
                    {log.toStatus && <TaskStatusBadge status={log.toStatus} />}
                  </div>
                </ItemTitle>
                <Separator />
                <ItemDescription className="italic line-clamp-none">
                  {log.description}
                </ItemDescription>
              </ItemContent>
            </Item>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
