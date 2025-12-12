
// Card component to display agent details and their assigned cases
// Used in the Service Manager Dashboard to show agent info, availability, and case count


import React from 'react';
import { Box, Typography } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import type { AgentModel } from '../../models/ServiceManagerDashboard/Agent_Model';
import { useGetAllApplicationsByAgentIdQuery } from '../../api/dashboardApi';


// Props for the AgentCard component
interface AgentCardProps {
  agent: AgentModel; // Agent data to display
  onClick?: (agent: AgentModel) => void; // Optional click handler for the card
  onAssign?: (agent: AgentModel) => void; // (Unused) Optional handler to assign agent
  showActions?: boolean; // (Unused) Whether to show action buttons
  // totalCases?: number;
}

// AgentCard component definition
export const AgentCard: React.FC<AgentCardProps> = ({
  agent,
  onClick,
}) => {
  // Style constants for card appearance
  const BORDER_COLOR = "#D4D4D4";
  const ONLINE_COLOR = "#E5FFDE";
  const CASE_BG = "#E4E4E5";
  const ONLINE_TXT_COLOR = "#00703C";
  const OFFLINE_TXT_COLOR = "#A80000";

  // Fetch all applications assigned to this agent
  const {data: applicationsByAgent,
    // isLoading: applicationsByAgentLoading,
    // error: applicationsByAgentError
    } = useGetAllApplicationsByAgentIdQuery({ agent_id: agent.id });
  
  // Calculate total number of cases assigned to the agent
  let totalCases = applicationsByAgent?.data.length || 0;
  

  // Determine agent's availability status
  const isAvailable = agent.isActive === true;
  const availabilityText = isAvailable ? "Available" : "Not available";

// Helper function to display wards as a comma-separated string
const getWardsDisplay = (wards: string | string[] | undefined) => {
  if (!wards) return 'N/A';
  
  // If it's already an array
  if (Array.isArray(wards)) {
    return wards.join(', ');
  }
  
  // If it's a string, split and format
  if (typeof wards === 'string') {
    return wards
      .split('Ward-')
      .filter(Boolean)
      .map(w => `Ward-${w}`)
      .join(', ');
  }
  
  return 'N/A';
}

  return (
    <Box
      onClick={() => onClick?.(agent)}
      sx={{
        border: `1.5px solid ${BORDER_COLOR}`,
        borderRadius: '18px',
        background: "#fff",
        display: 'flex',
        flexDirection: 'column',
        p: 2.5,
        my: 1.5,
        boxSizing: 'border-box',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'box-shadow 0.2s',
        "&:hover": {
          boxShadow: onClick ? "0 4px 12px rgba(0,0,0,0.06)" : undefined,
        },
      }}
    >
      {/* Header row: Icon + Name + Availability */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.3 }}>
          <PersonOutlineIcon sx={{ fontSize: 32, color: "#222" }} />
          <Box>
            {/* Agent's full name */}
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: 14,
                color: "#222",
                fontFamily: "Roboto, sans-serif",
              }}>
              {agent.profile.firstName} {agent.profile.lastName}
            </Typography>
            {/* Wards assigned to the agent */}
            <Typography
              sx={{
                fontSize: '12px',
                color: "#222",
                fontFamily: "Roboto, sans-serif",
                mt: 0.3,
              }}>
              <b>Wards:</b> {getWardsDisplay(agent.zoneData?.flatMap(z => z.wards))}
            </Typography>
          </Box>
        </Box>
        {/* Availability status */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography
            sx={{
              color: isAvailable ? ONLINE_TXT_COLOR : OFFLINE_TXT_COLOR,
              fontWeight: 400,
              fontSize: 12,
              fontFamily: "Roboto, sans-serif",
            }}
          >
            {availabilityText}
          </Typography>
          {isAvailable && (
            <CheckCircleOutlineIcon sx={{ fontSize: 12, color: ONLINE_COLOR, ml: 0.3 }} />
          )}
        </Box>
      </Box>

      {/* Cases Row & Status */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mt: 0.5 }}>
        {/* Case count chip: shows total cases assigned to the agent */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: 2,
            py: 0.6,
            background: CASE_BG,
            color: "#222",
            borderRadius: "13px",
            fontWeight: 600,
            fontSize: 16,
            fontFamily: "Roboto, sans-serif",
            gap: 1,
          }}
        >
          <AssignmentIndOutlinedIcon sx={{ fontSize: 15, color: "#444" }} />
          <Typography sx={{ fontWeight: 700, fontSize: 12, fontFamily: "Roboto, sans-serif" }}>
            {totalCases + ` `} 
            total cases
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};