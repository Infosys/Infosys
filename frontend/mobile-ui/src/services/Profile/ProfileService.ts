// Service functions and types for user profile management

import env from "../../config/env";

// Address type for user profile
export type Address = {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pinCode: string;
};

// User profile details (nested object)
export type UserProfile = {
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumber: string;
  adhaarNo: number;
  gender: string;
  guardian: string;
  guardianType: string;
  dateOfBirth: string;
  address: Address;
  department: string;
  designation: string;
  workLocation: string;
  profilePicture: string;
  relationshipToProperty: string;
  ownershipShare: number;
  isPrimaryOwner: boolean;
  isVerified: boolean;
};

// Main user object with profile and metadata
export type User = {
  users: any;
  id: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  zone: string[];
  ward: string[];
  preferred_language: string; // <-- matches API's snake_case
  createdDate: string;
  updatedDate: string;
  createdBy: string;
  updatedBy: string;
  profile: UserProfile;
};

// Fetch user details by username from API
export const getUserByUsername = async (username: string): Promise<User> => {
  const response = await fetch(`${env.ONBOARDING_HOST}/api/v1/users?username=${username}`);
  if (response.status !== 200) throw new Error("User not found");
  const data = await response.json();
  return data.data; // assuming your API structure is { data: { ...user } }
};

// Set the app locale in localStorage
export const setAppLocale = (localeKey:string, locale: string) => {
  localStorage.setItem(localeKey, locale);
};

// Get the app locale from localStorage (default to 'en')
export const getAppLocale = () => {
  return localStorage.getItem("appLocale") || "en";
};

// Remove the app locale from localStorage
export const removeAppLocale = () => {
  localStorage.removeItem("appLocale");
};

// Update the user's preferred language in the backend
export const updatePreferredLanguage = async (userId: string, lang: string) => {
  const response = await fetch(
    `${env.ONBOARDING_HOST}/api/v1/users/${userId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ preferredLanguage: lang }),
    }
  );
  if (response.status < 200 || response.status >= 300) {
    throw new Error("Failed to update preferred language");
  }
  const data = await response.json();
  return data;
};