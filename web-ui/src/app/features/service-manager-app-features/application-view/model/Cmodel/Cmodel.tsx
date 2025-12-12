// // Centralized models for all edit requests & responses for property application modules

// // =================== Additional Details ===================
// export type AdditionalDetailsFieldValue = {
//   spaces?: number;
//   covered?: boolean;
//   type?: string;
//   monthly_fee?: number;
//   reserved_spaces?: number;
//   [key: string]: string | number | boolean | undefined;
// };

// export interface EditAdditionalDetailsRequest {
//   fieldName: string;
//   fieldValue: AdditionalDetailsFieldValue;
//   propertyId: string;
// }

// export interface EditAdditionalDetailsResponse {
//   success: boolean;
//   message: string;
//   data: {
//     ID: string;
//     FieldName: string;
//     fieldValue: AdditionalDetailsFieldValue;
//     PropertyID: string;
//     CreatedAt: string;
//     UpdatedAt: string;
//   };
// }

// // =================== Amenities ===================
// export interface EditAmenitiesRequest {
//   property_id: string;
//   type: string[];
// }

// export interface EditAmenitiesResponse {
//   message: string;
//   data: {
//     ID: string;
//     type: string[];
//     Description: string;
//     ExpiryDate: string | null;
//     PropertyID: string;
//     CreatedAt: string;
//     UpdatedAt: string;
//   };
// }

// // =================== Owner ===================
// export interface EditOwnerRequest {
//   name: string;
//   contactNo: string;
//   email: string;
//   gender: string;
//   guardian: string;
//   guardianType: string;
//   relationshipToProperty: string;
//   ownershipShare: number;
//   isPrimaryOwner: boolean;
//   propertyId?: string;
// }

// export interface EditOwnerResponse {
//   success: boolean;
//   message: string;
//   data: {
//     ID: string;
//     Name: string;
//     ContactNo: string;
//     Email: string;
//     Gender: string;
//     Guardian: string;
//     GuardianType: string;
//     RelationshipToProperty: string;
//     OwnershipShare: number;
//     IsPrimaryOwner: boolean;
//     PropertyID: string;
//     CreatedAt: string;
//     UpdatedAt: string;
//   };
// }

// // =================== Assessment ===================
// export interface EditAssessmentRequest {
//   reasonOfCreation: string;
//   occupancyCertificateNumber: string;
//   occupancyCertificateDate: string;
//   extendOfSite: string;
//   isLandUnderneathBuilding: string;
//   isUnspecifiedShare: boolean;
//   propertyId: string;
// }

// export interface EditAssessmentResponse {
//   success: boolean;
//   message: string;
//   data: {
//     ID: string;
//     ReasonOfCreation: string;
//     OccupancyCertificateNumber: string;
//     OccupancyCertificateDate: string;
//     ExtendOfSite: string;
//     IsLandUnderneathBuilding: string;
//     IsUnspecifiedShare: boolean;
//     PropertyID: string;
//     CreatedAt: string;
//     UpdatedAt: string;
//   };
// }

// // =================== IGRS ===================
// export interface EditIGRSRequest {
//   propertyId: string;
//   habitation: string;
//   igrsWard: string;
//   igrsLocality: string;
//   builtUpAreaPct: number;
//   totalPlinthArea: number;
// }

// export interface EditIGRSResponse {
//   success?: boolean;
//   message?: string;
//   data: {
//     id: string;
//     habitation: string;
//     igrsWard: string;
//     igrsLocality: string;
//     igrsBlock?: string;
//     doorNoFrom?: string;
//     doorNoTo?: string;
//     igrsClassification?: string;
//     builtUpAreaPct: number;
//     frontSetback?: number;
//     rearSetback?: number;
//     sideSetback?: number;
//     totalPlinthArea: number;
//     createdAt: string;
//     updatedAt: string;
//     PropertyID: string;
//   };
// }

// // =================== Construction ===================
// export interface EditConstructionRequest {
//   floorType: string;
//   wallType: string;
//   roofType: string;
//   woodType: string;
//   propertyId: string;
// }

// export interface EditConstructionResponse {
//   success: boolean;
//   message: string;
//   data: {
//     ID: string;
//     FloorType: string;
//     WallType: string;
//     RoofType: string;
//     WoodType: string;
//     PropertyID: string;
//     FloorDetails?: any;
//     CreatedAt: string;
//     UpdatedAt: string;
//   };
// }

// // =================== Floor ===================
// export interface EditFloorRequest {
//   floorNo: number;
//   classification: string;
//   natureOfUsage: string;
//   firmName: string;
//   occupancyType: string;
//   occupancyName: string;
//   constructionDate: string;
//   effectiveFromDate: string;
//   unstructuredLand: string;
//   lengthFt: number;
//   breadthFt: number;
//   plinthAreaSqFt: number;
//   buildingPermissionNo: string;
//   floorDetailsEntered: boolean;
//   constructionDetailsId: string;
//   propertyId?: string;
// }

// export interface EditFloorResponse {
//   success: boolean;
//   message: string;
//   data: {
//     ID: string;
//     FloorNo: number;
//     Classification: string;
//     NatureOfUsage: string;
//     FirmName: string;
//     OccupancyType: string;
//     OccupancyName: string;
//     ConstructionDate: string;
//     EffectiveFromDate: string;
//     UnstructuredLand: string;
//     LengthFt: number;
//     BreadthFt: number;
//     PlinthAreaSqFt: number;
//     BuildingPermissionNo: string;
//     FloorDetailsEntered: boolean;
//     ConstructionDetailsID: string;
//     CreatedAt: string;
//     UpdatedAt: string;
//   };
// }

// // =================== Editable Field Types For Popovers ===================
// export type AdditionalDetailsEditInput = EditAdditionalDetailsRequest;
// export type AddressEditInput = {
//   locality: string;
//   zoneNo: string;
//   wardNo: string;
//   blockNo: string;
//   street: string;
//   electionWard: string;
//   secretariatWard: string;
//   pinCode: number;
//   differentCorrespondenceAddress: boolean;
//   propertyId: string;
// };
// export type AmenitiesEditInput = EditAmenitiesRequest;
// export type AssessmentEditInput = EditAssessmentRequest;
// export type ConstructionEditInput = EditConstructionRequest;
// export type FloorEditInput = EditFloorRequest;
// export type IGRSEditInput = EditIGRSRequest;
// export type OwnerEditInput = EditOwnerRequest;

// // =================== Property (Summary) ===================
// export type Property = {
//   ID: string;
//   PropertyNo: string;
//   OwnershipType: string;
//   PropertyType: string;
//   ComplexName: string;
// };