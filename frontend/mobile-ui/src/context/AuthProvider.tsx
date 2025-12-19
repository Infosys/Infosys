// AuthProvider.tsx
//
// Centralized authentication provider for the application.
// Manages user authentication state, handles login/logout, token management, and exposes
// authentication-related actions and state to the rest of the app via React Context.
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/AuthService';
import type { User } from '../services/Profile/ProfileService';
import { useAppDispatch } from '../redux/Hooks';

// Type for authentication context value
interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
  updateAuthState: () => Promise<void>;
  role: 'CITIZEN' | 'AGENT' | null;
  user: User | null;
  appLocale: string;
}

// ---- Session storage helpers ----
// Key for storing user info in sessionStorage
const SESSION_USER_KEY = 'user';

// Save user object to sessionStorage for persistence across reloads
function saveUserToSession(user: User | null) {
  if (user) {
    try {
      sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));
    } catch {
      // ignore storage errors
    }
  } else {
    sessionStorage.removeItem(SESSION_USER_KEY);
  }
}

// Retrieve user object from sessionStorage to restore user state
export function getUserFromSession(): User | null {
  try {
    const stored = sessionStorage.getItem(SESSION_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}


// ---- Context ----
// Create AuthContext for sharing authentication state and actions throughout the app
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to access AuthContext from any component
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

// AuthProvider component: wraps children with authentication context and logic
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<'CITIZEN' | 'AGENT' | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [appLocale, setAppLocaleState] = useState<string>('en');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  // On mount, initialize authentication state from sessionStorage and authService
  useEffect(() => {
    let mounted = true;
    const initAuth = async () => {
      try {
        const isAuth = authService.isAuthenticated();
        if (!mounted) return;
        if (isAuth) {
          const validToken = await authService.getValidToken();
          if (!mounted) return;
          setIsAuthenticated(Boolean(validToken));
          setToken(validToken ?? null);

          const primaryRole = authService.getPrimaryRole?.();
          setRole(
            primaryRole ? (primaryRole.toUpperCase() === 'AGENT' ? 'AGENT' : 'CITIZEN') : null
          );

          setAppLocaleState(authService.appLocale ?? 'en');

          const storedUser = getUserFromSession();
          const svcUser = authService.user ?? null;
          const finalUser = storedUser || svcUser;
          setUser(finalUser);
          if (!storedUser && svcUser) saveUserToSession(svcUser);
        } else {
          setIsAuthenticated(false);
          setToken(null);
          setRole(null);
          setAppLocaleState('en');
          setUser(null);
          saveUserToSession(null);
        }
      } catch (e) {
        setError('Authentication initialization failed');
        setIsAuthenticated(false);
        setToken(null);
        setRole(null);
        setAppLocaleState('en');
        setUser(null);
        saveUserToSession(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    initAuth();
    return () => {
      mounted = false;
    };
  }, [dispatch]);

  // Handles user login: authenticates and updates all relevant state
  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const success = await authService.loginWithPassword({ username, password });
      if (success) {
        const validToken = await authService.getValidToken();
        setIsAuthenticated(true);
        setToken(validToken ?? authService.getAccessToken?.() ?? null);

        const primaryRole = authService.getPrimaryRole?.();
        setRole(primaryRole ? (primaryRole.toUpperCase() === 'AGENT' ? 'AGENT' : 'CITIZEN') : null);

        setAppLocaleState(authService.appLocale ?? 'en');
        setUser(authService.user ?? null);
        saveUserToSession(authService.user ?? null);
        return true;
      } else {
        setError('Login failed. Please check your credentials.');
        return false;
      }
    } catch (e) {
      setError('Login failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Handles user logout: clears auth state, Redux, and session
  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Ensure app clears Redux state (root reducer should handle 'auth/logout')
      dispatch({ type: 'auth/logout' });
      await authService.logout();
    } catch {
      setError('Logout failed');
    } finally {
      // Reset local context state irrespective of authService success
      setIsAuthenticated(false);
      setToken(null);
      setRole(null);
      setAppLocaleState('en');
      setUser(null);
      saveUserToSession(null);
      setLoading(false);
    }
  }, [dispatch]);

  // Refreshes authentication state (token, role, user) in context, e.g. after token refresh
  const updateAuthState = useCallback(async () => {
    try {
      const validToken = await authService.getValidToken();
      if (validToken) {
        setIsAuthenticated(true);
        setToken(validToken);
        const primaryRole = authService.getPrimaryRole?.();
        setRole(primaryRole ? (primaryRole.toUpperCase() === 'AGENT' ? 'AGENT' : 'CITIZEN') : null);
        setAppLocaleState(authService.appLocale ?? 'en');
        setUser(authService.user ?? null);
        saveUserToSession(authService.user ?? null);
        setError(null);
      } else {
        // token not available -> treat as logged out
        dispatch({ type: 'auth/logout' });
        setIsAuthenticated(false);
        setToken(null);
        setRole(null);
        setAppLocaleState('en');
        setUser(null);
        saveUserToSession(null);
      }
    } catch {
      // on error, clear local auth
      dispatch({ type: 'auth/logout' });
      setIsAuthenticated(false);
      setToken(null);
      setRole(null);
      setAppLocaleState('en');
      setUser(null);
      saveUserToSession(null);
    }
  }, [dispatch]);

  // Memoize context value to optimize performance and prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      isAuthenticated,
      token,
      login,
      logout,
      loading,
      error,
      updateAuthState,
      role,
      user,
      appLocale,
    }),
    [isAuthenticated, token, login, logout, loading, error, updateAuthState, role, user, appLocale]
  );

  // Provide authentication context to all child components
  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};