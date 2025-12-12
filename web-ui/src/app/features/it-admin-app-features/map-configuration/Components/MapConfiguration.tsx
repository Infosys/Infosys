import { Box, Button, IconButton, Typography } from "@mui/material";
import {
  ButtonContainerSx,
  CardListSx,
  containerStylesSx,
  filterIconOverlaySx,
  headerContainerSx,
  headerSubtitleSx,
  headerTitleSx,
  mapBoxSx,
  viewMapBoxSx,
  viewMoreButtonSx,
  searchBarOverlaySx,
  viewMoreOverlaySx,
  leftPanelSx,
} from "../Styles/MapConfigurationStyle";
import SelectorTab from "./SelectorTab/SelectorTab";
import MapView from "../../../comissioner-app-features/property-approval/components/mapview";
import CustomButton from "./Buttons/CustomButton";
import AddIcon from "@mui/icons-material/Add";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import MapFileTable from "./Table/MapFileTable";
import { useState } from "react";
import UploadMapFilePopUp from "./PopUps/UploadMapFilePopUp";
import SearchBar from "./SearchBar/SearchBar";
import InfoCard from "./Cards/InfoCard";
import FilterNoneIcon from "@mui/icons-material/FilterNone";
import LayerVisibility from "./LayerVisibility/LayerVisibility";
import { JurisdictionDropdown } from "../../../../components/JurisdictionDropdown/JurisdictionDropdown";

const MapConfiguration = () => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [layerVisibility, setLayerVisibility] = useState(false);

  return (
    <Box sx={containerStylesSx}>

      <Box sx={{ position: "absolute", top: 16, right: 16, zIndex: 20 }}>
        <JurisdictionDropdown
          backgroundColor="#10729B40"
          hoverBackgroundColor="#10729B60"
        />
      </Box>

      <Box sx={headerContainerSx}>
        <Typography sx={headerTitleSx}>Map Configuration</Typography>
        <Typography sx={headerSubtitleSx}>
          Manage map layers and GIS analytics
        </Typography>
      </Box>

      <Box mb={2}>
        <SelectorTab
          selectedIndex={selectedIndex}
          onTabChange={setSelectedIndex}
        />
      </Box>

      {/* Conditionally render content based on selectedIndex */}
      {selectedIndex === 0 ? (
        <>
          <Box sx={{ ...mapBoxSx, position: "relative" }}>
            <MapView />
            {/* Top right search bar */}
            <Box sx={searchBarOverlaySx}>
              <SearchBar
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onSearch={() => {
                  /* handle search */
                }}
              />
            </Box>
            {/* Bottom left view more button */}
            <Box sx={viewMoreOverlaySx}>
              <Button variant="contained" sx={viewMoreButtonSx}>
                View More
              </Button>
            </Box>
            {/* Add more overlays as needed */}
          </Box>

          <Box sx={ButtonContainerSx}>
            <CustomButton
              icon={<FileDownloadOutlinedIcon />}
              text="Export data"
              variant="outlined"
              color="#c84c03"
            />
            <CustomButton
              icon={<AddIcon />}
              text="Upload map file"
              variant="contained"
              color="#fff"
              backgroundColor="#c84c03"
              onClick={() => setOpen(true)}
            />
          </Box>

          <Box>
            <MapFileTable />
          </Box>

          <UploadMapFilePopUp open={open} onClose={() => setOpen(false)} />
        </>
      ) : (
        <>
          {/* Content for "View Map Options" tab */}
          <Box>
            <Box sx={CardListSx}>
              <InfoCard label="Total properties mapped" value="42,391" />
              <InfoCard label="Properties with polygons" value="32,451" />
              <InfoCard label="Boundary Coverage" value="198" />
              <InfoCard label="Coordinate Accuracy" value="95.2%" />
            </Box>

            <Box sx={viewMapBoxSx}>
              <IconButton sx={filterIconOverlaySx} onClick={() => setLayerVisibility(true)}>
                <FilterNoneIcon sx={{ color: "#c84c03", cursor: "pointer" }} />
              </IconButton>

              {/* Left-side component */}
              {layerVisibility && (
                <Box sx={leftPanelSx}>
                  <LayerVisibility onClose={() => setLayerVisibility(false)} />
                </Box>
              )}

              <MapView />
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default MapConfiguration;