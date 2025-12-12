// Represents a license associated with a property
export type License = {
  id: string; // Unique license identifier
  propertyId: string; // Linked property ID
  licenseNo: string; // License number
  licenseType: string; // Type of license (e.g., trade, construction)
  status: string; // License status (e.g., active, expired)
  issuedDate: string; // Date when the license was issued
  expiryDate: string; // Date when the license expires
  createdAt: string; // Creation timestamp
}