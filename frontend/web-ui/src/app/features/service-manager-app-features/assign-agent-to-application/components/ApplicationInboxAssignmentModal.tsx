// ApplicationInboxAssignmentModal component allows assigning or reassigning an agent to an application.
// It displays a modal dialog with agent selection, reason input, SMS notification toggle, and an action button.
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import { useGetAgentsQuery } from "../../application-inbox/api/getAndReassignAgentApi";
import {
  agentFieldSx,
  fieldLabelSx,
  reasonFieldSx,
  reassignmentBoxSx,
  titleSx,
  toggleRowSx,
  modalBoxSx,
} from "../styles/AssignAgentBoxStyle";
import ApplicationInboxToggleButton from "../../application-inbox/components/ApplicationInboxButtons/ApplicationInboxToggleButton";
import ApplicationInboxReassignButton from "../../application-inbox/components/ApplicationInboxButtons/ApplicationInboxReassignButton";
import { useAssignApplicationMutation, useReassignApplicationMutation } from "../api/assignAgentApi";

// Props for the ApplicationInboxAssignmentModal component
interface ApplicationInboxAssignmentModalProps {
  open: boolean;
  ward?: string;
  applicationId: string;
  onClose: () => void;
  assignedAgentId?: string | null;
  isAssigned?: boolean;
  assignedAgentName?: string;
}

// Main functional component for the assignment/reassignment modal
export const ApplicationInboxAssignmentModal = ({
  open,
  applicationId,
  onClose,
  assignedAgentId,
  isAssigned,
  ward,
  // assignedAgentName
}: ApplicationInboxAssignmentModalProps) => {
  const { data: agentsData, isLoading } = useGetAgentsQuery({ ward: ward || "" });
  // Fetch agents data for the dropdown (empty ward fetches all)
  const [selectedAgent, setSelectedAgent] = useState("");
  const [reason, setReason] = useState("");
  const [notifySMS, setNotifySMS] = useState(false);

  // State for selected agent, reason input, and SMS notification toggle
  const filteredAgents = (agentsData?.data.users || []).filter(
    (agent) => agent.id !== assignedAgentId
  );

  // RTK Query mutation hook for reassigning an application
  const [reassignApplication, { isLoading: isReassigning }] =
    useReassignApplicationMutation();

  // Handler for reassigning the application to a new agent
  const handleReassign = async () => {
    if (!selectedAgent || (assignedAgentId && !reason)) return;

    try {
      await reassignApplication({
        applicationId,
        agentId: selectedAgent,
        comments: reason,
        // notifySMS,
      });
      onClose();
    } catch (error) {
      console.error("Reassignment failed:", error);
    }
  };

  // RTK Query mutation hook for assigning an application
  const [assignApplication, {isLoading: isAssigning}] = useAssignApplicationMutation();

  // Handler for assigning the application to an agent
  const handleAssign = async () => {
    if (!selectedAgent) return;

    try {
      await assignApplication({
        applicationId,
        agentId: selectedAgent,
        comments: reason,
        // notifySMS,
      });
      onClose();
    } catch (error) {
      console.error("Assignment failed:", error);
    }
  };

  // Determine if the modal is for reassignment (already assigned) or initial assignment
  const isReassignment = !!isAssigned;

  // Render the modal dialog with agent selection, reason input, SMS toggle, and action button
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="assign-agent-modal-title"
      aria-describedby="assign-agent-modal-description"
    >
      <Box sx={modalBoxSx}>
        <Box sx={reassignmentBoxSx}>
          <Typography sx={titleSx} id="assign-agent-modal-title">
            {isReassignment ? "Reassignment Details" : "Assignment Details"}
          </Typography>

          {/* Agent Selection */}
          <Box mb={2}>
            <Typography sx={fieldLabelSx}>
              {isReassignment ? "Select New Agent:" : "Select Agent:"}
            </Typography>
            <TextField
              sx={agentFieldSx}
              select
              disabled={isLoading}
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              placeholder="Choose an agent"
            >
              {isLoading ? (
                <MenuItem disabled>Loading agents...</MenuItem>
              ) : filteredAgents.length === 0 ? (
                <MenuItem disabled>No agents available for the ward</MenuItem>
              ) : (
                filteredAgents.map((agent) => (
                  <MenuItem key={agent.id} value={agent.id}>
                    {agent.profile?.fullName || agent.username}
                  </MenuItem>
                ))
              )}
            </TextField>
          </Box>

          {/* Reason Field */}
          <Box mb={2}>
            <Typography sx={fieldLabelSx}>
              {isReassignment
                ? "Reason for Reassignment:"
                : "Assignment Notes (Optional):"}
            </Typography>
            <TextField
              sx={reasonFieldSx}
              multiline
              minRows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={
                isReassignment
                  ? "Enter reason for reassignment..."
                  : "Add any notes for the agent..."
              }
            />
          </Box>

          {/* Notify SMS Toggle */}
          <Box sx={toggleRowSx} mb={3}>
            <Typography sx={fieldLabelSx}>Notify Agent via SMS</Typography>
            <ApplicationInboxToggleButton
              checked={notifySMS}
              onChange={(val: boolean) => setNotifySMS(val)}
            />
          </Box>

          {/* Action Button */}
          <Box>
            <ApplicationInboxReassignButton
              disabled={
                !selectedAgent ||
                (isReassignment ? !reason : false) ||
                (isReassignment ? isReassigning : isAssigning)
              }
              onClick={isReassignment ? handleReassign : handleAssign}
              text={isReassignment ? "Reassign Agent" : "Assign Agent"}
            />
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default ApplicationInboxAssignmentModal;