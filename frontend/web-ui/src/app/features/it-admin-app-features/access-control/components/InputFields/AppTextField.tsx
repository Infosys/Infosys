import { Box, Typography, TextField } from "@mui/material";

export const AppTextField: React.FC<{
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}> = ({ label, value, onChange, placeholder }) => (
  <Box mb={2}>
    <Typography fontSize={16} fontWeight={300} mb={0.5}>{label}</Typography>
    <TextField
      fullWidth
      variant="outlined"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      size="small"
    />
  </Box>
);