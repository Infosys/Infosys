// This file defines the TextButton component, a reusable button for displaying text with custom styles and click handling.
import type { SxProps, Theme } from "@mui/material";
import React from "react";
import Button from "@mui/material/Button";

// Props for the TextButton component
interface TextButtonProps {
  text: string;
  sx?: SxProps<Theme>;
  onClick?: () => void;
}

// Functional component for rendering a styled text button
const TextButton: React.FC<TextButtonProps> = ({
  text,
  sx,
  onClick,
}) => (
  <Button
    variant="outlined"
    sx={sx}
    onClick={onClick}
  >
    {text}
  </Button>
);

// Export the TextButton component as default
export default TextButton;