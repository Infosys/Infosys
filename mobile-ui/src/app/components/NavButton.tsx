// NavButton is a reusable button component for navigation actions.
// It displays an icon and a label, and triggers a callback when clicked.
// Used in navigation bars and other places where a styled navigation button is needed (e.g., Previous, Home).
// Accepts icon, message, and onClick handler as props.
import { Box, Typography } from "@mui/material";
import type { FC } from "react";
import type { NavButtonProps } from "../models/NavButton.model";


const NavButton: FC<NavButtonProps> = ({ icon, message, onClick }) => {
    return (
        // Outer Box: styled container for icon and label
        <Box
        sx={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          height: "50px",
          justifyContent: "center",
          bgcolor: "rgba(255, 255, 255, 0.5)",
          borderRadius: "20px",
          px: 2.5,
          width: "160px",
          boxShadow: "none",
          transition: "background 0.2s",
          gap: 1,
          '&:hover': { bgcolor: "#E5D3C6" },
        }}
        onClick= {onClick}
      >
        {/* Icon displayed on the left */}
        {icon}
        {/* Navigation label/message */}
        <Typography sx={{ color: "#D88336", fontSize: 16, fontWeight: 400 }}>
          {message}
        </Typography>
      </Box>
    );
}

export default NavButton;