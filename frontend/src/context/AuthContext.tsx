import { createContext, useCallback, useEffect, useState, type ReactNode } from 'react';
import toast from 'react-hot-toast';
import type { AuthUser, LoginPayload, SignupPayload } from '@/types/auth.types';
import { authService } from '@/services/authService';
import { tokenStorage, extractErrorMessage } from '@/services/apiClient';

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  signup: (payload: SignupPayload) => Promise<void>;
  logout: () => Promise<void>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // On app load, if a token exists, hydrate the user from /auth/me instead
    // of trusting stale localStorage data.
    async function bootstrap() {
      if (!tokenStorage.getAccessToken()) {
        setIsLoading(false);
        return;
      }
      try {
        const me = await authService.getMe();
        setUser(me);
      } catch {
        tokenStorage.clear();
      } finally {
        setIsLoading(false);
      }
    }
    bootstrap();
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    try {
      const result = await authService.login(payload);
      tokenStorage.setTokens(result.accessToken, result.refreshToken);
      setUser(result.user);
      toast.success('Logged in successfully.');
    } catch (err) {
      toast.error(extractErrorMessage(err));
      throw err;
    }
  }, []);

  const signup = useCallback(async (payload: SignupPayload) => {
    try {
      const result = await authService.signup(payload);
      tokenStorage.setTokens(result.accessToken, result.refreshToken);
      setUser(result.user);
      toast.success('Account created successfully.');
    } catch (err) {
      toast.error(extractErrorMessage(err));
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Logout is best-effort server-side (stateless JWT); always clear locally.
    } finally {
      tokenStorage.clear();
      setUser(null);
      toast.success('Logged out.');
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>{children}</AuthContext.Provider>
  );
}
