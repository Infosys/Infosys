import { Box, FormControlLabel, Checkbox, Typography, Divider } from "@mui/material";
import { useState } from "react";
import { layerOptionsBoxSx, layerOptionsCheckboxSx, layerOptionsLabelSx, layerOptionsDividerSx } from "../../Styles/CheckboxOptionsStyle/LayerOptionsStyle";

const options = [
  "Electric Lines",
  "Water Lines",
  "Sewage connections"
];

const LayerOptions = () => {
  const [checked, setChecked] = useState([false, false, false]);

  const handleChange = (idx: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(prev => prev.map((c, i) => i === idx ? event.target.checked : c));
  };

  return (
    <Box mt={0} sx={layerOptionsBoxSx}>
      <Divider sx={layerOptionsDividerSx} />
      {options.map((label, idx) => (
        <FormControlLabel
          key={label}
          control={
            <Checkbox
              checked={checked[idx]}
              onChange={handleChange(idx)}
              size="small"
              sx={layerOptionsCheckboxSx}
            />
          }
          label={
            <Typography sx={layerOptionsLabelSx}>
              {label}
            </Typography>
          }
          sx={{ m: 0, alignItems: "center", mb: idx !== options.length - 1 ? "-4px" : 0 }}
        />
      ))}
    </Box>
  );
};

export default LayerOptions;