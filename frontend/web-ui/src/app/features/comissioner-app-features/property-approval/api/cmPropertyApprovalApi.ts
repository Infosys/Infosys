
import apiSlice from "../../../../../store/apiSlice";
import { TAG_TYPES } from "../../../../../store/tagTypes";
import type { ApplicationResponse } from "../models/ApplicationModel";

// Request payload interface for updating application status
export interface UpdateApplicationStatusRequest {
    applicationId: string;
    action: 'approve' | 'reject';
    approved: boolean;
    comments: string;
}

// Response interface for application status update
export interface UpdateApplicationStatusResponse {
    message: string;
    success: boolean;
}

export const viewApplicationApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // get application by Application id
        getApplicationByApplicationId: builder.query<ApplicationResponse, string>({
            query: (applicationId) => ({
                url: `/v1/applications/${applicationId}`,
                method: 'GET',
                headers: {
                    'X-Tenant-ID': 'pb.amritsar',
                    'X-User-Role': 'COMMISSIONER'
                },
            }),
            providesTags: (_result, _error, applicationId) => [
                { type: TAG_TYPES.APPLICATION, id: applicationId },
                { type: TAG_TYPES.APPLICATION_LOGS, id: applicationId },
                TAG_TYPES.APPLICATIONS,
                TAG_TYPES.GIS_DATA
            ],
        }),
         // Update application status (approve/reject)
        updateApplicationStatus: builder.mutation<
            UpdateApplicationStatusResponse,
            UpdateApplicationStatusRequest
        >({
            query: ({ applicationId, action, approved, comments }) => ({
                url: `/v1/applications/${applicationId}`,
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Tenant-ID': 'pb.amritsar',
                },
                body: {
                    action,
                    approved,
                    comments
                }
            }),
            invalidatesTags: (_result, _error, { applicationId }) => [
                { type: TAG_TYPES.APPLICATION, id: applicationId },
                { type: TAG_TYPES.APPLICATION_LOGS, id: applicationId },
                TAG_TYPES.APPLICATIONS,
            ],
        }),
        
    }),
});

export const { useGetApplicationByApplicationIdQuery, useUpdateApplicationStatusMutation }  = viewApplicationApi;