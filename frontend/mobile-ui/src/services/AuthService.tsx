// AuthService handles authentication, token management, and user session logic
// Provides login, logout, token refresh, and role/locale utilities for the app
import { env } from "../config/env";
const KEYCLOAK_TOKEN_URL = `${env.KEYCLOAK_URL}/realms/${env.KEYCLOAK_REALM}/protocol/openid-connect/token`;
import {
  getUserByUsername,
  setAppLocale,
  getAppLocale,
  removeAppLocale,
  updatePreferredLanguage,
  type User,
} from "../services/Profile/ProfileService";

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

interface AuthCredentials {
  username: string;
  password: string;
}

type UserRole = "CITIZEN" | "AGENT" | null;

// Main authentication service class
class AuthService {
  // Store tokens and expiry in memory
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiry: number | null = null;

  // Current user, locale, and role
  public user: User | null = null;
  public appLocale: string = "en";
  public primaryRole: UserRole = null;

  // Track which locale key is set, based on user role
  // Key for storing locale in localStorage
  private localeKey: string = "appLocale";

  // Login using username and password, fetch tokens and user profile
  async loginWithPassword(credentials: AuthCredentials): Promise<boolean> {
    try {
      const response = await fetch(KEYCLOAK_TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "password",
          client_id: env.KEYCLOAK_CLIENT_ID,
          client_secret: env.KEYCLOAK_CLIENT_SECRET,
          username: credentials.username,
          password: credentials.password,
          scope: env.KEYCLOAK_SCOPE,
        }),
      });
      // If login fails, return false
      if (!response.ok) return false;
      const tokenData: TokenResponse = await response.json();

      // Store tokens and expiry
      this.accessToken = tokenData.access_token;
      this.refreshToken = tokenData.refresh_token;
      this.tokenExpiry = Date.now() + tokenData.expires_in * 1000;

      // Fetch user profile and store user ID
      try {
        let userResponse = await getUserByUsername(credentials.username);
        let actualUser = userResponse.users?.[0];
        if (actualUser) {
          this.user = actualUser;
          if (this.user?.role !== "AGENT" && this.user?.role !== "CITIZEN") {
            return false;
          }
          localStorage.setItem("access_token", this.accessToken);
          localStorage.setItem("refresh_token", this.refreshToken);
          localStorage.setItem("token_expiry", this.tokenExpiry.toString());
          localStorage.setItem("user", JSON.stringify(actualUser));
          localStorage.setItem("user_id", actualUser.id);
        } else {
          this.user = null;
          console.warn("No user found in response:", userResponse);
        }
      } catch (e) {
        this.user = null;
        console.error("Failed to fetch user profile:", e);
      }

      // Set default role and locale
      let primaryRole: "CITIZEN" | "AGENT" | null = null;
      let localeKey = "appLocale";
      let appLocale = "en";
      this.primaryRole = primaryRole;
      this.localeKey = localeKey;
      this.appLocale = appLocale;

      // Persist locale
      setAppLocale(localeKey, appLocale);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  }

  // Refresh the access token using the refresh token
  async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) return false;
    try {
      const response = await fetch(KEYCLOAK_TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: this.refreshToken,
          client_id: env.KEYCLOAK_CLIENT_ID,
          client_secret: env.KEYCLOAK_CLIENT_SECRET,
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

      localStorage.setItem("access_token", this.accessToken);
      localStorage.setItem("refresh_token", this.refreshToken);
      localStorage.setItem("token_expiry", this.tokenExpiry.toString());

      return true;
    } catch (error) {
      await this.logout();
      console.error("Token refresh failed:", error);
      return false;
    }
  }

  // Get a valid access token, refresh if needed
  async getValidToken(): Promise<string | null> {
    if (!this.accessToken) this.loadFromStorage();
    if (this.tokenExpiry && Date.now() >= this.tokenExpiry - 60000) {
      const refreshed = await this.refreshAccessToken();
      if (!refreshed) return null;
    }
    return this.accessToken;
  }

  // Load tokens, user, and locale from storage
  private loadFromStorage(): void {
    this.accessToken = localStorage.getItem("access_token");
    this.refreshToken = localStorage.getItem("refresh_token");
    const expiry = localStorage.getItem("token_expiry");
    this.tokenExpiry = expiry ? Number.parseInt(expiry) : null;

    // Guess role and key to retrieve correct locale
    // Usually context/user info should tell you current role
    const storedAgentLocale = localStorage.getItem("agentLocale");
    const storedCitizenLocale = localStorage.getItem("citizenLocale");

    if (storedAgentLocale) {
      this.appLocale = storedAgentLocale;
      this.localeKey = "agentLocale";
      this.primaryRole = "AGENT";
    } else if (storedCitizenLocale) {
      this.appLocale = storedCitizenLocale;
      this.localeKey = "citizenLocale";
      this.primaryRole = "CITIZEN";
    } else {
      this.appLocale = getAppLocale();
      this.localeKey = "appLocale";
    }
  }

  // Logout and clear all session/local storage
  async logout(): Promise<void> {
    try {
      if (this.user) {
        const lastLocale =
          localStorage.getItem("appLocale") || getAppLocale() || "en";
        try {
          await updatePreferredLanguage(this.user.id, lastLocale);
        } catch (err) {
          console.error("updatePreferredLanguage error:", err);
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
    this.appLocale = "en";
    // Remove both possible locale keys to clean logout
    localStorage.removeItem("agentLocale");
    localStorage.removeItem("citizenLocale");
    localStorage.setItem("citizenLocaleMismatchChecked", "false");
    removeAppLocale();
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token_expiry");
    localStorage.removeItem("user_id");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("citizenPhoneNumber");
  }

  // Check if user is authenticated and token is valid
  isAuthenticated(): boolean {
    if (!this.accessToken) this.loadFromStorage();
    return !!(
      this.accessToken &&
      this.tokenExpiry &&
      Date.now() < this.tokenExpiry
    );
  }

  // Return current access token
  getAccessToken(): string | null {
    return this.accessToken;
  }

  // Decode JWT token payload
  decodeTokenPayload(): any {
    if (!this.accessToken) this.loadFromStorage();
    if (!this.accessToken) return null;
    try {
      const part = this.accessToken.split(".")[1];
      if (!part) return null;
      const json = atob(part.replaceAll(/-/g, "+").replaceAll(/_/g, "/"));
      return JSON.parse(
        decodeURIComponent(
          json
            .split("")
            .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
            .join("")
        )
      );
    } catch (e) {
      console.error("Failed to decode token payload:", e);
      return null;
    }
  }

  // Extract all roles from token payload
  getTokenRoles(): string[] {
    const payload = this.decodeTokenPayload();
    if (!payload) return [];
    const realmRoles: string[] = payload.realm_access?.roles || [];
    const resourceRoles: string[] = payload.resource_access
      ? Object.values(payload.resource_access).flatMap(
          (r: any) => r.roles || []
        )
      : [];
    return Array.from(new Set([...realmRoles, ...resourceRoles]));
  }

  // Determine primary role from token roles
  getPrimaryRoleFromToken(): UserRole {
    const roles = new Set(this.getTokenRoles().map((r) => r.toUpperCase()));
    if (roles.has("AGENT")) return "AGENT";
    if (roles.has("CITIZEN")) return "CITIZEN";
    return null;
  }

  // Check if user has a specific role
  hasRole(role: string): boolean {
    if (this.user?.role) {
      return this.user.role.toLowerCase() === role.toLowerCase();
    }
    return this.getTokenRoles().some(
      (r) => r.toUpperCase() === role.toUpperCase()
    );
  }

  // Check if user is a citizen
  isCitizen(): boolean {
    return this.getPrimaryRole() === "CITIZEN";
  }
  // Check if user is an agent
  isAgent(): boolean {
    return this.getPrimaryRole() === "AGENT";
  }

  // Prefer role from user profile if available
  // Prefer role from user profile, fallback to token
  getPrimaryRole(): "CITIZEN" | "AGENT" | null {
    if (this.user?.role) {
      if (this.user.role.toUpperCase() === "AGENT") return "AGENT";
      return "CITIZEN";
    }
    return this.getPrimaryRoleFromToken();
  }

  // Get the current locale key
  getLocaleKey(): string {
    return this.localeKey;
  }
}

export const authService = new AuthService();
export default authService;
