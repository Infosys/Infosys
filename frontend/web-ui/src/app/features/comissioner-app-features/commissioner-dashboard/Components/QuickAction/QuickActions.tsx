// QuickActions component displays a card with a list of quick action buttons
// Used for providing easy access to frequent actions in the Commissioner's dashboard

import React from "react";
import { Card, CardContent, Typography, Box, Button } from "@mui/material";

// Represents a single quick action item
export interface QuickActionItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  variant?: "contained" | "outlined";
  onClick?: () => void;
}

// Props for the QuickActions component
export interface QuickActionsProps {
  actions?: QuickActionItem[];
  title?: string;
}

// QuickActions functional component
const QuickActions: React.FC<QuickActionsProps> = ({
  actions = [],
  title = "Quick Actions",
}) => (
  // Card container for the quick actions section
  <Card
    sx={{
      borderRadius: "8px",
      boxShadow: "none",
      width: "100%",
      backgroundColor: "#ffffff",
      fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif',
    }}
  >
    {/* Card content with title and action buttons */}
    <CardContent sx={{ p: 1 }}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          mb: 2,
          color: "#1f2937",
          fontSize: "16px",
        }}
      >
        {title}
      </Typography>
      {/* Render each quick action as a button */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {actions.map((action) => (
          <Button
            key={action.id}
            variant={action.variant || "outlined"}
            startIcon={action.icon}
            onClick={action.onClick}
            fullWidth
            sx={{
              justifyContent: "flex-start",
              textAlign: "left",
              padding: "10px 16px",
              borderRadius: "6px",
              textTransform: "none",
              fontSize: "14px",
              fontWeight: 500,
              height: "44px",
              // Contained and outlined variant styles
              ...(action.variant === "contained" && {
                backgroundColor: "#0B4B66",
                color: "white",
                border: "none",
                "&:hover": {
                  backgroundColor: "#093a50",
                },
              }),
              ...(action.variant === "outlined" && {
                borderColor: "#0B4B66",
                color: "#0B4B66",
                backgroundColor: "white",
                "&:hover": {
                  backgroundColor: "#f9fafb",
                  borderColor: "#0B4B66",
                },
              }),
              // Icon styling
              "& .MuiButton-startIcon": {
                marginRight: "12px",
                "& svg": {
                  fontSize: "18px",
                },
              },
            }}
          >
            {action.label}
          </Button>
        ))}
      </Box>
    </CardContent>
  </Card>
);

export default QuickActions;