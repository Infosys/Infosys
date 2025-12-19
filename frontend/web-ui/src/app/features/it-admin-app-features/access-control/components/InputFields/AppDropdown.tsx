import { Box, Typography, FormControl, Select, MenuItem } from "@mui/material";

export const AppDropdown: React.FC<{
  label: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
}> = ({ label, value, options, onChange }) => (
  <Box mb={2}>
    <Typography fontSize={16} fontWeight={300} mb={0.5}>{label}</Typography>
    <FormControl fullWidth size="small" variant="outlined">
      <Select
        value={value}
        onChange={e => onChange(e.target.value)}
        displayEmpty
      >
        <MenuItem value="" disabled>
          Select {label}
        </MenuItem>
        {options.map(opt => (
          <MenuItem key={opt} value={opt}>{opt}</MenuItem>
        ))}
      </Select>
    </FormControl>
  </Box>
);