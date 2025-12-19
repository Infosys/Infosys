// apiSlice.ts
//
// This file defines the centralized RTK Query API slice for the application.
// It sets up the base API configuration, including dynamic base URL, authentication headers,
// and cache invalidation tags. Feature-specific API endpoints will extend this base slice
// to ensure consistent API access and state management across the app.

import authService from '../services/AuthService';
import { ALL_TAG_TYPES } from './tagTypes'
// import { SERVER_URL } from '../utils/constants'

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Centralized RTK Query API slice for the app
export const apiSlice = createApi({
    // Key for the API reducer in the Redux store
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_ENUMERATION_HOST, // Dynamic API base URL from environment
        // Always attach latest auth token and content type for secure API access
        prepareHeaders: async (headers) => {
            // Ensure token is valid (refresh if needed) before every request
            const token = await authService.getValidToken();
            console.log("token added");
            if (token) {
                headers.set('authorization', `Bearer ${token}`)
            }
            headers.set('content-type', 'application/json')
            return headers
        },
    }),
    // Enables cache invalidation and refetching for all tag types
    tagTypes: ALL_TAG_TYPES,
    // No endpoints here; feature slices will extend this base
    endpoints: () => ({}),
})

export default apiSlice
 