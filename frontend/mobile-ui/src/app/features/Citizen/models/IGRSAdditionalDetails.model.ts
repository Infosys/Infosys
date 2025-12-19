// Represents additional amenities/details for IGRS (Integrated Grievance Redressal System)
export type ISGRAdditionalDetails = {
  lifts: boolean; // Whether lifts are available
  toilet: boolean; // Whether toilets are available
  watertap: boolean; // Whether water tap is available
  electricity: boolean; // Whether electricity is available
  cableConnection: boolean; // Whether cable connection is available
  waterHarvesting: boolean; // Whether water harvesting is available
  attachedBathroom: boolean; // Whether attached bathroom is available
}