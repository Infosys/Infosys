
// Provides user profile types and utility functions for user profile and language management
import httpClient from "../services/httpClient";
import env from '../../../../config/env';


// Represents a user's address information
export type Address = {
  addressLine1: string; // First line of address
  addressLine2: string | null; // Second line of address (optional)
  city: string; // City name
  state: string; // State name
  pinCode: string; // Postal code
};


// Represents a zone and its associated wards
export type ZoneData = {
  zoneNumber: string; // Zone identifier
  wards: string[]; // List of ward names or numbers
};


// Represents detailed user profile information
export type UserProfile = {
  firstName: string; // User's first name
  lastName: string; // User's last name
  fullName: string; // User's full name
  phoneNumber: string; // User's phone number
  adhaarNo: number; // User's Aadhaar number (unique ID)
  gender: string; // User's gender
  guardian?: string; // Guardian's name (optional)
  guardianType?: string; // Type of guardian (optional)
  dateOfBirth?: string; // Date of birth (optional)
  address: Address; // User's address
  department: string; // Department name
  designation: string; // User's designation
  workLocation?: string; // Work location (optional)
  profilePicture?: string; // Profile picture URL (optional)
  relationshipToProperty: string; // Relationship to property
  ownershipShare: number; // Share of ownership
  isPrimaryOwner: boolean; // Is the primary owner
  isVerified: boolean; // Is the profile verified
};


// Represents a user with profile and zone information
export type User = {
  id: string; // Unique user identifier
  username: string; // Username
  email: string; // Email address
  role: string; // User's role
  isActive: boolean; // Is the user active
  zoneData: ZoneData[]; // List of zones and wards
  preferred_language?: string; // Preferred language (optional)
  createdDate: string; // Account creation date
  updatedDate: string; // Last update date
  createdBy: string; // Who created the user
  updatedBy: string; // Who last updated the user
  profile: UserProfile; // User's profile details
};


// Fetches a user by their username from the onboarding API
export const getUserByUsername = async (username: string): Promise<User> => {
  const response = await fetch(`${env.ONBOARDING_HOST}/api/v1/users?username=${username}`);
  if (response.status !== 200) throw new Error("User not found");
  const data = await response.json();
  
  // Check if user data exists and is valid
  if (!data.data || !Array.isArray(data.data.users) || data.data.users.length === 0) {
    throw new Error("User not found");
  }
  // Return the first user found
  return data.data.users[0];
};


// Sets the application's locale in localStorage
export const setAppLocale = (localeKey:string, locale: string) => {
  localStorage.setItem(localeKey, locale);
};


// Retrieves the application's locale from localStorage, defaults to 'en' if not set
export const getAppLocale = () => {
  return localStorage.getItem("appLocale") || "en";
};


// Removes the application's locale from localStorage
export const removeAppLocale = () => {
  localStorage.removeItem("appLocale");
};


// Updates the user's preferred language via API call
export const updatePreferredLanguage = async (userId: string, lang: string) => {
  const response = await httpClient.put(
    `/api/v1/users/${userId}/language`,
    { preferredLanguage: lang },
    { headers: { "Content-Type": "application/json" } }
  );
  if (response.status < 200 || response.status >= 300) throw new Error("Failed to update preferred language");
  return response.data;
};