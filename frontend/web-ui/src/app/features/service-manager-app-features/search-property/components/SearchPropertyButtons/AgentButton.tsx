// This file defines the AgentButton component, which displays an agent's name and username in a styled button.
import React from "react";
import { Button, Box } from "@mui/material";
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import { agentButtonSx, agentIconSx } from "../../styles/SearchPropertyButtons/AgentButtonStyle";

// Props for the AgentButton component
interface AgentButtonProps {
  agentName: string;
  agentUsername: string;
}

// Functional component for displaying an agent as a button with name and username
const AgentButton: React.FC<AgentButtonProps> = ({ agentName, agentUsername }) => (
  <Button
    variant="outlined"
    startIcon={<AssignmentIndOutlinedIcon sx={agentIconSx} />}
    sx={agentButtonSx}
  >
  <Box component="span">
    {agentName}
    {agentUsername && (
      <Box component="span" sx={{ fontStyle: 'italic', fontWeight: 300 }}>
        {" "}({agentUsername})
      </Box>
    )}
  </Box>
  </Button>
);

// Export the AgentButton component as default
export default AgentButton;