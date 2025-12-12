// API slice for property application CRUD and logs
import apiSlice from "../apiSlice";
import { TAG_TYPES } from "../tagTypes";

// Request body for submitting a new application
export interface SubmitApplicationRequest {
    propertyId: string;
    dueDate?: string;
    priority?: string;
    appliedBy: string;
    assesseeId: string;
    isDraft: boolean;
    importantNote?: string;
}

// Request body for updating an existing application
export interface UpdateApplicationRequest {
    applicationId: string;
    propertyId?: string;
    dueDate?: string;
    priority?: string;
    appliedBy?: string;
    assesseeId?: string;
    isDraft?: boolean;
    importantNote?: string;
}

// Response structure for submitting an application
export interface SubmitApplicationResponse {
    data: {
        ID: string;
        ApplicationNo: string;
        PropertyID: string;
        DueDate?: string;
        Priority?: string;
        AppliedBy: string;
        AssesseeID: string;
        IsDraft: boolean;
        ImportantNote?: string;
        CreatedAt: string;
        UpdatedAt: string;
    };
    message: string;
    success: boolean;
}

// Response for updating is same as submit
export type UpdateApplicationResponse = SubmitApplicationResponse;

// Request body for verifying an application
export interface VerifyApplicationRequest {
    applicationId: string;
    action: string;
    verified: boolean;
    importantNote: string;
}

// Response for verifying an application
export interface VerifyApplicationResponse {
    data?: any;
    message: string;
    success: boolean;
}

// Request body for deleting an application
export interface DeleteApplicationRequest {
    applicationId: string;
}

// Response for deleting an application
export interface DeleteApplicationResponse {
    message: string;
    success: boolean;
}

// Application Log interfaces
// Structure for a single application log entry
export interface ApplicationLog {
    Action: string;
    ApplicationID: string;
    Comments: string;
    CreatedAt: string;
    FileStoreID: string | null;
    ID: string;
    Metadata: string;
    PerformedBy: string;
    PerformedDate: string;
}

// Request body for posting a new application log
export interface PostApplicationLogRequest {
    action: string;
    performedBy: string;
    comments: string;
    applicationId: string;
    fileStoreId?: string;
    metadata: any;
}

// Response for posting a new application log
export interface PostApplicationLogResponse {
    data: ApplicationLog;
    message: string;
    success: boolean;
}

// Response for fetching application details by ID
export interface GetApplicationByIdResponse {
    data: {
        ID: string;
        ApplicationNo: string;
        PropertyID: string;
        Priority?: string;
        TenantID: string;
        DueDate?: string;
        AssignedAgent?: string;
        Status: string;
        WorkflowInstanceID?: string;
        AppliedBy: string;
        AssesseeID: string;
        Property: any;
        ApplicationLogs: ApplicationLog[];
        IsDraft: boolean;
        CreatedAt: string;
        UpdatedAt: string;
        importantNote?: string;
    };
    message: string;
    success: boolean;
}



// Inject endpoints for application CRUD and logs
export const applicationApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Create a new application
        submitApplication: builder.mutation<SubmitApplicationResponse, SubmitApplicationRequest>({
            query: (data) => ({
                url: '/v1/applications',
                method: 'POST',
                body: {
                    propertyId: data.propertyId,
                    appliedBy: data.appliedBy,
                    assesseeId: data.assesseeId,
                    isDraft: data.isDraft,
                },
                headers: {
                    'X-Tenant-ID': 'pb.amritsar',
                    'Content-Type': 'application/json',
                }
            }),

            invalidatesTags: [TAG_TYPES.APPLICATION],
        }),
        // Update an existing application
        updateApplication: builder.mutation<UpdateApplicationResponse, UpdateApplicationRequest>({
            query: ({ applicationId, ...data }) => {
                // Build the request body with only the fields that are provided
                const body: Record<string, any> = {};

                if (data.propertyId !== undefined) body.propertyId = data.propertyId;
                if (data.priority !== undefined) body.priority = data.priority;
                if (data.appliedBy !== undefined) body.appliedBy = data.appliedBy;
                if (data.dueDate !== undefined) body.dueDate = data.dueDate;
                if (data.assesseeId !== undefined) body.assesseeId = data.assesseeId;
                if (data.isDraft !== undefined) body.isDraft = data.isDraft;
                if (data.importantNote !== undefined) body.importantNote = data.importantNote;

                return {
                    url: `/v1/applications/${applicationId}`,
                    method: 'PUT',
                    body,
                    headers: {
                        'X-Tenant-ID': 'pb.amritsar',
                        'Content-Type': 'application/json',
                    }
                };
            },
            invalidatesTags: [TAG_TYPES.APPLICATION],
        }),
        // Verify an application (PATCH)
        verifyApplication: builder.mutation<VerifyApplicationResponse, VerifyApplicationRequest>({
            query: ({ applicationId, action, verified, importantNote }) => ({
                url: `/v1/applications/${applicationId}`,
                method: 'PATCH',
                body: {
                    action,
                    verified,
                    importantNote,
                },
                headers: {
                    'X-Tenant-ID': 'pb.amritsar',
                    'Content-Type': 'application/json',
                }
            }),
            invalidatesTags: [TAG_TYPES.APPLICATION],
        }),
        // Delete an application
        deleteApplication: builder.mutation<DeleteApplicationResponse, DeleteApplicationRequest>({
            query: ({ applicationId }) => ({
                url: `/v1/applications/${applicationId}`,
                method: 'DELETE',
                headers: {
                    'X-Tenant-ID': 'pb.amritsar',
                    'Content-Type': 'application/json',
                }
            }),
            invalidatesTags: [TAG_TYPES.APPLICATION],
        }),

        // Fetch application details by ID
        getApplicationById: builder.query<GetApplicationByIdResponse, string>({
            query: (applicationId) => ({
                url: `/v1/applications/${applicationId}`,
                method: 'GET',
            }),
            providesTags: (_result, _error, applicationId) => [
                { type: TAG_TYPES.APPLICATION, id: applicationId }
            ],
        }),
        
        // Post a new application log entry
        postApplicationLog: builder.mutation<PostApplicationLogResponse, PostApplicationLogRequest>({
            query: (data) => ({
                url: `/v1/application-logs`,
                method: 'POST',
                headers: {
                    'X-Tenant-ID': 'pb.amritsar',
                },
                body: data,
            }),
            invalidatesTags: (_result, _error, arg) => [
                { type: TAG_TYPES.APPLICATION_LOG, id: arg.applicationId }
            ],
        }),
    }),
})

// Export hooks for use in components
export const {
    useSubmitApplicationMutation,
    useUpdateApplicationMutation,
    useVerifyApplicationMutation,
    useDeleteApplicationMutation,
    useLazyGetApplicationByIdQuery,
    usePostApplicationLogMutation
} = applicationApi;