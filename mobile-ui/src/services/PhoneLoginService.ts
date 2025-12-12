// Service for handling phone-based login (OTP)
export class PhoneLoginService {
  // Sends OTP request to backend for the given phone number
  static async sendOtp(phone: string): Promise<any> {
    // Make GET request to send OTP to user's phone
    const response = await fetch(`${import.meta.env.VITE_ONBOARDING_HOST}/api/v1/users?phoneNumber=${phone}`, {
      method: "GET",
      headers: { "Content-Type": "application/json"},
    });
    // Return the API response as JSON
    return response.json();
  }
}