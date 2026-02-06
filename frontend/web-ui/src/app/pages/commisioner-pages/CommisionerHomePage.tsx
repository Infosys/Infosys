// Commissioner Home Page for the property tax web UI
// Handles sidebar navigation and renders dashboard, application inbox, search, and profile modal

import React from 'react';
import { Box, Container } from '@mui/material';
import { commissionerPrimaryItems } from '../../components/Sidebar/sidebarConfig';
import { mainContainerStyle, renderingContent } from "../../styles/HomePageStyle/HomePageStyle";
import ApplicationInbox from '../../features/service-manager-app-features/application-inbox/components/ApplicationInbox';
import SearchProperty from '../../features/service-manager-app-features/search-property/components/SearchProperty';
import AllApplications from '../../features/comissioner-app-features/commissioner-all-applications/components/AllApplications';
import { CommissionerSidebar } from '../../components/Sidebar/CM_Sidebar';
import { useCommissionerSidebar } from '../../components/Sidebar/provider/CMSideBarProvider';
import ProfileModal from '../../components/profile-modal/components/ProfileModal';
import CommissionerDashBoard from '../../features/comissioner-app-features/commissioner-dashboard/Components/Coms_DashBoardLayout';

export // Main content component for the Commissioner Home Page
const CommisionerHomePage: React.FC = () => {
  // Sidebar and navigation state from context
  const {
    sideBarOpen,
    toggleSideBar,
    selectedNav,
    handleNavSelection,
    allApplicationsToggle,
    setAllApplicationsToggle,
    profileModalAnchor,
    setProfileModalAnchor,
  } = useCommissionerSidebar();

  // Handler to close the profile modal
  const handleCloseProfileModal = () => setProfileModalAnchor(null);

  // Render content based on selected navigation item
  const renderContent = () => {
    switch (selectedNav) {
      case 'dashboard':
        return <CommissionerDashBoard />;
      case 'applicationApproval':
        return <ApplicationInbox />;
      case 'searchProperty':
        return <SearchProperty />;
      case 'allApplications':
        return <AllApplications />;
      default:
        return <div>Dashboard Content</div>;
    }
  };

  return (
    <div>
      {/* Sidebar navigation for the commissioner */}
      <CommissionerSidebar
        open={sideBarOpen}
        onToggle={toggleSideBar}
        selectedNav={selectedNav}
        onSelectNav={handleNavSelection}
        primaryItems={commissionerPrimaryItems}
        allApplicationsToggle={allApplicationsToggle}
        setAllApplicationsToggle={setAllApplicationsToggle}
        onProfileClick={setProfileModalAnchor}
      />

      {/* Main content area, adjusts width based on sidebar state */}
      <Container
        disableGutters
        component="main"
        maxWidth={false}
        sx={{
          ...mainContainerStyle,
          marginLeft: mainContainerStyle.marginLeft(sideBarOpen),
          width: mainContainerStyle.width(sideBarOpen),
        }}
      >
        {/* Renders the selected page content */}
        <Box
          sx={{
            ...renderingContent,
            width: renderingContent.width(sideBarOpen),
          }}
        >
          {renderContent()}
        </Box>
      </Container>
      {/* Profile modal for user account actions */}
      <ProfileModal
                anchorEl={profileModalAnchor}
                onClose={handleCloseProfileModal}
            />
    </div>
  );
};
