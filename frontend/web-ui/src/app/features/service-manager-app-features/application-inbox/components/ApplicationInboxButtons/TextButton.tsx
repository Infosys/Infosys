
/**
 * This component renders a reusable outlined text button for the application inbox.
 * It accepts custom text, styles, and an optional click handler.
 */
import type { SxProps, Theme } from "@mui/material";
import React from "react";
import Button from "@mui/material/Button";


// Props for the TextButton component
interface TextButtonProps {
  text: string;                // Button label text
  sx?: SxProps<Theme>;         // Optional custom styles for the button
  onClick?: () => void;        // Optional click handler
}


// Functional component to render an outlined text button
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