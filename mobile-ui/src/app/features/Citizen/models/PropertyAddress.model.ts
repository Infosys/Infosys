// Represents the address details for a property
export type PropertyAddress = {
  street: string; // Street name
  wardNo: string; // Ward number
  zoneNo: string; // Zone number
  blockNo: string; // Block number
  pincode: string; // Postal code
  locality: string; // Locality or neighborhood
  electionWard: string; // Election ward
  secretariatWard: string; // Secretariat ward
  isCorrespondenceAddressDifferent: boolean; // Whether correspondence address is different
}