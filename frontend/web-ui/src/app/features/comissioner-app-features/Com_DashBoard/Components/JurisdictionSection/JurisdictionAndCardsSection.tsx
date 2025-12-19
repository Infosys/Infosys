// JurisdictionAndCardsSection component displays the jurisdiction title and a list of status summary cards
// Used in the Commissioner's dashboard to show application status for different wards/zones

import React from "react";
import { Box, Typography } from "@mui/material";
import CardStatusSummary from "../Cards/CardStatusSummary";

// Functional component for displaying jurisdiction section and status summary cards
const JurisdictionAndCardsSection: React.FC = () => {

  return (
    // Main container for the section
    <Box>
      {/* Section title for jurisdiction */}
      <Box mb={2}>
        <Typography color="#c84c03" fontWeight={500} fontSize={20}>
          Jurisdiction
        </Typography>
      </Box>
     
      {/* List of CardStatusSummary components for each ward/zone */}
      <Box display="flex" flexDirection="column" gap={2}>
        <CardStatusSummary
  wardLabel="Ward 12 - Zone 3"
  pending={5}
  approved={19}
  rejected={3}
/>

<CardStatusSummary
  wardLabel="Ward 12 - Zone 3"
  pending={5}
  approved={19}
  rejected={3}
/>

<CardStatusSummary
  wardLabel="Ward 12 - Zone 3"
  pending={5}
  approved={19}
  rejected={3}
/>
      </Box>
    </Box>
  );
};

export default JurisdictionAndCardsSection;