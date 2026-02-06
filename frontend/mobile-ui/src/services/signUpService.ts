// Service for handling user sign-up API requests
import { env } from "../config/env";
import type { SignUpFormValues, SignUpResponse } from "../models/signUpFormModel";

// SignUpService provides static methods for user registration
export class SignUpService {
  // Sends sign-up request to backend with form values
  static async signUp(form: SignUpFormValues): Promise<SignUpResponse> {
    // Remove passwordConfirm from payload before sending
    const { passwordConfirm, ...userData } = form;
    try {
      // Prepare user data payload for registration
      const payload = {
        username: userData.username,
        role: 'CITIZEN',
        email: userData.email,
        profile: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          fullName: `${userData.firstName} ${userData.lastName}`,
          phoneNumber: userData.phoneNumber,
        }
      };

      // Make POST request to sign-up endpoint
      const response = await fetch(`${env.ONBOARDING_HOST}/api/v1/users`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({...payload}),
      });
      const data = await response.json();
      // If sign-up is successful, return user data
      if (data.success) {
        return { success: data.success, message: data.message, data: data.data };
      }
      // If sign-up fails, return error message
      return { success: false, message: data?.message || "Signup failed", data: data.data };
    } catch (err) {
      // Handle network or unexpected errors
      console.error("Sign-up error:", err);
      return { success: false, message: "Network error", data: null as any };
    }
  }
}