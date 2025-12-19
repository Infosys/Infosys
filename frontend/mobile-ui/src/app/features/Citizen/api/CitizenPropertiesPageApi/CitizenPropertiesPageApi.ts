// CitizenPropertiesPageApi defines API endpoints for fetching property applications for the Citizen properties page.
// Uses Redux Toolkit Query to provide hooks for searching applications by assesseeId and draft status.
import { apiSlice } from '../../../../../redux/apiSlice';
import type { CitizenApplicationSearchResponse } from '../CitizenHomePageApi/CitizenHomePageModel';

// Inject endpoint for searching citizen properties (properties page)
export const citizenPropertiesPageApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch applications for 'homepage' by assesseeId & isDraft
    getCitizenProperties: builder.query<
      CitizenApplicationSearchResponse,
      { assesseeId: string; Status: string; isDraft: boolean }
    >({
      query: ({ assesseeId, isDraft=true }) => ({
        url: `/v1/applications/search`,
        params: {
          assesseeId,
          isDraft,
        },
        method: 'GET',
      }),
    }),
  }),
});

// Export RTK Query hook for fetching citizen properties
export const { useGetCitizenPropertiesQuery } = citizenPropertiesPageApi;
export default citizenPropertiesPageApi;