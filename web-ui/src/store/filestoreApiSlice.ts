// Redux Toolkit API slice for file storage operations
// Sets up base query for file upload/download and manages API state for filestore

import { ALL_TAG_TYPES } from './tagTypes'
import { FILESTORE_URL } from '../utils/constants'

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service for file storage using a base URL and expected endpoints
export const filestoreApiSlice = createApi({
    reducerPath: 'filestoreApi',
    // Configure the base query for all filestore API requests
    baseQuery: fetchBaseQuery({
        baseUrl: FILESTORE_URL,
    }),
    // Global tags for cache invalidation
    tagTypes: ALL_TAG_TYPES,
    // Define endpoints in feature-specific API slices that extend this base
    endpoints: () => ({}),
})

export default filestoreApiSlice
