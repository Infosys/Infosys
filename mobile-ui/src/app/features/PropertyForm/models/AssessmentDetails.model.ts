// Request payload for submitting assessment details
export interface AssessmentDetailsRequest {
  reasonOfCreation: string; // Reason for creating the assessment
  occupancyCertificateNumber: string; // Occupancy certificate number
  occupancyCertificateDate: string; // Date of occupancy certificate
  extentOfSite: string; // Area/extent of the site
  isLandUnderneathBuilding: string; // Whether land is underneath building
  isUnspecifiedShare: boolean; // Whether the property has an unspecified share
  propertyId: string; // Linked property ID
}

// Response structure for assessment details API
export interface AssessmentDetailsResponse {
  success: boolean; // Indicates if the API call was successful
  message: string; // Response message
  data: {
    ID: string; // Unique assessment ID
    ReasonOfCreation: string; // Reason for creation
    OccupancyCertificateNumber: string; // Occupancy certificate number
    OccupancyCertificateDate: string; // Date of occupancy certificate
    ExtentOfSite: string; // Site area/extent
    IsLandUnderneathBuilding: string; // Whether land is underneath building
    IsUnspecifiedShare: boolean; // Whether property has unspecified share
    PropertyID: string; // Linked property ID
    CreatedAt: string; // Creation timestamp
    UpdatedAt: string; // Last update timestamp
  };
}