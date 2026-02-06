import React from 'react';
import { Box, Container } from '@mui/material';
import { AdminSidebar } from '../../components/Sidebar/Admin_Sidebar';
import { adminPrimaryItems } from '../../components/Sidebar/sidebarConfig';
import { useAdminSidebar } from '../../components/Sidebar/provider/AdminSidebarProvider';
import ProfileModal from '../../components/profile-modal/components/ProfileModal';
import { mainContainerStyle, renderingContent } from '../../styles/HomePageStyle/HomePageStyle';
import { AdminDashboard } from '../../features/it-admin-app-features/admin-dashboard/components/AdminDashboard';
import { UserManagement } from '../../features/it-admin-app-features/user-management/UserManagement';
import { DemandGeneration } from '../../features/it-admin-app-features/demand-generation/DemandGeneration';
import MapConfiguration from '../../features/it-admin-app-features/map-configuration/Components/MapConfiguration';
import NotificationManagement from '../../features/it-admin-app-features/notification-management/Components/NotificationManagement';
import { AccessControl } from '../../features/it-admin-app-features/access-control/AccessControl';
import UnderConstruction from '../../components/under-construction/UnderConstruction';

export const AdminHomePage: React.FC = () => {
  const {
    sideBarOpen,
    toggleSideBar,
    selectedNav,
    handleNavSelection,
    profileModalAnchor,
    setProfileModalAnchor,
  } = useAdminSidebar();

  const handleCloseProfileModal = () => setProfileModalAnchor(null);

  // Render content based on selected nav item
  const renderContent = () => {
    switch (selectedNav) {
      case 'dashboard':
        return <AdminDashboard onNavigate={handleNavSelection} />;
      case 'userManagement':
        return <UserManagement />;
      case 'demandGeneration':
        return <DemandGeneration />;
      case 'mapConfiguration':
        return <MapConfiguration />;
      case 'localization':
        return <UnderConstruction />;
      case 'accessControl':
        return <AccessControl />;
      case 'notificationManagement':
        return <NotificationManagement />;
      default:
        return <Box sx={{ p: 3 }}>Dashboard Content</Box>;
    }
  };

  return (
    <div>
      {/* Sidebar */}
      <AdminSidebar
        open={sideBarOpen}
        onToggle={toggleSideBar}
        selectedNav={selectedNav}
        onSelectNav={handleNavSelection}
        primaryItems={adminPrimaryItems}
        onProfileClick={setProfileModalAnchor}
        primaryColor="#A3C7D7"
        secondaryColor="#5191afff"
      />

      {/* Main Content Area */}
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
        {/* Content */}
        <Box
          sx={{
            ...renderingContent,
            width: renderingContent.width(sideBarOpen),
          }}
        >
          {renderContent()}
        </Box>
      </Container>
      <ProfileModal
        anchorEl={profileModalAnchor}
        onClose={handleCloseProfileModal}
      />
    </div>
  );
};
