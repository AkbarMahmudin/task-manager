import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@task-manager/ui/components/button';
import { TaskPaginationProps } from '../types';

export function TaskPagination({
  page,
  totalPages,
  totalData,
  onPageChange,
  isFetching,
}: TaskPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

  return (
    <div className="mt-4 flex flex-col items-center justify-between gap-3 border-t border-border pt-4 sm:flex-row">
      <p className="text-sm text-muted-foreground">
        Page {page} of {totalPages} &middot; {totalData} task
        {totalData === 1 ? '' : 's'} total
      </p>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!canGoPrev || isFetching}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft />
          Previous
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!canGoNext || isFetching}
          onClick={() => onPageChange(page + 1)}
        >
          Next
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
