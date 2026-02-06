import { apiSlice } from "../../../../../store/apiSlice";
import type {
  ZoneEnumerationCountData,
  GetZoneEnumerationCountRequest,
} from "../Models/ZoneModel";

export const zoneEnumerationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getZoneEnumerationCount: builder.query<
      ZoneEnumerationCountData,
      GetZoneEnumerationCountRequest
    >({
      query: ({ zoneNo, enumerated }) => ({
        url: `/v1/applications/search?zoneNo=${zoneNo}&enumerated=${enumerated}&isCountOnly=true`,
        method: "GET",
      }),
      providesTags: (_result, _error, { zoneNo, enumerated }) => [
        {
          type: "Applications",
          id: `${zoneNo}-${enumerated ? "enumerated" : "unenumerated"}`,
        },
        "Dashboard",
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetZoneEnumerationCountQuery,
  useLazyGetZoneEnumerationCountQuery,
} = zoneEnumerationApi;
