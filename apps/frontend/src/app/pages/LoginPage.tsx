import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLogin } from '../hooks/use-auth';
import { AuthRequest, authSchema } from '@task-manager/shared-types';
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

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const loginMutation = useLogin();

  const form = useForm<AuthRequest>({
    resolver: zodResolver(authSchema),
  });

  const onSubmit = form.handleSubmit((values) => {
    loginMutation.mutate(values, {
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
                <Button type="submit">Login</Button>
              </Field>
            </FieldGroup>
          </form>

          <FieldDescription className="px-6 text-center">
            Don&apos;t have an account? <Link to="/register">Register</Link>
          </FieldDescription>
        </div>
      </div>
    </div>
  );
};
