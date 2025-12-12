
// RTK Query API endpoint for replacing GIS coordinates for a property application.
import { apiSlice } from "../../../../../store/apiSlice"; // adjust path if needed
import { TAG_TYPES } from "../../../../../store/tagTypes";


/**
 * Injects an endpoint for replacing GIS coordinates for a property application using RTK Query.
 * Uses a PUT request to update the coordinates for a given GIS data ID.
 */
export const coordinatesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Mutation for replacing GIS coordinates for a property.
     * @param gisDataId - The ID of the GIS data to update
     * @param applicationId - The ID of the related application
     * @param points - Array of latitude/longitude points
     * @returns The response from the backend
     */
    replaceGisCoordinates: builder.mutation<
      any,
      { 
        gisDataId: string; 
        applicationId: string; 
        points: Array<{ latitude: number; longitude: number }> 
      }
    >({
      query: ({ gisDataId, points }) => ({
        url: `/v1/coordinates/gis/${gisDataId}`,
        method: 'PUT',
        body: points,
        headers: { 'Content-Type': 'application/json' },
      }),
      // Invalidate specific application and general lists after update
      invalidatesTags: (_result, _error, arg) => [
        { type: TAG_TYPES.APPLICATION, id: arg.applicationId },
        TAG_TYPES.APPLICATIONS,
        TAG_TYPES.GIS_DATA
      ]
    }),
  }),
  overrideExisting: false,
});


// Export the mutation hook for replacing GIS coordinates
export const { useReplaceGisCoordinatesMutation } = coordinatesApi;