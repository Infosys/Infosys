import React from "react";
import { Box, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {
  searchBarContainerSx,
  searchInputSx,
  searchIconSx,
} from "../../Styles/SearchBarStyle/SearchBarStyle";

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  onSearch?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "Search Zones",
  onSearch,
}) => (
  <Box sx={searchBarContainerSx}>
    <TextField
      variant="standard"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      InputProps={{
        disableUnderline: true,
        sx: searchInputSx,
      }}
      inputProps={{
        style: { fontSize: 18, color: "#868686" },
      }}
      autoComplete="off"
      spellCheck={false}
      fullWidth
    />
    <SearchIcon sx={searchIconSx} onClick={onSearch} />
  </Box>
);

export default SearchBar;