import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@task-manager/ui/components/dialog';
import { Button, buttonVariants } from '@task-manager/ui/components/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@task-manager/ui/components/field';
import { Input } from '@task-manager/ui/components/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from '@task-manager/ui/components/input-group';
import { Pencil, Plus } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import {
  UpdateTaskRequest,
  updateTaskSchema,
} from '@task-manager/shared-types';

import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdateTaskFormProps } from '../types';

export const UpdateTaskForm = ({
  task,
  onSubmit,
  isSubmitting,
}: UpdateTaskFormProps) => {
  const [open, setOpen] = React.useState(false);
  const form = useForm<z.infer<typeof updateTaskSchema>>({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: {
      title: task?.title,
      description: task?.description,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({ ...task });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, task]);

  const handleSubmit = (data: UpdateTaskRequest) => {
    onSubmit(task.id, data);

    // TODO: perlu callback (toast)
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={() => setOpen((prev) => !prev)}>
      <DialogTrigger
        className={buttonVariants({
          size: 'icon',
          variant: 'ghost',
        })}
      >
        <Pencil />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>

        <form id="form-edit-task" onSubmit={form.handleSubmit(handleSubmit)}>
          <FieldGroup>
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-edit-task-title">Title</FieldLabel>
                  <Input
                    id="form-edit-task-title"
                    aria-invalid={fieldState.invalid}
                    placeholder=""
                    autoComplete="off"
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-edit-task-description">
                    Description
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      id="form-edit-task-description"
                      rows={6}
                      className="min-h-24 resize-none"
                      aria-invalid={fieldState.invalid}
                      {...field}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {field?.value?.length}/1000 characters
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>

        <DialogFooter>
          <Field orientation="horizontal">
            <Button type="submit" form="form-edit-task">
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </Field>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
