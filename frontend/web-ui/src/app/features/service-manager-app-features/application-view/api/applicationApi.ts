
// RTK Query API endpoints for viewing, editing, and acting on property applications.
import type { ApplicationResponse, Property } from '../model/applicationByIdModel';
import type { AcceptApplicationResponse, EditApplicationResponse } from '../model/acceptApplicationModel';
import { apiSlice } from '../../../../../store/apiSlice'
import { TAG_TYPES } from '../../../../../store/tagTypes'
import type { PostApplicationLogRequest, PostApplicationLogResponse } from '../model/applicationLogModel';


/**
 * Injects endpoints for viewing and editing property applications using RTK Query.
 * Includes queries for fetching owner/application details and mutations for editing and logging.
 */
export const viewApplicationApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        // Get owner details by property ID
        getOwnerByPropertyId: builder.query<ApplicationResponse, string>({
            query: (propertyId) => ({
                url: `/v1/property-owners/property/${propertyId}`,
                method: 'GET',
                headers: {
                    'X-User-Role': 'SERVICE_MANAGER',
                    'X-Tenant-ID': 'pb.amritsar'
                },
            }),
            providesTags: [TAG_TYPES.APPLICATIONS],
        }),

        // get application by Application id
        getApplicationByApplicationId: builder.query<ApplicationResponse, string>({
            query: (applicationId) => ({
                url: `/v1/applications/${applicationId}`,
                method: 'GET',
            }),
            providesTags: (_result, _error, applicationId) => [
                { type: TAG_TYPES.APPLICATION, id: applicationId },
                { type: TAG_TYPES.APPLICATION_LOGS, id: applicationId },
                TAG_TYPES.APPLICATIONS,
                TAG_TYPES.GIS_DATA
            ],
        }),

        // Edit application details
        editApplication: builder.mutation<EditApplicationResponse, { property: Property, applicationId: string }>({
            query: ({ property, applicationId }) => ({
                url: `/v1/properties/${property.ID}/${applicationId}?isVerifying=true`,
                method: 'PUT',
                headers: {
                    'X-Tenant-ID': 'pb.amritsar'
                },
                body: {
                    ...property
                },
            }),
                invalidatesTags: (_result, _error, { property , applicationId }) => [
        { type: TAG_TYPES.APPLICATION, id: applicationId },
        { type: TAG_TYPES.APPLICATION_LOGS, id: property.ID },
        TAG_TYPES.APPLICATIONS,
        TAG_TYPES.GIS_DATA
    ],
        }),


        // Post an application log entry
        postApplicationLog: builder.mutation<PostApplicationLogResponse, PostApplicationLogRequest>({
            query: (log) => ({
                url: '/v1/application-logs',
                method: 'POST',
                headers: {
                    'X-Tenant-ID': 'pb.amritsar',
                },
                body: log,
            }),
            // Invalidate logs cache for the affected application
            invalidatesTags: (_result, _error, arg) => [
                { type: TAG_TYPES.APPLICATION_LOGS, id: arg.applicationId }
            ],
        }),

    }),

});


/**
 * Injects a standalone endpoint for posting application logs.
 */
export const applicationLogApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        postApplicationLog: builder.mutation<PostApplicationLogResponse, PostApplicationLogRequest>({
            query: (log) => ({
                url: '/v1/application-logs',
                method: 'POST',
                headers: {
                    'X-Tenant-ID': 'pb.amritsar',
                },
                body: log,
            }),
        }),
    }),
});


// Export the mutation hook for posting application logs
export const { usePostApplicationLogMutation } = applicationLogApi;


/**
 * Injects an endpoint for accepting (auditing) an application.
 * Uses a PATCH request to update the application's approval status and comments.
 */
export const acceptApplicationApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        acceptApplication: builder.mutation<AcceptApplicationResponse, { applicationId: string, approved: boolean, comments: string }>({
            query: ({ applicationId, approved, comments }) => ({
                url: `/v1/applications/${applicationId}`,
                method: 'PATCH',
                headers: {
                    'X-Tenant-ID': 'pb.amritsar'
                },
                body: {
                    action: "audit-verify",
                    approved,
                    comments,
                },
            }),
            // Invalidate the applications cache after approval
            invalidatesTags: [TAG_TYPES.APPLICATIONS]
        }),
    }),
});

// Export the mutation hook for accepting applications
export const { useAcceptApplicationMutation } = acceptApplicationApi;


// Export hooks for all queries and mutations in the viewApplicationApi
export const {
    useGetOwnerByPropertyIdQuery,
    useGetApplicationByApplicationIdQuery,
    useEditApplicationMutation,
} = viewApplicationApi;