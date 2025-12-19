// AuthService handles authentication, token management, user profile, and locale for the app
// Provides login, logout, token refresh, and role/locale utilities for user sessions

import { KEYCLOAK_TOKEN_URL } from '../env';

import {
  getUserByUsername,
  setAppLocale,
  getAppLocale,
  removeAppLocale,
  updatePreferredLanguage,
  type User,
} from '../models/ProfileService';
 
// Response structure for OAuth token requests
interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}
 
// Credentials for login
interface AuthCredentials {
  username: string;
  password: string;
}
 
// Main authentication service class
class AuthService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiry: number | null = null;
 
  public user: User | null = null;
  public appLocale: string = 'en';

  public primaryRole: 'SERVICE_MANAGER' | 'COMMISSIONER' | 'ADMIN' | null = null;
 
  // Track which locale key is set, based on user role
  private localeKey: string = "appLocale";
 
  // Login with username and password, fetch tokens and user profile
  async loginWithPassword(credentials: AuthCredentials): Promise<boolean> {
    try {
      const response = await fetch(KEYCLOAK_TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'password',
          client_id: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
          client_secret: import.meta.env.VITE_KEYCLOAK_CLIENT_SECRET,
          username: credentials.username,
          password: credentials.password,
          scope: import.meta.env.VITE_KEYCLOAK_SCOPE,
        }),
      });
 
      if (!response.ok) return false;
      const tokenData: TokenResponse = await response.json();
 
      this.accessToken = tokenData.access_token;
      this.refreshToken = tokenData.refresh_token;
      this.tokenExpiry = Date.now() + tokenData.expires_in * 1000;
 
      localStorage.setItem('access_token', this.accessToken);
      localStorage.setItem('refresh_token', this.refreshToken);
      localStorage.setItem('token_expiry', this.tokenExpiry.toString());
 
      // Fetch user profile FIRST, to determine role
      let user: User | null = null;

      let primaryRole: 'SERVICE_MANAGER' | 'COMMISSIONER' | 'ADMIN' | null = null;

      let localeKey = "appLocale";
      let appLocale = 'en';
      try {
        user = await getUserByUsername(credentials.username);
        this.user = user;
        if (user && user.role) {
          const role = user.role.toUpperCase();
          if (role === 'SERVICE_MANAGER') primaryRole = 'SERVICE_MANAGER';
          else if (role === 'COMMISSIONER') primaryRole = 'COMMISSIONER';

          else if (role === 'ADMIN') primaryRole = 'ADMIN';

          else primaryRole = null;
        } else {
          primaryRole = this.getPrimaryRoleFromToken();
        }
        localeKey = primaryRole === 'SERVICE_MANAGER'
          ? 'serviceManagerLocale'
          : primaryRole === 'COMMISSIONER'
            ? 'commissionerLocale'

            : primaryRole === 'ADMIN'

              ? 'adminLocale'

              : 'appLocale';

        appLocale = user?.preferred_language || 'en';
      } catch {
        this.user = null;
        primaryRole = this.getPrimaryRoleFromToken();
        localeKey = primaryRole === 'SERVICE_MANAGER'
          ? 'serviceManagerLocale'
          : primaryRole === 'COMMISSIONER'
            ? 'commissionerLocale'

            : primaryRole === 'ADMIN'

              ? 'adminLocale'

              : 'appLocale';

        appLocale = 'en';
      }
      this.primaryRole = primaryRole;
      this.localeKey = localeKey;
      this.appLocale = appLocale;
 
      // Set locale in persistent store as per resolved role
      setAppLocale(localeKey, appLocale);
      return true;
    } catch (error) {
      console.log(error)
      return false;
    }
  }
 
  // Refresh the access token using the refresh token
  async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) return false;
    try {
      const response = await fetch(KEYCLOAK_TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: this.refreshToken,
          client_id: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
          client_secret: import.meta.env.VITE_KEYCLOAK_CLIENT_SECRET,
        }),
      });
      if (!response.ok) {
        await this.logout();
        return false;
      }
      const tokenData: TokenResponse = await response.json();
      this.accessToken = tokenData.access_token;
      this.refreshToken = tokenData.refresh_token;
      this.tokenExpiry = Date.now() + tokenData.expires_in * 1000;
 
      localStorage.setItem('access_token', this.accessToken);
      localStorage.setItem('refresh_token', this.refreshToken);
      localStorage.setItem('token_expiry', this.tokenExpiry.toString());
      return true;
    } catch {
      await this.logout();
      return false;
    }
  }
 
  // Get a valid access token, refreshing if needed
  async getValidToken(): Promise<string | null> {
    if (!this.accessToken) this.loadFromStorage();
    if (this.tokenExpiry && Date.now() >= this.tokenExpiry - 60000) {
      const refreshed = await this.refreshAccessToken();
      if (!refreshed) return null;
    }
    return this.accessToken;
  }
 
  // Load tokens, user, and locale from localStorage
  private loadFromStorage(): void {
    this.accessToken = localStorage.getItem('access_token');
    this.refreshToken = localStorage.getItem('refresh_token');
    const expiry = localStorage.getItem('token_expiry');
    this.tokenExpiry = expiry ? parseInt(expiry) : null;
 
    // Guess role and key to retrieve correct locale
    const storedServiceManagerLocale = localStorage.getItem('serviceManagerLocale');
    const storedCommissionerLocale = localStorage.getItem('commissionerLocale');

    const storedAdminLocale = localStorage.getItem('adminLocale');
 
    if (storedServiceManagerLocale) {
      this.appLocale = storedServiceManagerLocale;
      this.localeKey = 'serviceManagerLocale';
      this.primaryRole = 'SERVICE_MANAGER';
    } else if (storedCommissionerLocale) {
      this.appLocale = storedCommissionerLocale;
      this.localeKey = 'commissionerLocale';
      this.primaryRole = 'COMMISSIONER';

    } else if (storedAdminLocale) {

      this.appLocale = storedAdminLocale;

      this.localeKey = 'adminLocale';

      this.primaryRole = 'ADMIN';

    } else {
      this.appLocale = getAppLocale();
      this.localeKey = 'appLocale';
      this.primaryRole = null;
    }
  }
 
  // Logout the user, clear tokens and locale, and update preferred language
  async logout(): Promise<void> {
    try {
      if (this.user) {
        const lastLocale = localStorage.getItem(this.localeKey) || getAppLocale() || 'en';
        console.log('Calling updatePreferredLanguage with:', this.user.id, lastLocale);
        try {
          await updatePreferredLanguage(this.user.id, lastLocale);
          console.log('updatePreferredLanguage finished successfully');
        } catch (err) {
          console.error('updatePreferredLanguage error:', err);
        }
      }
    } catch (e) {
      console.log(e);
    }
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiry = null;
    this.user = null;
    this.primaryRole = null;
    this.appLocale = 'en';
 
    localStorage.removeItem('serviceManagerLocale');
    localStorage.removeItem('commissionerLocale');

    localStorage.removeItem('adminLocale');

    removeAppLocale();
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_expiry');
  }
 
  // Check if the user is authenticated (token exists and not expired)
  isAuthenticated(): boolean {
    if (!this.accessToken) this.loadFromStorage();
    return !!(this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry);
  }
 
  // Get the current access token
  getAccessToken(): string | null {
    return this.accessToken;
  }
 
  // Decode the JWT token payload
  decodeTokenPayload(): any | null {
    if (!this.accessToken) this.loadFromStorage();
    if (!this.accessToken) return null;
    try {
      const part = this.accessToken.split('.')[1];
      if (!part) return null;
      const json = atob(part.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(
        decodeURIComponent(
          json.split('').map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join('')
        )
      );
    } catch {
      return null;
    }
  }
 
  // Get all roles from the token
  getTokenRoles(): string[] {
    const payload = this.decodeTokenPayload();
    if (!payload) return [];
    const realmRoles: string[] = payload.realm_access?.roles || [];
    const resourceRoles: string[] = payload.resource_access
      ? Object.values(payload.resource_access).flatMap((r: any) => r.roles || [])
      : [];
    return Array.from(new Set([...realmRoles, ...resourceRoles]));
  }
 
  getPrimaryRoleFromToken(): 'SERVICE_MANAGER' | 'COMMISSIONER' | 'ADMIN' | null {

    const roles = this.getTokenRoles().map((r) => r.toUpperCase());
    if (roles.includes('SERVICE_MANAGER')) return 'SERVICE_MANAGER';
    if (roles.includes('COMMISSIONER')) return 'COMMISSIONER';

    if (roles.includes('ADMIN')) return 'ADMIN';

    return null;
  }
 
  // Check if the user has a specific role
  hasRole(role: string): boolean {
    if (this.user?.role) {
      return this.user.role.toLowerCase() === role.toLowerCase();
    }
    return this.getTokenRoles().some((r) => r.toUpperCase() === role.toUpperCase());
  }
 
  // Check if the user is a Service Manager
  isServiceManager(): boolean {
    return this.getPrimaryRole() === 'SERVICE_MANAGER';
  }

  // Check if the user is a Commissioner
  isCommissioner(): boolean {
    return this.getPrimaryRole() === 'COMMISSIONER';
  }

  isAdmin(): boolean {

    return this.getPrimaryRole() === 'ADMIN';

  }
 
  // Prefer role from user profile if available

  getPrimaryRole(): 'SERVICE_MANAGER' | 'COMMISSIONER' | 'ADMIN' | null {

    if (this.user?.role) {
      if (this.user.role.toUpperCase() === "SERVICE_MANAGER") return "SERVICE_MANAGER";
      if (this.user.role.toUpperCase() === "COMMISSIONER") return "COMMISSIONER";

      if (this.user.role.toUpperCase() === "ADMIN") return "ADMIN";

    }
    return this.getPrimaryRoleFromToken();
  }
 
  // Get the locale key for the current user/role
  getLocaleKey(): string {
    return this.localeKey;
  }

}
 
export const authService = new AuthService();

export default authService;
