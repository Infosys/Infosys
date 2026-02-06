
// Response Info model
export interface ResponseInfo {
    apiId: string;
    ver: string;
    ts: number;
    resMsgId: string;
    msgId: string;
    status: string;
}

// Tax Head Estimate model
export interface TaxHeadEstimate {
    taxHeadCode: string;
    estimateAmount: number;
    category: 'TAX' | 'REBATE' | 'PENALTY' | 'EXEMPTION';
}

// Calculation model
export interface Calculation {
    tenantId: string;
    propertyId: string;
    assessmentNumber: string;
    assessmentYear: string;
    totalAmount: number;
    taxAmount: number;
    penalty: number;
    exemption: number;
    rebate: number;
    taxHeadEstimates: TaxHeadEstimate[];
    billingSlabIds: string[];
    fromDate: number;
    toDate: number;
}

// Main response model
export interface CalculationResponse {
    ResponseInfo: ResponseInfo;
    Calculations: Calculation[];
}