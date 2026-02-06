export const USER_ROLES = {
  CITIZEN: 'CITIZEN',
  AGENT: 'AGENT',
  SERVICE_MANAGER: 'SERVICE_MANAGER',
} as const;

export const DEFAULT_USER_ROLES = `${USER_ROLES.AGENT},${USER_ROLES.SERVICE_MANAGER},${USER_ROLES.CITIZEN}`;

export interface UserProfile {
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumber: string;
  aadhaarNo: number;
  gender: string;
  dateOfBirth?: string;
  address: {
    addressLine1: string;
    addressLine2: string | null;
    city: string;
    state: string;
    pinCode: string;
  };
  department?: string;
  designation?: string;
  workLocation?: string;
  relationshipToProperty: string;
  ownershipShare: number;
  isPrimaryOwner: boolean;
  isVerified: boolean;
}

export interface ZoneData {
  zoneNumber: string;
  wards: string[];
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'CITIZEN' | 'AGENT' | 'SERVICE_MANAGER';
  isActive: boolean;
  zoneData: ZoneData[];
  preferredLanguage: string;
  createdDate: string;
  updatedDate: string;
  createdBy?: string;
  updatedBy?: string;
  startDate?: string;
  endDate?: string;
  profile: UserProfile;
}

export interface ActiveUsersResponse {
  success: boolean;
  message: string;
  data: {
    users: User[];
    TotalCount: number;
    Limit: number;
    Offset: number;
  };
}

export interface GetActiveUsersParams {
  role?: string; 
  isActive?: boolean;
  limit?: number;
  offset?: number;
}