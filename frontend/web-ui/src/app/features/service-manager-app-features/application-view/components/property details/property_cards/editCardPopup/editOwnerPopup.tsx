
// This component provides a dialog for editing owner details of a property.
// It supports form validation using a Zod schema and allows users to edit and save owner-related fields.
// The component is reusable and receives its field configuration, labels, and validation schema via props.
import React, { useState, useEffect } from 'react';
import { Dialog, Box, Typography, Button, TextField, FormControlLabel, Checkbox, MenuItem } from '@mui/material';
import { ownerSchema } from "../../../../zod/validationSchemas"; // adjust path if needed

// Type for the editable owner fields, matching the expected API request body
export type OwnerEditInput = {
  ID: string;
  name: string;
  contactNo: string;
  email: string;
  gender: string;
  guardian: string;
  guardianType: string;
  relationshipToProperty: string;
  ownershipShare: number;
  isPrimaryOwner: boolean;
  AdhaarNo: number;
};


// Props for the EditOwnerPopover component
interface EditOwnerPopoverProps {
  open: boolean; // Whether the dialog is open
  onClose: () => void; // Function to close the dialog
  fields: Partial<OwnerEditInput>; // Initial values for the editable fields
  labels: { [key in keyof OwnerEditInput]?: string }; // Field labels for display
  onSave: (fields: Partial<OwnerEditInput>) => void; // Callback to save the edited fields
  schema: typeof ownerSchema; // Zod schema for validation
  genderOptions: Array<{ id: string; name: string }>;
  guardianRelationshipOptions: Array<{ id: string; name: string }>;
}


const EditOwnerPopover: React.FC<EditOwnerPopoverProps> = ({
  open,
  onClose,
  fields,
  labels,
  onSave,
  schema,
  genderOptions,
  guardianRelationshipOptions
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
  const handleChange = (key: keyof OwnerEditInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let value: string | number | boolean = e.target.value;

    // Convert numeric and boolean fields appropriately
    if (key === "ownershipShare") value = Number(value);
    if (key === "isPrimaryOwner") value = (e.target as HTMLInputElement).checked;
    if (key === "AdhaarNo") value = Number(value);
    setLocalFields({
      ...localFields,
      [key]: value,
    });

    // Immediate validation as user types using the Zod schema
    const result = schema.safeParse({
      ...localFields,
      [key]: value,
    });
    if (result.success) {
      setErrors({});
    } else {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        const key = issue.path.at(-1)?.toString() || 'unknown';
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
    }
  };

  // Save the edited fields if validation passes, otherwise show errors
  const handleSave = () => {
    console.log("EditOwnerPopover handleSave localFields:", localFields);
    const result = schema.safeParse(localFields);
    if (result.success) {
      setErrors({});
      console.log("Calling onSave from EditOwnerPopover with:", localFields);
      onSave(localFields);
      onClose();
      return;
    }
    
    const fieldErrors: Record<string, string> = {};
    result.error.issues.forEach(issue => {
      const key = issue.path.at(-1)?.toString() || 'unknown';
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    });
    setErrors(fieldErrors);
    console.log("Validation errors:", fieldErrors);
  };


  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        backdrop: {
          sx: { backgroundColor: 'rgba(0,0,0,0.3)' }
        },
        paper: { sx: { p: 4, minWidth: 400, borderRadius: 3, boxShadow: 6 } }
      }}
    >
      {/* Title for the dialog */}
      <Typography variant="h6" sx={{ mb: 2, fontStyle: 'italic' }}>
        Edit Owner Details
      </Typography>
      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Render editable owner fields dynamically based on localFields */}
        {Object.entries(localFields).map(([key, value]) => {
          if (key === "isPrimaryOwner") {
            // Render a checkbox for the boolean field
            return (
              <FormControlLabel
                key={key}
                label={labels[key as keyof OwnerEditInput] || "Is Primary Owner"}
                control={
                  <Checkbox
                    checked={!!value}
                    onChange={handleChange(key as keyof OwnerEditInput)}
                    color="primary"
                  />
                }
              />
            );
          }
          
          if (key === "Gender") {
            return (
              <TextField
                key={key}
                select
                label={labels[key as keyof OwnerEditInput] || "Gender"}
                value={value ?? ""}
                onChange={handleChange(key as keyof OwnerEditInput)}
                fullWidth
                error={!!errors[key]}
                helperText={errors[key]}
              >
                <MenuItem value="" disabled>
                  <em >Select Gender</em>
                </MenuItem>
                {genderOptions.map(option => (
                  <MenuItem key={option.id} value={option.name}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            );
          }
          if (key === "GuardianType") {
            return (
              <TextField
              key={key}
              select
              label={labels[key as keyof OwnerEditInput] || "Guardian Type"}
              value={value ?? ""}
              onChange={handleChange(key as keyof OwnerEditInput)}
              fullWidth
              error={!!errors[key]}
              helperText={errors[key]}
            >
              <MenuItem value="" disabled>
                <em>Select Guardian Relationship</em>
              </MenuItem>
              {guardianRelationshipOptions.map(option => (
                <MenuItem key={option.id} value={option.name}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
            );
          }
          
          // Render a text or number field for other owner details
          return (
            <TextField
              key={key}
              label={labels[key as keyof OwnerEditInput] || key}  
              value={value === undefined || value === null ? "" : String(value)}
              onChange={handleChange(key as keyof OwnerEditInput)}
              fullWidth
              error={!!errors[key]}
              helperText={errors[key]}
              type={key === "ownershipShare" || key === "AdhaarNo" ? "number" : "text"}
              slotProps={{
                htmlInput: key === "AdhaarNo" ? { maxLength: 12 } : undefined
              }}
            />
          );
        })}
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
export default EditOwnerPopover;