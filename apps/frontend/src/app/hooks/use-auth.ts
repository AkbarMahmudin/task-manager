import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { AUTH_QUERY_KEY } from '../context/auth-context';
import { clearToken, saveToken } from '../lib/auth';

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (user) => {
      saveToken(user.token);
      queryClient.setQueryData(AUTH_QUERY_KEY, user);
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (user) => {
      saveToken(user.token);
      queryClient.setQueryData(AUTH_QUERY_KEY, user);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      clearToken();
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.setQueryData(AUTH_QUERY_KEY, undefined);
      queryClient.clear();
      window.location.replace('/login');
    },
  });
}
