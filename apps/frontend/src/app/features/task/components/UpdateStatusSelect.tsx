import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from '@task-manager/ui/components/select';
import { TASK_STATUS_ORDER } from '@task-manager/shared-types';
import { TaskStatusBadge } from './TaskStatusBadge';
import { UpdateStatusSelectProps } from '../types';

export function UpdateStatusSelect({
  defaultStatus,
  isSubmitting,
  onSelect,
}: UpdateStatusSelectProps) {
  const items = TASK_STATUS_ORDER.map((status) => ({
    value: status,
    label: status,
  }));

  return (
    <Select
      items={items}
      defaultValue={defaultStatus}
      onValueChange={(value) => onSelect({ newStatus: value ?? '' })}
      disabled={isSubmitting}
    >
      <SelectTrigger>
        <TaskStatusBadge status={defaultStatus} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              <TaskStatusBadge status={item.value} />
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
