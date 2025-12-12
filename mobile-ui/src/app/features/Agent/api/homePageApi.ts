
// homePageApi defines API endpoints for fetching property lists for the Agent home page.
// It provides queries for both non-draft (active/finished) and draft properties assigned to the agent.
// Uses agentApiSlice for base API configuration and authentication.
// Returns RTK Query hooks for use in Agent screens/components.

import apiSlice from '../../../../redux/apiSlice';
import { TAG_TYPES } from '../../../../redux/tagTypes';
import type { HomePageResponse } from '../models/HomePageData.model';

export const allPropertiesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch non-draft (active/finished) properties assigned to the agent
    getAllProperties: builder.query<HomePageResponse, {agentId: string}>({
      query: ({agentId}) => ({
        url: `v1/applications/search?assignedAgent=${agentId}&isDraft=false&status=ASSIGNED`,
        method: 'GET',
      }),
      providesTags: [TAG_TYPES.APPLICATION, TAG_TYPES.PROPERTY],
    }),
    // Fetch draft properties assigned to the agent
    getDraftProperties: builder.query<HomePageResponse, {agentId: string}>({
      query: ({agentId}) => ({
        url: `v1/applications/search?assesseeID=${agentId}&isDraft=true`,
        method: 'GET',
      }),
      providesTags: [TAG_TYPES.APPLICATION, TAG_TYPES.PROPERTY],
    }),
  }),
});


// RTK Query hooks for use in Agent home page components
export const { useGetAllPropertiesQuery, useGetDraftPropertiesQuery } = allPropertiesApi;