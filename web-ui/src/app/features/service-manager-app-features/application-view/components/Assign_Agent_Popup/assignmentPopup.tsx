
// This component provides a UI for reassigning an application to a different agent.
// It fetches available agents, allows the user to select one, and assigns the application via an API call.
// The component is used in the property details view for agent reassignment.
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import { agentFieldSx, fieldLabelSx, reassignmentBoxSx, titleSx} from "../../Styles/searchPropertyStyles/AssignmentBox";
import { useGetAgentsQuery,  } from "../../../application-inbox/api/getAndReassignAgentApi";
import { useAssignApplicationMutation } from "../../api/assignAgentApi";


// Props for the ApplicationAssignmentBox component
interface ApplicationInboxReassignmentBoxProps {
  ward: string; // Ward for which to fetch agents (not used in this instance)
  applicationId: string; // ID of the application to reassign
  onClose: () => void; // Function to close the popup
  assignedAgentId?: string; // ID of the currently assigned agent (to exclude from list)
}


const ApplicationAssignmentBox = ({ward,  applicationId, onClose, assignedAgentId }: ApplicationInboxReassignmentBoxProps) => {
  // Fetch the list of agents (for the given ward)
  const { data: agentsData, isLoading } = useGetAgentsQuery({ ward: ward });
  // State for the selected agent to assign
  const [selectedAgent, setSelectedAgent] = useState("");

  // Exclude the currently assigned agent from the dropdown
  const filteredAgents = (agentsData?.data.users || []).filter(
    agent => agent.id !== assignedAgentId
  );

  // Mutation for assigning the application to an agent
  const [assignApplication, { isLoading: isAssigning }] = useAssignApplicationMutation();

  // Handle the assign button click
  const handleAssign = async () => {
    if (!selectedAgent) return;

    await assignApplication({
      applicationId,
      agentId: selectedAgent,
      comments: "",
    });
    onClose();
  };


  return (
    <Box sx={reassignmentBoxSx}>
      {/* Title for the assignment popup */}
      <Typography sx={titleSx}>Assignment Details</Typography>

      {/* Dropdown to select a new agent */}
      <Box mb={2}>
        <Typography sx={fieldLabelSx}>Select Agent:</Typography>
        <TextField
          sx={agentFieldSx}
          select
          disabled={isLoading}
          value={selectedAgent}
          onChange={e => setSelectedAgent(e.target.value)}
        >
          {isLoading
            ? <MenuItem disabled>Loading...</MenuItem>
            : filteredAgents.map(agent => (
                <MenuItem key={agent.id} value={agent.id}>
                  {agent.profile.fullName}
                </MenuItem>
              ))}
        </TextField>
      </Box>

      {/* Assign button to confirm reassignment */}
      <Box>
        <Button
          variant="contained"
          sx={{
            bgcolor: "#C84C0E",
            color: "#fff",
            px: 4,
            py: 1,
            borderRadius: 2,
            fontWeight: 600,
            fontSize: 16,
            mt: 2,
            textTransform: "none",
            '&:hover': { bgcolor: "#a63a0b" }
          }}
          disabled={!selectedAgent || isAssigning}
          onClick={handleAssign}
        >
          Assign
        </Button>
      </Box>
    </Box>
  );
};


// Export the assignment popup component for use in parent components
export default ApplicationAssignmentBox;