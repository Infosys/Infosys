// This file defines the PropertyCardList component, which displays a paginated list of property cards
// with filtering, searching, sorting, and agent enrichment. It fetches property and agent data,
// applies search and sort logic, and renders each property using the PropertyCard component.

import React, { useState, useEffect, useMemo } from "react";
import { Alert, Box } from "@mui/material";
import PaginationControls from "../../../../../components/Pagination/PaginationControls";
import { useGetAllPropertiesUnderJurisdictionQuery } from "../../api/getAllPropertiesApi";
import { propertyCardListSx } from "../../styles/SearchPropertyCards/PropertyCardListStyle";
import PropertyCard from "./PropertyCard";
import { useDebouncedValue } from "../../utils/debounce";
import { useGetAllAgentsQuery } from "../../api/getAllAgentsApi";
import { useNavigate } from "react-router-dom";
import { useGetApplicationsBySearchQuery } from "../../api/searchFilterApi";
import { FILTER_PARAM_MAP } from "../../utils/constants";
import type { RootState } from "../../../../../../store";
import { useSelector } from "react-redux";

const PAGE_SIZE = 5; // Number of properties per page

// Props for the PropertyCardList component
interface PropertyCardListProps {
  selectedFilter: string; // The current filter type (e.g., Zone, Ward)
  searchValue: string; // The current search input value
  selectedSort: string; // The current sort option
}

// Functional component for displaying a paginated, searchable, and sortable list of property cards
const PropertyCardList: React.FC<PropertyCardListProps> = ({
  selectedFilter,
  searchValue,
  selectedSort,
}) => {
  const [page, setPage] = useState(1); // Current page number
  const navigate = useNavigate(); // React Router navigation hook

  // Debounce the search value to avoid rapid API calls
  const debouncedSearchValue = useDebouncedValue(searchValue, 500);
  const getSearchValue = debouncedSearchValue;

  // Convert sort option to API parameters
  const sortBy = selectedSort === "New - Old" ? "DESC" : "ASC";
  const sortField = "created_at";

  // Get the currently selected zone and wards from Redux store
  const selectedZone = useSelector(
    (state: RootState) => state.user.selectedZone
  );

  // Fetch all agents for enrichment
  const { data: agentsData, isLoading: agentsLoading } = useGetAllAgentsQuery();

  // Fetch properties under the selected jurisdiction (zone/wards)
  const {
    data: zoneBasedData,
    isError: isZoneError,
    isLoading: isZoneLoading,
    isFetching: isZoneFetching,
  } = useGetAllPropertiesUnderJurisdictionQuery({
    page: page -1,
    size: PAGE_SIZE,
    zoneNo: selectedZone?.zoneNumber ?? "",
    wardNos: selectedZone?.wards ?? [],
    sortBy,
    sortField,
  });

  // Extract assigned zone and wards for filtering
  const assignedZoneNo = selectedZone?.zoneNumber ?? "";
  const assignedWards = selectedZone?.wards ?? [];

  let filteredZoneNo = assignedZoneNo;
  let filteredWardNos = assignedWards;

  // If searching by Ward, only include the searched ward if assigned
  if (selectedFilter === "Ward" && getSearchValue.trim() !== "") {
    filteredWardNos = assignedWards.filter((w) => w === getSearchValue.trim());
  }

  // If searching by Zone, check if it's the assigned zone
  if (selectedFilter === "Zone" && getSearchValue.trim() !== "") {
    if (assignedZoneNo === getSearchValue.trim()) {
      filteredZoneNo = getSearchValue.trim();
      filteredWardNos = assignedWards;
    } else {
      filteredZoneNo = "";
      filteredWardNos = [];
    }
  }

  // Determine if search API should be used based on filter and input
  let shouldUseSearch = getSearchValue.trim() !== "";

  if (selectedFilter === "Zone" && getSearchValue.trim() !== "") {
    shouldUseSearch = filteredZoneNo !== "" && filteredWardNos.length > 0;
  }

  if (selectedFilter === "Ward" && getSearchValue.trim() !== "") {
    shouldUseSearch = filteredWardNos.length > 0;
  }

  let apiSearchValue = getSearchValue;
if (selectedFilter === "Agent name" && getSearchValue.trim() !== "" && agentsData?.data?.users) {
  const agent = agentsData.data.users.find(
    (a) => a.profile?.fullName?.toLowerCase() === getSearchValue.trim().toLowerCase()
  );
  apiSearchValue = agent ? agent.id : ""; // Pass agent ID or empty string if not found
}

  // Map filter type to API parameter
  const searchText = FILTER_PARAM_MAP[selectedFilter] || "propertyNo";

  // Fetch properties using the search API if needed
  const {
    data: searchData,
    isLoading: isSearchLoading,
    isError: isSearchError,
    isFetching: isSearchFetching,
  } = useGetApplicationsBySearchQuery(
    {
      searchText,
      searchValue: apiSearchValue,
      zoneNo: filteredZoneNo,
      wardNos: filteredWardNos,
      page: page - 1, // backend is usually 0-indexed
      size: PAGE_SIZE,
      sortBy,
      sortField,
    },
    { skip: !shouldUseSearch }
  );

  // Choose which data to display: search results or zone-based data
  const data = shouldUseSearch ? searchData : zoneBasedData;
  const isLoading = shouldUseSearch ? isSearchLoading : isZoneLoading;
  const isError = shouldUseSearch ? isSearchError : isZoneError;
  const isFetching = shouldUseSearch ? isSearchFetching : isZoneFetching;

  // Create a mapping from agent ID to agent name for quick lookup
  const agentIdToName = useMemo(() => {
    const map: Record<string, string> = {};
    if (agentsData?.data?.users) {
      agentsData.data.users.forEach((agent) => {
        map[agent.id] = agent.profile?.fullName || "Unassigned";
      });
    }
    return map;
  }, [agentsData]);

  // Create a mapping from agent ID to agent username
  const agentIdToUsername = useMemo(() => {
    const map: Record<string, string> = {};
    if (agentsData?.data?.users) {
      agentsData.data.users.forEach((agent) => {
        map[agent.id] = agent?.username || "";
      });
    }
    return map;
  }, [agentsData]);

  // Enrich each property with agent name and username
  const enrichedProperties = useMemo(() => {
    return (data?.data || []).map((property) => ({
      ...property,
      AgentName: agentIdToName[property.AssignedAgent ?? ""] || "Unassigned",
      AgentUsername: agentIdToUsername[property.AssignedAgent ?? ""] || "",
    }));
  }, [data, agentIdToName, agentIdToUsername]);

  const totalPages = data?.pagination?.totalPages || 1;
  // Get the data for the current page (no slicing for search)
  const paginatedData = enrichedProperties;

  // Reset to first page when filter, search, or sort changes
  useEffect(() => {
    setPage(1);
  }, [selectedFilter, debouncedSearchValue, selectedSort]);

  // Show loading or error alerts as needed
  if (isFetching || agentsLoading)
    return (
      <Alert severity="info" sx={{ width: "100%", textAlign: "center", my: 6 }}>
        Loading page...
      </Alert>
    );
  if (isLoading)
    return (
      <Alert severity="info" sx={{ width: "100%", textAlign: "center", my: 6 }}>
        Loading...
      </Alert>
    );
  if (isError)
    return (
      <Alert
        severity="error"
        sx={{ width: "100%", textAlign: "center", my: 6 }}
      >
        Error loading properties.
      </Alert>
    );

  // Handle card click to navigate to property details
  const handleCardClick = (applicationId: string) => {
    navigate(`/service-manager/property-details/${applicationId}`);
  };

  return (
    <Box>
      {/* List of property cards or a message if none found */}
      <Box sx={propertyCardListSx}>
        {paginatedData.length === 0 ? (
          <Alert
            severity="info"
            sx={{ width: "100%", textAlign: "center", my: 6 }}
          >
            No properties found.
          </Alert>
        ) : (
          paginatedData.map((property) => (
            <PropertyCard
              status={property.Status}
              key={property.ID}
              uniqueId={property.ID}
              propertyName={property.Property.ComplexName}
              propertyId={property.Property.PropertyNo}
              address={property.Property.Address?.Street ?? "N/A"}
              ward={property.Property.Address?.WardNo ?? "N/A"}
              zone={property.Property.Address?.ZoneNo ?? "N/A"}
              agentId={property.AssignedAgent ?? "N/A"}
              agentName={property.AgentName}
              agentUsername={property.AgentUsername}
              images={property.Property.Documents}
              createdDate={
                property.Property?.CreatedAt
                  ? property.Property.CreatedAt
                  : "N/A"
              }
              location={
                property.Property.GISData ?? {
                  ID: "",
                  Source: "",
                  Type: "",
                  EntityType: "",
                  PropertyID: "",
                  Coordinates: [],
                  Latitude: 0,
                  Longitude: 0,
                  CreatedAt: "",
                  UpdatedAt: "",
                }
              }
              onClick={() => handleCardClick(property.ID)}
            />
          ))
        )}
      </Box>

      {/* Pagination controls for navigating pages */}
      {totalPages > 1 &&
        <PaginationControls
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
      }
    </Box>
  );
};

export default PropertyCardList;
