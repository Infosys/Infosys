
// Header is a reusable, styled top bar component for displaying a page or section title.
// It accepts a main header, an optional sub-header, and an optional icon.
// Used across both Agent and Citizen screens to provide consistent page headings.
import { Box, Typography } from "@mui/material";
import type { FC } from "react";
import type { HeaderProps } from "../models/Header.model";


const Header: FC<HeaderProps> = ({
  header,      // Main title text to display
  subHeader,   // Optional subtitle or description
  icon,        // Optional icon to display left of the title
}) => {
  return (
    // Outer Box: fixed at the top, styled background, full width
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        height: 110,
        zIndex: 1100,
        bgcolor: "#EEDCD2",
        px: 2.5,
        pt: 4,
        pb: 1.2,
        pl: 1,
        borderBottom: "1.5px solid #EEDCD2",
      }}
    >
      {/* Inner Box: aligns icon and text horizontally */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, paddingLeft: 2 }}>
        {icon}
        <Box>
          {/* Main header text */}
          <Typography fontWeight={700} fontSize={24} color="#1A1816" sx={{ lineHeight: "1.2" }}>
            {header}
          </Typography>
          {/* Sub-header/description text */}
          <Typography fontSize={16} color="#313131" fontStyle="italic" sx={{ mt: 0.2 }}>
            {subHeader}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};


export default Header;