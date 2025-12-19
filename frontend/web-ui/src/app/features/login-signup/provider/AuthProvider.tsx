// Provides authentication context and state management for the application
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/AuthService';
import type { User } from '../models/ProfileService';
import { useDispatch } from 'react-redux';
import { setUser as setReduxUser, clearUser as clearReduxUser } from '../../../../store/userSlice';

// Defines the shape of the authentication context
interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
  updateAuthState: () => Promise<void>;
  role: 'SERVICE_MANAGER' | 'COMMISSIONER' | 'ADMIN' | null;
  user: User | null;
  appLocale: string;
}


// ---- Session storage helpers ----
// Key for storing user in sessionStorage
const SESSION_USER_KEY = 'user';

// Save user object to sessionStorage
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

// Retrieve user object from sessionStorage
export function getUserFromSession(): User | null {
  try {
    const stored = sessionStorage.getItem(SESSION_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}



// Create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);


// Custom hook to access authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};


// Provides authentication state and actions to its children
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State variables for authentication
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<'SERVICE_MANAGER' | 'COMMISSIONER' | 'ADMIN' | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [appLocale, setAppLocaleState] = useState<string>('en');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch();

  // Initialize authentication state on mount
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

          // Determine user's primary role
          const primaryRole = authService.getPrimaryRole?.();
          setRole(
            primaryRole === 'SERVICE_MANAGER'
              ? 'SERVICE_MANAGER'
              : primaryRole === 'COMMISSIONER'
                ? 'COMMISSIONER'
                : primaryRole === 'ADMIN' ? 'ADMIN' : null
          );

          setAppLocaleState(authService.appLocale ?? 'en');

          // Retrieve user from session or service
          const storedUser = getUserFromSession();
          const svcUser = authService.user ?? null;
          const finalUser = storedUser || svcUser;
          setUser(finalUser);
          if (!storedUser && svcUser) saveUserToSession(svcUser);
          
          // ✅ SYNC WITH REDUX on init
          if (finalUser) {
            dispatch(setReduxUser(finalUser));
          }
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
    }
  }, [dispatch]);


  // Handles user login and updates authentication state
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
        setRole(
          primaryRole === 'SERVICE_MANAGER'
            ? 'SERVICE_MANAGER'
            : primaryRole === 'COMMISSIONER'
              ? 'COMMISSIONER'
              : primaryRole === 'ADMIN' ? 'ADMIN' : null
        );

        setAppLocaleState(authService.appLocale ?? 'en');
        
        const userData = authService.user ?? null;
        setUser(userData);
        saveUserToSession(userData);
        
        // ✅ SYNC WITH REDUX
        if (userData) {
          dispatch(setReduxUser(userData));
        }
        
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
  }, [dispatch]);



  // Handles user logout and clears authentication state
  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await authService.logout();
    } catch {
      setError('Logout failed');
    } finally {
      setIsAuthenticated(false);
      setToken(null);
      setRole(null);
      setAppLocaleState('en');
      setUser(null);
      saveUserToSession(null);
      
      // ✅ SYNC WITH REDUX
      dispatch(clearReduxUser());
      
      setLoading(false);
    }
  }, [dispatch]);



  // Refreshes authentication state (e.g., after token refresh or user update)
  const updateAuthState = useCallback(async () => {
    try {
      const validToken = await authService.getValidToken();
      if (validToken) {
        setIsAuthenticated(true);
        setToken(validToken);
        // Update user's primary role
        const primaryRole = authService.getPrimaryRole?.();
        setRole(
          primaryRole === 'SERVICE_MANAGER'
            ? 'SERVICE_MANAGER'
            : primaryRole === 'COMMISSIONER'
              ? 'COMMISSIONER'
              : primaryRole === 'ADMIN' ? 'ADMIN' : null
        );
        setAppLocaleState(authService.appLocale ?? 'en');
        
        const userData = authService.user ?? null;
        setUser(userData);
        saveUserToSession(userData);
        
        // ✅ SYNC WITH REDUX
        if (userData) {
          dispatch(setReduxUser(userData));
        }
        
        setError(null);
      } else {
        setIsAuthenticated(false);
        setToken(null);
        setRole(null);
        setAppLocaleState('en');
        setUser(null);
        saveUserToSession(null);
        
        // ✅ SYNC WITH REDUX
        dispatch(clearReduxUser());
      }
    } catch {
      setIsAuthenticated(false);
      setToken(null);
      setRole(null);
      setAppLocaleState('en');
      setUser(null);
      saveUserToSession(null);
      
      // ✅ SYNC WITH REDUX
      dispatch(clearReduxUser());
    }
  }, [dispatch]);


  // Memoize the context value to avoid unnecessary re-renders
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

  // Provide authentication context to children
  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
