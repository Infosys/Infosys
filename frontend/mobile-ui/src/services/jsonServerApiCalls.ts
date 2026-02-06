import env from '../config/env';

// Owner type for property owner details
export type Owner = {
  id: string | number;
  name: string;
  mobile?: string;
  email?: string;
  address?: string;
  guardianName?: string;
  guardianRelationship?: string;
  gender?: string;
  age?: number;
};

// Type helpers for dropdown UI options
type DropdownIdName = { id: string | number; name: string };
type DropdownIdLabel = { id: string | number; label: string };
type DropdownKeyLabel = { key: string; label: string };
type DropdownWithValue = { id: string | number; label: string; value: string };

// Structure of MDMS API response
interface MdmsResponse {
  mdms: Array<{
    id: string;
    tenantId: string;
    schemaCode: string;
    uniqueIdentifier: string;
    data: {
      [key: string]: any[];
    };
    isActive: boolean;
    auditDetails: {
      createdBy: string;
      lastModifiedBy: string;
      createdTime: number;
      lastModifiedTime: number;
    };
  }>;
}

// MDMS API configuration for endpoints and headers
const MDMS_CONFIG = {
  baseUrl: `${env.MDMS_HOST}/mdms-v2/v2`,
  tenantId: 'pb.amritsar',
  schemaCode: 'PropertyTax.Enumeration',
  clientId: 'test-client'
};

// Cache for MDMS data to avoid repeated API calls
let mdmsCache: any = null;

// Fetches and caches MDMS data from the API
const fetchMdmsData = async (): Promise<any> => {
  if (mdmsCache) {
    return mdmsCache;
  }

  try {
    const url = `${MDMS_CONFIG.baseUrl}?schemaCode=${MDMS_CONFIG.schemaCode}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Tenant-ID': MDMS_CONFIG.tenantId,
        'X-Client-Id': MDMS_CONFIG.clientId,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`MDMS API call failed: ${response.status}`);
    }

    const data: MdmsResponse = await response.json();

    // Extract the data from the first MDMS entry
    if (data.mdms && data.mdms.length > 0) {
      mdmsCache = data.mdms[0].data;
      return mdmsCache;
    } else {
      throw new Error('No MDMS data found');
    }
  } catch (error) {
    console.error('Error fetching MDMS data:', error);
    // Fallback to local data if API fails
    // const db = await import('../../json-server/db.json');
    // mdmsCache = db.default;
    return mdmsCache;
  }
};

// Service object for dropdowns and owner CRUD using MDMS and local JSON
const JsonService = {
  // Dropdowns - All fetch from MDMS API and return array for UI
  getDocumentTypes: async (): Promise<DropdownIdName[]> => {
    const data = await fetchMdmsData();
    return data.documentTypes || [];
  },

  getOwnershipOptions: async (): Promise<DropdownIdName[]> => {
    const data = await fetchMdmsData();
    return data.ownershipOptions || [];
  },

  getPropertyTypeOptions: async (): Promise<DropdownIdName[]> => {
    const data = await fetchMdmsData();
    return data.propertyTypeOptions || [];
  },

  getVacantLandPropertyTypes: async (): Promise<DropdownIdName[]> => {
    const data = await fetchMdmsData();
    return data.vacantLandPropertyTypes || [];
  },

  getGuardianRelationshipOptions: async (): Promise<DropdownIdName[]> => {
    const data = await fetchMdmsData();
    return data.guardianRelationshipOptions || [];
  },

  getGenderOptions: async (): Promise<DropdownIdName[]> => {
    const data = await fetchMdmsData();
    return data.genderOptions || [];
  },

  getWardNoOptions: async (): Promise<DropdownIdName[]> => {
    const data = await fetchMdmsData();
    return data.wardNoOptions || [];
  },

  getBlockNoOptions: async (): Promise<DropdownIdName[]> => {
    const data = await fetchMdmsData();
    return data.blockNoOptions || [];
  },

  getStreetOptions: async (): Promise<DropdownIdName[]> => {
    const data = await fetchMdmsData();
    return data.streetOptions || [];
  },

  getElectionWardOptions: async (): Promise<DropdownIdName[]> => {
    const data = await fetchMdmsData();
    return data.electionWardOptions || [];
  },

  getSecretariatWardOptions: async (): Promise<DropdownIdName[]> => {
    const data = await fetchMdmsData();
    return data.secretariatWardOptions || [];
  },

  getReasons: async (): Promise<DropdownIdLabel[]> => {
    const data = await fetchMdmsData();
    return data.reason || [];
  },

  getHabitations: async (): Promise<DropdownIdLabel[]> => {
    const data = await fetchMdmsData();
    return data.habitation || [];
  },

  getIgrsWards: async (): Promise<DropdownIdLabel[]> => {
    const data = await fetchMdmsData();
    return data.igrsWard || [];
  },

  getIgrsLocalities: async (): Promise<DropdownIdLabel[]> => {
    const data = await fetchMdmsData();
    return data.igrsLocality || [];
  },

  getIgrsBlocks: async (): Promise<DropdownIdLabel[]> => {
    const data = await fetchMdmsData();
    return data.igrsBlock || [];
  },

  getDoorNoFrom: async (): Promise<DropdownIdLabel[]> => {
    const data = await fetchMdmsData();
    return data.doorNoFrom || [];
  },

  getDoorNoTo: async (): Promise<DropdownIdLabel[]> => {
    const data = await fetchMdmsData();
    return data.doorNoTo || [];
  },

  getFloorNumbers: async (): Promise<DropdownIdLabel[]> => {
    const data = await fetchMdmsData();
    return data.floorNumber || [];
  },

  getBuildingClassifications: async (): Promise<DropdownIdLabel[]> => {
    const data = await fetchMdmsData();
    return data.buildingClassification || [];
  },

  getIgrsClassifications: async (): Promise<DropdownIdLabel[]> => {
    const data = await fetchMdmsData();
    return data.igrsClassification || [];
  },

  getNatureOfUsages: async (): Promise<DropdownIdLabel[]> => {
    const data = await fetchMdmsData();
    return data.natureOfUsage || [];
  },

  getOccupancies: async (): Promise<DropdownIdLabel[]> => {
    const data = await fetchMdmsData();
    return data.occupancy || [];
  },

  getOccupantNames: async (): Promise<DropdownIdLabel[]> => {
    const data = await fetchMdmsData();
    return data.occupantName || [];
  },

  getUnstructuredLands: async (): Promise<DropdownIdLabel[]> => {
    const data = await fetchMdmsData();
    return data.unstructuredLand || [];
  },

  getLengths: async (): Promise<DropdownIdLabel[]> => {
    const data = await fetchMdmsData();
    return data.length || [];
  },

  getBreadths: async (): Promise<DropdownIdLabel[]> => {
    const data = await fetchMdmsData();
    return data.breadth || [];
  },

  getPlinthAreas: async (): Promise<DropdownIdLabel[]> => {
    const data = await fetchMdmsData();
    return data.plinthArea || [];
  },

  getBuildingPermissionNos: async (): Promise<DropdownIdLabel[]> => {
    const data = await fetchMdmsData();
    return data.buildingPermissionNo || [];
  },

  getFloorTypes: async (): Promise<DropdownIdLabel[]> => {
    const data = await fetchMdmsData();
    return data.floorType || [];
  },

  getRoofTypes: async (): Promise<DropdownIdLabel[]> => {
    const data = await fetchMdmsData();
    return data.roofType || [];
  },

  getWallTypes: async (): Promise<DropdownIdLabel[]> => {
    const data = await fetchMdmsData();
    return data.wallType || [];
  },

  getWoodTypes: async (): Promise<DropdownIdLabel[]> => {
    const data = await fetchMdmsData();
    return data.woodType || [];
  },

  getSearchFields: async (): Promise<DropdownWithValue[]> => {
    const data = await fetchMdmsData();
    return data.searchFields || [];
  },

  getIsgrAdditionalOptions: async (): Promise<DropdownKeyLabel[]> => {
    const data = await fetchMdmsData();
    return data.isgrAdditionalOptions || [];
  },

  // Clear MDMS cache (force refetch on next call)
  clearCache: () => {
    mdmsCache = null;
  },

  // Owners CRUD (using local db.json for now)
  getOwners: async (): Promise<Owner[]> => {
    const db = await import('../../json-server/db.json');
    return db.default.owners || [];
  },

  addOwner: async (owner: Owner): Promise<Owner> => {
    const db = await import('../../json-server/db.json');
    (db.default.owners as Owner[]).push(owner);
    return owner;
  },

  deleteOwner: async (id: string | number): Promise<void> => {
    const db = await import('../../json-server/db.json');
    const owners = db.default.owners as Owner[];
    const idx = owners.findIndex((o) => o.id === id);
    if (idx !== -1) owners.splice(idx, 1);
  },
};

export default JsonService;

// Fetch MDMS data for a specific schema code (used for units, etc.)
const fetchMdmsDataBySchema = async (schemaCode: string): Promise<any> => {
  try {
    const url = `${env.MDMS_HOST}/mdms-v2/v2?schemaCode=${schemaCode}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Tenant-ID': MDMS_CONFIG.tenantId,
        'X-Client-Id': MDMS_CONFIG.clientId,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error(`MDMS API call failed: ${response.status}`);
    const data: MdmsResponse = await response.json();
    if (data.mdms && data.mdms.length > 0) {
      return data.mdms[0];
    } else {
      throw new Error('No MDMS data found');
    }
  } catch (error) {
    console.error('Error fetching MDMS data:', error);
    return null;
  }
};

// Get unit of measurement options from MDMS
const getUnitOfMeasurementOptions = async (): Promise<any> => {
  const data = await fetchMdmsDataBySchema('PropertyTax.UnitOfMeasurement');
  return data?.data || {};
};

export { getUnitOfMeasurementOptions };