import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLogin, useRegister } from '../hooks/use-auth';
import {
  AuthUserRequest,
  authUserSchema,
  CreateUserRequest,
  createUserSchema,
} from '@task-manager/shared-types';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@task-manager/ui/components/field';
import { Input } from '@task-manager/ui/components/input';
import { Button } from '@task-manager/ui/components/button';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const registerMutation = useRegister();

  const form = useForm<CreateUserRequest>({
    resolver: zodResolver(createUserSchema),
  });

  const onSubmit = form.handleSubmit((values) => {
    registerMutation.mutate(values, {
      onSuccess: () => {
        const state = location.state as {
          from?: { pathname?: string };
        } | null;
        navigate(state?.from?.pathname ?? '/', { replace: true });
      },
      onError: (error) => {
        // toast.add({
        //   type: 'error',
        //   priority: 'high',
        //   description: error?.message ?? 'Login failed. Please try again!',
        // });
      },
    });
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <form onSubmit={onSubmit}>
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <Input
                      id="name"
                      type="name"
                      autoComplete="name"
                      placeholder="Hiiro"
                      aria-invalid={fieldState.invalid}
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="anda@contoh.com"
                      aria-invalid={fieldState.invalid}
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      aria-invalid={fieldState.invalid}
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Field>
                <Button type="submit">Register</Button>
              </Field>
            </FieldGroup>
          </form>

          <FieldDescription className="px-6 text-center">
            Have an account? <Link to="/login">Login</Link>
          </FieldDescription>
        </div>
      </div>
    </div>
  );
};
