import React from "react";
import { Box } from "@mui/material";
import { getCustomChipSx } from "../../Styles/ButtonsStyle/CustomChipStyle";

interface CustomChipProps {
  label: string;
  color?: string;
  borderColor?: string;
  backgroundColor?: string;
  sx?: object;
}

const CustomChip: React.FC<CustomChipProps> = ({
  label,
  color,
  borderColor,
  backgroundColor,
  sx = {},
}) => (
  <Box sx={{ ...getCustomChipSx(color, borderColor, backgroundColor), ...sx }}>
    {label}
  </Box>
);

export default CustomChip;