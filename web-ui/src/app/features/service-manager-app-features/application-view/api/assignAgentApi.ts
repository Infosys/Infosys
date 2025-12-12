
// RTK Query API endpoint for assigning an agent to an application.
import { apiSlice } from '../../../../../store/apiSlice'
import { TAG_TYPES } from '../../../../../store/tagTypes'
import type { AssignApplicationResponse } from '../model/assignAgentModel';


/**
 * Injects an endpoint for assigning an agent to a property application using RTK Query.
 * Uses a PATCH request to update the application's assigned agent.
 */
export const assignApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Mutation for assigning an agent to an application.
     * @param applicationId - The ID of the application to assign
     * @param agentId - The ID of the agent to assign
     * @param comments - Comments for the assignment action
     * @returns The response from the backend
     */
    AssignApplication: builder.mutation<AssignApplicationResponse, { applicationId: string, agentId: string, comments: string }>({
      query: ({ applicationId, agentId }) => ({
        url: `/v1/applications/${applicationId}`,
        method: 'PATCH',
        body: {
          "action": "assign",
          "agentId": `${agentId}`,
          "comments": "Assign to field agent",
        },
      }),
      // Invalidate relevant caches after assignment
      invalidatesTags: (_result, _error, arg) => [
        { type: TAG_TYPES.APPLICATION, id: arg.applicationId },
        // { type: TAG_TYPES.APPLICATIONS, id: 'LIST' },
        TAG_TYPES.AGENTS,
        TAG_TYPES.ASSIGNMENTS,
      ]
    }),
  }),
});

// Export the mutation hook for assigning an agent
export const { useAssignApplicationMutation } = assignApi;