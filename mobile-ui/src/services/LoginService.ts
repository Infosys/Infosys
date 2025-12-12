// Service for handling user login API requests
import type { LoginFormValues, LoginResponse } from "../models/LoginFormModel";

// LoginService provides static methods for user authentication
export class LoginService {
  // Sends login request to backend with form values
  static async login(form: LoginFormValues): Promise<LoginResponse> {
    try {
      // Make POST request to login endpoint with form data
      const response = await fetch(`${import.meta.env.VITE_ONBOARDING_HOST}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      // If login is successful, return user data
      if (data.success) {
        return { success: true, message: data.message, data: data.data };
      }
      // If login fails, return error message
      return { success: false, message: data?.message || "Login failed" };
    } catch (err) {
      // Handle network or unexpected errors
      return { success: false, message: "Network error" };
    }
  }
}