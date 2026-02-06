
// LoginService provides a static method to perform user login via API
import type { LoginFormValues, LoginResponse } from "../models/LoginFormModel";
import env from '../../../../config/env';


export class LoginService {
  /**
   * Attempts to log in a user with the provided form values.
   * @param form - The login form values (username and password)
   * @returns A promise resolving to the login response object
   */
  static async login(form: LoginFormValues): Promise<LoginResponse> {
    try {
      // Send a POST request to the login API endpoint
      const response = await fetch(`${env.ONBOARDING_HOST}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      // Parse the response as JSON
      const data = await response.json();
      // If login is successful, return the response data
      if (data.success) {
        return { success: true, message: data.message, data: data.data };
      }
      // If login fails, return an error message
      return { success: false, message: data?.message || "Login failed" };
    } catch (err) {
      // Handle network or unexpected errors
      return { success: false, message: "Network error" };
    }
  }
}