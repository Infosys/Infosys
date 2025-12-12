import mdmsApiSlice from '../../../../../../store/mdmsApiSlice'

// MDMS API Response Types
interface MdmsResponse {
  mdms: Array<{
    id: string;
    tenantId: string;
    schemaCode: string;
    uniqueIdentifier: string;
    data: {
      [key: string]: any[];
    };
    isActive: boolean;
    auditDetails: {
      createdBy: string;
      lastModifiedBy: string;
      createdTime: number;
      lastModifiedTime: number;
    };
  }>;
}


export const mdmsApi = mdmsApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Generic MDMS enumeration fetcher (fetches all dropdown data for PropertyTax.Enumeration)
    getMdmsEnumeration: builder.query<{ [key: string]: any[] }, void>({
      query: () => ({
        url: '?schemaCode=PropertyTax.Enumeration',
        method: 'GET',
      }),
      transformResponse: (response: MdmsResponse) => 
        response?.mdms?.[0]?.data ?? {},
    }),

    // Fetch by schema code (for e.g. unit of measurement)
    // getMdmsDataBySchema: builder.query<MdmsResponse['mdms'][0] | undefined, string>({
    //   query: (schemaCode: string) => ({
    //     url: `?schemaCode=${schemaCode}`,
    //     method: 'GET',
    //   }),
    //   transformResponse: (response: MdmsResponse) =>
    //     response.mdms && response.mdms.length > 0
    //       ? response.mdms[0]
    //       : undefined,
    // }),

    // Example: fetch one dropdown from PropertyTax.Enumeration
    // getDropdown: builder.query<any[], { dropdownKey: string }>({
    //   query: () => ({
    //     url: '?schemaCode=PropertyTax.Enumeration',
    //     method: 'GET',
    //   }),
    //   transformResponse: (response: MdmsResponse, _meta, arg) => {
    //     if (response?.mdms?.[0]?.data) {
    //       return response.mdms[0].data[arg.dropdownKey] ?? [];
    //     }
    //     return [];
    //   },
    // }),
  }),
  overrideExisting: false,
})

// Export hooks for use in components
export const {
  useGetMdmsEnumerationQuery,
  // useGetMdmsDataBySchemaQuery,
  // useGetDropdownQuery,
} = mdmsApi