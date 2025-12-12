
// This component provides a dialog for editing basic property details (not nested objects) of a property.
// It supports form validation using a Zod schema and allows users to edit and save property-related fields.
// The component is reusable and receives its field configuration, labels, and validation schema via props.
import React, { useState, useEffect } from 'react';
import { Dialog, Box, Typography, Button, TextField, MenuItem } from '@mui/material';
import { ZodType } from "zod";

export type Property = {
  ID: string;
  PropertyNo: string;
  OwnershipType: string;
  PropertyType: string;
  ComplexName: string;
};


// Props for the EditPropertyPopover component
interface EditPropertyPopoverProps {
  open: boolean; 
  onClose: () => void; 
  fields: Partial<Property>; 
  labels: { [key in keyof Property]?: string }; 
  onSave: (fields: Partial<Property>) => void;
  schema: ZodType<any>; 
  ownershipOptions: Array<{ id: string; name: string }>;
  propertyTypeOptions: Array<{ id: string; name: string }>;
}


const EditPropertyPopover: React.FC<EditPropertyPopoverProps> = ({
  open,
  onClose,
  fields,
  labels,
  onSave,
  schema,
  ownershipOptions,
  propertyTypeOptions,
}) => {
  // Local state for the editable fields in the form
  const [localFields, setLocalFields] = useState(fields);
  // Local state for validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Reset local fields and errors when the dialog is opened or fields change
  useEffect(() => {
    setLocalFields(fields);
    setErrors({});
  }, [fields, open]);

  // Handle changes to any field in the form
  const handleChange = (key: keyof Property) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFields({
      ...localFields,
      [key]: e.target.value
    });

    // Validate the updated field using the Zod schema
    const result = schema.safeParse({
      ...localFields,
      [key]: e.target.value
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

  // Save the edited fields if validation passes, otherwise show errors
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

  // Only render editable string fields, not nested objects.
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
       slotProps={{
          backdrop: { sx: { backgroundColor: 'rgba(0,0,0,0.3)' } },
          paper: { sx: { p: 4, minWidth: 400, borderRadius: 3, boxShadow: 6 } }
        }}
      >
      {/* Title for the dialog */}
      <Typography variant="h6" sx={{ mb: 2, fontStyle: 'italic' }}>
        Edit Property Details
      </Typography>
      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Render editable property fields dynamically based on localFields */}
        {Object.entries(localFields).map(([key, value]) =>
          key === "OwnershipType" ? (
            <TextField
              key={key}
              select
              label={labels[key as keyof Property] || "Ownership Type"}
              value={value ?? ""}
              onChange={handleChange(key as keyof Property)}
              fullWidth
              error={!!errors[key]}
              helperText={errors[key]}
            >
              <MenuItem value="">
                <em>Select Ownership Type</em>
              </MenuItem>
              {ownershipOptions.map(option => (
                <MenuItem key={option.id} value={option.name}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
          ) : key === "PropertyType" ? (
            <TextField
              key={key}
              select
              label={labels[key as keyof Property] || "Property Type"}
              value={value ?? ""}
              onChange={handleChange(key as keyof Property)}
              fullWidth
              error={!!errors[key]}
              helperText={errors[key]}
            >
              <MenuItem value="">
                <em>Select Property Type</em>
              </MenuItem>
              {propertyTypeOptions.map(option => (
                <MenuItem key={option.id} value={option.name}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
          ) : (
            // Render a text field for each property detail
          <TextField
              key={key}
              label={labels[key as keyof Property] || key}
              value={value === undefined || value === null ? "" : String(value)}
              onChange={handleChange(key as keyof Property)}
              fullWidth
              error={!!errors[key]}
              helperText={errors[key]}
              type="text"
              disabled={key === "PropertyNo"}
            />
          )
        )}
        {/* Save button to submit the form */}
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


// Export the popover component for use in parent components
export default EditPropertyPopover;