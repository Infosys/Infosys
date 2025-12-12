// Card component to display property application details in the Service Manager Dashboard
// Shows property info, application number, due date, priority, assigned agent, and allows agent assignment


import React, { useMemo, useState } from 'react';
import { Box, Typography, Button, Chip } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { type AllApplicationModel } from '../../models/ServiceManagerDashboard/PropertyApplicationModel';
import propertyIcon from '../../assets/application_icon.svg';
import { useNavigate } from 'react-router-dom';
import ApplicationInboxAssignmentModal from '../../../assign-agent-to-application/components/ApplicationInboxAssignmentModal';
// import { useReassignApplicationMutation } from '../../../assign-agent-to-application/api/assignAgentApi';


// Props for the ApplicationCard component
interface ApplicationCardProps {
  application: AllApplicationModel; // Application data to display
  onClick?: (application: AllApplicationModel) => void; // Optional click handler for the card
  onViewLocation?: (application: AllApplicationModel) => void; // Optional handler to view property location
  onAssignAgent?: (application: AllApplicationModel) => void; // Optional handler to assign agent
  // showActions?: boolean;
  agentsData?: {
    data?: {
      users?: Array<{ id: string; profile?: { fullName?: string }; username?: string }>
    }
  };
}

// ApplicationCard component definition
export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  agentsData,
}) => {
  // Style constants for card appearance
  const PRIMARY_ORANGE = "#C84C0E";
  const BORDER_COLOR = "#D4D4D4";
  const VIEW_LOCATION_BG = "#FCEDE3";
  const PRIORITY_BG: Record<string, string> = {
    HIGH: "#FFDADA",
    MEDIUM: "#F6F2CF",
    LOW: "#B4D0AC",
  };

    const getStatusColor = (status: string): { bgColor: string; textColor: string; borderColor: string } => {
    switch (status.toLowerCase()) {
      case 'assigned':
        return { bgColor: '#FFF3CD', textColor: '#856404', borderColor: '#FFC107' };
      case 'verified':
        return { bgColor: '#D1E7DD', textColor: '#0F5132', borderColor: '#4CAF50' };
      case 'audit_verified':
        return { bgColor: '#D1ECF1', textColor: '#0C5460', borderColor: '#2196F3' };
      case 'rejected':
        return { bgColor: '#F8D7DA', textColor: '#721C24', borderColor: '#F44336' };
      case 'approved':
        return { bgColor: '#D1E7DD', textColor: '#0F5132', borderColor: '#4CAF50' };
      case 'initiated':
        return { bgColor: '#E2E3E5', textColor: '#383D41', borderColor: '#9E9E9E' };
      default:
        return { bgColor: '#E2E3E5', textColor: '#383D41', borderColor: '#9E9E9E' };
    }
  };

  let applicationStatus = application.Status || '';
  if (applicationStatus.toLowerCase() === 'assigned') {
    applicationStatus = 'Assigned';
  } else if (applicationStatus.toLowerCase() === 'verified') {
    applicationStatus = 'Verified';
  } else if (applicationStatus.toLowerCase() === 'audit_verified') {
    applicationStatus = 'Audit Verified';
  } else if (applicationStatus.toLowerCase() === 'rejected') {
    applicationStatus = 'Rejected';
  } else if (applicationStatus.toLowerCase() === 'approved') {
    applicationStatus = 'Approved';
  } else if (applicationStatus.toLowerCase() === 'initiated') {
    applicationStatus = 'Initiated';
  }

  const statusColors = getStatusColor(application.Status || '');

  // Memoize agent id to full name mapping for quick lookup
  const agentIdToName = useMemo(() => {
    const map: Record<string, string> = {};
    if (agentsData?.data?.users) {
      agentsData.data.users.forEach(agent => {
        map[agent.id] = agent.profile?.fullName || "N/A";
      });
    }
    return map;
  }, [agentsData]);

  // Get the assigned agent's name for this application
  const AgentName = application.AssignedAgent
    ? agentIdToName[application.AssignedAgent] || 'Unassigned'
    : 'Unassigned';

  // Flag to check if the application is assigned to an agent
  const isAssigned = AgentName !== 'Unassigned';

  // State to control the assignment modal
  const [assignModalOpen, setAssignModalOpen] = useState(false);

  // Navigation hook for routing to property details
  const navigate = useNavigate();
  const handlePropertyCardClick = (applicationID: string) => {
  // Navigate to the property details page for this application
  navigate(`/service-manager/property-details/${applicationID}`);
  };

  // Format the due date for display
  function formatDueDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate();
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    let hours = date.getHours();
    let mins = date.getMinutes();

    // Add leading zeros if needed
    const hourStr = hours < 10 ? `0${hours}` : hours;
    const minStr = mins < 10 ? `0${mins}` : mins;

    return `${day} ${month} ${year} ${hourStr}:${minStr}`;
  }

  return (
    <Box
      sx={{
        border: `1.5px solid ${BORDER_COLOR}`,
        borderRadius: '18px',
        background: "#fff",
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        p: 2.5,
        minHeight: 95,
        width: '100%',
        mb: 2,
        boxSizing: 'border-box',
        // cursor: onClick ? 'pointer' : 'default',
        transition: 'box-shadow 0.2s',
        "&:hover": {
          // boxShadow: onClick ? "0 4px 12px rgba(0,0,0,0.06)" : undefined,
        },
      }}
    >
      {/* Left: Icon and Details */}
      <Box onClick={() => handlePropertyCardClick(application.ID)}
        sx={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'start', alignItems: 'flex-start' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'start', mb: 0.2 }}>
          {/* Property icon */}
          <Box
            component="img"
            src={propertyIcon}
            alt="Property Icon"
            sx={{
              width: 20,
              height: 20,
              color: "#282828",
              mr: 1.5,
              mt: 0.8
            }}
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
            {/* Property complex name */}
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: 18,
                color: "#444",
                fontFamily: "Roboto, sans-serif",
                mb: 0.2,
              }}
            >
              {application.Property.ComplexName}
            </Typography>
            {/* Application number */}
            <Typography
              sx={{
                fontFamily: "Roboto, sans-serif",
                color: "#282828",
                fontSize: 15,
                fontWeight: 400,
                mb: 1.4,
              }}
            >
              {application.ApplicationNo}
            </Typography>
            {/* View Location button (currently does nothing) */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button
                startIcon={<OpenInNewIcon sx={{ fontSize: 10, color: "#B16C3B" }} />}
                onClick={
                  // e => {
                  // e.stopPropagation();
                  // if (onViewLocation) {
                  //   onViewLocation(application);
                  // } else {
                  //   window.open(application.getLocationUrl(), '_blank');
                  // }}
                  () => { }
                }
                sx={{
                  background: VIEW_LOCATION_BG,
                  color: "#222",
                  fontWeight: 500,
                  borderRadius: "20px",
                  textTransform: "none",
                  fontFamily: "Roboto, sans-serif",
                  fontSize: 12,
                  minWidth: 0,
                  px: 2,
                  // py: "7px",
                  boxShadow: "none",
                  mr: 0.5,
                  '&:hover': {
                    background: "#F6DBC7",
                    boxShadow: "none",
                  },
                }}
              >
                View Location
              </Button>
            </Box>
          </Box>

        </Box>


      </Box>

      {/* Right: Status, Date and Actions */}
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        minWidth: 180,
        pl: 2,
      }}>
        {/* Date and Priority */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', mb: 2 }}>
          {/* Due date of the application */}
          <Typography sx={{
            color: "#222",
            fontSize: 13,
            fontFamily: "Roboto, sans-serif",
            fontWeight: 400,
            mb: 0.8,
          }}>
            {formatDueDate(application.DueDate)}
          </Typography>
          {/* Priority chip */}
          <Box
            sx={{
              px: 1.5,
              py: 0.4,
              background: PRIORITY_BG[application.Priority] || '#b8b8b8ff',
              borderRadius: "7px",
              fontWeight: 600,
              fontSize: 12,
              fontFamily: "Roboto, sans-serif",
              color: "#000000ff",
              boxShadow: "none",
              textAlign: "center",
              display: "inline-block",
            }}
          >
            {application.Priority}
          </Box>
        </Box>

        {/* Assign/Reassign Agent button */}
        {(application.Status === 'ASSIGNED' || application.Status === 'INITIATED') ? (
          <Button
          onClick={
            e => {
              e.stopPropagation();
              setAssignModalOpen(true)
            }
          }
          variant="contained"
          disableElevation
          sx={{
            
            background: PRIMARY_ORANGE,
            color: "#fff",
            fontFamily: "Roboto, sans-serif",
            fontWeight: 600,
            fontSize: 12,
            borderRadius: "11px",
            textTransform: "none",
            boxShadow: "none",
            px: 3,
            py: 0.5,
            '&:hover': { background: PRIMARY_ORANGE },
          }}
        >
          {isAssigned ? 'Reassign Agent' : 'Assign Agent'}
        </Button>
        ) : (
          <Chip
              label={application.Status}
              sx={{
                borderRadius: '10px',
                height: '30px',
                px: 2.2,
                backgroundColor: statusColors.bgColor,
                border: `1px solid ${statusColors.borderColor}`,
                color: statusColors.textColor,
                fontFamily: 'Roboto, sans-serif',
                fontSize: '12px',
                fontWeight: 500,
                '& .MuiChip-label': {
                  padding: '0 8px',
                }
              }}
            />

        )}
      </Box>
      {/* Modal for assigning agent to the application */}
      <ApplicationInboxAssignmentModal
        open={assignModalOpen}
        ward={application.Property.Address.WardNo}
        applicationId={application.ID}
        assignedAgentName={AgentName}
        assignedAgentId = {application.AssignedAgent}
        onClose={() => setAssignModalOpen(false)}
        isAssigned={isAssigned}
      />
    </Box>
  );
};