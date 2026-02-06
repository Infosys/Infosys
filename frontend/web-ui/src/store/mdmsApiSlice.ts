import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ALL_TAG_TYPES } from './tagTypes'
// import { MDMS_URL } from '../utils/constants'
import { authService } from '../app/features/login-signup/services/AuthService'
import env from '../config/env'

// MDMS base URL
export const MDMS_BASE_URL = `${env.MDMS_HOST}/mdms-v2/v2`

export const mdmsApiSlice = createApi({
  reducerPath: 'mdmsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: MDMS_BASE_URL,
    prepareHeaders: async (headers) => {
      headers.set('content-type', 'application/json')
      headers.set('X-Tenant-ID', env.TENANT_ID)
      headers.set('X-Client-Id', 'test-client')
      const token = await authService.getValidToken?.()
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ALL_TAG_TYPES,
  endpoints: () => ({}),
})

export default mdmsApiSlice