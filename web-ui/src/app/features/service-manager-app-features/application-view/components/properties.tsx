/**
 * properties.tsx
 *
 * This file provides the main Properties page component for viewing and managing a single property application.
 * It displays property details, a map, and tabbed sections for documents, services, and change log.
 * The component fetches application data, manages UI state for actions (accept, assign, reassign), and renders dialogs for assignment.
 *
 * Features:
 * - Fetch and display property application data
 * - Show property map and details
 * - Tabbed navigation for property, documents, services, and change log
 * - Accept, assign, and reassign application actions with dialogs
 * - Handles loading and error states
 */
import React, { useState } from 'react';
import MapComponent from './Map_Component/MapComponent';
import SelectorTab from './SelectorTab/SelectorTab';
import { Box, Typography, Select, MenuItem, CircularProgress, Alert, Dialog, DialogContent } from '@mui/material';
import { JurisdictionDropdown } from '../../../../components/JurisdictionDropdown/JurisdictionDropdown';
import { jurisdictionDropdownStyles } from '../../../../styles/HomePageStyle/HomePageStyle';
import { loadingContainer } from '../../all-applications/styles/AllApplicationStyle';
import { useAcceptApplicationMutation, useGetApplicationByApplicationIdQuery } from '../api/applicationApi';
import ApplicationInboxReassignmentBox from '../../application-inbox/components/ApplicationInboxReassignmentBox/ApplicationInboxReassignmentBox';
import ApplicationInboxAssignmentBox from './Assign_Agent_Popup/assignmentPopup';

import {
  selectActionStyle,
  selectMenuPaperProps,
  mainContentStyle
} from '../Styles/propertiesStyle';

type TabType = 'property' | 'documents' | 'services' | 'change';


// Props for the Properties page component
interface PropertiesPageProps {
  propertyDetails?: boolean;
  applicationID: string;
  sideBarOpen?: boolean;
  setSelectedNav?: (nav: string) => void;
}


export const Properties: React.FC<PropertiesPageProps> = ({ applicationID }) => {
  // State for active tab, action dropdown, and dialog visibility
  const [activeTab, setActiveTab] = useState<TabType>('property');
  const [action, setAction] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);

  // Fetch data using RTK Query
  const { data: applicationData, error: apiError, isLoading: apiLoading } = useGetApplicationByApplicationIdQuery(applicationID);
  // console.log("Application data id :", applicationData?.data.ID);
  // console.log("Application data : ", applicationData);
  
  const [acceptApplication, { isLoading: acceptLoading }] = useAcceptApplicationMutation();
  const agentId = applicationData?.data.AssignedAgent;
  // console.log("Application data", applicationData);
  

  // Handler for accepting the application
  const handleAcceptApplication = async () => {
    if (applicationData?.data.Status === "VERIFIED") {
      console.log('Status is VERIFIED. Accept clicked for applicationId:', applicationID);
    }
    try {
      const response = await acceptApplication({
        applicationId: applicationID,
        approved: true,
        comments: 'audit verified application'
      }).unwrap();
      console.log('Accept API response:', response);
    } catch (err) {
      console.error('Accept action failed', err);
    }
    setAction("");
  };

  // Handler for tab change
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  type StatusKey = 'VERIFIED' | 'ASSIGNED' | 'REJECTED' | 'APPROVED' | 'AUDIT_VERIFIED' | 'INITIATED';

  const statusMap: Record<StatusKey, { label: string; color: string }> = {
    VERIFIED: { label: "Verified", color: "#14833B" },
    ASSIGNED: { label: "Assigned", color: "#e4b10bff" },
    REJECTED: { label: "Rejected", color: "#B71C1C" },
    APPROVED: { label: "Approved", color: "#1565C0" },
    AUDIT_VERIFIED: { label: "Audit Verified", color: "#00703C" },
    INITIATED: { label: "Initiated", color: "#f6cd38ff" },

  };

  const statusValue = applicationData?.data?.Status as StatusKey;
  const statusInfo = statusValue && statusMap[statusValue]
    ? statusMap[statusValue]
    : {
        label: statusValue ?? "Loading...",
        color: "#C84C0E"
      };

  if (apiLoading) {
    return (
      <Box sx={loadingContainer}>
        <CircularProgress size={60} sx={{ color: '#C84C0E' }} />
      </Box>
    );
  }

  // Show error alert if API call fails
  if (apiError) {
    const errorMessage =
      'status' in apiError
        ? `Error: ${apiError.status}`
        : apiError.message || 'Failed to load applications';
    return (
      <Box>
        <Alert severity="error">{errorMessage}</Alert>
      </Box>
    );
  }

  // Main page layout and content
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        color: '#0f172a',
        width: '100%',
        fontFamily: 'Roboto',
        bgcolor: '#E5E5E5',
      }}
    >
      <Box
        sx={{
          width: '100%',
          mx: 'auto',
          boxSizing: 'border-box',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'none',
          pl: 2,
          pr: 2
        }}
      >
        {/* Jurisdiction dropdown at the top */}
        <Box sx={jurisdictionDropdownStyles}>
          <JurisdictionDropdown backgroundColor="#F7E4DB" hoverBackgroundColor="#F0DED1" />
        </Box>

        {/* Main content area with property info, actions, map, and tabs */}
        <Box
          sx={mainContentStyle}
          className={`content${activeTab === 'property' ? '' : ' no-track'}`}
        >
          <Box sx={{ position: 'relative' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography sx={{ fontSize: 32, fontWeight: 700, ml: '3px', mt: '10px'}}>
                {applicationData?.data.Property.ComplexName ?? 'Loading...'} <br />
              </Typography>
              <Typography sx={{ fontSize: 18, fontWeight: 400, ml: '3px', mb: 1, color: '#000000ff' }}>
                {applicationData?.data.ApplicationNo?? 'Loading address...'}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb:0 }}>
              <Box
                sx={{
                  borderRadius: '20px',
                  background: statusInfo.color,
                  color: '#fff',
                  fontWeight: 500,
                  fontSize: 16,
                  px: 3,
                  py: 0.2,
                  width: 'fit-content',
                  display: 'inline-block',
                  // minWidth: 120,
                  textAlign: 'center',
                  letterSpacing: 1,
                  border: 'none',
                  fontFamily: 'Roboto'
                }}
              >
               {statusInfo.label}
              </Box>

              {/* Action dropdown for Accept, Assign, Reassign */}
              {applicationData?.data.Status !== "AUDIT_VERIFIED" && (
                <Select
                  value={action}
                  onChange={async e => {
                    const val = String(e.target.value);
                    setAction(val);
                    if (val === 'accept') {
                      await handleAcceptApplication();
                    } else if (val === 'reassign') {
                      setDialogOpen(true);
                      setAction("");
                    } else if (val === 'assign') {
                      setAssignDialogOpen(true);
                      setAction("");
                    }
                  }}
                  size="small"
                  sx={selectActionStyle}
                  displayEmpty
                  renderValue={selected =>
                    selected === ""
                      ? (
                        applicationData?.data.Status === "AUDIT_VERIFIED"
                          ? "Application Accepted"
                          : <em>Act on this Application</em>
                      )
                      : (
                        selected === "accept" ? "Accept" :
                          selected === "reassign" ? "Reassign" :
                            selected === "assign" ? "Assign" : selected
                      )
                  }
                  MenuProps={{
                    PaperProps: selectMenuPaperProps
                  }}
                  disabled={acceptLoading}
                >
                  {applicationData?.data.Status === "INITIATED" && (
                    <MenuItem value="assign">Assign</MenuItem>
                  )}
                  {applicationData?.data.Status === "VERIFIED" && [
                    <MenuItem value="accept" key="accept">Accept</MenuItem>,
                    <MenuItem value="reassign" key="reassign">Reassign</MenuItem>
                  ]}
                  {applicationData?.data.Status === "ASSIGNED" && (
                    <MenuItem value="reassign">Reassign</MenuItem>
                  )}
                </Select>
              )}
            </Box>

            {/* Dialog for reassigning application */}
            <Dialog
              open={dialogOpen}
              onClose={() => setDialogOpen(false)}
              PaperProps={{
                sx: {
                  minWidth: 500,
                  borderRadius: '20px',
                }
              }}
            >
              <DialogContent>
                <ApplicationInboxReassignmentBox
                  applicationId={applicationID}
                  assignedAgentId={agentId || ''}
                  ward={applicationData?.data.Property.Address.WardNo || ""}
                  onClose={() => setDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>

            {/* Dialog for assigning application */}
            <Dialog
              open={assignDialogOpen}
              onClose={() => setAssignDialogOpen(false)}
              PaperProps={{
                sx: {
                  minWidth: 500,
                  borderRadius: '20px',
                }
              }}
            >
              <DialogContent>
                <ApplicationInboxAssignmentBox
                  applicationId={applicationID}
                  onClose={() => setAssignDialogOpen(false)}
                  ward={applicationData?.data.Property.Address.WardNo || ""}
                />
              </DialogContent>
            </Dialog>

            {/* Property map component */}
            {applicationData?.data?.Property ? (
              <MapComponent application={applicationData.data.Property} applicationStatus={applicationData.data.Status} applicationID={applicationData.data.ID} />
            ) : (
              <Box sx={{ p: 2, textAlign: 'center' }}>Loading map...</Box>
            )}
            {/* Tabbed selector for property, documents, services, change log */}
            <SelectorTab activeTab={activeTab} onTabChange={handleTabChange} assesseeId={applicationData?.data.AssesseeID || ""} propertyId={applicationData?.data.ID || ""} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}