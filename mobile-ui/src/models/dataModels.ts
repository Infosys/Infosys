// dataModels.ts
// TypeScript interfaces for property application data, property items, and pagination used throughout the app.
// Raw application data structure for property applications
export interface RawApplication {
  id: string;
  pId: string,
  applicationNo: string;
  propertyId: string;
  property: any; 
  currentState: string;
  processInstanceId: string;
  createdTime: string;
  updatedTime: string;
  citizenId: string;
  tenantId: string;
}

// Summary information for a property (used in lists/cards)
export interface PropertyItem {
  id: string;
  pId: string;
  type: string;
  description: string;
  address: string;
  dueDate: string;
  status: string;
  phoneNumber: string;
  area: string;
  propertyType: string;
  isVerified: boolean;
  isDraft: boolean;
  isNew: boolean;
  createdDate: string;
}

// Pagination information for paged API results
export interface Pagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// Result structure for paged property fetches
export interface PropertyFetchResult<T> {
  applications: T[];
  pagination: Pagination;
}