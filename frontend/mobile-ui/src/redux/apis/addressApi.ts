// API slice for property address operations (add/update)
import apiSlice from "../apiSlice";

// Address data model for property addresses
export interface Address {
    ID?: string;
    Locality: string;
    ZoneNo: string;
    WardNo: string;
    BlockNo: string;
    Street: string;
    ElectionWard: string;
    SecretariatWard: string;
    PinCode: number;
    DifferentCorrespondenceAddress: boolean;
    PropertyId: string;
    CororespondenceAddress1?: string;
    CororespondenceAddress2?: string;
    CorrespondencePincode?: number;
}

// Response type for add/update address API
export interface AddAddressResponse {
    data: Address;
    message: string;
    success: boolean;
}

// Inject endpoints for address add/update mutations
export const addressApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Mutation for adding a new address
        addAddress: builder.mutation<AddAddressResponse, Address>({
            query: (data) => ({
                url: '/v1/property-addresses',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Property'], // Invalidate property cache after mutation
        }),

        // Mutation for updating an existing address
        updateAddress: builder.mutation<AddAddressResponse, { id: string; address: Address }>({
            query: ({ id, address }) => ({
                url: `/v1/property-addresses/${id}`,
                method: 'PUT',
                body: address,
            }),
            invalidatesTags: ['Property'], // Invalidate property cache after mutation
        }),
    })
});

// Export hooks for using the address mutations in components
export const {
    useAddAddressMutation,
    useUpdateAddressMutation,
} = addressApi;