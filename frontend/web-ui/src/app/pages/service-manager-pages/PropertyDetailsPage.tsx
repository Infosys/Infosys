// Property Details Page for the Service Manager role
// Displays property details for a specific application, with sidebar navigation and profile modal

import { useParams } from "react-router-dom";
import { Container, Box } from "@mui/material";
import { serviceManagerPrimaryItems } from "../../components/Sidebar/sidebarConfig";
import ProfileModal from "../../components/profile-modal/components/ProfileModal";
import * as HomePageStyle from "../../styles/HomePageStyle/HomePageStyle";
import { useSidebar } from "../../components/Sidebar/provider/SMSideBarProvider";
import { Sidebar } from "../../components/Sidebar/SM_Sidebar";
import { Properties } from "../../features/service-manager-app-features/application-view/components/properties";

// Main component for the Service Manager's property details page
export const PropertyDetailsPage: React.FC = () => {
    // Get application ID from route parameters
    const { applicationID } = useParams<{ applicationID: string }>();
    
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
                    {/* Renders the property details for the selected application */}
                    <Properties applicationID={applicationID!}/>
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