// This file defines API endpoints for managing and querying property applications for service managers
import type { AllApplicationModel } from '../models/PropertyApplicationModel'
import { apiSlice } from '../../../../../store/apiSlice'
import { TAG_TYPES } from '../../../../../store/tagTypes'

interface GetByWardNoRequest {
    wardNo: string;
    page?: number;
    size?: number;
}
interface GetByZoneNoRequest {
    zoneNo: string;
    page?: number;
    size?: number;
}
interface GetByDueDateRequest {
    dueDateTo: string;
    page?: number;
    size?: number;
}
// Request type for fetching applications by ward number
interface GetAllApplicationsRequest {
    page?: number;
    size?: number;
// Request type for fetching applications by zone number
}
interface GetAllApplicationsResponse {
    data: AllApplicationModel[];
// Request type for fetching applications by due date
    message: string;
    pagination: {
        page: number;
        size: number;
// Request type for fetching all applications with pagination
        totalItems: number;
        totalPages: number;
    };
    success: boolean;
}
interface UpdateApplicationPriorityRequest {
    id: string;
    priority: string;
}
interface UpdateApplicationPriorityResponse {
    data: AllApplicationModel;
// Response type for fetching all applications, includes pagination info
    message: string;
    success: boolean;
}

// Request type for updating the priority of an application

interface GetApplicationByApplicationNoRequest {
    applicationNo: string;
    page?: number;
    size?: number;
}

// Response type for updating the priority of an application

export const allApplicationApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
// Request type for fetching an application by its application number
        getAllApplications: builder.query<GetAllApplicationsResponse, GetAllApplicationsRequest>({
// Define endpoints for all application-related API calls using RTK Query
            query: ({ page = 0, size = 10 } = {}) => {
                const url = `/v1/applications?sortBy=DESC&page=${page}&size=${size}`;
            // Fetch all applications with pagination
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
        getAllApplicationsByWard: builder.query<GetAllApplicationsResponse, GetByWardNoRequest>({
            query: ({ wardNo, page=0, size=10 }) => ({
                url: `/v1/applications/search?isDraft=true&wardNo=${wardNo}&page=${page}&size=${size}`,
            // Fetch all applications for a specific ward
                method: 'GET',
                headers: {
                    'X-User-Role': 'SERVICE_MANAGER',
                },
            }),
            providesTags: [TAG_TYPES.APPLICATIONS],
        }),
        getAllApplicationsByZone: builder.query<GetAllApplicationsResponse, GetByZoneNoRequest>({
            query: ({ zoneNo, page=0, size=10 }) => ({
                url: `/v1/applications/search?isDraft=true&zoneNo=${zoneNo}&page=${page}&size=${size}`,
            // Fetch all applications for a specific zone
                method: 'GET',
                headers: {
                    'X-User-Role': 'SERVICE_MANAGER',
                },
            }),
            providesTags: [TAG_TYPES.APPLICATIONS],
        }),
        getAllApplicationsByDueDate: builder.query<GetAllApplicationsResponse, GetByDueDateRequest>({
            query: ({ dueDateTo, page=0, size=10 }) => ({
                url: `/v1/applications/search?isDraft=true&dueDateTo=${dueDateTo}&page=${page}&size=${size}`,
            // Fetch all applications due by a specific date
                method: 'GET',
                headers: {
                    'X-User-Role': 'SERVICE_MANAGER',
                },
            }),
            providesTags: [TAG_TYPES.APPLICATIONS],
        }),
        getApplicationByApplicationNo: builder.query<GetAllApplicationsResponse, GetApplicationByApplicationNoRequest>({
            query: ({ applicationNo, page=0, size=10 }) => ({
                url: `/v1/applications/search?isDraft=false&applicationNo=${applicationNo}&page=${page}&size=${size}`,
            // Fetch an application by its application number
                method: 'GET',
                headers: {
                    'X-User-Role': 'SERVICE_MANAGER',
                },
            }),
            providesTags: [TAG_TYPES.APPLICATIONS],
        }),
        updateApplicationPriority: builder.mutation<UpdateApplicationPriorityResponse, UpdateApplicationPriorityRequest>({
            query: ({ id, priority }) => ({
                url: `/v1/applications/${id}`,
            // Update the priority of a specific application
                method: 'PUT',
                body: {
                    "priority": `${priority}`
                },
                headers: {
                    'X-User-Role': 'SERVICE_MANAGER',
                },
            }),
            invalidatesTags: [TAG_TYPES.APPLICATIONS],
        }),
    }),
})

export const {
    useGetAllApplicationsQuery,
    useGetAllApplicationsByWardQuery,
// Export hooks for use in React components
    useGetAllApplicationsByZoneQuery,
    useGetAllApplicationsByDueDateQuery,
    useGetApplicationByApplicationNoQuery,
    useUpdateApplicationPriorityMutation
} = allApplicationApi;