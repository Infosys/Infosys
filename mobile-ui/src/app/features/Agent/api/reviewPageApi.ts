
// reviewPageApi defines API endpoints for fetching property applications assigned to an agent for review.
// Uses agentApiSlice for base API configuration and authentication.
// Returns RTK Query hook for use in Agent review screens/components.

import { agentApiSlice } from './agentApiSlice';
import type { ApplicationsResponse } from '../models/ReviewPage.model';


// Injects the getApplications endpoint for fetching applications with status AUDIT_VERIFIED assigned to the agent
export const applicationsApi = agentApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getApplications: builder.query<ApplicationsResponse, { AssignedAgent: string }>({
      query: ({ AssignedAgent }) => ({
        url: `/v1/applications/search?AssignedAgent=${AssignedAgent}&status=AUDIT_VERIFIED`,
        method: 'GET',
      }),
    }),
  }),
});


// RTK Query hook for use in Agent review page components
export const { useGetApplicationsQuery } = applicationsApi;