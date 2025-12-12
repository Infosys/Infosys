// RTK Query slice for file storage APIs.
// Sets up base config for file upload/download endpoints.
// Used for consistent file storage API access across the app.
import { ALL_TAG_TYPES } from './tagTypes'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const filestoreApiSlice = createApi({
    reducerPath: 'filestoreApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_FILESTORE_URL, // File store API base URL (env or default)
        // Prepare headers for all file store requests
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json'); // Ensure JSON content type
            return headers;
        },
    }),
    // Enables cache invalidation and refetching for all tag types
    tagTypes: ALL_TAG_TYPES,
    // No endpoints here; feature slices will extend this base
    endpoints: () => ({}),
})

export default filestoreApiSlice
