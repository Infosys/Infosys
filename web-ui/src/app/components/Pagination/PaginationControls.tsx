// This file contains the PaginationControls component, which displays a styled pagination bar for navigating between pages of data.
// It uses Material-UI's Pagination component and is designed to be reusable across the app.
import React from "react";
import Pagination from "@mui/material/Pagination";
import { Box } from "@mui/material";
import { paginationStyleSx } from "../../styles/PaginationStyle/PaginationControlsStyle";

// Props for PaginationControls: current page, total pages, and a callback for page changes
interface PaginationControlsProps {
  page: number; // The current page number
  totalPages: number; // The total number of pages available
  onPageChange: (page: number) => void; // Callback when the page is changed
}


// PaginationControls component renders a centered pagination bar with first/last buttons
const PaginationControls: React.FC<PaginationControlsProps> = ({
  page,
  totalPages,
  onPageChange,
}) => (
  // Center the pagination bar horizontally with some vertical margin
  <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
    <Pagination
      count={totalPages} // Total number of pages
      page={page} // Current page
      onChange={(_, value) => onPageChange(value)} // Call parent handler when page changes
      color="primary"
      size="large"
      showFirstButton // Show button to go to the first page
      showLastButton // Show button to go to the last page
      sx={paginationStyleSx} // Custom styles for pagination
    />
  </Box>
);

export default PaginationControls;