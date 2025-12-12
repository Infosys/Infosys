// This file defines an RTK Query API slice for searching property applications with filters for service managers.
import { apiSlice } from '../../../../../store/apiSlice'
import { TAG_TYPES } from '../../../../../store/tagTypes'
import type { GetAllPropertiesResponse } from '../models/GetAllProperties';

// API slice for searching property applications with various filters
export const allApplicationApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Endpoint to search property applications by text, value, zone, wards, with pagination
        getApplicationsBySearch: builder.query<
          GetAllPropertiesResponse,
          { searchText: string; searchValue: string; zoneNo: string; wardNos: string[]; page?: number; size?: number }
        >({
          query: ({ searchText, searchValue, zoneNo, wardNos, page = 0, size = 15 }) => {
            const zoneParam = zoneNo ? `zoneNo=${encodeURIComponent(zoneNo)}` : '';
            const wardParams = wardNos.length > 0 
              ? wardNos.map(w => `wardNo=${encodeURIComponent(w)}`).join('&') 
              : '';
            const pageParam = `page=${page}`;
            const sizeParam = `size=${size}`;
            
            // Build query params
            const params = [
              zoneParam, 
              wardParams, 
              `${searchText}=${encodeURIComponent(searchValue)}`,
              pageParam,
              sizeParam
            ]
              .filter(Boolean)
              .join('&');
            
            const url = `/v1/applications/search?${params}`;
            // console.log('Search API URL:', url);
            // console.log('Zone:', zoneNo, 'Wards:', wardNos, 'Page:', page, 'Size:', size);
            
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

// Hook for searching property applications with filters
export const {
  useGetApplicationsBySearchQuery,
} = allApplicationApi;