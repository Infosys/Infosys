
// Represents a property owner and their details
export interface Owner {
  ID: string;                                 // Unique owner ID
  PropertyID: string;                        // Associated property ID
  AdhaarNo: number;                          // Aadhaar number (national ID)
  Name: string;                              // Owner's name
  ContactNo: string;                         // Contact number
  Email: string;                             // Email address
  Gender: 'MALE' | 'FEMALE' | 'OTHER';       // Gender
  Guardian: string;                          // Guardian's name
  GuardianType: 'FATHER' | 'MOTHER' | 'HUSBAND' | 'WIFE' | 'OTHER'; // Guardian relationship
  RelationshipToProperty: 'OWNER' | 'CO_OWNER' | 'TENANT' | 'OTHER'; // Relationship to property
  OwnershipShare: number;                    // Percentage share of ownership
  IsPrimaryOwner: boolean;                   // Whether this is the primary owner
  CreatedAt: string;                         // Record creation timestamp
  UpdatedAt: string;                         // Record update timestamp
}


// Response payload for fetching owner details
export interface OwnerResponse {
  data: Owner[];         // Array of owner records
  message: string;       // Response message from the API
  success: boolean;      // Indicates if the operation was successful
}