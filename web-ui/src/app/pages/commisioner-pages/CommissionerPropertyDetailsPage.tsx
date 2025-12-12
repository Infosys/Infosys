// Commissioner Property Details Page for viewing details of a specific property application
// Includes sidebar navigation, property details, and profile modal

import { commissionerPrimaryItems } from "../../components/Sidebar/sidebarConfig";
import { Box, Container } from "@mui/material";
import { mainContainerStyle, renderingContent } from "../../styles/HomePageStyle/HomePageStyle";
import ProfileModal from "../../components/profile-modal/components/ProfileModal";
import { useParams } from "react-router-dom";
import { CommissionerProperties } from "../../features/comissioner-app-features/property-approval/components/properties";
import { CommissionerSidebar } from "../../components/Sidebar/CM_Sidebar";
import { useCommissionerSidebar } from "../../components/Sidebar/provider/CMSideBarProvider";

// Props for the property details page (optional propertyId)
interface PropertyDetailsPageProps {
    propertyId?: string;
}

// Main component for the Commissioner Property Details Page
export const CommissionerPropertyDetailsPage: React.FC<PropertyDetailsPageProps> = () => {

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

    // Get application ID from route parameters
    const { applicationID } = useParams<{ applicationID: string }>();

    return (
        <div>
            {/* Sidebar navigation for the commissioner */}
            <CommissionerSidebar
                open={sideBarOpen}
                onToggle={toggleSideBar}
                selectedNav={selectedNav}
                onSelectNav={handleNavSelection}
                primaryItems={commissionerPrimaryItems}
                onProfileClick={setProfileModalAnchor}
                allApplicationsToggle={allApplicationsToggle}
                setAllApplicationsToggle={setAllApplicationsToggle}
            />

            {/* Main content area, adjusts width based on sidebar state */}
            <Container disableGutters
                component="main"
                maxWidth={false}
                sx={{
                    ...mainContainerStyle,
                    marginLeft: mainContainerStyle.marginLeft(sideBarOpen),
                    width: mainContainerStyle.width(sideBarOpen),
                }}
            >
                {/* Renders the property details for the selected application */}
                <Box sx={
                    { ...renderingContent,
                        width: renderingContent.width(sideBarOpen)
                    }}>
                    
                    <CommissionerProperties applicationID={applicationID!}/>
                </Box>
            </Container>
            {/* Profile Modal anchored to the Profile button */}
            <ProfileModal
                anchorEl={profileModalAnchor}
                onClose={handleCloseProfileModal}
            />
        </div>
    )
}