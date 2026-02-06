import { apiSlice } from '../../../../../store/apiSlice';
import { TAG_TYPES } from '../../../../../store/tagTypes';
import type { TotalPropertiesResponse, GetTotalPropertiesParams } from '../models/totalPropertiesModel';

export const totalPropertiesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTotalProperties: builder.query<TotalPropertiesResponse, GetTotalPropertiesParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        
        queryParams.append('isCountOnly', String(params?.isCountOnly ?? true));

        return {
          url: `/v1/properties?${queryParams.toString()}`,
          method: 'GET',
        };
      },
      transformResponse: (response: TotalPropertiesResponse | unknown[]) => {
        if (Array.isArray(response)) {
          return { total: response.length };
        }
        if (typeof response === 'object' && response !== null && 'total' in response) {
          return response as TotalPropertiesResponse;
        }
        // Fallback for unexpected response format
        console.warn('Unexpected response format from getTotalProperties API:', response);
        return { total: 0 };
      },
      providesTags: [TAG_TYPES.PROPERTIES],
    }),
  }),
});

export const { useGetTotalPropertiesQuery } = totalPropertiesApi;