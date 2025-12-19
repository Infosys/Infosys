// Redux Toolkit API slice for making server requests and managing API state
// Sets up base query, authentication headers, and global tag types for cache management

import authService from '../app/features/login-signup/services/AuthService';

import { ALL_TAG_TYPES } from './tagTypes'
import { SERVER_URL } from '../utils/constants'

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const apiSlice = createApi({
    reducerPath: 'api',
    // Configure the base query for all API requests
    baseQuery: fetchBaseQuery({
        baseUrl: SERVER_URL,

        // Prepare headers for each request, including authentication
        prepareHeaders: async (headers, { getState: _getState }) => {
            // Add auth token if available
            // const state = getState() as RootState
            // const token = state.auth.token

            // Get token directly from localStorage
            // const token = localStorage.getItem('access_token');

            // Use AuthService to get a valid token (handles refresh automatically)
            headers.set('content-type', 'application/json')
            headers.set('X-Tenant-ID', 'pb.amritsar')
            headers.set('X-User-Role', 'SERVICE_MANAGER')
            const token = await authService.getValidToken();
            // console.log("token added");
            if (token) {
                headers.set('authorization', `Bearer ${token}`)
            }
            return headers
        },
    }),
    // Global tags for cache invalidation
    tagTypes: ALL_TAG_TYPES,
    // Define endpoints in feature-specific API slices that extend this base
    endpoints: () => ({}),
})

export default apiSlice
