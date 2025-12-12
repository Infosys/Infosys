
/**
 * This component renders a property card in the application inbox.
 * It displays property details, agent info, priority, status, and action buttons for each application.
 */
import Box from '@mui/material/Box'
// import ApplicationInboxCheckBox from '../ApplicationInboxButtons/ApplicationInboxCheckBox'
import Typography from '@mui/material/Typography'
import ActionButton from '../ApplicationInboxButtons/ActionButton'
import TextButton from '../ApplicationInboxButtons/TextButton'
import {
  newPropertyButtonSx,
  highPriorityButtonSx,
  dueDateButtonSx,
  lowPriorityButtonSx,
  mediumPriorityButtonSx,
} from '../../styles/ApplicationInboxButtons/TextButtonStyle'
import {
  applicationInboxPropertyCardSx,
  propertyCardHeaderSx,
  propertyCardAgentInfoSx,
  propertyCardActionsSx,
} from '../../styles/ApplicationInboxPropertyCard/ApplicationInboxPropertyCardStyle'
import type {AllApplicationModel} from '../../models/getAllApplicationsModel' 


// Props for the ApplicationInboxPropertyCard component
interface ApplicationInboxPropertyCardProps {
  property: AllApplicationModel & { agentName?: string; agentUsername?: string };
}


// Functional component to render a property card with details and actions
const ApplicationInboxPropertyCard: React.FC<ApplicationInboxPropertyCardProps> = ({ property }) => {
  // Helper to get the correct style for the priority button
  const getPriorityButtonSx = (priority: string) => {
    if (priority === "LOW") return lowPriorityButtonSx;
    if (priority === "MEDIUM") return mediumPriorityButtonSx;
    return highPriorityButtonSx;
  };

  return (
    <Box sx={applicationInboxPropertyCardSx}>
      {/* Optionally render a checkbox for selection (currently commented out) */}
      {/* <Box>
        <ApplicationInboxCheckBox />
      </Box> */}

      <Box>
        <Box sx={propertyCardHeaderSx}>
          {/* Display the application number */}
          {/* <Typography>{property.Property.PropertyNo}</Typography> */}
          <Typography>{property.ApplicationNo}</Typography>
          {/* Show the priority and status as styled buttons */}
          <TextButton
            text={property.Priority}
            sx={getPriorityButtonSx(property.Priority)}
          />
          <TextButton text={property.Status ?? ""} sx={newPropertyButtonSx} />
        </Box>

        {/* Display property address and complex name */}
        <Typography fontSize={20} fontWeight={400} mb={1}>
          {property.Property.Address?.Locality
            ? `${property.Property.Address.Locality}, `
            : ""}
          {property.Property.ComplexName}
        </Typography>
        
        {/* Show agent info and ward/zone details */}
        <Box sx={propertyCardAgentInfoSx}>
          <Typography fontSize={16} fontWeight={400}>
            Agent: {property.agentName} <Box component="span" sx={{ fontStyle: 'italic', fontWeight: 300 }}>({property.agentUsername})</Box>
          </Typography>
          <Typography ml={3} fontSize={16} fontWeight={500}>
            {property.Property.Address?.WardNo ?? "No Ward"}
          </Typography>
          <Typography ml={3} fontSize={16} fontWeight={500}>
            {property.Property.Address?.ZoneNo ?? ""}
          </Typography>
        </Box>
        <Box>
          {/* Optionally display agent username (currently commented out) */}
          {/* <Typography fontSize={14} fontWeight={300} fontStyle={'italic'}>
            Username: {property.AgentUsername || "N/A"}
          </Typography> */}
        </Box>
      </Box>
      
      {/* Action buttons for due date and agent reassignment */}
      <Box sx={propertyCardActionsSx}>
        <TextButton text={`Due: ${property.DueDate ? property.DueDate.substring(0, 10) : "N/A"}`} sx={dueDateButtonSx} />
        <ActionButton assignedAgentId={property.AssignedAgent ?? undefined} selectedAction="Act" onActionChange={() => {}} applicationId={property.ID} ward={property.Property.Address?.WardNo ? property.Property.Address.WardNo : ""} />
      </Box>
    </Box>
  )
}


// Export the ApplicationInboxPropertyCard component as default
export default ApplicationInboxPropertyCard