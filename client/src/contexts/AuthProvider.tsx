import { useCallback, useEffect, type ReactNode } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from '@/api';
import { AuthContext } from '@/contexts/AuthContext';
import { queryKeys } from '@/queryKeys';

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const { data, isLoading, refetch } = useQuery({
    queryKey: queryKeys.auth,
    queryFn: api.getAuthStatus,
  });

  useEffect(() => {
    api.setOnUnauthorized(() => {
      queryClient.setQueryData(queryKeys.auth, {
        passwordSet: data?.passwordSet ?? true,
        authenticated: false,
      });
    });

    return () => {
      api.setOnUnauthorized(null);
    };
  }, [data?.passwordSet, queryClient]);

  const loginMutation = useMutation({
    mutationFn: api.login,
    onSuccess: () => {
      queryClient.setQueryData(queryKeys.auth, {
        passwordSet: true,
        authenticated: true,
      });
    },
  });

  const login = useCallback(async (password: string) => {
    await loginMutation.mutateAsync(password);
  }, [loginMutation]);

  const logout = useCallback(() => {
    api.setToken(null);
    queryClient.setQueryData(queryKeys.auth, {
      passwordSet: data?.passwordSet ?? true,
      authenticated: false,
    });
  }, [data?.passwordSet, queryClient]);

  const refreshAuth = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <AuthContext.Provider
      value={{
        loading: isLoading,
        passwordSet: data?.passwordSet ?? false,
        authenticated: data?.authenticated ?? false,
        login,
        logout,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
