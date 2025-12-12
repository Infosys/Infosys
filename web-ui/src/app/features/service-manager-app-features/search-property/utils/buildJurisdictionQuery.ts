// This file provides a utility function to build a query URL for searching applications
// by zone, wards, and pagination in the property search feature.

// Builds a query string for searching applications by zone, wards, page, and size
export function buildJurisdictionQuery(zoneNo: string, wardNos: string[], page: number, size: number) {
  // Encode the zone number as a query parameter
  const zoneParam = `zoneNo=${encodeURIComponent(zoneNo)}`;
  // Encode each ward number as a separate query parameter and join them
  const wardParams = wardNos.map(w => `wardNo=${encodeURIComponent(w)}`).join('&');
  // Construct the full URL with all parameters
  const url = `/v1/applications/search?${zoneParam}&${wardParams}&page=${page}&size=${size}`;
  console.log('Built jurisdiction query', url);
  return url;
}