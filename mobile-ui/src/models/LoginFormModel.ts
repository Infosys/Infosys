// LoginFormModel.ts
// TypeScript interfaces for login form values and login API responses.
// Values for the login form fields
export interface LoginFormValues {
  username: string;
  password: string;
}

// User data returned on successful login
export interface LoginResponseData {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  phoneNumber: string;
}

// Structure of the login API response
export interface LoginResponse {
  success: boolean;
  message: string;
  data?: LoginResponseData;
}