// CitizenPropertyPageApi defines API endpoints for fetching a single property by propertyId for the Citizen property details page.
// Uses Redux Toolkit Query to provide hooks for retrieving property details.
import { apiSlice } from '../../../../../redux/apiSlice';
import type { CitizenPropertyResponse } from '../../models/CitizenPropertiesPageModel/CitizenPropertyPageModel';

// Inject endpoint for fetching a single citizen property by ID
export const citizenPropertyPageApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch single property by propertyId
    getCitizenPropertyById: builder.query<
      CitizenPropertyResponse,
      { propertyId: string }
    >({
      query: ({ propertyId }) => ({
        url: `/v1/properties/${propertyId}`,
        method: 'GET',
      }),
    }),
  }),
});

// Export RTK Query hook for fetching a single citizen property by ID
export const { useGetCitizenPropertyByIdQuery } = citizenPropertyPageApi;
export default citizenPropertyPageApi;