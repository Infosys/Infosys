import React, { useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
} from '@mui/material';
import MapsHomeWorkOutlinedIcon from '@mui/icons-material/MapsHomeWorkOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import type { AllApplicationModel } from '../models/PropertyApplicationModel';
import { useNavigate } from 'react-router-dom';
import { PriorityModal } from '../../priority-modal/components/PriorityModal';
import {
  cardContainer,
  cardLeftSection,
  cardRightSection,
  propertyHeader,
  propertyTitle,
  propertyId,
  infoIcon,
  addressText,
  tagsContainer,
  tagChip,
  actionsContainer,
  priorityButton,
  assignButton,
  imagesSection,
  mapBox,
  coloredTagChip,
} from '../styles/ApplicationCardStyle';
import { ApplicationInboxAssignmentModal } from '../../assign-agent-to-application/components/ApplicationInboxAssignmentModal';
import { MapLibreMap } from './ApplicationCardMapComponent';
import documentIcon from '../../service-manager-dashboard/assets/application_icon.svg';


interface ApplicationCardProps {
  application: AllApplicationModel;
  onSetPriority?: (id: string) => void;
  agentsData?: {
    data?: {
      users?: Array<{ id: string; profile?: { fullName?: string }; username?: string }>
    }
  };
}


export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  onSetPriority,
  agentsData,
}) => {
  const [priorityModalOpen, setPriorityModalOpen] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState(application.Priority || "High");
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const navigate = useNavigate();

  const agentIdToName = useMemo(() => {
    const map: Record<string, string> = {};
    if (agentsData?.data?.users) {
      agentsData.data.users.forEach(agent => {
        map[agent.id] = agent.profile?.fullName || "N/A";
      });
    }
    return map;
  }, [agentsData]);

  const AgentName = application.AssignedAgent
    ? agentIdToName[application.AssignedAgent] || 'Unassigned'
    : 'Unassigned';

  const isAssigned = AgentName !== 'Unassigned';

  const handlePriorityConfirm = (newPriority: string) => {
    setSelectedPriority(newPriority);
    if (onSetPriority) onSetPriority(application.ID);
  };

  const getBGColorForPriority = (priority: string): string => {
  switch (priority.toLowerCase()) {
    case 'high': return '#A30202B3'; 
    case 'medium': return '#A5940073'; 
    case 'low': return '#00703C73'; 
    default: return '#E2E3E5';
  }
};

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'numeric',
      year: 'numeric',
    });
    return `Due: ` + formattedDate.replace(/\//g, '-');
  };

  const getFullAddress = (): string => {
    if (application.Property.Address) {
      const addr = application.Property.Address;
      const zoneNo = application.Property.Address.ZoneNo;
      const parts = [addr.Street, addr.Locality, addr.WardNo, zoneNo].filter(Boolean);
      return parts.length > 0 ? parts.join(' \u2022 ') : 'Address not available';
    }
    return application.Property.ComplexName || 'Address not available';
  };

  const DEFAULT_BANGALORE_LAT = 12.9141;
  const DEFAULT_BANGALORE_LNG = 77.6387;

  const mapCoordinates = useMemo(() => {
    const gisData = application.Property.GISData;
    let lat = gisData?.Latitude ?? 0;
    let lng = gisData?.Longitude ?? 0;
    
    if ((lat === 0 || lng === 0) && gisData?.Coordinates?.[0]) {
      lat = gisData.Coordinates[0].Latitude ?? 0;
      lng = gisData.Coordinates[0].Longitude ?? 0;
    }
    
    const finalLat = lat !== 0 && !isNaN(lat) && isFinite(lat) ? lat : DEFAULT_BANGALORE_LAT;
    const finalLng = lng !== 0 && !isNaN(lng) && isFinite(lng) ? lng : DEFAULT_BANGALORE_LNG;
    
    return { lat: finalLat, lng: finalLng };
  }, [application.Property.GISData]);

  const handlePropertyCardClick = (applicationID: string) => {
    navigate(`/service-manager/property-details/${applicationID}`);
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

  return (
    <Box sx={cardContainer}>
      <Box sx={cardLeftSection} onClick={() => handlePropertyCardClick(application.ID)}>
        <Box sx={propertyHeader}>
          <img src={documentIcon} alt="Application Icon" style={{ width: 20, height: 20, marginTop: '4px', marginLeft: '8px' }} />
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography sx={propertyTitle}>
                {application.Property.ComplexName || 'N/A'}
              </Typography>
              <Chip
                label={formatDate(application.DueDate)}
                sx={coloredTagChip(application.Priority ? getBGColorForPriority(application.Priority) : '#E2E3E5')}
              />
              <InfoOutlinedIcon sx={infoIcon} />
            </Box>
            <Typography sx={propertyId}>
              {application.ApplicationNo}
            </Typography>
            <Typography sx={addressText}>
              {getFullAddress()}
            </Typography>
            <Box sx={tagsContainer}>
              <Chip
                icon={<MapsHomeWorkOutlinedIcon sx={{ fontSize: 13, color: '#222' }} />}
                label={application.Property.PropertyType}
                sx={tagChip}
              />
              <Chip
                icon={<DescriptionOutlinedIcon sx={{ fontSize: 13, color: '#222' }} />}
                label={application.Property.OwnershipType}
                sx={tagChip}
              />
              <Chip
                label={`Priority: ${application.Priority}`}
                sx={tagChip}
              />
              <Chip
                label={AgentName}
                sx={tagChip}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={cardRightSection}>
        <Box sx={actionsContainer}>
          <Button
            variant="contained"
            sx={priorityButton(application.Priority || '')}
            onClick={e => {
              e.stopPropagation();
              setPriorityModalOpen(true);
            }}
          >
            {(!application.Priority || application.Priority === '' || application.Priority === null) ? 'Set Priority' : `Change Priority`}
          </Button>

          {isAssigned ? (
            <Chip
              label={applicationStatus}
              sx={{
                minWidth: '125px',
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
          ) : (
            <Button
              onClick={e => {
                e.stopPropagation();
                setAssignModalOpen(true);
              }}
              variant="contained"
              sx={assignButton}
            >
              Assign Agent
            </Button>
          )}
        </Box>

        <Box sx={imagesSection}>
          <Box sx={mapBox}>
            <MapLibreMap
              latitude={mapCoordinates.lat}
              longitude={mapCoordinates.lng}
              zoom={15}
              width="96px"
              height="74px"
              borderRadius="8px"
            />
          </Box>
        </Box>
      </Box>

      <PriorityModal
        applicationID={application.ID}
        open={priorityModalOpen}
        onClose={() => setPriorityModalOpen(false)}
        onConfirm={handlePriorityConfirm}
        defaultValue={selectedPriority}
      />
      <ApplicationInboxAssignmentModal
        open={assignModalOpen}
        ward={application.Property.Address?.WardNo || ""}
        applicationId={application.ID}
        assignedAgentId={application.AssignedAgent}
        onClose={() => setAssignModalOpen(false)}
        isAssigned={isAssigned}
      />
    </Box>
  );
};