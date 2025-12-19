// This file defines API endpoints for fetching and updating property applications for the Commissioner dashboard.
// It uses RTK Query (Redux Toolkit Query) for data fetching and caching.
import type { AllApplicationModel } from '../models/PropertyApplicationModel'
import { apiSlice } from '../../../../../store/apiSlice'
import { TAG_TYPES } from '../../../../../store/tagTypes'

// Request params for fetching all applications (with pagination)
interface GetAllApplicationsRequest {
    page?: number;
    size?: number;
}

// Response shape for fetching all applications
interface GetAllApplicationsResponse {
    data: AllApplicationModel[];
    message: string;
    pagination: {
        page: number;
        size: number;
        totalItems: number;
        totalPages: number;
    };
    success: boolean;
}

// Request params for updating an application's priority
interface UpdateApplicationPriorityRequest {
    id: string;
    priority: string;
}

// Response shape for updating an application's priority
interface UpdateApplicationPriorityResponse {
    data: AllApplicationModel;
    message: string;
    success: boolean;
}

// Inject endpoints for all applications API
export const allApplicationApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Fetch all property applications (paginated)
        getAllApplications: builder.query<GetAllApplicationsResponse, GetAllApplicationsRequest>({
            query: ({ page = 0, size = 30 } = {}) => ({
                url: `/v1/applications?page=${page}&size=${size}`,
                method: 'GET',
                headers: {
                    'X-User-Role': 'COMMISSIONER',
                },
            }),
            providesTags: [TAG_TYPES.APPLICATIONS],
        }),
        // Update the priority of a specific application
        updateApplicationPriority: builder.mutation<UpdateApplicationPriorityResponse, UpdateApplicationPriorityRequest>({
            query: ({ id, priority }) => ({
                url: `/v1/applications/${id}`,
                method: 'PUT',
                body: { 
                    "priority": `${priority}`
                },
                headers: {
                    'X-User-Role': 'COMMISSIONER',
                },
            }),
            invalidatesTags: [TAG_TYPES.APPLICATIONS],
        }),
    }),
})

// Export hooks for use in components
export const { useGetAllApplicationsQuery, useUpdateApplicationPriorityMutation } = allApplicationApi;