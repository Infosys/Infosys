import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, FormControlLabel, Checkbox, MenuItem, Dialog } from '@mui/material';
import { ZodType } from "zod";

// Editable fields for PUT address-details API
export type AddressEditInput = {
  Locality: string;
  ZoneNo: string;
  WardNo: string;
  BlockNo: string;
  Street: string;
  ElectionWard: string;
  SecretariatWard: string;
  PinCode: number;
  DifferentCorrespondenceAddress: boolean;
  PropertyId: string;
  CorrespondenceAddress1: string;
  CorrespondenceAddress2: string;
  CorrespondenceAddress3: string;
};

interface EditAddressPopoverProps {
  open: boolean;
  onClose: () => void;
  fields: Partial<AddressEditInput>;
  labels: { [key in keyof AddressEditInput]?: string };
  onSave: (fields: Partial<AddressEditInput>) => void;
  schema: ZodType<any>;
  blockNoOptions: Array<{ id: string; name: string }>;
  wardNoOptions: Array<{ id: string; name: string }>;
  electionWardOptions: Array<{ id: string; name: string }>;
  secretariatWardOptions: Array<{ id: string; name: string }>;
}

const EditAddressPopover: React.FC<EditAddressPopoverProps> = ({
  open,
  onClose,
  fields,
  labels,
  onSave,
  schema,
  blockNoOptions,
  wardNoOptions,
  electionWardOptions,
  secretariatWardOptions,
}) => {
  const [localFields, setLocalFields] = useState(fields);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setLocalFields(fields);
    setErrors({});
  }, [fields, open]);

  const handleChange = (key: keyof AddressEditInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let value: string | number | boolean = e.target.value;
    if (key === "PinCode") value = Number(value);
    if (key === "DifferentCorrespondenceAddress") value = (e.target as HTMLInputElement).checked;

    setLocalFields({
      ...localFields,
      [key]: value,
    });

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
     
    >
      <Typography variant="h6" sx={{ mb: 2, fontStyle: 'italic' }}>
        Edit Address Details
      </Typography>
      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {Object.entries(localFields).map(([key, value]) => {
          // Skip CorrespondenceAddress fields if not present in backend
          if (
            key === "correspondenceAddress1" ||
            key === "correspondenceAddress2" ||
            key === "correspondenceAddress3"
          ) {
            return null;
          }

          if (key === "DifferentCorrespondenceAddress") {
            return (
              <FormControlLabel
                key={key}
                label={labels[key as keyof AddressEditInput] || "Different Correspondence Address"}
                control={
                  <Checkbox
                    checked={!!value}
                    onChange={handleChange(key as keyof AddressEditInput)}
                    color="primary"
                  />
                }
              />
            );
          }

          // Dropdowns for MDMS options
          if (key === "BlockNo") {
            return (
              <TextField
                key={key}
                select
                label={labels[key as keyof AddressEditInput] || key}
                value={value === undefined || value === null ? "" : String(value)}
                onChange={handleChange(key as keyof AddressEditInput)}
                fullWidth
                error={!!errors[key]}
                helperText={errors[key]}
              >
                <MenuItem value="">
                  <em>Select Block</em>
                </MenuItem>
                {blockNoOptions.map(opt => (
                  <MenuItem key={opt.id} value={opt.name}>{opt.name}</MenuItem>
                ))}
              </TextField>
            );
          }
          if (key === "WardNo") {
            return (
              <TextField
                key={key}
                select
                label={labels[key as keyof AddressEditInput] || key}
                value={value === undefined || value === null ? "" : String(value)}
                onChange={handleChange(key as keyof AddressEditInput)}
                fullWidth
                error={!!errors[key]}
                helperText={errors[key]}
              >
                <MenuItem value="">
                  <em>Select Ward</em>
                </MenuItem>
                {wardNoOptions.map(opt => (
                  <MenuItem key={opt.id} value={opt.name}>{opt.name}</MenuItem>
                ))}
              </TextField>
            );
          }
          if (key === "ElectionWard") {
            return (
              <TextField
                key={key}
                select
                label={labels[key as keyof AddressEditInput] || key}
                value={value === undefined || value === null ? "" : String(value)}
                onChange={handleChange(key as keyof AddressEditInput)}
                fullWidth
                error={!!errors[key]}
                helperText={errors[key]}
              >
                <MenuItem value="">
                  <em>Select Election Ward</em>
                </MenuItem>
                {electionWardOptions.map(opt => (
                  <MenuItem key={opt.id} value={opt.name}>{opt.name}</MenuItem>
                ))}
              </TextField>
            );
          }
          if (key === "SecretariatWard") {
            return (
              <TextField
                key={key}
                select
                label={labels[key as keyof AddressEditInput] || key}
                value={value === undefined || value === null ? "" : String(value)}
                onChange={handleChange(key as keyof AddressEditInput)}
                fullWidth
                error={!!errors[key]}
                helperText={errors[key]}
              >
                <MenuItem value="">
                  <em>Select Secretariat Ward</em>
                </MenuItem>
                {secretariatWardOptions.map(opt => (
                  <MenuItem key={opt.id} value={opt.name}>{opt.name}</MenuItem>
                ))}
              </TextField>
            );
          }

          // Default text field for other fields
          return (
            <TextField
              key={key}
              label={labels[key as keyof AddressEditInput] || key}
              value={value === undefined || value === null ? "" : String(value)}
              onChange={handleChange(key as keyof AddressEditInput)}
              fullWidth
              error={!!errors[key]}
              helperText={errors[key]}
              type={key === "PinCode" ? "number" : "text"}
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

export default EditAddressPopover;