// This file defines API slices and endpoints for agent assignment and reassignment in the application.
// It uses RTK Query to create endpoints for fetching agents and assigning/reassigning applications to agents.
import { onboardingApiSlice } from '../../../../../store/onboardingApiSlice'
import { apiSlice } from '../../../../../store/apiSlice';
import { TAG_TYPES } from '../../../../../store/tagTypes';

// Types for agent API responses
import type {
  GetAgentByIdResponse,
  GetAgentsByWardResponse,
} from '../../application-inbox/models/getAndReassignAgentModel';

// Response type for assign/reassign application API calls
interface AssignReassignApplicationResponse {
  success: boolean;
  message: string;
}

// API slice for agent-related queries (fetching agents by ward and by ID)
export const agentsApi = onboardingApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Endpoint to fetch agents by ward
    getAgents: builder.query<GetAgentsByWardResponse, { ward: string }>({
      query: ({ ward }) => ({
        url: `/api/v1/users?role=AGENT&isActive=true&ward=${ward}&limit=20&offset=0`,
        method: 'GET',
      }),
      providesTags: [TAG_TYPES.AGENTS],
    }),
    // Endpoint to fetch a single agent by their ID
    getAgentById: builder.query<GetAgentByIdResponse, string>({
      query: (id) => ({
        url: `/api/v1/users/${id}`,
        method: 'GET',
      }),
      providesTags: [TAG_TYPES.AGENTS],
    }),
  }),
});
// Hooks for agent queries
export const { useGetAgentsQuery, useGetAgentByIdQuery } = agentsApi;

// API slice for assigning or reassigning an application to an agent
export const assignOrReassignApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Endpoint to reassign an application to a different agent
    reassignApplication: builder.mutation<AssignReassignApplicationResponse, { applicationId: string, agentId: string, comments: string }>({
      query: ({ applicationId, agentId, comments }) => ({
        url: `/v1/applications/${applicationId}`,
        method: 'PATCH',
        body: {
          "action": "re-assign",
          "agentId": `${agentId}`,
          "comments": `${comments}`,
        },
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: TAG_TYPES.APPLICATION, id: arg.applicationId },
        TAG_TYPES.APPLICATIONS,
        TAG_TYPES.AGENTS
      ]
    }),
    // Endpoint to assign an application to an agent
    assignApplication: builder.mutation<AssignReassignApplicationResponse, { applicationId: string, agentId: string, comments: string }>({
      query: ({ applicationId, agentId, comments }) => ({
        url: `/v1/applications/${applicationId}`,
        method: 'PATCH',
        body: {
          "action": "assign",
          "agentId": `${agentId}`,
          "comments": `${comments}`,
        },
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: TAG_TYPES.APPLICATION, id: arg.applicationId },
        TAG_TYPES.APPLICATIONS,
        TAG_TYPES.AGENTS
      ]
    }),
  }),
});
// Hooks for assign/reassign mutations
export const { useReassignApplicationMutation, useAssignApplicationMutation } = assignOrReassignApi;