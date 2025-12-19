
/**
 * Represents the address details of an agent.
 */
export interface AgentAddress {
  addressLine1: string; // First line of the address
  addressLine2: string; // Second line of the address
  city: string;         // City name
  state: string;        // State name
  pinCode: string;      // Postal code
}


/**
 * Represents the profile information of an agent.
 */
export interface AgentProfile {
  firstName: string;                // Agent's first name
  lastName: string;                 // Agent's last name
  fullName: string;                 // Agent's full name
  phoneNumber: string;              // Contact phone number
  adhaarNo: number;                 // Aadhaar number (unique ID)
  gender: string;                   // Gender of the agent
  guardian: string;                 // Guardian's name
  guardianType: string;             // Type of guardian (e.g., father, mother)
  dateOfBirth: string;              // Date of birth
  address: AgentAddress;            // Address details
  department: string;               // Department name
  designation: string;              // Job designation
  workLocation: string;             // Work location
  profilePicture: string;           // URL to profile picture
  relationshipToProperty: string;   // Relationship to the property
  ownershipShare: number;           // Share of ownership
  isPrimaryOwner: boolean;          // Whether agent is the primary owner
  isVerified: boolean;              // Whether agent is verified
}


/**
 * Represents an agent user in the system.
 */
export interface AgentUser {
  id: string;                    // Unique user ID
  username: string;              // Username
  email: string;                 // Email address
  role: string;                  // User role (e.g., AGENT)
  isActive: boolean;             // Whether the user is active
  ward: string;                  // Ward assigned to the agent
  preferred_language: string;    // Preferred language
  createdDate: string;           // Date the user was created
  updatedDate: string;           // Date the user was last updated
  createdBy?: string;            // (Optional) Who created the user
  updatedBy?: string;            // (Optional) Who last updated the user
  profile: AgentProfile;         // Profile details
}


/**
 * Represents the response structure for fetching agents.
 */
export interface GetAgentsResponse {
  success: boolean; // Indicates if the request was successful
  message?: string; // Optional message from the server
  data: {
    users: AgentUser[]; // List of agent users
    TotalCount: number;  // Total number of users
    Limit: number;       // Pagination limit
    Offset: number;      // Pagination offset
  };
}