// signUpFormModel.ts
// TypeScript interfaces for sign-up form values, errors, payload, and API responses.
// Values for the sign-up form fields
export interface SignUpFormValues {
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  passwordConfirm: string;
  role: string;
}

// Validation errors for the sign-up form fields
export interface SignUpFormErrors {
  username?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  password?: string;
  passwordConfirm?: string;
}

// Payload structure for sign-up API request
export interface SignUpPayload {
  user: Omit<SignUpFormValues, "passwordConfirm">;
}

// User data returned on successful sign-up
export interface SignUpResponseData {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  phoneNumber: string;
  isActive: boolean;
  message: string;
}

// Structure of the sign-up API response
export interface SignUpResponse {
  success: boolean;
  message: string;
  data: SignUpResponseData;
}