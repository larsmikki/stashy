import { createContext, useContext } from 'react';

export interface AuthContextValue {
  loading: boolean;
  passwordSet: boolean;
  authenticated: boolean;
  login: (password: string) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
