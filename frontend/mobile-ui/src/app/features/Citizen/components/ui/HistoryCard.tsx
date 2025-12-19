import {
  // Box,
  // Chip,
  Paper,
  Stack,
  // Tooltip,
  Typography,
} from "@mui/material";
import type { FC } from "react";
import { useAppSelector } from "../../../../../redux/Hooks";
import { getMessagesFromSession, useLocalization } from "../../../../../services/Citizen/Localization/LocalizationContext";
// import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LoadingPage from "../../../../components/Loader";
import type { CitizenPropertyData } from "../../models/CitizenPropertiesPageModel/CitizenPropertyPageModel";

// Tag color by ownershipType (case-insensitive)
// const TYPE_COLORS: Record<string, string> = {
//   owner: "#C84C0E",
//   tenant: "#92731C",
// };

interface HistoryProps {
  property: CitizenPropertyData;
}

const History: FC<HistoryProps> = ({ property }) => {
  const lang = useAppSelector((state) => state.lang.citizenLang);
  const { loading } = useLocalization();
  const messages = getMessagesFromSession("CITIZEN")!;

  if (loading) {
    return <LoadingPage />;
  }

  if (!property) return null;

  // Note: The API response doesn't include a 'history' field
  // You'll need to either:
  // 1. Add a separate API endpoint to fetch property history
  // 2. Use property ownership/transaction data from another source
  // For now, we'll show a placeholder message
  const hasHistory = false; // Set to true when history data is available

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3,
        border: "1px solid #00000033",
        bgcolor: "#fff",
        mb: 1.2,
      }}
    >
      <Typography fontWeight={700} mb={1} fontSize={16}>
      </Typography>
      {hasHistory ? (
        <Stack gap={2}>
          {/* When you have history data, map it here */}
          {/* Example structure:
          {property.history.map((h, idx) => (
            <Paper key={idx} ... >
              // History card content
            </Paper>
          ))}
          */}
        </Stack>
      ) : (
        <Typography color="#888" fontSize={14} mt={1}>
          {messages['citizen.my-properties'][lang]['no-history'] || 'No ownership history available.'}
        </Typography>
      )}
    </Paper>
  );
};

export default History;