// ErrorMessage.tsx displays a styled error message for the Citizen UI.
// It uses MUI for UI and shows an error icon, title, and message.
// Main responsibilities:
// - Render a centered error card with icon and message
// - Use Paper for card styling and Typography for text
// No props required; static error message
import {type FC} from "react";
import { Box, Typography, Paper } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

// ErrorMessage component: renders a styled error card with icon and message
const ErrorMessage: FC = () => (
  <Box sx={{ my: 4, mx: "auto", maxWidth: 360, textAlign: "center" }}>
    <Paper
      elevation={2}
      sx={{
        py: 4,
        width: "300px",
        px: 2,
        bgcolor: "#fff",
        borderRadius: 3,
        boxShadow: "0 2px 12px rgba(200,0,0,0.06)",
        border: "2px solid #f8bbbd",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Error icon */}
      <ErrorOutlineIcon
        sx={{
          fontSize: 60,
          color: "#d32f2f",
          mb: 2,
        }}
      />
      {/* Error title */}
      <Typography
        variant="h6"
        sx={{
          color: "#d32f2f",
          fontWeight: 700,
          mb: 1,
        }}
      >
        Error
      </Typography>
      {/* Error message */}
      <Typography
        sx={{
          color: "#a94442",
          fontSize: 15,
          fontWeight: 500,
        }}
      >
        Something went wrong
      </Typography>
    </Paper>
  </Box>
);

// Export ErrorMessage for use in error boundaries and error states
export default ErrorMessage;