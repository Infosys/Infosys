// API slice for searching properties assigned to an agent
import { taxCalculatorApiSlice } from '../../../../redux/taxCalculatorApiSlice';

export interface TaxCalculatorResponse {
  ResponseInfo: {
    apiId: string;
    ver: string;
    ts: number;
    resMsgId: string;
    msgId: string;
    status: string;
  };
  Calculations: Array<{
    tenantId: string;
    propertyId: string;
    assessmentNumber: string;
    assessmentYear: string;
    totalAmount: number;
    taxAmount: number;
    penalty: number;
    exemption: number;
    rebate: number;
    taxHeadEstimates: Array<{
      taxHeadCode: string;
      estimateAmount: number;
      category: string;
    }>;
    billingSlabIds: string[];
    fromDate: number;
    toDate: number;
  }>;
}

// Injects endpoints into the taxCalculatorApiSlice
export const taxCalculatorApi = taxCalculatorApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTaxCalculator: builder.query<TaxCalculatorResponse, { propertyNo: string }>({
      query: ({ propertyNo }) => ({
        url: `/v1/tax/calculate/${propertyNo}`,
        method: 'GET',
        headers: {
          'X-Tenant-ID': 'pb.amritsar',
        },
      }),
    }),
  }),
});

// Export hooks for using the getProperties query
export const { useGetTaxCalculatorQuery, useLazyGetTaxCalculatorQuery } = taxCalculatorApi;