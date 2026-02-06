import apiSlice from "../../../../../store/apiSlice";
import propertyTaxCalcApiSlice from "../../../../../store/propertyTaxCalcApiSlice";
import { TAG_TYPES } from "../../../../../store/tagTypes";
import type { CalculationResponse } from "../Models/CalculatePropertyResponse";

interface PropertyCountByZoneRequest {
    zoneNo: string;
}

interface PropertyCountByZoneResponse {
    totalItems: number;
}

export const propertyCountByZone = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPropertyCountByZone: builder.query<PropertyCountByZoneResponse, PropertyCountByZoneRequest>({
            query: (params) => {
                const url = `/v1/applications/search?zoneNo=${params.zoneNo}&isCountOnly=true`;
                return {
                    url,
                    method: 'GET',
                    headers: {
                        'X-User-Role': 'COMMISSIONER',
                    },
                };
            },
        }),
    }),
});
export const { useGetPropertyCountByZoneQuery } = propertyCountByZone;



interface CommissionerDashboardStatsResponse {
    totalTaxAmount: number;
    pendingAmount: number;
    collectionAmount: number;
}

interface CommissionerDashboardStatsRequest {
    zone: string;
}

export const commissionerDashboardPrpTaxApi = propertyTaxCalcApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCommissionerDashboardOverAllPropertyTax: builder.query<CommissionerDashboardStatsResponse, CommissionerDashboardStatsRequest >({
            query: (params) => {
                const url = `/v1/tax/${params.zone}`;
                return {
                    url,
                    method: 'GET',
                    headers: {
                        'X-User-Role': 'COMMISSIONER',
                    },
                };
            },
        }),
        getPropertyTaxCalculation: builder.query<CalculationResponse, { propertyId: string }>({
            query: ({ propertyId }) => {
                const url = `/v1/tax/calculate/${propertyId}`;
                return {
                    url,
                    method: 'GET',
                    headers: {
                        'X-User-Role': 'COMMISSIONER',
                    },
                };
            },
            providesTags: (_result, _error, { propertyId }) => [
                { type: TAG_TYPES.CALCULATION, id: propertyId },
            ],
        }),
    }),
});

export const { useGetCommissionerDashboardOverAllPropertyTaxQuery , useGetPropertyTaxCalculationQuery } = commissionerDashboardPrpTaxApi;