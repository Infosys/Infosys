// This file defines the SearchProperty component, which serves as the main container for the property search page.
// It manages filter, search, and sort state, and renders the header, map, and property card list.

import { Box } from '@mui/material';
import SearchPropertyHeader from './SearchPropertyHeader/SearchPropertyHeader';
import PropertyCardList from './SearchPropertyCards/PropertyCardList';
import { searchPropertyContainerSx, searchPropertySpacerSx } from '../styles/SearchPropertyStyle';
// import SearchPropertyMap from './SearchPropertyMap/SearchPropertyMap';
import { JurisdictionDropdown } from '../../../../components/JurisdictionDropdown/JurisdictionDropdown';
import { jurisdictionDropdownStyles } from '../../../../styles/HomePageStyle/HomePageStyle';
import { useState } from 'react';
import MapView from '../../../comissioner-app-features/property-approval/components/mapview';

const DEFAULT_FILTER = "Property No.";
const DEFAULT_SORT = "New - Old";
  
// Main component for the property search page
const SearchProperty = () => {
  // State for the selected filter option
  const [selectedFilter, setSelectedFilter] = useState(DEFAULT_FILTER);
  // State for the search input value
  const [searchValue, setSearchValue] = useState("");
  // State for the selected sort option
  const [selectedSort, setSelectedSort] = useState(DEFAULT_SORT);

  return (
    <Box sx={{...searchPropertyContainerSx, m:0, pt:3}}>
      {/* Dropdown for selecting jurisdiction (zone/ward) */}
      <Box sx={jurisdictionDropdownStyles}>
        <JurisdictionDropdown backgroundColor="#F7E4DB" hoverBackgroundColor="#F0DED1" />
      </Box>
      
      {/* Header with filter, search, and sort controls */}
      <SearchPropertyHeader
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        selectedSort={selectedSort}
        onSortChange={setSelectedSort}
      />
      
      {/* Map preview section */}
      <Box sx={{ ...searchPropertySpacerSx,  height: '350px', overflow: 'hidden', width: '100%', borderRadius: "20px" }}>
        {/* <SearchPropertyMap /> */}
        <MapView/>

      </Box>

      {/* List of property cards based on current filter/search/sort */}
      <PropertyCardList
        selectedFilter={selectedFilter}
        searchValue={searchValue}
        selectedSort={selectedSort}
      />
    </Box>
  );
};

export default SearchProperty;