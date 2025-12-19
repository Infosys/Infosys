// import { fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from "@reduxjs/toolkit/query";
// import authService from "../../services/AuthService";
// import { getUserFromSession } from "../../context/AuthProvider";

// const baseUrl = import.meta.env.VITE_ENUMERATION_HOST;
// const TENANT_ID = import.meta.env.VITE_TENANT_ID;

// const baseQuery = fetchBaseQuery({
//   baseUrl,
//   prepareHeaders: async (headers) => {
//     headers.set('Content-Type', 'application/json');
//     headers.set('X-Tenant-ID', TENANT_ID);

//     const token = await authService.getValidToken();
//     const user = getUserFromSession();
//     if (token) {
//       headers.set('Authorization', `Bearer ${token}`);
//       headers.set('X-User-ID', user!.id );
//     }
//     return headers;
//   },
// });

// const customBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
//   let result = await baseQuery(args, api, extraOptions);

//   if (result.error?.status === 401) {
//     try {
//       const refreshed = await authService.refreshAccessToken();
//       if (refreshed) {
//         const newToken = await authService.getValidToken();
//         if (newToken) {
//           if (typeof args === 'string') args = { url: args };
//           // Ensure headers is a Headers instance
//           if (!(args.headers instanceof Headers)) {
//             args.headers = new Headers();
//           }
//           args.headers.set('Authorization', `Bearer ${newToken}`);
//           result = await baseQuery(args, api, extraOptions);
//         }
//       } else {
//         authService.logout();
//         window.location.reload();
//       }
//     } catch (refreshError) {
//       authService.logout();
//       window.location.reload();
//       return { error: { status: 401, data: 'Token refresh failed' } };
//     }
//   }

//   return result;
// };

// export default customBaseQuery;