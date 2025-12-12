// This file provides a custom React hook to retrieve the current user's jurisdiction (zone and wards) from the Redux store.
// Use this hook in components that need to access or display the user's assigned zones and wards.
import { useSelector } from "react-redux";
import type { RootState } from "../../../../store/index";

// Type definition for a zone, which includes a zone number and a list of wards in that zone
interface ZoneData {
  zoneNumber: string;
  wards: string[];
}

// Custom hook to get the current user's jurisdiction information from the Redux store
export const useGetUserJurisdiction = () => {
  // Access the currentUser object from the Redux store
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  // Get the zone data from the current user, or return an empty array if not available
  const zoneData: ZoneData[] = currentUser?.zoneData || [];

  // Return the user's zone data for use in components
  return zoneData;
};