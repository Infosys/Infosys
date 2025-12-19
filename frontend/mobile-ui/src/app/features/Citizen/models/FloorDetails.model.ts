// Represents details for a single floor in a property
export type FloorDetails = {
  length: number; // Length of the floor (in feet/meters)
  breadth: number; // Breadth of the floor (in feet/meters)
  firmName: string; // Name of the firm (if any) occupying the floor
  occupancy: string; // Type of occupancy (e.g., owner, tenant)
  plinthArea: number; // Plinth area of the floor
  floorNumber: string; // Floor number or label
  occupantName: string; // Name of the occupant
  natureOfUsage: string; // Usage type (e.g., residential, commercial)
  constructionDate: string; // Date of construction
  unstructuredLand: string; // Unstructured land info (if any)
  effectiveFromDate: string; // Date from which the floor is effective
  igrsClassification: string; // IGRS classification for the floor
  buildingPermissionNo: string; // Building permission number
  floorsDetailsEntered: boolean; // Whether floor details have been entered
  buildingClassification: string; // Classification of the building
}