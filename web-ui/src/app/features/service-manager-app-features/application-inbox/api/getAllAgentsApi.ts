
// This file defines an API slice for fetching all agent users from the backend
import { onboardingApiSlice } from '../../../../../store/onboardingApiSlice'
import type { GetAgentsResponse } from '../models/agentModel';



// Injects the getAllAgents endpoint into the onboardingApiSlice
export const allAgentsApi = onboardingApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all users with the AGENT role
    getAllAgents: builder.query<GetAgentsResponse, void>({
      query: () => ({
        url: `/api/v1/users?role=AGENT`,
        method: 'GET',
      }),
    }),
  }),
});

// Export the hook for use in React components
export const { useGetAllAgentsQuery } = allAgentsApi;