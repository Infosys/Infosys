// Represents an owner of a property
export type Owner = {
  email: string; // Owner's email address
  gender: string; // Owner's gender
  mobile: string; // Owner's mobile number
  aadhaar: string; // Owner's Aadhaar number (unique ID in India)
  guardian: string; // Name of the guardian (if applicable)
  ownerName: string; // Name of the property owner
  guardianRelationship: string; // Relationship to the guardian
}