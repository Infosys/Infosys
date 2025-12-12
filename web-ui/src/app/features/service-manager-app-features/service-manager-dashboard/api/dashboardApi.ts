// API slice for Service Manager Dashboard related endpoints
// Provides queries for fetching property applications and applications by agent ID

import apiSlice from '../../../../../store/apiSlice';
import { TAG_TYPES } from '../../../../../store/tagTypes';
import type { AllApplicationModel } from '../models/ServiceManagerDashboard/PropertyApplicationModel';

// Request payload for fetching applications by agent ID
interface GetApplicationsByAgentIdRequest {
  agent_id: string;
}

// Response structure for dashboard property applications
interface GetDashboardPropertiesResponse {
  data: AllApplicationModel[]; // List of application data
  message: string; // Response message
  pagination: {
    page: number; // Current page number
    size: number; // Number of items per page
    totalItems: number; // Total number of items
    totalPages: number; // Total number of pages
  };
  success: boolean; // Indicates if the request was successful
}

// Inject endpoints into the main API slice for dashboard features
export const serviceManagerDashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Query to fetch all property applications, optionally filtered by zone and ward
    getAllPropertyApplications: builder.query<GetDashboardPropertiesResponse, { page: number; size: number; zoneNo?: string; wardNos?: string[] }>({
      query: ({ page, size, zoneNo, wardNos }) => {
        let url = `/v1/applications/search?sortBy=DESC&page=${page}&size=${size}`;

        if (zoneNo && wardNos && wardNos.length > 0) {
          const zoneParam = `zoneNo=${encodeURIComponent(zoneNo)}`;

          // Generate ward parameters with both formats (ward-2 and ward 2)
          const wardParams = wardNos.flatMap(w => {
            const params = [`wardNo=${encodeURIComponent(w)}`];

            // If ward contains a hyphen (e.g., "ward-2"), add the space version ("ward 2")
            if (w.includes('-')) {
              const spaceVersion = w.replace('-', ' ');
              params.push(`wardNo=${encodeURIComponent(spaceVersion)}`);
            }
            // If ward contains a space (e.g., "ward 2"), add the hyphen version ("ward-2")
            else if (w.includes(' ')) {
              const hyphenVersion = w.replace(' ', '-');
              params.push(`wardNo=${encodeURIComponent(hyphenVersion)}`);
            }

            return params;
          }).join('&');

          url = `/v1/applications/search?sortBy=DESC&${zoneParam}&${wardParams}&page=${page}&size=${size}`;
        }

        return {
          url,
          method: 'GET',
          headers: {
            'X-User-Role': 'SERVICE_MANAGER',
          },
        };
      },
      providesTags: [TAG_TYPES.APPLICATIONS, TAG_TYPES.AGENTS],
    }),
    // Query to fetch all applications assigned to a specific agent
    getAllApplicationsByAgentId: builder.query<GetDashboardPropertiesResponse, GetApplicationsByAgentIdRequest>({
      query: ({ agent_id }) => ({
        url: `/v1/applications/search?assignedAgent=${agent_id}`,
        method: 'GET',
        headers: {
          'X-User-Role': 'SERVICE_MANAGER',
          'X-Tenant-ID': 'pb.amritsar'
        },
      }),
      providesTags: [TAG_TYPES.APPLICATIONS, TAG_TYPES.AGENTS],
    }),
  }),
})

// Export hooks for using the queries in React components
export const {
  useGetAllPropertyApplicationsQuery,
  useGetAllApplicationsByAgentIdQuery
} = serviceManagerDashboardApi;