import zoneApiSlice from "../../../../../store/zoneApiSlice";
import type { ZoneWardsData, GetZoneWardsRequest } from "../Models/ZoneModel";

export const zoneApi = zoneApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getZoneWards: builder.query<ZoneWardsData[], GetZoneWardsRequest>({
      query: ({ fileStoreId, userId, userRole, tenantId }) => {
        const headers: Record<string, string> = {};

        if (userId) headers["X-User-ID"] = userId;
        if (userRole) headers["X-User-Role"] = userRole;
        if (tenantId) headers["X-Tenant-ID"] = tenantId;

        return {
          url: `/v1/geojson/${fileStoreId}`,
          method: "GET",
          headers,
        };
      },
      transformResponse: (response: ZoneWardsData[]) => response,
    }),
  }),
  overrideExisting: false,
});

export const { useGetZoneWardsQuery, useLazyGetZoneWardsQuery } = zoneApi;
