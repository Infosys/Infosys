// This file contains the CommissionerDashBoard layout and related UI components for the Commissioner dashboard page.
// It includes the dashboard header, tabs, metric cards, map, and right-side actions/quick actions layout.
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { dashboardTabs } from "../Utils/SelectorTabs";
import SelectorTab from "./SelectorTab";
import { Typography } from "@mui/material";
import MetricCard from "./Cards/MetricCard";
import { metricCardListSx } from "../Styles/Coms_DashboardLayoutStyles";
import ScheduleDemandGeneration from "./ScheduleDemandGeneration";
import JurisdictionAndCardsSection from "./JurisdictionSection/JurisdictionAndCardsSection";
import QuickActions from "./QuickAction/QuickActions";
import { quickActionsList } from "../Utils/quickActionsList";

import MapView from "../../property-approval/components/mapview";
import { JurisdictionDropdown } from "../../../../components/JurisdictionDropdown/JurisdictionDropdown";
import { useGetCommissionerDashboardOverAllPropertyTaxQuery } from "../CommissionerDashBoardApi/commissionerDashboardApi";
import type { RootState } from "../../../../../store";
import { useSelector } from "react-redux";
import CommissionerMapViewZones from "./CommissionerMapViewZones";

// Type for dashboard tabs
export type DashboardTabType =
  | "demand"
  | "coverage"
  | "kpi dashboard"
  | "reports";

const DashboardHeader = () => {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography
        fontSize={32}
        fontWeight={500}
        sx={{ lineHeight: 1.2, letterSpacing: "-0.02em" }}
      >
        Dashboard
      </Typography>
      <Typography fontSize={20} fontWeight={300} color="#000000">
        Property Tax based Insights and notifications
      </Typography>
    </Box>
  );
};

// Map Component - now accepts activeTab prop
const MapComponent = ({ activeTab }: { activeTab: string }) => {
  if (activeTab === "demand") {
    // Show interactive map with zone selection for Demand Collection
    return <CommissionerMapViewZones />;
  }

  // Show regular map for other tabs
  return (
    <Box
      sx={{
        height: 450,
        borderRadius: 2,
        bgcolor: "#ffffff",
        mb: 2,
        overflow: "hidden",
      }}
    >
      <MapView />
    </Box>
  );
};

const JurisdictionAndRightSideRow = () => (
  <Box
    sx={{
      bgcolor: "#f5f5f5",
      borderRadius: 3,
      mb: 2,
      mt: 2,
    }}
  >
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 2,
        alignItems: "stretch",
      }}
    >
      {/* LEFT: Jurisdiction and cards - Reduced width section */}
      <Box
        sx={{
          width: { xs: "100%", md: "75%", lg: "80%" },
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            bgcolor: "#fff",
            borderRadius: 2,
            boxShadow: "0 1px 6px 0 #0001",
            p: 2,
            flex: 1,
            minHeight: 180,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            height: "100%",
          }}
        >
          <JurisdictionAndCardsSection />
        </Box>
      </Box>
      {/* RIGHT: TWO STACKED BOXES - Increased width */}
      <Box
        sx={{
          width: { xs: "100%", md: "45%", lg: "40%" },
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Stack spacing={2} sx={{ flex: 1, height: "100%" }}>
          <Box>
            <ScheduleDemandGeneration
              onSearch={(value) => console.log("Search:", value)}
              onGenerate={() => console.log("Generate clicked")}
              maxWidth="100%"
            />
          </Box>
          <Box
            sx={{
              bgcolor: "#fff",
              borderRadius: 2,
              boxShadow: "0 1px 6px 0 #0001",
              p: 2,
              minHeight: 120,
            }}
          >
            <QuickActions actions={quickActionsList} />
          </Box>
        </Stack>
      </Box>
    </Box>
  </Box>
);

const CommissionerDashBoard: React.FC = () => {
  // State for the currently active dashboard tab
  const [activeTab, setActiveTab] = useState<DashboardTabType>("demand");

  // Get the selected zone from Redux
  const selectedZone = useSelector(
    (state: RootState) => state.user.selectedZone
  );
  const zoneNumber = selectedZone?.zoneNumber?.toLowerCase() || "east";

  const {
    data: dashboardPropertyTax,
    error,
    // isLoading,
  } = useGetCommissionerDashboardOverAllPropertyTaxQuery(
    { zone: zoneNumber },
    { skip: !zoneNumber } // Skip the query if no zone is selected
  );

  // Format amounts - API returns actual values, just format them
  const collectedAmount = dashboardPropertyTax?.collectionAmount
    ? dashboardPropertyTax.collectionAmount.toLocaleString("en-IN", {
        maximumFractionDigits: 2,
      })
    : "0";
  console.log("Collected Amount:", collectedAmount);

  // Show error message if API fails
  if (error) {
    console.error("Failed to fetch tax data:", error);
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
        pl: 4,
        // pr:4,
        pt: 4,
        pr: 2,
        overflow: "auto",
        position: "relative",
      }}
    >
      {/* Jurisdiction Dropdown - Top Right */}
      <Box
        sx={{
          position: "absolute",
          top: "20px",
          right: "24px",
          zIndex: 200,
          boxShadow: "0 4px 10px rgba(15,23,42,0.04)",
        }}
      >
        <JurisdictionDropdown
          backgroundColor="#C8E0E9"
          hoverBackgroundColor="#BBDEFB"
        />
      </Box>

      <Box sx={{ maxWidth: "1600px", mx: "auto" }}>
        <DashboardHeader />
        <SelectorTab
          tabs={dashboardTabs}
          activeTab={activeTab}
          onTabChange={(tabId: string) =>
            setActiveTab(tabId as DashboardTabType)
          }
        />

        {/* Map section (placeholder) */}
        <MapComponent activeTab={activeTab} />

        {/* Metric cards row */}
        <Box sx={metricCardListSx}>
          <MetricCard
            title="Property Tax collected"
            value={`₹${dashboardPropertyTax?.totalTaxAmount ?? "0"} Cr`}
            target="Target : 74%"
            trend={7.1}
            backgroundColor="rgba(0, 112, 60, 0.1)"
            borderColor="rgb(0, 112, 60)"
            trendColor="rgb(0, 112, 60)"
          />
          <MetricCard
            title="Property Tax pending"
            value="₹748.8 Cr"
            target="Target : 74%"
            trend={-7.1}
            backgroundColor="rgba(185, 25, 0, 0.1)"
            borderColor="rgba(185, 25, 0, 1)"
            trendColor="rgba(185, 25, 0, 1)"
          />
          <MetricCard
            title="New Properties Registered"
            value="36,500"
            target="+3 Today • Avg wait: 4.2 days"
            trend={7.1}
            backgroundColor="#ffffff"
            borderColor="#ffffff"
          />
        </Box>

        {/* Row with jurisdiction and right-side actions */}
        <JurisdictionAndRightSideRow />
      </Box>
    </Box>
  );
};

export default CommissionerDashBoard;
