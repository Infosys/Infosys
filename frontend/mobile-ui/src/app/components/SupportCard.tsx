
// SupportHelp is a reusable card component for displaying support and help options.
// It lists multiple support channels (helpdesk, email, portal) with icons, descriptions, and a contact button.
// Uses localization for all labels and adapts to the current language.
// Used in profile/settings screens for Citizen interface to provide quick access to support resources.
import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import LiveHelpOutlinedIcon from "@mui/icons-material/LiveHelpOutlined";
import { useAppSelector } from "../../redux/Hooks";
import { getMessagesFromSession } from "../../services/Citizen/Localization/LocalizationContext";
import { COLORS } from "../models/Colors.const";




export const SupportHelp: React.FC = () => { 
  // Get current language and localized messages for Citizen
  const lang = useAppSelector(state => state.lang.citizenLang);
  const messages = getMessagesFromSession("CITIZEN")!;

  // List of support/help items to display
  const supportItems = [
    {
      icon: <ChatBubbleOutlineIcon sx={{ fontSize: 32, color: COLORS.text, mr: 2 }} />,
      title: messages["profile"][lang]["bbmp-helpdesk"],
      desc: messages["profile"][lang]["get-help-with-municipal-services"],
    },
    {
      icon: <MailOutlineIcon sx={{ fontSize: 32, color: COLORS.text, mr: 2 }} />,
      title: messages["profile"][lang]["email-support"],
      desc: `${messages["profile"][lang]["write-to-us"]} support@bbmp.gov.in`,
    },
    {
      icon: <LiveHelpOutlinedIcon sx={{ fontSize: 32, color: COLORS.text, mr: 2 }} />,
      title: messages["profile"][lang]["citizen-services-portal"],
      desc: messages["profile"][lang]["browse-services-and-faqs"],
    },
  ];

  return(
    // Paper provides a styled card container for support/help options
    <Paper
      elevation={0}
      sx={{
        border: `1px solid ${COLORS.border}`,
        borderRadius: "10px",
        padding: 2.5,
        width: "93vw",
        background: COLORS.bg,
        margin: "4px",
        position: "relative",
      }}
    >
      {/* Header with icon and title */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <HelpOutlineIcon sx={{ mr: 1, color: "#757575" }} />
        <Typography fontWeight={300} fontSize={24} color={COLORS.text}>
          {/* Support & Help */}
          {messages["profile"][lang]["support-help"]}
        </Typography>
      </Box>
      {/* List of support/help items with icon, title, description, and contact button */}
      {supportItems.map((item) => (
        <Box
          key={item.title}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
            {item.icon}
            <Box>
              <Typography fontWeight={700} fontSize={20} color={COLORS.text}>
                {item.title}
              </Typography>
              <Typography fontSize={16} color="#444">
                {item.desc}
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            disableElevation
            sx={{
              background: COLORS.contact,
              color: COLORS.text,
              borderRadius: "16px",
              boxShadow: "none",
              fontWeight: 500,
              fontSize: 16,
              px: 3,
              minWidth: "90px",
              textTransform: "none",
              "&:hover": { background: COLORS.contact },
            }}
          >
            {/* contact */}
            {messages["profile"][lang]["contact"]}
          </Button>
        </Box>
      ))}
    </Paper>
  );
}

export default SupportHelp;