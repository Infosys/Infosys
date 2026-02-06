// API slice for property owner operations (CRUD)
import apiSlice from "../apiSlice";
import { TAG_TYPES } from "../tagTypes";

export interface Owner {
    ID: string;
    PropertyID: string;
    Name: string;
    AdhaarNo: number;
    ContactNo: string;
    Email: string;
    Gender: string;
    Guardian?: string;
    GuardianType?: string;
    RelationshipToProperty: string;
    OwnershipShare: number;
    IsPrimaryOwner: boolean;
    CreatedAt: string;
    UpdatedAt: string;
}

export interface UpdateOwnerRequest {
    name: string;
    contactNo: string;
    email: string;
    gender: string;
    guardian?: string;
    guardianType?: string;
    relationshipToProperty: string;
    ownershipShare: number;
    isPrimaryOwner: boolean;
}

// Add owner request omits fields not required on creation
export interface AddOwnerRequest extends Omit<Owner, 'ID' | 'CreatedAt' | 'UpdatedAt'> {
    applicationId: string;
    isVerifying: boolean;
}

// Add owner response uses Owner interface
export interface AddOwnerResponse {
    data: Owner;
    message: string;
    success: boolean;
}

export interface UpdateOwnerResponse {
    data: Owner;
    message: string;
    success: boolean;
}

// Get owners response returns array of Owner
export interface GetOwnersResponse {
    data: Owner[];
    message: string;
    success: boolean;
}

export interface DeleteOwnerResponse {
    message: string;
    success: boolean;
}

export const ownerApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Add a new property owner
        addOwner: builder.mutation<AddOwnerResponse, AddOwnerRequest>({
            query: ({ applicationId, isVerifying, ...data }) => ({
                url: `/v1/property-owners/${applicationId}?isVerifying=${isVerifying}`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [TAG_TYPES.OWNER],
        }),

        // Get all owners for a property by property ID
        getOwnersByPropertyId: builder.query<GetOwnersResponse, string>({
            query: (propertyId) => ({
                url:`/v1/property-owners/property/${propertyId}`,
                method: 'GET',
            }),
            providesTags: [TAG_TYPES.OWNER],
        }),

        // Update an existing property owner by ID
        updateOwner: builder.mutation<UpdateOwnerResponse, { id: string; data: UpdateOwnerRequest; applicationId: string; isVerifying: boolean }>({
            query: ({ id, data, applicationId, isVerifying }) => ({
                url: `/v1/property-owners/${id}/${applicationId}?isVerifying=${isVerifying}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: [TAG_TYPES.OWNER],
        }),

        // Delete a property owner by ID
        deleteOwner: builder.mutation<DeleteOwnerResponse, { id: string; applicationId: string; isVerifying: boolean }>({
            query: ({ id, applicationId, isVerifying }) => ({
                url: `/v1/property-owners/${id}/${applicationId}?isVerifying=${isVerifying}`,
                method: 'DELETE',
            }),
            invalidatesTags: [TAG_TYPES.OWNER],
        }),
    })
});

// Export hooks for using owner endpoints in components
export const {
    useAddOwnerMutation,
    useGetOwnersByPropertyIdQuery,
    useLazyGetOwnersByPropertyIdQuery,
    useUpdateOwnerMutation,
    useDeleteOwnerMutation
} = ownerApi;