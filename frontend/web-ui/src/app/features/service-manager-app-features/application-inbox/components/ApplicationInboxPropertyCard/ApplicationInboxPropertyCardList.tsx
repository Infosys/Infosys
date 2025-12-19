/**
 * This component renders a list of property cards for the application inbox.
 * It fetches applications and agents, applies backend filters,
 * and displays paginated results with appropriate loading and error messages.
 */
import React, { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import ApplicationInboxPropertyCard from "./ApplicationInboxPropertyCard";
import { applicationInboxPropertyCardListSx } from "../../styles/ApplicationInboxPropertyCard/ApplicationInboxPropertyCardListStyle";
import { useGetAllApplicationsUnderJurisdictionQuery } from "../../api/getAllApplicationsApi";
import { useGetAllAgentsQuery } from "../../api/getAllAgentsApi";
import PaginationControls from "../../../../../components/Pagination/PaginationControls";
import { useSelector } from 'react-redux';
import AlertMessage from "../AlertComponent/AlertComponent";
import { useDebouncedValue } from "../../utils/debounce";
import {
  buildAgentIdToNameMap,
  enrichPropertiesWithAgentName,
  buildAgentIdToUsernameMap,
  enrichPropertiesWithAgentUsername,
} from "../../utils/searchAndFilterutil";
import type { RootState } from "../../../../../../store/index";
import type { AllApplicationModel } from "../../models/getAllApplicationsModel";

// Number of items to show per page
const PAGE_SIZE = 5;

// Functional component to render a paginated, filtered list of property cards
const ApplicationInboxPropertyCardList: React.FC = () => {
  // State for current page in pagination
  const [page, setPage] = useState(1);

  // Get selected zone from Redux store
  const selectedZone = useSelector((state: RootState) => state.user.selectedZone);

  // Fetch all agents for mapping and filtering
  const { data: agentsData, isLoading: agentsLoading } = useGetAllAgentsQuery();

  // Get filter values from Redux store
  const agentsFilter = useSelector((state: RootState) => state.filter.agents); // array, but only one agent allowed
  const priority = useSelector((state: RootState) => state.filter.priority);
  const wardsFilter = useSelector((state: RootState) => state.filter.wards); // single ward in array
  const searchValue = useSelector((state: RootState) => state.filter.searchValue);

  // Debounce the search value to avoid excessive filtering
  const debouncedSearchValue = useDebouncedValue(searchValue, 300);

  // Determine which wards to pass
  const wardNos = wardsFilter.length > 0
    ? [wardsFilter[0]] // Only one ward can be selected
    : selectedZone?.wards ?? [];

  // Determine agentId to pass (find from agent name)
  let agentId = "";
  if (agentsFilter.length > 0 && agentsData?.data?.users) {
    const foundAgent = agentsData.data.users.find(
      (a) => a.profile?.fullName === agentsFilter[0]
    );
    agentId = foundAgent ? foundAgent.id : "";
  }

  // Only fetch if a zone and wards are available
  const shouldFetch = !!selectedZone && !!selectedZone.zoneNumber && wardNos.length > 0;

  // Fetch applications under user's jurisdiction with filters
  const { data, isLoading, isError, isFetching } = useGetAllApplicationsUnderJurisdictionQuery(
    {
      page: page - 1,
      size: PAGE_SIZE,
      zoneNo: selectedZone?.zoneNumber ?? "",
      wardNos,
      status: "ASSIGNED",
      ...(priority ? { priority } : {}),
      ...(agentId ? { assignedAgent: agentId } : {}),
      ...(debouncedSearchValue ? { applicationNo: debouncedSearchValue } : {}),
    },
    { skip: !shouldFetch }
  );

  // Memoized mapping of agent IDs to names and usernames
  const agentIdToName = useMemo(
    () => buildAgentIdToNameMap(agentsData ?? {data: {users: []}}),
    [agentsData]
  );
  const agentIdToUsername = useMemo(
    () => buildAgentIdToUsernameMap(agentsData ?? {data: {users: []}}),
    [agentsData]
  );

  // Enrich properties with agent names and usernames
  let enrichedProperties = useMemo(
    () => enrichPropertiesWithAgentName(data?.data ?? [], agentIdToName),
    [data, agentIdToName]
  );
  enrichedProperties = useMemo(
    () => enrichPropertiesWithAgentUsername(enrichedProperties, agentIdToUsername),
    [enrichedProperties, agentIdToUsername]
  );

  const totalPages = data?.pagination?.totalPages || 1;

  // Show appropriate messages for loading, errors, or empty states
  if (!shouldFetch) return <AlertMessage message="No jurisdiction assigned." />;
  if (isLoading || agentsLoading) return <AlertMessage message="Loading applications..." />;
  if (isError) return <AlertMessage message="Error loading applications." />;
  if (!enrichedProperties.length) return <AlertMessage message="No applications found." />;

  // Render the list of property cards and pagination controls
  return (
    <Box>
      {isFetching && <div>Loading page...</div>}
      <Box sx={applicationInboxPropertyCardListSx}>
        {enrichedProperties.map((property: AllApplicationModel) => (
          <ApplicationInboxPropertyCard key={property.ID} property={property} />
        ))}
      </Box>
      {totalPages > 1 && (
        <PaginationControls
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
      )}
      
    </Box>
  );
};

export default ApplicationInboxPropertyCardList;