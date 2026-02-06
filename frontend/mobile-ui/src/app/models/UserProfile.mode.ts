export interface UserProfile {
  id?: string;
  username?: string;
  email?: string;
  role?: string;
  isActive?: boolean;
  zone?: string[];
  zoneData?: { zoneNumber: string; wards: string[] }[]; // More specific type
  ward?: string[];
  preferred_language?: string;
  createdDate?: string;
  updatedDate?: string;
  createdBy?: string;
  updatedBy?: string;
  profile?: {
    firstName?: string;
    lastName?: string;
    fullName?: string;
    phoneNumber?: string;
    adhaarNo?: number;
    gender?: string;
    guardian?: string;
    guardianType?: string;
    dateOfBirth?: string;
    address?: Address;
    department?: string;
    designation?: string;
    workLocation?: string;
    profilePicture?: string;
    relationshipToProperty?: string;
    ownershipShare?: number;
    isPrimaryOwner?: boolean;
    isVerified?: boolean;
  };
  // Fallback properties for session data
  firstName?: string;
  lastName?: string;
  fullName?: string;
  phoneNumber?: string;
  address?: Address;
}

export interface Address {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  pinCode?: string;
}