
/**
 * This component displays an informational alert message using Material-UI's Alert component.
 * It is typically used to show status or feedback messages, such as when no data is found.
 */
import React from "react";
import { Alert } from "@mui/material";


// Props for the AlertMessage component
interface AlertMessageProps {
  message?: string; // The message to display in the alert
  sx?: object;      // Optional custom styles for the alert
}


// Functional component to render an informational alert
const AlertMessage: React.FC<AlertMessageProps> = ({
  message = "No data found.",
  sx = {},
}) => (
  <Alert severity="info" sx={{ width: "100%", textAlign: "center", my: 6, ...sx }}>
    {message}
  </Alert>
);


// Export the AlertMessage component as default
export default AlertMessage;