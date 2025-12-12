
/**
 * Represents a basic agent with contact and role information.
 */
export interface Agent {
  id: string;         // Unique identifier for the agent
  name: string;       // Agent's full name
  email: string;      // Agent's email address
  phone: string;      // Agent's phone number
  role: string;       // Role of the agent
  status?: string;    // (Optional) Status of the agent
}


/**
 * Represents the profile details of an agent, including personal and work information.
 */
export interface AgentProfile {
  firstName: string;              // Agent's first name
  lastName: string;               // Agent's last name
  fullName: string;               // Agent's full name
  phoneNumber: string;            // Agent's phone number
  adhaarNo: number;               // Agent's Aadhaar number
  gender: string;                 // Gender of the agent
  guardian: string;               // Guardian's name
  guardianType: string;           // Type of guardian (e.g., father, mother)
  dateOfBirth: string;            // Date of birth
  address: {
    addressLine1: string;         // Address line 1
    addressLine2: string;         // Address line 2
    city: string;                 // City
    state: string;                // State
    pinCode: string;              // Postal code
  };
  department: string;             // Department name
  designation: string;            // Designation or job title
  workLocation: string;           // Work location
  profilePicture: string;         // URL to profile picture
  relationshipToProperty: string; // Relationship to the property
  ownershipShare: number;         // Ownership share percentage
  isPrimaryOwner: boolean;        // Whether the agent is the primary owner
  isVerified: boolean;            // Whether the agent is verified
}


/**
 * Response structure for fetching a list of agents.
 */
export interface GetAgentsResponse {
  success: boolean;    // Indicates if the request was successful
  data: Agent[];       // List of agents
  message?: string;    // (Optional) Response message
}


/**
 * Request structure for reassigning an application to another agent.
 */
export interface ReassignApplicationRequest {
  action: string;                // Action to be performed (e.g., 'reassign')
  reasonForReassignment: string; // Reason for reassigning the application
  informViaSMS: boolean;         // Whether to inform via SMS
  applicationId: string;         // ID of the application to reassign
  agentId: string;               // ID of the agent to assign
}


/**
 * Response structure after reassigning an application.
 */
export interface ReassignApplicationResponse {
  success: boolean;  // Indicates if the reassignment was successful
  message: string;   // Response message
}


/**
 * Represents the address details of an agent.
 */
export interface AgentAddress {
  addressLine1: string; // Address line 1
  addressLine2: string; // Address line 2
  city: string;         // City
  state: string;        // State
  pinCode: string;      // Postal code
}


/**
 * Represents the profile details of an agent, including address as a separate type.
 */
export interface AgentProfile {
  firstName: string;              // Agent's first name
  lastName: string;               // Agent's last name
  fullName: string;               // Agent's full name
  phoneNumber: string;            // Agent's phone number
  adhaarNo: number;               // Agent's Aadhaar number
  gender: string;                 // Gender of the agent
  guardian: string;               // Guardian's name
  guardianType: string;           // Type of guardian (e.g., father, mother)
  dateOfBirth: string;            // Date of birth
  address: AgentAddress;          // Address details (AgentAddress type)
  department: string;             // Department name
  designation: string;            // Designation or job title
  workLocation: string;           // Work location
  profilePicture: string;         // URL to profile picture
  relationshipToProperty: string; // Relationship to the property
  ownershipShare: number;         // Ownership share percentage
  isPrimaryOwner: boolean;        // Whether the agent is the primary owner
  isVerified: boolean;            // Whether the agent is verified
}


/**
 * Represents an agent with detailed profile and status information, fetched by ID.
 */
export interface AgentById {
  id: string;                  // Unique agent ID
  username: string;            // Username of the agent
  email: string;               // Email address
  role: string;                // Role of the agent
  isActive: boolean;           // Whether the agent is active
  ward: string;                // Ward assigned to the agent
  preferred_language: string;  // Preferred language
  createdDate: string;         // Creation date
  updatedDate: string;         // Last update date
  profile: AgentProfile;       // Agent's profile details
}


/**
 * Response structure for fetching an agent by ID.
 */
export interface GetAgentByIdResponse {
  success: boolean;    // Indicates if the request was successful
  message?: string;    // (Optional) Response message
  data: AgentById;     // Agent details
}


/**
 * Represents a user who is an agent, including audit fields.
 */
export interface AgentUser {
  id: string;                  // Unique user ID
  username: string;            // Username
  email: string;               // Email address
  role: string;                // Role of the user
  isActive: boolean;           // Whether the user is active
  ward: string;                // Ward assigned
  preferred_language: string;  // Preferred language
  createdDate: string;         // Creation date
  updatedDate: string;         // Last update date
  createdBy?: string;          // (Optional) Who created the user
  updatedBy?: string;          // (Optional) Who last updated the user
  profile: AgentProfile;       // Profile details
}


/**
 * Response structure for fetching agents by ward, including pagination info.
 */
export interface GetAgentsByWardResponse {
  success: boolean;    // Indicates if the request was successful
  message?: string;    // (Optional) Response message
  data: {
    users: AgentUser[]; // List of agent users
    TotalCount: number; // Total number of users
    Limit: number;      // Limit per page
    Offset: number;     // Offset for pagination
  };
}