
// agentApiSlice sets up the base API configuration for Agent-related requests using Redux Toolkit Query.
// It handles authentication by attaching a valid token to each request header via AuthService.
// The base URL points to the backend service for agent operations.
// Endpoints for agent features should be defined in feature-specific slices that extend this base.
// Used for all network requests made by Agent screens/components.

import authService from '../../../../services/AuthService';

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints

export const agentApiSlice = createApi({
    reducerPath: 'agentApi', // Unique key for agent API slice in Redux store
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_ENUMERATION_HOST, // Backend base URL for agent operations

        // Prepare headers for every request (add auth token, content type)
        prepareHeaders: async (headers, { getState: _getState }) => {
            // Use AuthService to get a valid token (handles refresh automatically)
            const token = await authService.getValidToken();
            if (token) {
                headers.set('authorization', `Bearer ${token}`)
            }
            headers.set('content-type', 'application/json')
            return headers
        },
    }),
    // Global tags for cache invalidation (can be extended)
    // tagTypes: ALL_TAG_TYPES,
    // Define endpoints in feature-specific API slices that extend this base
    endpoints: () => ({}),
})


export default agentApiSlice;
 