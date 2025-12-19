
// /**
//  * This file provides an API slice for searching and filtering applications in the Service Manager's inbox.
//  * It defines a query endpoint that allows filtering by various parameters such as priority, zone, agent, status, property, applicant, and application number.
//  * Uses RTK Query for efficient data fetching and cache management.
//  */
// import { apiSlice } from '../../../../../store/apiSlice'
// import { TAG_TYPES } from '../../../../../store/tagTypes'
// import type { GetAllApplicationsResponse } from '../models/getAllApplicationsModel';


// // Defines the possible search and filter parameters for applications
// interface ApplicationSearchParams {
//     priority?: string;
//     zoneNo?: string;
//     assignedAgent?: string;
//     status?: string;
//     propertyId?: string;
//     appliedBy?: string;
//     applicationNo?: string;
//     page?: number;
//     size?: number;
// }


// export const allApplicationApi = apiSlice.injectEndpoints({
//     endpoints: (builder) => ({
//         /**
//          * Fetches filtered applications based on provided search parameters.
//          * Dynamically builds the query string from the given filters.
//          * Adds a custom header to indicate the user role.
//          */
//         getFilteredApplications: builder.query<GetAllApplicationsResponse, ApplicationSearchParams>({
//             query: (params) => {
//                 // Build query parameters from the provided filters
//                 const queryParams = new URLSearchParams();
//                 if (params.priority) queryParams.append('priority', params.priority);
//                 if (params.zoneNo) queryParams.append('zoneNo', params.zoneNo);
//                 if (params.assignedAgent) queryParams.append('assignedAgent', params.assignedAgent);
//                 if (params.status) queryParams.append('status', params.status);
//                 if (params.propertyId) queryParams.append('propertyId', params.propertyId);
//                 if (params.appliedBy) queryParams.append('appliedBy', params.appliedBy);
//                 if (params.applicationNo) queryParams.append('applicationNo', params.applicationNo);
//                 if (params.page !== undefined) queryParams.append('page', params.page.toString());
//     if (params.size !== undefined) queryParams.append('size', params.size.toString());   
//                 // Return the API request configuration
//                 return {
//                     url: `/v1/applications/search?${queryParams.toString()}`,
//                     method: 'GET',
//                     headers: {
//                         'X-User-Role': 'SERVICE_MANAGER',
//                     },
//                 };
//             },
//             // Provides a tag for cache management and refetching
//             providesTags: [TAG_TYPES.APPLICATIONS],
//         }),
//     }),
// })


// // Export the hook for fetching filtered applications
// export const {
//     useGetFilteredApplicationsQuery,
// } = allApplicationApi;