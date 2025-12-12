
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
import type { Property } from "../../model/applicationByIdModel";


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
    editApplication: builder.mutation<
      EditOwnerResponse,
      { property: Property }
    >({
      query: ({ property }) => ({
        url: `/v1/properties/${property.ID}`,
        method: "PUT",
        headers: {
          "X-Tenant-ID": "pb.amritsar",
        },
        body: {
          ...property,
        },
      }),
      // Invalidate the cache for the edited application
      invalidatesTags: (_result, _error, { property }) => [
        { type: TAG_TYPES.APPLICATIONS, id: property.ID },
      ],
    }),

    // --- Edit Owner Details ---
    /**
     * Edits the owner details of a property.
     */
    editOwner: builder.mutation<
      EditOwnerResponse,
      { id: string; owner: Omit<EditOwnerRequest, "ID"> }
    >({
      query: ({ id, owner }) => ({
        url: `/v1/property-owners/${id}`,
        method: "PUT",
        headers: {
          "X-Tenant-ID": "pb.amritsar",
        },
        body: owner,
      }),
      // Invalidate the cache for the edited owner's application
      invalidatesTags: (_result, _error, { owner }) => [
        { type: TAG_TYPES.APPLICATIONS, id: owner.propertyId },
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
      }
    >({
      query: ({ id, additionalDetails }) => ({
        url: `/v1/additional-property-details/${id}`,
        method: "PUT",
        headers: {
          "X-Tenant-ID": "pb.amritsar",
        },
        body: additionalDetails,
      }),
      // Invalidate the cache for the edited property's application
      invalidatesTags: (_result, _error, { propertyId }) => [
        { type: TAG_TYPES.APPLICATIONS, id: propertyId },
      ],
    }),

    // --- Edit Amenities ---
    /**
     * Edits the amenities for a property.
     */
    editAmenities: builder.mutation<
      EditAmenitiesResponse,
      { id: string; propertyId: string; amenities: EditAmenitiesRequest }
    >({
      query: ({ id, amenities }) => ({
        url: `/v1/amenities/${id}`,
        method: "PUT",
        headers: {
          "X-Tenant-ID": "pb.amritsar",
        },
        body: {
          property_id: amenities.property_id,
          type: amenities.type,
        },
      }),
      // Invalidate the cache for the edited property's application
      invalidatesTags: (_result, _error, { propertyId }) => [
        { type: TAG_TYPES.APPLICATIONS, id: propertyId },
      ],
    }),

    // --- Edit Assessment Details ---
    /**
     * Edits the assessment details for a property.
     */
    editAssessment: builder.mutation<
      EditAssessmentResponse,
      { id: string; body: EditAssessmentRequest }
    >({
      query: ({ id, body }) => ({
        url: `/v1/assessment-details/${id}`,
        method: "PUT",
        headers: {
          "X-Tenant-ID": "pb.amritsar",
        },
        body,
      }),
      // Invalidate the cache for the edited property's application
      invalidatesTags: (_result, _error, { body }) => [
        { type: TAG_TYPES.APPLICATIONS, id: body.PropertyID },
      ],
    }),

    // --- Edit IGRS Details ---
    /**
     * Edits the IGRS (stamp duty/registration) details for a property.
     */
    editIGRS: builder.mutation<
      EditIGRSResponse,
      { id: string; body: EditIGRSRequest }
    >({
      query: ({ id, body }) => ({
        url: `/v1/igrs/${id}`,
        method: "PUT",
        headers: {
          "X-Tenant-ID": "pb.amritsar",
        },
        body,
      }),
      // Invalidate the cache for the edited property's application
      invalidatesTags: (_result, _error, { body }) => [
        { type: TAG_TYPES.APPLICATIONS, id: body.propertyId },
      ],
    }),

    // --- Edit Construction Details ---
    /**
     * Edits the construction details for a property.
     */
    editConstruction: builder.mutation<
      EditConstructionResponse,
      { id: string; body: EditConstructionRequest }
    >({
      query: ({ id, body }) => ({
        url: `/v1/construction-details/${id}`,
        method: "PUT",
        headers: {
          "X-Tenant-ID": "pb.amritsar",
        },
        body,
      }),
      // Invalidate the cache for the edited property's application
      invalidatesTags: (_result, _error, { body }) => [
        { type: TAG_TYPES.APPLICATIONS, id: body.propertyId },
      ],
    }),

    // --- Edit Property Address ---
    /**
     * Edits the address details for a property.
     */
    editAddress: builder.mutation< EditAddressResponse, 
      { id: string; body: EditAddressRequest }
    >({
      query: ({ id, body }) => ({
        url: `/v1/property-addresses/${id}`,
        method: "PUT",
        headers: {
          "X-Tenant-ID": "pb.amritsar",
        },
        body,
      }),
      // Invalidate the cache for the edited property's application
      invalidatesTags: (_result, _error, { body }) => [
        { type: TAG_TYPES.APPLICATIONS, id: body.propertyId },
      ],
    }),

    // --- Edit Floor Details ---
    /**
     * Edits the floor details for a property.
     */
    editFloor: builder.mutation<
      EditFloorResponse,
      { id: string; body: EditFloorRequest }
    >({
      query: ({ id, body }) => ({
        url: `/v1/floor-details/${id}`,
        method: "PUT",
        headers: {
          "X-Tenant-ID": "pb.amritsar",
        },
        body,
      }),
      // Invalidate the cache for the edited property's application
      invalidatesTags: (_result, _error, { body }) => [
        { type: TAG_TYPES.APPLICATIONS, id: body.propertyId },
      ],
    }),
  }),
  overrideExisting: false,
});


// Export hooks for each mutation endpoint for use in React components
export const {
  useEditApplicationMutation,
  useEditAdditionalDetailsMutation,
  useEditAddressMutation,
  useEditAmenitiesMutation,
  useEditOwnerMutation,
  useEditAssessmentMutation,
  useEditIGRSMutation,
  useEditConstructionMutation,
  useEditFloorMutation,
} = editApplicationApi;
