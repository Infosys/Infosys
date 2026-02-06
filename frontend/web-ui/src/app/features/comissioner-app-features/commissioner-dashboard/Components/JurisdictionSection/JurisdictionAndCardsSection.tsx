// JurisdictionAndCardsSection component displays the jurisdiction title and a list of status summary cards
// Used in the Commissioner's dashboard to show application status for different wards/zones

import React from "react";
import { Box, Typography } from "@mui/material";
import { useGetPropertyCountByZoneQuery } from "../../CommissionerDashBoardApi/commissionerDashboardApi";
import CardStatusSummary from "../Cards/CardStatusSummary";


// Interface for jurisdiction data structure
interface JurisdictionData {
  zoneLabel: string;
  pending: number;
  approved: number;
  rejected: number;
  percentage: number;
}

// Functional component for displaying jurisdiction section and status summary cards
const JurisdictionAndCardsSection: React.FC = () => {

  const userZones = ["Zone-1", "Zone-2", "Zone-3"];

  // Create queries for all zones
  const zoneQueries = userZones.map(zone => 
    useGetPropertyCountByZoneQuery({ zoneNo: zone })
  );

  // Transform API data into jurisdiction data
  const jurisdictionData: JurisdictionData[] = React.useMemo(() => {
    return userZones.map((zone, index) => {
      const { data, 
        // isLoading, 
        // error 
      } = zoneQueries[index];
      const totalItems = data?.totalItems || 0;
      
      // Calculate percentage based on actual data (you can adjust this logic)
      const percentage = totalItems > 0 ? Math.min(Math.round((totalItems / 100) * 70), 100) : 0;
      
      return {
        zoneLabel: zone,
        pending: totalItems,
        approved: 0, 
        rejected: 0, 
        percentage: percentage,
      };
    });
  }, [zoneQueries]);

  return (
    <Box>
      {/* Section title for jurisdiction */}
      <Box mb={2}>
        <Typography color="#c84c03" fontWeight={500} fontSize={20}>
          Jurisdiction
        </Typography>
      </Box>

      {/* List of CardStatusSummary components - mapped from data */}
      <Box display="flex" flexDirection="column" gap={2}
        sx={{
          overflowY: "auto",
          scrollbarWidth: "none", 
          maxHeight: '600px', 
        }}
      >
        {jurisdictionData.map((zone) => (
          <CardStatusSummary
            key={zone.zoneLabel}
            zoneLabel={zone.zoneLabel}
            pending={zone.pending}
            approved={zone.approved}
            rejected={zone.rejected}
            percentage={zone.percentage}
          />
        ))}
      </Box>
    </Box>
  );
};

export default JurisdictionAndCardsSection;