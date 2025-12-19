import { useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { filterIconOverlaySx } from "../../Styles/MapConfigurationStyle";
import FilterNoneIcon from "@mui/icons-material/FilterNone";
import {
  layerVisibilityContainerSx,
  ToggleCardListSx,
} from "../../Styles/LayerVisibilityStyle/LayerVisibilityStyle";
import ToggleCard from "../Cards/ToggleCard";
import LayerOptions from "../CheckboxOptions/LayerOptions";

interface LayerVisibilityProps {
  onClose: () => void;
}

const layerVisibilityContents: string[] = [
  "Zone Boundaries",
  "Ward Boundaries",
  "Mohalla Boundaries",
  "Property Polygons",
  "Road Network",
  "Utility Lines",
];

const LayerVisibility = ({ onClose }: LayerVisibilityProps) => {
  // State: one boolean per layer
  const [toggles, setToggles] = useState<boolean[]>(
    Array(layerVisibilityContents.length).fill(true)
  );

  // Handler to toggle a specific layer
  const handleToggle = (idx: number, value: boolean) => {
    setToggles((prev) => prev.map((t, i) => (i === idx ? value : t)));
  };

  return (
    <Box sx={layerVisibilityContainerSx}>
      <Typography fontSize={20} fontWeight={300} mb={2}>
        Layer Visibility
      </Typography>
      <IconButton sx={filterIconOverlaySx} onClick={onClose}>
        <FilterNoneIcon sx={{ color: "#c84c03", cursor: "pointer" }} />
      </IconButton>

      <Box sx={ToggleCardListSx}>
        {layerVisibilityContents.map((layer, idx) => (
          <Box
            key={layer}
            mb={idx !== layerVisibilityContents.length - 1 ? 1 : 0}
          >
            <ToggleCard
              label={layer}
              toggled={toggles[idx]}
              onToggle={(value) => handleToggle(idx, value)}
              sx={
                idx === layerVisibilityContents.length - 1
                  ? {
                      borderTopLeftRadius: "10px",
                      borderTopRightRadius: "10px",
                      borderBottomRightRadius: "0px",
                      borderBottomLeftRadius: "0px",
                    }
                  : { borderRadius: "10px" }
              }
            />
          </Box>
        ))}

        <LayerOptions />
      </Box>
    </Box>
  );
};

export default LayerVisibility;
