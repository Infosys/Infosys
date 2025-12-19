
// API slice for searching properties assigned to an agent
import { agentApiSlice } from './agentApiSlice';
import type { SearchPropertyResponse } from '../models/SearchPropertyData.model';


// Injects endpoints into the agentApiSlice for property search
export const searchPropertyApi = agentApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Query to get properties assigned to a specific agent
    getProperties: builder.query<SearchPropertyResponse, { assignedAgent: string }>({
      query: ({ assignedAgent }) => ({
        url: `/v1/applications/search?assignedAgent=${assignedAgent}`,
        method: 'GET',
        headers: {
          'X-Tenant-ID': 'pb.amritsar', // Tenant ID header for API
        },
      }),
    }),
  }),
});


// Export hooks for using the getProperties query
export const { useGetPropertiesQuery, useLazyGetPropertiesQuery } = searchPropertyApi;