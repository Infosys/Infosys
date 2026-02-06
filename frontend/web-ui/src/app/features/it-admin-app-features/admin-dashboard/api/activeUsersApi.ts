import { onboardingApiSlice } from '../../../../../store/onboardingApiSlice';
import { TAG_TYPES } from '../../../../../store/tagTypes';
import { DEFAULT_USER_ROLES, type ActiveUsersResponse, type GetActiveUsersParams } from '../models/activeUsersModel';


export const activeUsersApi = onboardingApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getActiveUsers: builder.query<ActiveUsersResponse, GetActiveUsersParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        
        
        queryParams.append('role', params?.role || DEFAULT_USER_ROLES);
        queryParams.append('is_active', String(params?.isActive ?? true));
        
        if (params?.limit !== undefined) {
          queryParams.append('limit', String(params.limit));
        }
        
        if (params?.offset !== undefined) {
          queryParams.append('offset', String(params.offset));
        }

        return {
          url: `/api/v1/users?${queryParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: [TAG_TYPES.USER, TAG_TYPES.AGENTS, TAG_TYPES.SERVICE_MANAGERS],
    }),
  }),
});

export const { useGetActiveUsersQuery } = activeUsersApi;