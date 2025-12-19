// This file defines an RTK Query API slice for fetching property application data for service managers.
import { apiSlice } from '../../../../../store/apiSlice'
import { TAG_TYPES } from '../../../../../store/tagTypes'
import type { GetAllPropertiesResponse } from '../models/GetAllProperties'
// import { buildJurisdictionQuery } from '../utils/buildJurisdictionQuery'

// API slice for property application queries (all properties and by jurisdiction)
export const applicationInboxApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Endpoint to fetch all property applications with pagination
        // getAllProperties: builder.query<GetAllPropertiesResponse, GetAllPropertiesRequest>({
        //     query: ({ page = 0, size = 20 } = {}) => ({
        //         url: `/v1/applications?page=${page}&size=${size}`,
        //         method: 'GET',
        //         headers: {
        //             'X-User-Role': 'SERVICE_MANAGER',
        //         },
        //     }),
        //     providesTags: [TAG_TYPES.APPLICATIONS],
        // }),

        // Endpoint to fetch all property applications under a specific jurisdiction (zone and wards)
        getAllPropertiesUnderJurisdiction: builder.query<GetAllPropertiesResponse, { zoneNo: string, wardNos: string[], page?: number, size?: number }>({
        query: ({ page = 0, size = 20, zoneNo, wardNos }) => {
            const zoneParam = `zoneNo=${encodeURIComponent(zoneNo)}`;
            const wardParams = wardNos.map(w => `wardNo=${encodeURIComponent(w)}`).join('&');
            const url = `/v1/applications/search?${zoneParam}&${wardParams}&page=${page}&size=${size}`;
            console.log('Built jurisdiction query', url);
            return {
                url,
                method: 'GET',
                headers: {
                    'X-User-Role': 'SERVICE_MANAGER',
                },
            };
        },
        providesTags: [TAG_TYPES.APPLICATIONS],
        }),
    }),
})

// Hooks for property application queries
export const { useGetAllPropertiesUnderJurisdictionQuery } = applicationInboxApi