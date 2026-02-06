import authService from '../app/features/login-signup/services/AuthService';

import { ALL_TAG_TYPES } from './tagTypes'
import { PROPERTY_TAX_CALC_URL } from '../utils/constants'

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const propertyTaxCalcApiSlice = createApi({
    reducerPath: 'propertyTaxCalcApi',
    baseQuery: fetchBaseQuery({
        baseUrl: PROPERTY_TAX_CALC_URL,

        prepareHeaders: async (headers, { getState: _getState }) => {
            const token = await authService.getValidToken();
            // console.log("token added");
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ALL_TAG_TYPES,
    endpoints: () => ({}),
})

export default propertyTaxCalcApiSlice