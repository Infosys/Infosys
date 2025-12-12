// CitizenHomePageApi defines API endpoints for fetching property applications for the Citizen homepage.
// Uses Redux Toolkit Query to provide hooks for searching applications by assesseeId and draft status.
import { apiSlice } from '../../../../../redux/apiSlice';
import type { CitizenApplicationSearchResponse } from './CitizenHomePageModel';

// Inject endpoint for searching citizen applications (homepage)
export const citizenHomepageApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch applications for 'homepage' by assesseeId & isDraft
    getCitizenApplications: builder.query<
      CitizenApplicationSearchResponse,
      { assesseeId: string; isDraft?: boolean }
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

// Export RTK Query hook for fetching citizen applications
export const { useGetCitizenApplicationsQuery } = citizenHomepageApi;
export default citizenHomepageApi;
