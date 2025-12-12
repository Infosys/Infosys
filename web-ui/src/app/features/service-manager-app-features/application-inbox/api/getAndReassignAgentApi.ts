
/**
 * This file defines API slices for managing agent-related operations in the Service Manager's application inbox.
 * Includes endpoints for fetching agents by ward, fetching agent details by ID, and reassigning applications to agents.
 * Utilizes RTK Query for efficient data fetching and cache management.
 */
import { onboardingApiSlice } from '../../../../../store/onboardingApiSlice'
import {apiSlice} from '../../../../../store/apiSlice';
import { TAG_TYPES } from '../../../../../store/tagTypes';

import type {
  GetAgentByIdResponse,
  GetAgentsByWardResponse,
  ReassignApplicationResponse,
} from '../models/getAndReassignAgentModel';

// API slice for agent fetching operations
export const agentsApi = onboardingApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Fetches a list of active agents for a specific ward.
     * Limits the result to 20 agents, starting from offset 0.
     */
    getAgents: builder.query<GetAgentsByWardResponse, { ward: string }>({
      query: ({ ward }) => ({
        url: `/api/v1/users?role=AGENT&isActive=true&ward=${ward}&limit=20&offset=0`,
        method: 'GET',
      }),
    }),
    /**
     * Fetches details of a single agent by their unique ID.
     */
    getAgentById: builder.query<GetAgentByIdResponse, string>({
      query: (id) => ({
        url: `/api/v1/users/${id}`,
        method: 'GET',
      }),
    }),
  }),
});

// Export hooks for fetching agents and agent details
export const { useGetAgentsQuery, useGetAgentByIdQuery } = agentsApi;

// API slice for reassigning applications
export const reassignApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Reassigns an application to a different agent.
     * Sends a PATCH request with the new agent ID and comments explaining the reassignment.
     * Invalidates the APPLICATIONS tag to ensure data is refreshed.
     */
    reassignApplication: builder.mutation<ReassignApplicationResponse, {applicationId:string, agentId:string, comments:string}>({
      query: ({ applicationId, agentId, comments}) => ({
        url: `/v1/applications/${applicationId}`,
        method: 'PATCH',
        body: {
          action: "re-assign",
          agentId,
          comments,
        },
      }),
      invalidatesTags: [TAG_TYPES.APPLICATIONS]
    }),
  }),
});

// Export hook for reassigning applications
export const { useReassignApplicationMutation } = reassignApi;