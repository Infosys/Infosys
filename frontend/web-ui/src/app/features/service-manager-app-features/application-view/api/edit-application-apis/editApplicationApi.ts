
// RTK Query API endpoints for editing various parts of a property application.
import { apiSlice } from "../../../../../../store/apiSlice";
import { TAG_TYPES } from "../../../../../../store/tagTypes";
import type {
  EditAdditionalDetailsRequest,
  EditAdditionalDetailsResponse,
  EditAmenitiesRequest,
  EditAmenitiesResponse,
  EditOwnerRequest,
  EditOwnerResponse,
  EditAssessmentRequest,
  EditAssessmentResponse,
  EditIGRSRequest,
  EditIGRSResponse, 
  EditConstructionRequest,
  EditConstructionResponse,
  EditFloorRequest,
  EditFloorResponse,
  EditAddressResponse,
  EditAddressRequest,
} from "../../model/editAplicaiton-models/editApplicaitonModles";



/**
 * Injects endpoints for editing various sections of a property application using RTK Query.
 * Each mutation corresponds to a different editable section (owner, amenities, assessment, etc.).
 */
export const editApplicationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // --- Edit Application (Property) ---
    /**
     * Edits the main property application details.
     */
    // editApplication: builder.mutation<
    //   EditOwnerResponse,
    //   { property: Property; applicationId: string }
    // >({
    //   query: ({ property, applicationId }) => ({
    //     url: `/v1/propertiesEDIT/${property.ID}/${applicationId}?isVerifying=true`,
    //     method: "PUT",
    //     headers: {
    //       "X-Tenant-ID": "pb.amritsar",
    //     },
    //     body: {
    //       ...property,
    //     },
    //   }),
    //   // Invalidate the cache for the edited application
    //   invalidatesTags: (_result, _error, { property }) => [
    //     { type: TAG_TYPES.APPLICATIONS, id: property.ID },
    //   ],
    // }),

    // --- Edit Owner Details ---
    /**
     * Edits the owner details of a property.
     */
    editOwner: builder.mutation<
      EditOwnerResponse,
      { id: string; owner: Omit<EditOwnerRequest, "ID">, applicationId: string }
    >({
      query: ({ id, owner, applicationId }) => ({
        url: `/v1/property-owners/${id}/${applicationId}?isVerifying=true`,
        method: "PUT",
        headers: {
          "X-Tenant-ID": "pb.amritsar",
        },
        body: owner,
      }),
      // Invalidate the cache for the edited application
      invalidatesTags: (_result, _error) => [
        { type: TAG_TYPES.APPLICATION },
      ],
    }),

    // --- Edit Additional Property Details ---
    /**
     * Edits additional details for a property.
     */
    editAdditionalDetails: builder.mutation<
      EditAdditionalDetailsResponse,
      {
        id: string;
        propertyId: string;
        additionalDetails: EditAdditionalDetailsRequest;
        applicationId: string;
      }
    >({
      query: ({ id, additionalDetails, applicationId }) => ({
        url: `/v1/additional-property-details/${id}/${applicationId}?isVerifying=true`,
        method: "PUT",
        headers: {
          "X-Tenant-ID": "pb.amritsar",
        },
        body: additionalDetails,
      }),
      // Invalidate the cache for the edited application
      invalidatesTags: (_result, _error, { applicationId }) => [
        { type: TAG_TYPES.APPLICATION, id: applicationId },
      ],
    }),

    // --- Edit Amenities ---
    /**
     * Edits the amenities for a property.
     */
    editAmenities: builder.mutation<
      EditAmenitiesResponse,
      { id: string; propertyId: string; amenities: EditAmenitiesRequest; applicationId: string }
    >({
      query: ({ id, amenities, applicationId }) => ({
        url: `/v1/amenities/${id}/${applicationId}?isVerifying=true`,
        method: "PUT",
        headers: {
          "X-Tenant-ID": "pb.amritsar",
        },
        body: {
          property_id: amenities.property_id,
          type: amenities.type,
        },
      }),
      // Invalidate the cache for the edited application
      invalidatesTags: (_result, _error, { applicationId }) => [
        { type: TAG_TYPES.APPLICATION, id: applicationId },
      ],
    }),

    // --- Edit Assessment Details ---
    /**
     * Edits the assessment details for a property.
     */
    editAssessment: builder.mutation<
      EditAssessmentResponse,
      { id: string; body: EditAssessmentRequest; applicationId: string }
    >({
      query: ({ id, body, applicationId }) => ({
        url: `/v1/assessment-details/${id}/${applicationId}?isVerifying=true`,
        method: "PUT",
        headers: {
          "X-Tenant-ID": "pb.amritsar",
        },
        body,
      }),
      // Invalidate the cache for the edited application
      invalidatesTags: (_result, _error, { applicationId }) => [
        { type: TAG_TYPES.APPLICATION, id: applicationId },
      ],
    }),

    // --- Edit IGRS Details ---
    /**
     * Edits the IGRS (stamp duty/registration) details for a property.
     */
    editIGRS: builder.mutation<
      EditIGRSResponse,
      { id: string; body: EditIGRSRequest; applicationId: string }
    >({
      query: ({ id, body ,applicationId}) => ({
        url: `/v1/igrs/${id}/${applicationId}?isVerifying=true`,
        method: "PUT",
        headers: {
          "X-Tenant-ID": "pb.amritsar",
        },
        body,
      }),
      // Invalidate the cache for the edited application
      invalidatesTags: (_result, _error, { applicationId }) => [
        { type: TAG_TYPES.APPLICATION, id: applicationId },
      ],
    }),

    // --- Edit Construction Details ---
    /**
     * Edits the construction details for a property.
     */
    editConstruction: builder.mutation<
      EditConstructionResponse,
      { id: string; body: EditConstructionRequest; applicationId: string }
    >({
      query: ({ id, body, applicationId }) => ({
        url: `/v1/construction-details/${id}/${applicationId}?isVerifying=true`,
        method: "PUT",
        headers: {
          "X-Tenant-ID": "pb.amritsar",
        },
        body,
      }),
      // Invalidate the cache for the edited application
      invalidatesTags: (_result, _error, { applicationId }) => [
        { type: TAG_TYPES.APPLICATION, id: applicationId },
      ],
    }),

    // --- Edit Property Address ---
    /**
     * Edits the address details for a property.
     */
    editAddress: builder.mutation< EditAddressResponse, 
      { id: string; body: EditAddressRequest; applicationId: string }
    >({
      query: ({ id, body, applicationId }) => ({
        url: `/v1/property-addresses/${id}/${applicationId}?isVerifying=true`,
        method: "PUT",
        headers: {
          "X-Tenant-ID": "pb.amritsar",
        },
        body,
      }),
      // Invalidate the cache for the edited application
      invalidatesTags: (_result, _error, { applicationId }) => [
        { type: TAG_TYPES.APPLICATION, id: applicationId },
      ],
    }),

    // --- Edit Floor Details ---
    /**
     * Edits the floor details for a property.
     */
    editFloor: builder.mutation<
      EditFloorResponse,
      { id: string; body: EditFloorRequest; applicationId: string }
    >({
      query: ({ id, body, applicationId }) => ({
        url: `/v1/floor-details/${id}/${applicationId}?isVerifying=true`,
        method: "PUT",
        headers: {
          "X-Tenant-ID": "pb.amritsar",
        },
        body,
      }),
      // Invalidate the cache for the edited application
      invalidatesTags: (_result, _error, { applicationId }) => [
        { type: TAG_TYPES.APPLICATION, id: applicationId },
      ],
    }),
  }),
  overrideExisting: false,
});


// Export hooks for each mutation endpoint for use in React components
export const {
  // useEditApplicationMutation,
  useEditAdditionalDetailsMutation,
  useEditAddressMutation,
  useEditAmenitiesMutation,
  useEditOwnerMutation,
  useEditAssessmentMutation,
  useEditIGRSMutation,
  useEditConstructionMutation,
  useEditFloorMutation,
} = editApplicationApi;
