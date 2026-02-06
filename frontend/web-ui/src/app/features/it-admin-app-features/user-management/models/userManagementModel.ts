
export interface Profile {
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumber: string;
  adhaarNo: number;
  gender: string;
  address: Address;
  department: string;
  designation: string;
  relationshipToProperty: string;
  ownershipShare: number;
  isPrimaryOwner: boolean;
  isVerified: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
  ward: string;
  zoneData: any[];
  preferredLanguage: string;
  createdDate: string;
  updatedDate: string;
  createdBy: string;
  updatedBy: string;
  profile: Profile;
}

// *******************************************
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
export type SearchedUser = {
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
// *******************************************


export interface GetUsersResponse {
  success: boolean;
  message: string;
  data: {
    users: SearchedUser[];
    TotalCount: number;
    Limit: number;
    Offset: number;
  };
}



export interface GetUserByIdResponse {
  success: boolean;
  message?: string;
  data: SearchedUser;
}

export interface GetUserByUsernameRequest {
  username: string;
}

export interface GetUserByEmailRequest {
  email: string;
}

export interface DeleteUserRequest {
  userId: string;
}

export interface DeleteUserResponse {
  success: boolean;
  message: string;
}

// *******************************************
// interface for Total counts of users, Active users and Field agents

export interface UserCountData {
    activeUsers: number;
    totalUsers: number;
    fieldAgents: number;
}

export interface UserCountResponse {
    success: boolean;
    message: string;
    data: UserCountData;
}

export interface UserListResponse {
    success: boolean;
    message: string;
    data: User[];
}
// *******************************************