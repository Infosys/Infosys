// import { createApi } from '@reduxjs/toolkit/query/react';
// import type { CitizenHomeData } from '../models/CitizenHome.model';
// import type { Property } from '../models/Property.model';
// import type { UrgentAttention } from '../models/UrgentAttention.model';
// import customBaseQuery from '../../../service/BaseQuery.api';

// export const citizenApi = createApi({
//   reducerPath: 'citizenApi',
//   baseQuery: customBaseQuery,
//   tagTypes: ['Properties', 'CitizenHome'],
//   endpoints: (builder) => ({
//     getCitizenHome: builder.query<CitizenHomeData, void>({
//       query: () => `/api/v1/citizen/home`,
//       transformResponse: (response: any) => {
//         const homeJson = response?.home ?? {};

//         const user = homeJson.user ?? {};
//         const activeLicenses = user.activeLicenses ?? 0;
//         const numberOfProperties = user.numberOfProperties ?? 0;

//         const properties: Property[] = (homeJson.properties ?? []).map((prop: any) => ({
//           id: prop.id,
//           apartmentName: prop.apartmentName ?? '',
//           address: (prop.address as any) ?? '',
//           enumerationProgress: prop.enumerationProgress ?? 0,
//           locationData: prop.locationData ?? { address: '', coordinates: { lat: 0, lng: 0 }, timestamp: '' },
//         }));

//         const urgentAttention: UrgentAttention[] = (homeJson.urgentAttention ?? []).map((item: any) => ({
//           id: item.id,
//           type: item.type,
//           message: item.message,
//           date: item.date,
//           status: item.status,
//         }));

//         return { activeLicenses, numberOfProperties, properties, urgentAttention };
//       },
//       providesTags: ['CitizenHome'],
//     }),

//     getProperties: builder.query<Property[], void>({
//       query: () => `/api/v1/citizen/properties`,
//       transformResponse: (response: any) => {
//         if (response == null) return [];
//         if (response && 'properties' in response) {
//           return response.properties as Property[];
//         } else {
//           return response as Property[];
//         }
//       },
//       providesTags: (result) =>
//         result
//           ? [
//               ...result.map(({ id }) => ({ type: 'Properties' as const, id })),
//               { type: 'Properties', id: 'LIST' },
//             ]
//           : [{ type: 'Properties', id: 'LIST' }],
//     }),
//   }),
// });

// export const { useGetCitizenHomeQuery, useGetPropertiesQuery } = citizenApi;