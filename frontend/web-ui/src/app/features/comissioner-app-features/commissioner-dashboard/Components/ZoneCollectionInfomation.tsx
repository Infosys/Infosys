import React from "react";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import { useGetZoneWardsQuery } from "../CommissionerDashBoardApi/zoneApi";
import { useGetZoneTaxDataQuery } from "../CommissionerDashBoardApi/ZoneTaxApi";
import type {
  ZoneCollectionInformationProps,
  ZoneData,
} from "../Models/ZoneModel";
import type { RootState } from "../../../../../store";
import { useSelector } from "react-redux";

// Individual Zone Card Component
const ZoneCard: React.FC<{ zone: ZoneData }> = ({ zone }) => {
  const getCardColor = (compliance: number) => {
    if (compliance >= 80) return "rgba(200, 230, 201, 0.3)"; // Light green
    if (compliance >= 60) return "rgba(255, 243, 224, 0.5)"; // Light orange
    return "rgba(255, 235, 238, 0.5)"; // Light red
  };

  return (
    <Box
      sx={{
        backgroundColor: getCardColor(zone.compliance),
        border: "1px solid #E0E0E0",
        borderRadius: "12px",
        p: 1.5,
        mb: 1.5,
        width: "100%",
        boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 4px 8px rgba(0,0,0,0.12)",
          transform: "translateY(-2px)",
        },
      }}
    >
      {/* Zone Name */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          mb: 0.3,
          color: "#1a1a1a",
          fontSize: "15px",
        }}
      >
        {zone.zoneName}
      </Typography>

      {/* Ward */}
      <Typography
        variant="body2"
        sx={{
          color: "#666",
          mb: 1.2,
          fontSize: "14px",
        }}
      >
        {zone.ward}
      </Typography>

      {/* Compliance Row */}
      <Box sx={{ display: "flex", gap: 1, mb: 0.5 }}>
        <Typography
          variant="body2"
          sx={{ fontWeight: 500, color: "#333", fontSize: "13px" }}
        >
          Compliance:
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: "#000",
            fontSize: "13px",
          }}
        >
          {zone.compliance}%
        </Typography>
      </Box>

      {/* Collected Row */}
      <Box sx={{ display: "flex", gap: 1, mb: 0.5 }}>
        <Typography variant="body2" sx={{ fontWeight: 500, color: "#333" }}>
          Collected:
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600, color: "#4CAF50" }}>
          {zone.collected}
        </Typography>
      </Box>

      {/* Pending Row */}
      <Box sx={{ display: "flex", gap: 1, mb: 0.5 }}>
        <Typography variant="body2" sx={{ fontWeight: 500, color: "#333" }}>
          Pending:
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600, color: "#F44336" }}>
          {zone.pending}
        </Typography>
      </Box>
    </Box>
  );
};

// Hook to fetch zone tax data for a specific zone
const useZoneTaxData = (zoneName: string) => {
  return useGetZoneTaxDataQuery({ zoneName }, { skip: !zoneName });
};

// Helper function to format currency in Indian numbering system
const formatCurrency = (amount: number): string => {
  const amountStr = amount.toString();
  const lastThree = amountStr.substring(amountStr.length - 3);
  const otherNumbers = amountStr.substring(0, amountStr.length - 3);

  if (otherNumbers !== "") {
    return `₹${otherNumbers.replaceAll(/\B(?=(\d{2})+(?!\d))/g, ",")}${
      lastThree ? "," + lastThree : ""
    }`;
  } else {
    return `₹${lastThree}`;
  }
};

// Main Zone Collection Information Component
const ZoneCollectionInformation: React.FC<ZoneCollectionInformationProps> = ({
  fileStoreId: propFileStoreId,
  zones = [],
}) => {
  // Get user details from Redux store
  const currentUser = useSelector(
    (state: RootState) => state.user?.currentUser
  );

  const fileStoreId = propFileStoreId || "6dd4c1ad-af12-4447-ac30-a4a56a3a93b7";
  const userId = currentUser?.id || "6b338a84-af0f-47bf-9345-86c82b3120fc";
  const userRole = currentUser?.role || "SERVICE_MANAGER";
  const tenantId = "pb.amritsar";

  // Fetch zone wards data from API
  const {
    data: zoneWardsData,
    isLoading: isLoadingWards,
    error: wardsError,
  } = useGetZoneWardsQuery(
    {
      fileStoreId,
      userId,
      userRole,
      tenantId,
    },
    {
      skip: !fileStoreId,
    }
  );

  // Mock data for compliance (keep as mock as per requirement)
  const mockComplianceData: Record<string, number> = {
    Central: 58,
    South: 95,
    West: 79,
    East: 72,
    North: 85,
  };

  // Transform API data to display format
  const displayZones: Array<{
    zoneName: string;
    ward: string;
    compliance: number;
    zoneKey: string;
  }> = React.useMemo(() => {
    if (zones.length > 0) {
      return zones.map((zone) => ({
        zoneName: zone.zoneName,
        ward: zone.ward,
        compliance: zone.compliance,
        zoneKey: zone.zoneName.replace(" Zone", ""),
      }));
    }

    if (zoneWardsData && zoneWardsData.length > 0) {
      return zoneWardsData.map((item) => {
        const compliance = mockComplianceData[item.zone] || 50;

        return {
          zoneName: `${item.zone} Zone`,
          ward: `Ward ${item.wards}`,
          compliance,
          zoneKey: item.zone,
        };
      });
    }

    return [];
  }, [zoneWardsData, zones]);

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        borderRadius: "12px",
        p: 3,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        maxHeight: "600px",
        maxWidth: "400px",
        overflowY: "auto",
        scrollbarWidth: "none",
      }}
    >
      {/* Header */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: 200,
          mb: 3,
          color: "#1a1a1a",
          fontSize: "18px",
        }}
      >
        Zone Collection Information
      </Typography>

      {/* Loading State */}
      {isLoadingWards && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress size={40} />
        </Box>
      )}

      {/* Error State */}
      {wardsError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load zone data
        </Alert>
      )}

      {/* Zone Cards */}
      {!isLoadingWards && !wardsError && displayZones.length > 0 && (
        <Box>
          {displayZones.map((zone, index) => (
            <ZoneCardWithTaxData key={index} zone={zone} />
          ))}
        </Box>
      )}

      {/* Empty State */}
      {!isLoadingWards && !wardsError && displayZones.length === 0 && (
        <Typography
          variant="body2"
          color="textSecondary"
          textAlign="center"
          py={4}
        >
          No zone data available
        </Typography>
      )}
    </Box>
  );
};

// Wrapper component that fetches tax data for each zone card
const ZoneCardWithTaxData: React.FC<{
  zone: {
    zoneName: string;
    ward: string;
    compliance: number;
    zoneKey: string;
  };
}> = ({ zone }) => {
  const { data: taxData, isLoading } = useZoneTaxData(zone.zoneKey);

  // If loading or error, show placeholder data
  let collected: string;
  if (taxData?.collectionAmount) {
    collected = formatCurrency(taxData.collectionAmount);
  } else if (isLoading) {
    collected = "...";
  } else {
    collected = "₹0";
  }

  let pending: string;
  if (taxData?.pendingAmount) {
    pending = formatCurrency(taxData.pendingAmount);
  } else if (isLoading) {
    pending = "...";
  } else {
    pending = "₹0";
  }

  const displayZone: ZoneData = {
    zoneName: zone.zoneName,
    ward: zone.ward,
    compliance: zone.compliance,
    collected,
    pending,
  };

  return <ZoneCard zone={displayZone} />;
};

export default ZoneCollectionInformation;
