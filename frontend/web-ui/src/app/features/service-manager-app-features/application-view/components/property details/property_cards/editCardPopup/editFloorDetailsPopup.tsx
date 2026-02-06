import React, { useState, useEffect } from 'react';
import {Box, Typography, Button, TextField, FormControlLabel, Checkbox, MenuItem, Dialog } from '@mui/material';
import { floorSchema } from '../../../../zod/validationSchemas';

// Editable fields for PUT floor-details, matches request schema
export type FloorEditInput = {
  FloorNo: number;
  Classification: string;
  NatureOfUsage: string;
  FirmName: string;
  OccupancyType: string;
  OccupancyName: string;
  ConstructionDate: string;
  EffectiveFromDate: string;
  UnstructuredLand: string;
  LengthFt: number;
  BreadthFt: number;
  PlinthAreaSqFt: number;
  BuildingPermissionNo: string;
  FloorDetailsEntered: boolean;
  ConstructionDetailsID: string;
};

interface EditFloorPopoverProps {
  open: boolean;
  onClose: () => void;
  fields: FloorEditInput;
  labels: { [key in keyof FloorEditInput]?: string };
  onSave: (fields: FloorEditInput) => void;
  schema: typeof floorSchema
  buildingClassificationOptions: Array<{ id: string; label: string }>;
  natureOfUsageOptions: Array<{ id: string; label: string }>;
  occupancyOptions: Array<{ id: string; label: string }>;
  unstructuredLandOptions: Array<{ id: string; label: string }>;
}

const EditFloorPopover: React.FC<EditFloorPopoverProps> = ({
  open,
    onClose,
  fields,
  labels,
  onSave,
  schema,
  buildingClassificationOptions,
  natureOfUsageOptions,
  occupancyOptions,
  unstructuredLandOptions,
}) => {
  const [localFields, setLocalFields] = useState(fields);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setLocalFields(fields);
    setErrors({});
  }, [fields, open]);

  const handleChange = (key: keyof FloorEditInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
  let value: string | boolean | number = e.target.value;
  if (key === "FloorDetailsEntered") value = (e.target as HTMLInputElement).checked;
  if (key === "LengthFt") value = Number(value);
  if (key === "BreadthFt") value = Number(value);
  if (key === "PlinthAreaSqFt") value = Number(value);
  if (key === "FloorNo") value = Number(value);

  setLocalFields({
    ...localFields,
    [key]: value
  });

  const result = schema.safeParse({
    ...localFields,
    [key]: value
  });

  if (result.success) {
    setErrors({});
  } else {
    const fieldErrors: { [key: string]: string } = {};
    result.error.issues.forEach(issue => {
      if (issue.path.length > 0) {
        const fieldName = issue.path[0] as string;
        if (!fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message;
        }
      }
    });
    setErrors(fieldErrors);
  }
};


const handleSave = () => {
  const result = schema.safeParse(localFields);
  if (result.success) {
    setErrors({});
    console.log("Loccal Fields of Floor :", localFields);
    
    onSave(localFields);
    onClose();
  }
};

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{ paper: { sx: { p: 4, minWidth: 400, borderRadius: 3, boxShadow: 6 } } }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontStyle: 'italic' }}>
        Edit Floor Details
      </Typography>
      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {Object.entries(localFields).map(([key, value]) => {
  if (key === "Classification") {
    return (
      <TextField
        key={key}
        select
        label={labels[key as keyof FloorEditInput] || "Classification"}
        value={value === undefined || value === null ? "" : String(value)}
        onChange={handleChange(key as keyof FloorEditInput)}
        fullWidth
        error={!!errors[key]}
        helperText={errors[key]}
      >
        <MenuItem value="">
          <em>Select Classification</em>
        </MenuItem>
        {buildingClassificationOptions.map(opt => (
          <MenuItem key={opt.id} value={opt.label}>{opt.label}</MenuItem>
        ))}
      </TextField>
    );
  }
  if (key === "NatureOfUsage") {
    return (
      <TextField
        key={key}
        select
        label={labels[key as keyof FloorEditInput] || "Nature Of Usage"}
        value={value === undefined || value === null ? "" : String(value)}
        onChange={handleChange(key as keyof FloorEditInput)}
        fullWidth
        error={!!errors[key]}
        helperText={errors[key]}
      >
        <MenuItem value="">
          <em>Select Nature of Usage</em>
        </MenuItem>
        {natureOfUsageOptions.map(opt => (
          <MenuItem key={opt.id} value={opt.label}>{opt.label}</MenuItem>
        ))}
      </TextField>
    );
  }
  if (key === "OccupancyType") {
    return (
      <TextField
        key={key}
        select
        label={labels[key as keyof FloorEditInput] || "Occupancy Type"}
        value={value === undefined || value === null ? "" : String(value)}
        onChange={handleChange(key as keyof FloorEditInput)}
        fullWidth
        error={!!errors[key]}
        helperText={errors[key]}
      >
        <MenuItem value="">
          <em>Select Occupancy</em>
        </MenuItem>
        {occupancyOptions.map(opt => (
          <MenuItem key={opt.id} value={opt.label}>{opt.label}</MenuItem>
        ))}
      </TextField>
    );
  }
  if (key === "UnstructuredLand") {
    return (
      <TextField
        key={key}
        select
        label={labels[key as keyof FloorEditInput] || "Unstructured Land"}
        value={value === undefined || value === null ? "" : String(value)}
        onChange={handleChange(key as keyof FloorEditInput)}
        fullWidth
        error={!!errors[key]}
        helperText={errors[key]}
      >
        <MenuItem value="">
          <em>Select Unstructured Land</em>
        </MenuItem>
        {unstructuredLandOptions.map(opt => (
          <MenuItem key={opt.id} value={opt.label}>{opt.label}</MenuItem>
        ))}
      </TextField>
    );
  }
  // Checkbox for FloorDetailsEntered
  if (key === "FloorDetailsEntered") {
    return (
      <FormControlLabel
        key={key}
        label={labels[key as keyof FloorEditInput] || "Floor Details Entered"}
        control={
          <Checkbox
            checked={!!value}
            onChange={handleChange(key as keyof FloorEditInput)}
            color="primary"
          />
        }
      />
    );
  }
  // Default text/number field for other fields
  return (
    <TextField
      key={key}
      label={labels[key as keyof FloorEditInput] || key}
      value={value === undefined || value === null ? "" : String(value)}
      onChange={handleChange(key as keyof FloorEditInput)}
      fullWidth
      error={!!errors[key]}
      helperText={errors[key]}
      type={
        ["FloorNo", "LengthFt", "BreadthFt", "PlinthAreaSqFt"].includes(key)
          ? "number"
          : "text"
      }
    />
  );
})}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button
            variant="contained"
            sx={{ bgcolor: '#C84C0E', color: '#fff', px: 5, borderRadius: 1 }}
            onClick={handleSave}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default EditFloorPopover;