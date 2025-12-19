import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, MenuItem, Dialog } from '@mui/material';
import { ZodType } from "zod";

// Only the editable fields for IGRS PUT (based on request example)
export type IGRSEditInput = {
  propertyId: string;
  habitation: string;
  igrsWard: string;
  igrsLocality: string;
  igrsBlock?: string;
  doorNoFrom?: string;
  doorNoTo?: string;
  igrsClassification?: string;
  builtUpAreaPct: number;
  frontSetback?: number;
  rearSetback?: number;
  sideSetback?: number;
  totalPlinthArea: number;
};

interface EditIGSRPopoverProps {
  open: boolean;
  onClose: () => void;
  fields: Partial<IGRSEditInput>;
  labels: { [key in keyof IGRSEditInput]?: string };
  onSave: (fields: Partial<IGRSEditInput>) => void;
  schema: ZodType<any>;
  igrsBlockOptions: Array<{ id: string; label: string }>;
  igrsWardOptions: Array<{ id: string; label: string }>;
  igrsClassificationOptions: Array<{ id: string; label: string }>;
  igrsLocalityOptions: Array<{ id: string; label: string }>;
}

const EditIGSRPopover: React.FC<EditIGSRPopoverProps> = ({
  open,
  onClose,
  fields,
  labels,
  onSave,
  schema,
  igrsBlockOptions,
  igrsWardOptions,
  igrsClassificationOptions,
  igrsLocalityOptions,
}) => {
  const [localFields, setLocalFields] = useState(fields);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setLocalFields(fields);
    setErrors({});
  }, [fields, open]);

  const handleChange = (key: keyof IGRSEditInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let value: string | number = e.target.value;
    if (
      key === "builtUpAreaPct" ||
      key === "totalPlinthArea" ||
      key === "frontSetback" ||
      key === "rearSetback" ||
      key === "sideSetback"
    ) {
      value = Number(value);
    }
    setLocalFields({
      ...localFields,
      [key]: value
    });

    const result = schema.safeParse({
      ...localFields,
      [key]: value
    });
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors(
        Object.fromEntries(
          Object.entries(fieldErrors).map(([k, v]) => [k, v?.[0] || ""])
        )
      );
    } else {
      setErrors({});
    }
  };

  const handleSave = () => {
    const result = schema.safeParse(localFields);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors(
        Object.fromEntries(
          Object.entries(fieldErrors).map(([k, v]) => [k, v?.[0] || ""])
        )
      );
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
        Edit IGSR Details
      </Typography>
      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Render only editable IGSR fields for PUT request */}
        {Object.entries(localFields).map(([key, value]) => {
          if (key === "igrsBlock") {
            return (
              <TextField
                key={key}
                select
                label={labels[key as keyof IGRSEditInput] || "Block"}
                value={value === undefined || value === null ? "" : String(value)}
                onChange={handleChange(key as keyof IGRSEditInput)}
                fullWidth
                error={!!errors[key]}
                helperText={errors[key]}
              >
                <MenuItem value="">
                  <em>Select Block</em>
                </MenuItem>
                {igrsBlockOptions.map(opt => (
                  <MenuItem key={opt.id} value={opt.label}>{opt.label}</MenuItem>
                ))}
              </TextField>
            );
          }
          if (key === "igrsWard") {
            return (
              <TextField
                key={key}
                select
                label={labels[key as keyof IGRSEditInput] || "Ward"}
                value={value === undefined || value === null ? "" : String(value)}
                onChange={handleChange(key as keyof IGRSEditInput)}
                fullWidth
                error={!!errors[key]}
                helperText={errors[key]}
              >
                <MenuItem value="">
                  <em>Select Ward</em>
                </MenuItem>
                {igrsWardOptions.map(opt => (
                  <MenuItem key={opt.id} value={opt.label}>{opt.label}</MenuItem>
                ))}
              </TextField>
            );
          }
          if (key === "igrsClassification") {
            return (
              <TextField
                key={key}
                select
                label={labels[key as keyof IGRSEditInput] || "Classification"}
                value={value === undefined || value === null ? "" : String(value)}
                onChange={handleChange(key as keyof IGRSEditInput)}
                fullWidth
                error={!!errors[key]}
                helperText={errors[key]}
              >
                <MenuItem value="">
                  <em>Select Classification</em>
                </MenuItem>
                {igrsClassificationOptions.map(opt => (
                  <MenuItem key={opt.id} value={opt.label}>{opt.label}</MenuItem>
                ))}
              </TextField>
            );
          }
          if (key === "igrsLocality") {
            return (
              <TextField
                key={key}
                select
                label={labels[key as keyof IGRSEditInput] || "Locality"}
                value={value === undefined || value === null ? "" : String(value)}
                onChange={handleChange(key as keyof IGRSEditInput)}
                fullWidth
                error={!!errors[key]}
                helperText={errors[key]}
              >
                <MenuItem value="">
                  <em>Select Locality</em>
                </MenuItem>
                {igrsLocalityOptions.map(opt => (
                  <MenuItem key={opt.id} value={opt.label}>{opt.label}</MenuItem>
                ))}
              </TextField>
            );
          }
          // Default text/number field for other fields
          return (
            <TextField
              key={key}
              label={labels[key as keyof IGRSEditInput] || key}
              value={value === undefined || value === null ? "" : String(value)}
              onChange={handleChange(key as keyof IGRSEditInput)}
              fullWidth
              error={!!errors[key]}
              helperText={errors[key]}
              type={
                [
                  "sideSetback",
                  "rearSetback",
                  "frontSetback",
                  "totalPlinthArea",
                  "builtUpAreaPct"
                ].includes(key) ? "number" : "text"
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

export default EditIGSRPopover;