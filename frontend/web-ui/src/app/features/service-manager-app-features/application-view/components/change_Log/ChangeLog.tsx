// This component displays a change log/history for a property, including application previews and a timeline of key events.
// It uses static mock data for demonstration and renders cards for preview and application history.
import _React from "react";
import { Box, Typography, Button } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
applicatonHistoryStyle,
  previewBoxCardStyle,
  previewCenteredStyle,
  previewIconStyle,
  previewSubStyle,
  applicationHistoryCardStyle,
  applicationHistoryTitleStyle,
  historySubStyle,
  historyItemStyle,
  historyLeftStyle,
  historyYearStyle,
  historyMainStyle,
  historyRightStyle,
  historyDateStyle,
  historyStayleStyle,
  downloadButtonStyle,
viewLocationButtonStyle,
} from "../../Styles/searchPropertyStyles/searchPropertyChangeLogStyle";

// Mock data representing the property/application history timeline
const history = [
  {
    year: 2025,
    id: 'PRP_2025_003',
    action: 'Apartment complex verification pending final Review',
    agent: 'Ravi Kumar',
    date: '28/10/2024',
    status: 'Under Review'
  },
  {
    year: 2023,
    event: 'Ownership Transfer',
    from: 'Ms Meena Rajesh',
    to: 'Mr Pradeep Nair (current owner)',
    mutation: 'MUT_2023_0134',
    date: '14/04/2023'
  },
  {
    year: 2016,
    id: 'PTX_2016_015',
    action: 'Property Reassessment for updated floor area',
    date: '23/07/2016'
  }
];


export default function SearchPropertyChangeLog() {
  // Renders the property change log UI, including preview and application history cards
  return (
    <Box sx={applicatonHistoryStyle} className="change-grid">
      {/* Preview Card: Shows a preview section for the selected application */}
      <Box className="preview-box card" sx={previewBoxCardStyle}>
        <Box className="preview-centered" sx={previewCenteredStyle}>
          <Box className="preview-icon" sx={previewIconStyle}>
            <VisibilityIcon fontSize="inherit" />
          </Box>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Preview Application
          </Typography>
          <Typography className="preview-sub" sx={previewSubStyle}>
            view application selected from Logs
          </Typography>
        </Box>
      </Box>

      {/* Application History Timeline */}
      <Box
        component="aside"
        className="application-history card"
        sx={applicationHistoryCardStyle}
      >
        <Typography variant="h6" sx={applicationHistoryTitleStyle}>Application History</Typography>
        <Typography className="history-sub" sx={historySubStyle}>
          All Applications filed against this Property
        </Typography>

        <Box className="history-card-list">
          {/* Render each history event as a timeline card */}
          {history.map((h, idx) => (
            <Box
              key={idx}
              className="history-item"
              sx={historyItemStyle}
            >
              <Box className="history-left" sx={historyLeftStyle}>
                <Box sx={{ display: 'flex' }}>
                  <Box className="history-main" sx={historyMainStyle}>
                    <Box className="history-year" sx={historyYearStyle}>
                      {h.year}
                    </Box>
                    {/* Conditionally render available fields for each event */}
                    {h.id && (
                      <Typography component="div" sx={{ fontSize: 14 }}>
                        <strong>Application ID :</strong> {h.id}
                      </Typography>
                    )}
                    {h.event && (
                      <Typography component="div" sx={{ fontSize: 14 }}>
                        <strong>Event:</strong> {h.event}
                      </Typography>
                    )}
                    {h.action && (
                      <Typography component="div" sx={{ fontSize: 14 }}>
                        <strong>Action:</strong> {h.action}
                      </Typography>
                    )}
                    {h.agent && (
                      <Typography component="div" sx={{ fontSize: 14 }}>
                        <strong>Agent:</strong> {h.agent}
                      </Typography>
                    )}
                    {h.from && (
                      <Typography component="div" sx={{ fontSize: 14 }}>
                        <strong>From :</strong> {h.from}
                      </Typography>
                    )}
                    {h.to && (
                      <Typography component="div" sx={{ fontSize: 14 }}>
                        <strong>To :</strong> {h.to}
                      </Typography>
                    )}
                    {h.mutation && (
                      <Typography component="div" sx={{ fontSize: 14 }}>
                        <strong>Mutation ID :</strong> {h.mutation}
                      </Typography>
                    )}
                    {/* Button to view location for this event */}
                    <Button className="btn view-Location" sx={viewLocationButtonStyle}>
                      View Location
                    </Button>
                  </Box>
                </Box>
                <Box className="history-right" sx={historyRightStyle}>
                  <Typography className="history-date" sx={historyDateStyle}>
                    {h.date}
                  </Typography>
                  {h.status && (
                    <Typography className="history-note" sx={historyStayleStyle}>
                      {h.status}
                    </Typography>
                  )}
                  {/* Button to download documents for this event */}
                  <Button className="btn download" sx={downloadButtonStyle}>
                    Download
                  </Button>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}