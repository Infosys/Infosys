import { onboardingApiSlice } from "../../../../../store/onboardingApiSlice";
import { TAG_TYPES } from "../../../../../store/tagTypes";
import type { 
    UserCountResponse,
    DeleteUserRequest,
    DeleteUserResponse,
    GetUserByEmailRequest,
    GetUserByIdResponse,
    GetUserByUsernameRequest,
    GetUsersResponse,
} from "../models/userManagementModel";

export interface GetAllUsersRequest {
  limit?: number;
  offset?: number;
  status?: string;
  role?: string;
  searchQuery?: string;
}

export type UserRole = 'AGENT'| 'COMMISSIONER' | 'SERVICE_MANAGER'|'ADMIN'|'ALL_ROLES'| 'ALL Roles';

// Extend the onboardingApiSlice 

export const userManagementApiSlice = onboardingApiSlice.injectEndpoints({
    endpoints: (builder) => ({
// Fetch user counts
        getUserCounts: builder.query<UserCountResponse, void>({
            query: () => '/api/v1/users/count',
            providesTags:[TAG_TYPES.USER_STATS],
        }),

// Fetch user by UserID
        getUserById: builder.query<GetUserByIdResponse, string>({
            query: (userId) => ({
                url: `/api/v1/users/${userId}`,
                method: 'GET',
            }),
            providesTags: [TAG_TYPES.USER],
        }),

//Fetch user by Username
    getUserByUsername: builder.query<GetUsersResponse,GetUserByUsernameRequest>({
      query: ({ username }) => ({
        url: `api/v1/users?username=${username}`,
        method: "GET",
      }),
      providesTags: [TAG_TYPES.USER],
    }),

//Fetch user by Email
    getUserByEmail: builder.query<GetUsersResponse, GetUserByEmailRequest>({
      query: ({ email }) => ({
        url: `api/v1/users?email=${email}`,
        method: "GET",
      }),
      providesTags: [TAG_TYPES.USER],
    }),

// Fetch all users with optional filters
    getAllUsers: builder.query<GetUsersResponse, GetAllUsersRequest>({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.offset) queryParams.append('offset', params.offset.toString());
        if (params.status && params.status !== 'All Status') {
          let status = "true";
          if (params.status === 'Active'){
             status = 'true';
          }else if (params.status ==='Inactive'){
            status = 'false';
          }
          queryParams.append('is_active', status);
        }
        if (params.role) {
          const roleVal=params.role;
          const isAllRoles =
          roleVal === 'ALL ROLES' || roleVal === 'ALL_ROLES';
          const expandedRoles = isAllRoles
            ? ['AGENT', 'COMMISSIONER', 'SERVICE_MANAGER', 'ADMIN']
            : [roleVal];
          queryParams.append('role', expandedRoles.join(','));
        }

        if (params.searchQuery) {
          queryParams.append('search', params.searchQuery);
        }
        
        const queryString = queryParams.toString();
        return {
          url: `/api/v1/users${queryString ? `?${queryString}` : ''}`,
          method: 'GET',
        };
      },
      providesTags: [TAG_TYPES.USER],
    }),
    
// Delete user by UserID
    deleteUser: builder.mutation<DeleteUserResponse, DeleteUserRequest>({
      query: ({ userId }) => ({
        url: `/api/v1/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [TAG_TYPES.USER, TAG_TYPES.USER_STATS],
    }),

    }),
    overrideExisting : false,
});
export const { 
  useGetUserCountsQuery,
  useGetUserByIdQuery,
  useGetUserByUsernameQuery,
  useGetUserByEmailQuery,
  useGetAllUsersQuery,
  useDeleteUserMutation
 } = userManagementApiSlice;