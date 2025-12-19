// Redux Toolkit API slice for onboarding-related server requests
// Sets up base query, authentication headers, and global tag types for onboarding features

// import type { RootState } from './index'
import authService from '../app/features/login-signup/services/AuthService';

import { ALL_TAG_TYPES } from './tagTypes'
import { ONBOARDING_URL } from '../utils/constants'

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const onboardingApiSlice = createApi({
    reducerPath: 'onboardingApi',
    // Configure the base query for all onboarding API requests
    baseQuery: fetchBaseQuery({
        baseUrl: ONBOARDING_URL,
    
        // Prepare headers for each request, including authentication
        prepareHeaders: async (headers, { getState: _getState }) => {
            // Add auth token if available
            // const state = getState() as RootState
            // const token = state.auth.token

            // Get token directly from localStorage
            // const token = localStorage.getItem('access_token');

            // Use AuthService to get a valid token (handles refresh automatically)
            const token = await authService.getValidToken();
            console.log("token added");
            if (token) {
                headers.set('authorization', `Bearer ${token}`)
            }
            headers.set('content-type', 'application/json')
            return headers
        },
    }),
    // Global tags for cache invalidation
    tagTypes: ALL_TAG_TYPES,
    // Define endpoints in feature-specific API slices that extend this base
    endpoints: () => ({}),
})

export default onboardingApiSlice
