// EnumeratedInfo.tsx displays summary cards for bills due and issued licenses on the Citizen dashboard.
// It uses MUI for UI, localization for labels, and provides buttons to view bills and licenses.
// Main responsibilities:
// - Render two cards: bills due and issued licenses
// - Show total amount and count
// - Provide buttons for navigation to bills/licenses
// Props:
//   billsDue (number): count of bills due
//   billsAmount (number): total amount due
//   issuedLicenses (number): count of issued licenses
//   onViewBills, onViewLicenses (function, optional): navigation handlers
import React from "react";
import { Box, Button, Typography, Paper } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useAppSelector } from "../../../../redux/Hooks";
import { getMessagesFromSession, useLocalization } from "../../../../services/Citizen/Localization/LocalizationContext";
import LoadingPage from "../../../components/Loader";


// Props for EnumeratedInfo: bills/amount/licenses and navigation handlers
interface EnumeratedInfoProps {
  billsDue: number;
  billsAmount: number;
  issuedLicenses: number;
  onViewBills?: () => void;
  onViewLicenses?: () => void;
}

// EnumeratedInfo component: renders summary cards for bills and licenses
const EnumeratedInfo: React.FC<EnumeratedInfoProps> = ({
  billsAmount,
  issuedLicenses,
  onViewBills,
  onViewLicenses
}) => {
  const lang = useAppSelector(state => state.lang.citizenLang); // Current language
  const { loading } = useLocalization(); // Global loading state
  const messages = getMessagesFromSession("CITIZEN")!; // Localized messages

  // Show loader if localization is loading
  if (loading) {
    return <LoadingPage />;
  }

  // Render summary cards for bills and licenses
  return (
    <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
      {/* Bills Card */}
      <Paper
        elevation={0}
        sx={{
          flex: 1,
          p: 1.4,
          borderRadius: 2,
          bgcolor: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          minWidth: 0
        }}
      >
        <Typography fontSize={14} color="#222" fontWeight={500}>
          {messages['citizen.my-properties'][lang]['bills-due']}:
        </Typography>
        <Typography fontSize={13} color="#888">
          {/* {messages['citizen.my-properties'][lang]['total-amount']}: */}
          Total Amount :
        </Typography>
        <Typography fontWeight={700} fontSize={18} color="#C05B1B" mt={0.5} mb={0.5}>
          ₹{billsAmount?.toLocaleString?.() || billsAmount}
        </Typography>
        <Button
          onClick={onViewBills}
          variant="text"
          size="small"
          sx={{
            alignSelf: "flex-start",
            color: "#C05B1B",
            fontWeight: 600,
            fontSize: 15,
            px: 0,
            textTransform: "none"
          }}
          endIcon={<ArrowForwardIosIcon sx={{ fontSize: 16 }} />}
        >
          {/* {messages['citizen.my-properties'][lang]['view-bills']} */}
          View Bills
        </Button>
      </Paper>
      {/* Licenses Card */}
      <Paper
        elevation={0}
        sx={{
          flex: 1,
          p: 1.4,
          borderRadius: 2,
          bgcolor: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          minWidth: 0
        }}
      >
        <Typography fontSize={14} color="#222" fontWeight={500}>
          Issued Licenses:
        </Typography>
        <Typography
          fontWeight={700}
          fontSize={24}
          color="#222"
          mt={0.5}
          mb={0.5}
        >
          {issuedLicenses}
        </Typography>
        <Button
          onClick={onViewLicenses}
          variant="text"
          size="small"
          sx={{
            alignSelf: "flex-start",
            color: "#C05B1B",
            fontWeight: 600,
            fontSize: 15,
            px: 0,
            textTransform: "none"
          }}
          endIcon={<ArrowForwardIosIcon sx={{ fontSize: 16 }} />}
        >
          {/* {messages['citizen.my-properties'][lang]['view-licenses']} */}
          View Licences
        </Button>
      </Paper>
    </Box>
  );
};

// Export EnumeratedInfo for use in Citizen dashboard
export default EnumeratedInfo;