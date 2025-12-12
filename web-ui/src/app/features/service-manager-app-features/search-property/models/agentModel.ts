// This file defines TypeScript interfaces for agent-related data models used in the property search feature.

// Represents the address details of an agent
export interface AgentAddress {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pinCode: string;
}

// Represents the profile information of an agent
export interface AgentProfile {
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumber: string;
  adhaarNo: number;
  gender: string;
  guardian: string;
  guardianType: string;
  dateOfBirth: string;
  address: AgentAddress;
  department: string;
  designation: string;
  workLocation: string;
  profilePicture: string;
  relationshipToProperty: string;
  ownershipShare: number;
  isPrimaryOwner: boolean;
  isVerified: boolean;
}

// Represents a user who is an agent
export interface AgentUser {
  id: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  ward: string;
  preferred_language: string;
  createdDate: string;
  updatedDate: string;
  createdBy?: string;
  updatedBy?: string;
  profile: AgentProfile;
}

// Represents the response structure for fetching agents
export interface GetAgentsResponse {
  success: boolean;
  message?: string;
  data: {
    users: AgentUser[];
    TotalCount: number;
    Limit: number;
    Offset: number;
  };
}