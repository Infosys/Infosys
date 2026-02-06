
/**
 * This component renders a dialog box for reassigning an application to a new agent.
 * It allows the user to select a new agent, provide a reason, and optionally notify the agent via SMS.
 * The reassignment is submitted using a mutation hook.
 */
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ApplicationInboxReassignButton from "../ApplicationInboxButtons/ApplicationInboxReassignButton";
import ApplicationInboxToggleButton from "../ApplicationInboxButtons/ApplicationInboxToggleButton";
import {
  reassignmentBoxSx,
  titleSx,
  fieldLabelSx,
  agentFieldSx,
  reasonFieldSx,
  toggleRowSx,
} from "../../styles/ApplicationInboxReassignmentBox/ApplicationInboxReassignmentBoxStyle";
import { useGetAgentsQuery, useReassignApplicationMutation } from "../../api/getAndReassignAgentApi";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";


// Props for the ApplicationInboxReassignmentBox component
interface ApplicationInboxReassignmentBoxProps {
  ward: string;              // Ward identifier for the application
  applicationId: string;     // Application identifier
  onClose: () => void;       // Handler to close the dialog
  assignedAgentId?: string;  // (Optional) Currently assigned agent's ID
}


// Functional component to render the reassignment dialog box
const ApplicationInboxReassignmentBox = ({ ward, applicationId, onClose, assignedAgentId }: ApplicationInboxReassignmentBoxProps) => {
  // Fetch all agents for the ward (currently empty string, can be updated for filtering)
  const { data: agentsData, isLoading } = useGetAgentsQuery({ ward:ward });
  // State for selected agent, reason, and SMS notification toggle
  const [selectedAgent, setSelectedAgent] = useState("");
  const [reason, setReason] = useState("");
  const [notifySMS, setNotifySMS] = useState(false);

  // Exclude the currently assigned agent from the agent list
  const filteredAgents = (agentsData?.data.users || []).filter(
    agent => agent.id !== assignedAgentId
  );

  // Mutation hook for reassigning the application
  const [reassignApplication, { isLoading: isReassigning, isSuccess: isReassignSuccess }] = useReassignApplicationMutation();

  // Toggle the SMS notification state
  const handleNotifyChange = () => {
    setNotifySMS(!notifySMS);
  }

  // Handle the reassignment action
  const handleReassign = async () => {
    if (!selectedAgent || !reason) return;

    // Debug logs for agent selection (can be removed in production)
    console.log("filteredAgents:", filteredAgents.map(agent => ({
      id: agent.id,
      name: agent.profile.fullName
    })));
    console.log("AssignedAgentId (excluded):", assignedAgentId);

    await reassignApplication({
      applicationId,
      agentId: selectedAgent,
      comments: reason,
    });
    onClose();
    
    console.log("ReAssignment Status", isReassignSuccess);
  };

  return (
    <Box sx={reassignmentBoxSx}>
      <Typography sx={titleSx}>Reassignment Details</Typography>

      {/* Agent selection dropdown */}
      <Box mb={2}>
        <Typography sx={fieldLabelSx}>Select New Agent:</Typography>
        <TextField
          sx={agentFieldSx}
          select
          disabled={isLoading}
          value={selectedAgent}
          onChange={e => setSelectedAgent(e.target.value)}
        >
          {isLoading ?(
             <MenuItem disabled>Loading...</MenuItem>
          ) : filteredAgents.length === 0 ? (
    <MenuItem disabled>No agents available for the ward</MenuItem>
  )
          : filteredAgents.map(agent => (
                <MenuItem key={agent.id} value={agent.id}>
                  {agent.profile.fullName}
                </MenuItem>
              ))}
        </TextField>
      </Box>

      {/* Reason for reassignment input */}
      <Box>
        <Typography sx={fieldLabelSx}>Reason for Reassignment:</Typography>
        <TextField
          sx={reasonFieldSx}
          multiline
          minRows={3}
          value={reason}
          onChange={e => setReason(e.target.value)}
        />
      </Box>

      {/* Toggle for SMS notification to agent */}
      <Box sx={toggleRowSx}>
        <Typography sx={fieldLabelSx}>Notify Agent via SMS</Typography>
        <ApplicationInboxToggleButton
          checked={notifySMS}
          onChange={handleNotifyChange}
        />
      </Box>

      {/* Button to submit the reassignment */}
      <Box>
        <ApplicationInboxReassignButton
          disabled={!selectedAgent || !reason || isReassigning}
          onClick={handleReassign}
          text='Reassign Agent'
        />
      </Box>
    </Box>
  );
};


// Export the ApplicationInboxReassignmentBox component as default
export default ApplicationInboxReassignmentBox;