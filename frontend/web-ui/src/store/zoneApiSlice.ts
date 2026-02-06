import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ALL_TAG_TYPES } from './tagTypes'
import authService from '../app/features/login-signup/services/AuthService'

const ZONE_URL = import.meta.env.VITE_ZONE_URL

export const zoneApiSlice = createApi({
    reducerPath: 'zoneApi',
    baseQuery: fetchBaseQuery({
        baseUrl: ZONE_URL,
        prepareHeaders: async (headers, { getState: _getState }) => {
            const token = await authService.getValidToken()
            if (token) {
                headers.set('authorization', `Bearer ${token}`)
            }
            headers.set('content-type', 'application/json')
            headers.set('X-User-Role', 'SERVICE_MANAGER')
            headers.set('X-Tenant-ID', 'pb.amritsar')
            return headers
        },
    }),
    tagTypes: ALL_TAG_TYPES,
    endpoints: () => ({}),
})

export default zoneApiSlice