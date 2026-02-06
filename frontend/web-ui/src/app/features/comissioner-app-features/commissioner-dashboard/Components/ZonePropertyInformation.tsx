import React from "react";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import { useGetZoneWardsQuery } from "../CommissionerDashBoardApi/zoneApi";
import { useGetZoneEnumerationCountQuery } from "../CommissionerDashBoardApi/zoneEnumerationApi";
import type {
  ZonePropertyData,
  ZonePropertyInformationProps,
} from "../Models/ZoneModel";
import type { RootState } from "../../../../../store";
import { useSelector } from "react-redux";

// Helper function to format numbers in Indian numbering system
const formatNumber = (num: number): string => {
  const numStr = num.toString();
  const lastThree = numStr.substring(numStr.length - 3);
  const otherNumbers = numStr.substring(0, numStr.length - 3);

  if (otherNumbers !== "") {
    return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree;
  } else {
    return lastThree;
  }
};

// Individual Zone Property Card Component
const ZonePropertyCard: React.FC<{ zone: ZonePropertyData }> = ({ zone }) => {
  return (
    <Box
      sx={{
        backgroundColor: "#fff",
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

      {/* Enumerated Row */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            color: "#333",
            fontSize: "13px",
          }}
        >
          Enumerated:
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: "#4CAF50",
            fontSize: "13px",
          }}
        >
          {formatNumber(zone.enumerated)}
        </Typography>
      </Box>

      {/* Unenumerated Row */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            color: "#333",
            fontSize: "13px",
          }}
        >
          Unenumerated:
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: "#F44336",
            fontSize: "13px",
          }}
        >
          {formatNumber(zone.unenumerated)}
        </Typography>
      </Box>
    </Box>
  );
};

// Hook to fetch zone enumeration data for a specific zone
const useZoneEnumerationData = (zoneNo: string) => {
  const { data: enumeratedData, isLoading: isLoadingEnumerated } =
    useGetZoneEnumerationCountQuery(
      { zoneNo, enumerated: true },
      { skip: !zoneNo }
    );

  return {
    enumerated: enumeratedData?.totalItems || 0,
    isLoading: isLoadingEnumerated,
  };
};

// Main Zone Property Information Component
const ZonePropertyInformation: React.FC<ZonePropertyInformationProps> = ({
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

  // Mock data for unenumerated properties (keep as mock as per requirement)
  const mockUnenumeratedData: Record<string, number> = {
    Central: 20345,
    South: 12433,
    West: 3492,
    East: 8500,
    North: 15600,
  };

  // Transform API data to display format
  const displayZones: Array<{
    zoneName: string;
    ward: string;
    zoneKey: string;
    unenumerated: number;
  }> = React.useMemo(() => {
    if (zones.length > 0) {
      return zones.map((zone) => ({
        zoneName: zone.zoneName,
        ward: zone.ward,
        zoneKey: zone.zoneName.replace(" Zone", ""),
        unenumerated: zone.unenumerated,
      }));
    }

    if (zoneWardsData && zoneWardsData.length > 0) {
      return zoneWardsData.map((item) => {
        const unenumerated = mockUnenumeratedData[item.zone] || 0;

        return {
          zoneName: `${item.zone} Zone`,
          ward: `Ward ${item.wards}`,
          zoneKey: item.zone,
          unenumerated,
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
        Zone Property Information
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

      {/* Zone Property Cards */}
      {!isLoadingWards && !wardsError && displayZones.length > 0 && (
        <Box>
          {displayZones.map((zone, index) => (
            <ZonePropertyCardWithEnumerationData key={index} zone={zone} />
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

// Wrapper component that fetches enumeration data for each zone card
const ZonePropertyCardWithEnumerationData: React.FC<{
  zone: {
    zoneName: string;
    ward: string;
    zoneKey: string;
    unenumerated: number;
  };
}> = ({ zone }) => {
  const { enumerated, isLoading } = useZoneEnumerationData(
    `Zone-${zone.zoneKey}`
  );

  const displayZone: ZonePropertyData = {
    zoneName: zone.zoneName,
    ward: zone.ward,
    enumerated: isLoading ? 0 : enumerated,
    unenumerated: zone.unenumerated,
  };

  return <ZonePropertyCard zone={displayZone} />;
};

export default ZonePropertyInformation;
