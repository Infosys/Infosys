export interface ZoneWardsData {
  wards: number;
  zone: string;
}

export interface ZoneWardsResponse {
  data: ZoneWardsData[];
  error?: string;
}

export interface GetZoneWardsRequest {
  fileStoreId: string;
  userId?: string;
  userRole?: string;
  tenantId?: string;
}

export interface ZoneTaxData {
  totalTaxAmount: number;
  pendingAmount: number;
  collectionAmount: number;
}

export interface GetZoneTaxRequest {
  zoneName: string;
}

export interface ZoneEnumerationCountData {
  totalItems: number;
}

export interface GetZoneEnumerationCountRequest {
  zoneNo: string;
  enumerated: boolean;
}

export interface ZoneData {
  zoneName: string;
  ward: string;
  compliance: number; // percentage
  collected: string;
  pending: string;
}

export interface ZoneCollectionInformationProps {
  fileStoreId?: string;
  zones?: ZoneData[];
}

export interface ZonePropertyData {
  zoneName: string;
  ward: string;
  enumerated: number;
  unenumerated: number;
}

export interface ZonePropertyInformationProps {
  fileStoreId?: string;
  zones?: ZonePropertyData[];
}
