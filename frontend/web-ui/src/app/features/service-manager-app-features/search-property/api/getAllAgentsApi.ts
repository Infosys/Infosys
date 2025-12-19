// This file defines an RTK Query API slice for fetching all agents with the AGENT role from the backend.
import { onboardingApiSlice } from '../../../../../store/onboardingApiSlice'
import type { GetAgentsResponse } from '../models/agentModel';


// Defines an API slice for fetching all agents using RTK Query
export const allAgentsApi = onboardingApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Endpoint to fetch all users with the AGENT role
    getAllAgents: builder.query<GetAgentsResponse, void>({
      query: () => ({
        url: `/api/v1/users?role=AGENT`,
        method: 'GET',
      }),
    }),
  }),
});
// Hook for fetching all agents
export const { useGetAllAgentsQuery } = allAgentsApi;
