// Request payload for creating IGRS details
export interface IgrsDetailsRequest {
  propertyId: string; // Linked property ID
  habitation: string; // Habitation name
  igrsWard?: string; // IGRS ward (optional)
  igrsLocality?: string; // IGRS locality (optional)
  igrsBlock?: string; // IGRS block (optional)
  doorNoFrom?: string; // Door number (from, optional)
  doorNoTo?: string; // Door number (to, optional)
  igrsClassification?: string; // IGRS classification (optional)
  builtUpAreaPct?: number; // Built-up area percentage (optional)
  frontSetback?: number; // Front setback (optional)
  rearSetback?: number; // Rear setback (optional)
  sideSetback?: number; // Side setback (optional)
  totalPlinthArea?: number; // Total plinth area (optional)
}

// Request payload for updating IGRS details (all fields optional)
export interface IgrsDetailsUpdateRequest {
  propertyId?: string; // Linked property ID (optional)
  habitation?: string; // Habitation name (optional)
  igrsWard?: string; // IGRS ward (optional)
  igrsLocality?: string; // IGRS locality (optional)
  igrsBlock?: string; // IGRS block (optional)
  doorNoFrom?: string; // Door number (from, optional)
  doorNoTo?: string; // Door number (to, optional)
  igrsClassification?: string; // IGRS classification (optional)
  builtUpAreaPct?: number; // Built-up area percentage (optional)
  totalPlinthArea?: number; // Total plinth area (optional)
}

// Response structure for IGRS details API
export interface IgrsDetailsResponse {
  data: {
    id: string; // Unique IGRS details ID
    habitation: string; // Habitation name
    igrsWard?: string; // IGRS ward (optional)
    igrsLocality?: string; // IGRS locality (optional)
    igrsBlock?: string; // IGRS block (optional)
    doorNoFrom?: string; // Door number (from, optional)
    doorNoTo?: string; // Door number (to, optional)
    igrsClassification?: string; // IGRS classification (optional)
    builtUpAreaPct?: number; // Built-up area percentage (optional)
    frontSetback?: number; // Front setback (optional)
    rearSetback?: number; // Rear setback (optional)
    sideSetback?: number; // Side setback (optional)
    totalPlinthArea?: number; // Total plinth area (optional)
    createdAt: string; // Creation timestamp
    updatedAt: string; // Last update timestamp
    PropertyID: string; // Linked property ID
  };
  message: string; // Response message
  success: boolean; // Indicates if the API call was successful
}