// Service Home Page for the Service Manager role
// Handles sidebar navigation and renders dashboard, application inbox, search, map, and profile modal

import React from "react";
import { Container, Box } from "@mui/material";
import { serviceManagerPrimaryItems } from '../../components/Sidebar/sidebarConfig'
import * as HomePageStyle from "../../styles/HomePageStyle/HomePageStyle";
import ServiceManagerDashboard from "../../features/service-manager-app-features/service-manager-dashboard/components/ServiceManagerDashboard/ServiceManagerDashboard";
import ProfileModal from '../../components/profile-modal/components/ProfileModal';
import MapViewZones from '../map-pages/mapviewzones';
import { useSidebar } from "../../components/Sidebar/provider/SMSideBarProvider";
import ApplicationInbox from "../../features/service-manager-app-features/application-inbox/components/ApplicationInbox";
import SearchProperty from "../../features/service-manager-app-features/search-property/components/SearchProperty";
import AllApplications from "../../features/service-manager-app-features/all-applications/components/AllApplications";
import { Sidebar } from "../../components/Sidebar/SM_Sidebar";

// Main component for the Service Manager's home page
export const ServiceHomePage: React.FC = () => {
    // Sidebar and navigation state from context
    const {
        sideBarOpen,
        toggleSideBar,
        selectedNav,
        handleNavSelection,
        allApplicationsToggle,
        setAllApplicationsToggle,
        profileModalAnchor,
        setProfileModalAnchor
    } = useSidebar();

    // Handler to close the profile modal
    const handleCloseProfileModal = () => setProfileModalAnchor(null);

    // Render content based on selected navigation item
    const renderContent = () => {
        switch (selectedNav) {
            case 'dashboard':
                return <ServiceManagerDashboard />;
            case 'applicationInbox':
                return <ApplicationInbox />;
            case 'searchProperty':
                return <SearchProperty />;
            case 'allApplications':
                return <AllApplications />;
            case 'mapView':
                return <MapViewZones />
            default:
                return <ServiceManagerDashboard />;
        }
    };

    return (
        <>
            {/* Sidebar navigation for the service manager */}
            <Sidebar
                open={sideBarOpen}
                onToggle={toggleSideBar}
                selectedNav={selectedNav}
                onSelectNav={handleNavSelection}
                primaryItems={serviceManagerPrimaryItems}
                onProfileClick={setProfileModalAnchor}
                allApplicationsToggle={allApplicationsToggle}
                setAllApplicationsToggle={setAllApplicationsToggle}
            />
            {/* Main content area, adjusts width based on sidebar state */}
            <Container
                disableGutters
                component="main"
                maxWidth={false}
                sx={{
                    ...HomePageStyle.mainContainerStyle,
                    marginLeft: HomePageStyle.mainContainerStyle.marginLeft(sideBarOpen),
                    width: HomePageStyle.mainContainerStyle.width(sideBarOpen),
                }}
            >
                <Box
                    sx={{
                        ...HomePageStyle.renderingContent,
                        width: HomePageStyle.renderingContent.width(sideBarOpen),
                    }}
                >
                    {/* Renders the selected page content */}
                    {renderContent()}
                </Box>
            </Container>
            {/* Profile Modal anchored to the Profile button */}
            <ProfileModal
                anchorEl={profileModalAnchor}
                onClose={handleCloseProfileModal}
            />
        </>
    );
};