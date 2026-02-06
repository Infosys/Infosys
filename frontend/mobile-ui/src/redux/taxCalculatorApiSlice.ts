// apiSlice.ts
//
// This file defines the centralized RTK Query API slice for the application.
// It sets up the base API configuration, including dynamic base URL, authentication headers,
// and cache invalidation tags. Feature-specific API endpoints will extend this base slice
// to ensure consistent API access and state management across the app.

import { env } from '../config/env';
import authService from '../services/AuthService';
import { ALL_TAG_TYPES } from './tagTypes'

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Centralized RTK Query API slice for the app
export const taxCalculatorApiSlice = createApi({
    // Key for the API reducer in the Redux store
    reducerPath: 'taxCalculatorApi',
    baseQuery: fetchBaseQuery({
        baseUrl: env.PROPERTY_TAX_CALC_HOST, // Dynamic API base URL from environment
        // Always attach latest auth token and content type for secure API access
        prepareHeaders: async (headers) => {
            const token = await authService.getValidToken();
            
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            
            headers.set('content-type', 'application/json');
            return headers;
        },
    }),
    tagTypes: ALL_TAG_TYPES,
    endpoints: () => ({}),
})

export default taxCalculatorApiSlice;
