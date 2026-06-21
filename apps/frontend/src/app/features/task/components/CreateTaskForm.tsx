import React from 'react';
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
import { Plus } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import {
  CreateTaskRequest,
  createTaskSchema,
} from '@task-manager/shared-types';

import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateTaskFormProps } from '../types';

export const CreateTaskForm = ({
  onSubmit,
  isSubmitting,
}: CreateTaskFormProps) => {
  const [open, setOpen] = React.useState(false);
  const form = useForm<z.infer<typeof createTaskSchema>>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const handleSubmit = (data: CreateTaskRequest) => {
    onSubmit(data);

    // TODO: perlu callback (toast)
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={() => setOpen((prev) => !prev)}>
      <DialogTrigger
        className={buttonVariants({
          className: 'w-full md:w-auto',
          size: 'lg',
        })}
      >
        <Plus className="mr-2 h-4 w-4" />
        New Task
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>

        <form id="form-create-task" onSubmit={form.handleSubmit(handleSubmit)}>
          <FieldGroup>
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-create-task-title">
                    Title
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-create-task-title"
                    aria-invalid={fieldState.invalid}
                    placeholder=""
                    autoComplete="off"
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
                  <FieldLabel htmlFor="form-create-task-description">
                    Description
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id="form-create-task-description"
                      rows={6}
                      className="min-h-24 resize-none"
                      aria-invalid={fieldState.invalid}
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
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <Button type="submit" form="form-create-task">
              {isSubmitting ? 'Creating...' : 'Create Task'}
            </Button>
          </Field>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
