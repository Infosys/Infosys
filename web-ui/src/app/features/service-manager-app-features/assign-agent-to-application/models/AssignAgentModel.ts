// This file defines TypeScript interfaces for agent assignment and reassignment models. // Used for API requests and responses related to assigning or reassigning agents to applications.
import type { Agent } from "../../application-inbox/models/getAndReassignAgentModel";

export interface GetAgentsResponse { // Response structure for fetching a list of agents
  success: boolean; // Indicates if the API call was successful
  data: Agent[]; // Array of agent objects returned from the API
  message?: string; // Optional message from the API (e.g., error or status)
}

export interface ReassignApplicationRequest { // Request structure for reassigning an application to a different agent
  action: string; // Action type (e.g., 're-assign')
  reasonForReassignment: string; // Reason for the reassignment
  informViaSMS: boolean; // Whether to inform the agent via SMS
  applicationId: string; // ID of the application being reassigned
  agentId: string; // ID of the agent to assign
}

export interface ReassignApplicationResponse { // Response structure for a reassign application API call
  success: boolean; // Indicates if the reassignment was successful
  message: string; // Message from the API (e.g., success or error message)
}