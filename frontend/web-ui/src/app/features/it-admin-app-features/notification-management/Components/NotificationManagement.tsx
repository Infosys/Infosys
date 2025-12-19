import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { JurisdictionDropdown } from "../../../../components/JurisdictionDropdown/JurisdictionDropdown";
import {
  ButtonsContainerSx,
  containerStylesSx,
  headerContainerSx,
  headerSubtitleSx,
  headerTitleSx,
} from "../Styles/NotificationManagementStyle";
import CustomButton from "./Buttons/CustomButton";
import AddIcon from "@mui/icons-material/Add";
import TodayRoundedIcon from "@mui/icons-material/TodayRounded";
import TemplateTable from "./Table/TemplateTable";
import CreateTemplateDialog from "../Components/PopUps/CreateTemplateDialog";

const NotificationManagement = () => {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <Box sx={containerStylesSx}>
      <Box sx={{ position: "absolute", top: 16, right: 16, zIndex: 20 }}>
        <JurisdictionDropdown
          backgroundColor="#10729B40"
          hoverBackgroundColor="#10729B60"
        />
      </Box>

      <Box sx={headerContainerSx}>
        <Typography sx={headerTitleSx}>Notification Management</Typography>
        <Typography sx={headerSubtitleSx}>
          Create and schedule notifications
        </Typography>
      </Box>

      <Box sx={ButtonsContainerSx}>
        <CustomButton
          icon={<TodayRoundedIcon />}
          text="Schedule Notification"
          color="#c84c03"
          variant="outlined"
        />
        <CustomButton
          icon={<AddIcon />}
          text="Create Template"
          color="#fff"
          backgroundColor="#c84c03"
          variant="contained"
          onClick={() => setOpenDialog(true)}
        />
      </Box>

      <Box>
        <TemplateTable />
      </Box>

      <CreateTemplateDialog open={openDialog} onClose={() => setOpenDialog(false)} />
    </Box>
  );
};

export default NotificationManagement;