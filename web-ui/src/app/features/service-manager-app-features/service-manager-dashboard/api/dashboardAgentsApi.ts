// This file defines API endpoints for fetching agent data for the service manager dashboard
// using RTK Query and onboardingApiSlice.

import { onboardingApiSlice } from '../../../../../store/onboardingApiSlice'
// import { useGetAgentByIdQuery } from '../../application-inbox/api/getAndReassignAgentApi';
import type { AgentModel } from "../models/ServiceManagerDashboard/Agent_Model";

// Response structure for fetching all agents
interface GetAllAgentsResponse {
  data: {
    users: AgentModel[];
    TotalCount: number;
    Limit: number;
    Offset: number;
  };
  message: string;
  success: boolean;
}

// Inject endpoints for agent-related API calls into the onboardingApiSlice
export const allAgentsApi = onboardingApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Endpoint to fetch all agents
    getAllAgents: builder.query<GetAllAgentsResponse, void>({
      query: () => ({
        url: `/api/v1/users?role=AGENT`,
        method: 'GET',
      }),
    }),
    // Endpoint to fetch a single agent by ID
    getAgentById: builder.query<AgentModel, string>({
      query: (id: string) => ({
        url: `/api/v1/users/${id}`,
        method: 'GET',
      }),
    }), 
  }),
});

// Export hooks for using the agent API endpoints in components
export const { useGetAllAgentsQuery, useGetAgentByIdQuery } = allAgentsApi;