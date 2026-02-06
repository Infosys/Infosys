import propertyTaxCalcApiSlice from "../../../../../store/propertyTaxCalcApiSlice";
import type { GetZoneTaxRequest, ZoneTaxData } from "../Models/ZoneModel";

export const zoneTaxApi = propertyTaxCalcApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getZoneTaxData: builder.query<ZoneTaxData, GetZoneTaxRequest>({
      query: ({ zoneName }) => ({
        url: `/v1/tax?zone=${zoneName}`,
        method: "GET",
      }),
      providesTags: (_result, _error, { zoneName }) => [
        { type: "Zones", id: zoneName },
        "Dashboard",
      ],
    }),
  }),
  overrideExisting: false,
});

export const { useGetZoneTaxDataQuery, useLazyGetZoneTaxDataQuery } =
  zoneTaxApi;
