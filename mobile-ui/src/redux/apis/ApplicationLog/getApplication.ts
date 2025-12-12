// API slice for application logs (fetch by property, post log)
import { apiSlice } from '../../apiSlice'
import { TAG_TYPES } from '../../tagTypes'
import type { ApplicationResponse, PostApplicationLogResponse, PostApplicationLogRequest } from './Modal/ApplicationModals';



export const ApplicationApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Fetch application details by property ID
        getApplicationByPropertyId: builder.query<ApplicationResponse, string>({
            query: (propertyId) => ({
                url: `${import.meta.env.VITE_ENUMERATION_HOST}/v1/applications/${propertyId}`,
                method: 'GET',
                headers: {
                    // 'X-User-ID': '6b338a84-af0f-47bf-9345-86c82b3120fc',
                    // 'X-User-Role': 'SERVICE_MANAGER',
                    // 'X-Tenant-ID': 'pb.amritsar'
                },
            }),
            providesTags: (_result, _error, propertyId) => [
                { type: TAG_TYPES.APPLICATION_LOGS, id: propertyId }
            ],
        }),

        // Post a new application log entry
        postApplicationLog: builder.mutation<PostApplicationLogResponse, PostApplicationLogRequest>({
            query: (log) => ({
                url: '/v1/application-logs',
                method: 'POST',
                headers: { 'X-Tenant-ID': 'pb.amritsar' },
                body: log,
            }),
            invalidatesTags: (_result, _error, arg) => [
                { type: TAG_TYPES.APPLICATION_LOGS, id: arg.applicationId }
            ],
        }),
    }),
});