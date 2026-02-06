// Label mappings for displaying user-friendly field names in property application cards.
// Labels for owner-related fields
export const ownerLabels: { [key: string]: string } = {
  Name: "Owner Name ",
  ContactNo: "Mobile Number ",
  Email: "Email Address ",
  Gender: "Gender ",
  AdhaarNo: "Aadhaar No. ",
  Guardian: "Guardian",
  GuardianType: "Guardian Type"
};


// Labels for amenities fields
export const amenitiesLabels: { [key: string]: string } = {
  type: "Amenities Type",
};


// Labels for additional property details (e.g., parking)
export const additionalDetailsLabels: { [key: string]: string } = {
  covered: "Covered Parking",
  monthly_fee: "Monthly Fee",
  reserved_spaces: "Reserved Spaces",
  spaces: "Total Spaces",
  type: "Parking Type",
  revenueDocumentNo: "Revenue Document No",
  serialNo: "Serial No",
  
};



// Labels for address-related fields
export const addressLabels: { [key: string]: string } = {
  Locality: "Locality ",
  ZoneNo: "Zone No ",
  WardNo: "Ward No ",
  BlockNo: "Block No ",
  Street: "Street ",
  ElectionWard: "Election Ward ",
  SecretariatWard: "Secretariat Ward ",
  PinCode: "Pin Code ",
  DifferentCorrespondenceAddress: "Different Correspondence Address",
  CorrespondenceAddress1: "Correspondence Address 1",
  CorrespondenceAddress2: "Correspondence Address 2",
  CorrespondencePincode: "Correspondence Pincode"
};


// Labels for property main details
export const propertyLabels: { [key: string]: string } = {
  PropertyNo: "Property No",
  OwnershipType: "Ownership Type",
  PropertyType: "Property Type",
  ComplexName: "Complex Name",
  typeOfLand: "Type of Land",
  noOfFloors: "Number of Floors",
  noOfBasements: "Number of Basements",
  hasMezzanineFloor: "Has Mezzanine Floor",
  noOfBuildings: "Number of Buildings",
  buildingName: "Building Number/Name"
};


// Labels for assessment-related fields
export const assessmentLabels: {  [key: string]: ((unit?: string) => string) | string  } = {
  ReasonOfCreation: "Reason of Creation ",
  OccupancyCertificateNumber: "Occupancy Certificate Number ",
  OccupancyCertificateDate: "Occupancy Certificate Date ",
  ExtentOfSite: (unit?: string) => unit ? `Extent Of Site (${unit})` : "Extent Of Site"
};


// Labels for IGRS (stamp duty/registration) related fields
export const igsrLabels: { [key: string]: string } = {
  igrsWard: "IGRS Ward",
  igrsBlock: "IGRS Block",
  igrsClassification: "IGRS Classification",
  builtUpAreaPct: "Built-Up Area (%)",
  totalPlinthArea: "Total Plinth Area (m²)",
  habitation: "Habitation",
  frontSetback: "Front Setback (ft)",
  rearSetback: "Rear Setback (ft)",
  sideSetback: "Side Setback (ft)",
  doorNoFrom: "Door No. From",
  doorNoTo: "Door No. To",
  igrsLocality: "IGRS Locality"
};

// Labels for construction-related fields
export const constructionLabels: { [key: string]: string } = {
  FloorType: "Floor Type ",
  WallType: "Wall Type ",
  RoofType: "Roof Type ",
  WoodType: "Wood Type "
};


// Labels for floor-related fields
export const floorLabels: { [key: string]: string } = {
  FloorNo: "Floor No ",
  Classification: "Classification ",
  NatureOfUsage: "Nature of Usage ",
  FirmName: "Firm Name",
  PlinthAreaSqFt: "Plinth Area (sqft)",
  OccupancyName: "Occupancy Name",
  OccupancyType: "Occupancy Type",
  BuildingPermissionNo: "Building Permission No",
  BreadthFt: "Breadth (ft)",
  LengthFt: "Length (ft)"
};