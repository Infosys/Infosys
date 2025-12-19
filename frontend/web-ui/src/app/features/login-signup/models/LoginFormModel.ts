
// Represents the values entered in the login form
export interface LoginFormValues {
  username: string; // User's login username
  password: string; // User's login password
}


// Represents the user data returned from a successful login response
export interface LoginResponseData {
  id: string; // Unique user identifier
  username: string; // Username of the user
  email: string; // User's email address
  firstName: string; // User's first name
  lastName: string; // User's last name
  role: string; // User's role (e.g., admin, manager)
  phoneNumber: string; // User's phone number
}


// Represents the structure of the login API response
export interface LoginResponse {
  success: boolean; // Indicates if login was successful
  message: string; // Message describing the result
  data?: LoginResponseData; // Optional user data if login is successful
}