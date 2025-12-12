// Represents assessment details for a property
export type AssessmentDetails = {
  reason: string; // Reason for assessment creation
  extentOfSite: number; // Area/extent of the site
  landUnderBuilding: number; // Area of land under the building
  isUnspecifiedShare: boolean; // Whether the property has an unspecified share
  occupancyCertificateDate: string; // Date of occupancy certificate
  occupancyCertificateNumber: string; // Occupancy certificate number
}