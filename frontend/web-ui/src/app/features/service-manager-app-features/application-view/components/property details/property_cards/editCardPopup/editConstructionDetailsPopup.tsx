import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, MenuItem, Dialog } from '@mui/material';
import { ZodType } from "zod";

// Editable fields for PUT construction-details API (matches your request body)
export type ConstructionEditInput = {
  floorType: string;
  wallType: string;
  roofType: string;
  woodType: string;
  propertyId: string;
};

interface EditConstructionPopoverProps {
  open: boolean;
  onClose: () => void;
  fields: Partial<ConstructionEditInput>;
  labels: { [key in keyof ConstructionEditInput]?: string };
  onSave: (fields: Partial<ConstructionEditInput>) => void;
  schema: ZodType<any>;
  floorTypeOptions: Array<{ id: string; label: string }>;
  wallTypeOptions: Array<{ id: string; label: string }>;
  roofTypeOptions: Array<{ id: string; label: string }>;
  woodTypeOptions: Array<{ id: string; label: string }>;
}

const EditConstructionPopover: React.FC<EditConstructionPopoverProps> = ({
  open,
  onClose,
  fields,
  labels,
  onSave,
  schema,
  floorTypeOptions,
  wallTypeOptions,
  roofTypeOptions,
  woodTypeOptions,
}) => {
  const [localFields, setLocalFields] = useState(fields);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setLocalFields(fields);
    setErrors({});
  }, [fields, open]);

  const handleChange = (key: keyof ConstructionEditInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let value: string = e.target.value;
    setLocalFields({
      ...localFields,
      [key]: value,
    });

    // Live validation
    const result = schema.safeParse({
      ...localFields,
      [key]: value
    });
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors(Object.fromEntries(Object.entries(fieldErrors).map(([k, v]) => [k, v?.[0] || ""])));
    } else {
      setErrors({});
    }
  };

  const handleSave = () => {
    const result = schema.safeParse(localFields);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors(Object.fromEntries(Object.entries(fieldErrors).map(([k, v]) => [k, v?.[0] || ""])));
      return;
    }
    setErrors({});
    onSave(localFields);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { p: 4, minWidth: 400, borderRadius: 3, boxShadow: 6 } }}
      // transformOrigin={{
      //   vertical: 'center',
      //   horizontal: 'center',
      // }}
      // anchorOrigin={{
      //   vertical: 'bottom',
      //   horizontal: 'center',
      // }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontStyle: 'italic' }}>
        Edit Construction Details
      </Typography>
      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Only the editable construction fields for PUT */}
        {Object.entries(localFields).map(([key, value]) => {
          if (key === "FloorType") {
            return (
              <TextField
                key={key}
                select
                label={labels[key as keyof ConstructionEditInput] || "Floor Type"}
                value={value === undefined || value === null ? "" : String(value)}
                onChange={handleChange(key as keyof ConstructionEditInput)}
                fullWidth
                error={!!errors[key]}
                helperText={errors[key]}
              >
                <MenuItem value="">
                  <em>Select Floor Type</em>
                </MenuItem>
                {floorTypeOptions.map(opt => (
                  <MenuItem key={opt.id} value={opt.label}>{opt.label}</MenuItem>
                ))}
              </TextField>
            );
          }
          if (key === "WallType") {
            return (
              <TextField
                key={key}
                select
                label={labels[key as keyof ConstructionEditInput] || "Wall Type"}
                value={value === undefined || value === null ? "" : String(value)}
                onChange={handleChange(key as keyof ConstructionEditInput)}
                fullWidth
                error={!!errors[key]}
                helperText={errors[key]}
              >
                <MenuItem value="">
                  <em>Select Wall Type</em>
                </MenuItem>
                {wallTypeOptions.map(opt => (
                  <MenuItem key={opt.id} value={opt.label}>{opt.label}</MenuItem>
                ))}
              </TextField>
            );
          }
          if (key === "RoofType") {
            return (
              <TextField
                key={key}
                select
                label={labels[key as keyof ConstructionEditInput] || "Roof Type"}
                value={value === undefined || value === null ? "" : String(value)}
                onChange={handleChange(key as keyof ConstructionEditInput)}
                fullWidth
                error={!!errors[key]}
                helperText={errors[key]}
              >
                <MenuItem value="">
                  <em>Select Roof Type</em>
                </MenuItem>
                {roofTypeOptions.map(opt => (
                  <MenuItem key={opt.id} value={opt.label}>{opt.label}</MenuItem>
                ))}
              </TextField>
            );
          }
          if (key === "WoodType") {
            return (
              <TextField
                key={key}
                select
                label={labels[key as keyof ConstructionEditInput] || "Wood Type"}
                value={value === undefined || value === null ? "" : String(value)}
                onChange={handleChange(key as keyof ConstructionEditInput)}
                fullWidth
                error={!!errors[key]}
                helperText={errors[key]}
              >
                <MenuItem value="">
                  <em>Select Wood Type</em>
                </MenuItem>
                {woodTypeOptions.map(opt => (
                  <MenuItem key={opt.id} value={opt.label}>{opt.label}</MenuItem>
                ))}
              </TextField>
            );
          }
          // Default text field for other fields
          return (
            <TextField
              key={key}
              label={labels[key as keyof ConstructionEditInput] || key}
              value={value === undefined || value === null ? "" : String(value)}
              onChange={handleChange(key as keyof ConstructionEditInput)}
              fullWidth
              error={!!errors[key]}
              helperText={errors[key]}
              type="text"
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

export default EditConstructionPopover;