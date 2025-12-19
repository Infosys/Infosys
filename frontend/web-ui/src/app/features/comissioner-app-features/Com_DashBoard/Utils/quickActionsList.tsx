// List of quick action items for the Commissioner's dashboard
// Each item defines an action button with icon, label, and style variant

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PlaceIcon from "@mui/icons-material/Place";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import type { QuickActionItem } from "../Components/QuickAction/QuickActions";

// Array of quick actions to be displayed in the QuickActions component
export const quickActionsList: QuickActionItem[] = [
  {
    id: "review-applications",
    label: "Review Applications",
    icon: <CheckCircleOutlineIcon />,
    variant: "contained",
  },
  {
    id: "view-jurisdiction",
    label: "View Jurisdiction",
    icon: <PlaceIcon />,
    variant: "outlined",
  },
  {
    id: "send-message",
    label: "Send Message",
    icon: <ChatBubbleOutlineIcon />,
    variant: "outlined",
  },
  {
    id: "generate-report",
    label: "Generate Report",
    icon: <AnalyticsIcon />,
    variant: "outlined",
  },
];