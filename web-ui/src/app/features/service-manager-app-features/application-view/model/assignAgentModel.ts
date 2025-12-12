
// Request payload for assigning or reassigning an agent to an application
export interface AssignApplicationRequest {
  action: string;                // The action to perform (e.g., 'assign', 'reassign')
  reasonForReassignment: string; // Reason for (re)assignment
  informViaSMS: boolean;         // Whether to notify the agent via SMS
  applicationId: string;         // The ID of the application
  agentId: string;               // The ID of the agent to assign
}


// Response payload for assigning or reassigning an agent
export interface AssignApplicationResponse {
  success: boolean; // Indicates if the operation was successful
  message: string;  // Response message from the API
}