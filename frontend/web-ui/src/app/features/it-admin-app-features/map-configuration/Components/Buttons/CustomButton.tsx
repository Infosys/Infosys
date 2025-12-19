import { Button } from "@mui/material";
import React from "react";
import { getCustomButtonSx } from "../../Styles/ButtonsStyle/CustomButtonStyle";

interface CustomButtonProps {
  icon?: React.ReactNode;
  text: string;
  color?: string;
  backgroundColor?: string;
  variant?: "contained" | "outlined" | "text";
  onClick?: () => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  icon,
  text,
  color,
  backgroundColor,
  variant = "contained",
  onClick,
}) => (
  <Button
    onClick={onClick}
    variant={variant}
    startIcon={icon}
    sx={getCustomButtonSx(variant, color, backgroundColor)}
  >
    {text}
  </Button>
);

export default CustomButton;