import React from 'react';
import { Search, X } from 'lucide-react';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@task-manager/ui/components/input-group';
import { TaskSearchBarProps } from '../types';

const DEBOUNCE_MS = 400;

export function TaskSearchBar({
  value,
  onSearchChange,
  placeholder = 'Search task by title...',
}: TaskSearchBarProps) {
  // State lokal supaya input terasa instan saat diketik,
  // sementara pemanggilan onSearchChange (yang memicu refetch) di-debounce.
  const [localValue, setLocalValue] = React.useState(value);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  // Sinkron kalau value berubah dari luar (mis. tombol clear di tempat lain)
  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (next: string) => {
    setLocalValue(next);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      onSearchChange(next);
    }, DEBOUNCE_MS);
  };

  const handleClear = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setLocalValue('');
    onSearchChange('');
  };

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <InputGroup className="w-full sm:max-w-xs">
      <InputGroupAddon>
        <Search className="text-muted-foreground" />
      </InputGroupAddon>
      <InputGroupInput
        value={localValue}
        placeholder={placeholder}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleChange(e.target.value)
        }
        aria-label="Search task"
      />
      {localValue && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            aria-label="Clear search"
            onClick={handleClear}
          >
            <X />
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}
