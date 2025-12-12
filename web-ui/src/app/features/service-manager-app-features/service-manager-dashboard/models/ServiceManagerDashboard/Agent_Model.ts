// Interfaces for representing agent data, profile, and zone information in the Service Manager Dashboard

// Information about a zone and its wards assigned to an agent
export interface AgentZoneInfo {
  zoneNumber: string;
  wards: string[];
}

// Address details for an agent's profile
export interface AgentProfileAddress {
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  pinCode: string;
}

// Profile information for an agent, including personal and work details
export interface AgentProfile {
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumber: string;
  adhaarNo: number;
  gender: string;
  address: AgentProfileAddress;
  department: string;
  designation: string;
  relationshipToProperty: string;
  ownershipShare: number;
  isPrimaryOwner: boolean;
  isVerified: boolean;
  guardian?: string;
  guardianType?: string;
  dateOfBirth?: string;
  workLocation?: string;
  profilePicture?: string;
}

// Main agent model used throughout the dashboard
export interface AgentModel {
  id: string;
  username: string;
  email: string;
  role: string;
  name?: string;
  ward?: string;
  preferred_language?: string;
  isActive: boolean;
  zoneData: AgentZoneInfo[];
  preferredLanguage: string;
  createdDate: string;
  updatedDate: string;
  createdBy: string;
  updatedBy: string;
  profile: AgentProfile;
}