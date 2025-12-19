
// This component provides a popover dialog for editing assessment details of a property.
// It supports form validation using a Zod schema and allows users to edit and save assessment fields.
// The component is reusable and receives its field configuration, labels, and validation schema via props.
import React, { useState, useEffect } from 'react';
import {  Box, Typography, Button, TextField, FormControlLabel, Checkbox, MenuItem, Dialog } from '@mui/material';
import { ZodType } from "zod";

// Editable fields for PUT assessment-details API (matches your request body)

// Type for the editable assessment fields, matching the expected API request body
export type AssessmentEditInput = {
  ReasonOfCreation: string;
  OccupancyCertificateNumber: string;
  OccupancyCertificateDate: string;
  ExtentOfSite: string;
  isLandUnderneathBuilding: string;
  isUnspecifiedShare: boolean;
  propertyId: string;
};


// Props for the EditAssessmentPopover component
interface EditAssessmentPopoverProps {
  open: boolean;
  onClose: () => void;
  fields: Partial<AssessmentEditInput>;
  labels: { [key in keyof AssessmentEditInput]?: string };
  onSave: (fields: Partial<AssessmentEditInput>) => void;
  schema: ZodType<any>;
  reasonOptions: Array<{ id: string; label: string }>;
}


const EditAssessmentPopover: React.FC<EditAssessmentPopoverProps> = ({
  open,
  onClose,
  fields,
  labels,
  onSave,
  schema,
  reasonOptions,
}) => {
  // Local state for the editable fields in the form
  const [localFields, setLocalFields] = useState(fields);
  // Local state for validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Reset local fields and errors when the popover is opened or fields change
  useEffect(() => {
    setLocalFields(fields);
    setErrors({});
  }, [fields, open]);

    useEffect(() => {
      console.log("Reason of Creation options:", reasonOptions);
    }, [reasonOptions]);

  const handleChange = (key: keyof AssessmentEditInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let value: string | boolean = e.target.value;
    // Special handling for checkbox (boolean field)
    if (key === "isUnspecifiedShare") {
      value = (e.target as HTMLInputElement).checked;
    }
    setLocalFields({
      ...localFields,
      [key]: value
    });

    // Validate the updated field using the Zod schema
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

  // Save edited fields to parent if valid
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
      {/* Title for the popover dialog */}
      <Typography variant="h6" sx={{ mb: 2, fontStyle: 'italic' }}>
        Edit Assessment Details
      </Typography>
      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Render editable assessment fields dynamically based on localFields */}
        {Object.entries(localFields).map(([key, value]) =>
          key === "isUnspecifiedShare" ? (
            // Render a checkbox for boolean field
            <FormControlLabel
              key={key}
              label={labels[key as keyof AssessmentEditInput] || key}
              control={
                <Checkbox
                  checked={!!value}
                  onChange={handleChange(key as keyof AssessmentEditInput)}
                  color="primary"
                />
              }
            />
          ) : key === "ReasonOfCreation" ? (
            <TextField
              key={key}
              select
              label={labels[key as keyof AssessmentEditInput] || key}
              value={
                reasonOptions.some(opt => opt.label === localFields.ReasonOfCreation)
                  ? localFields.ReasonOfCreation
                  : ""
              }
              onChange={handleChange("ReasonOfCreation")}
              fullWidth
              error={!!errors[key]}
              helperText={errors[key]}
            >
              <MenuItem value="">
                <em>Select Reason</em>
              </MenuItem>
              {reasonOptions.map(opt => (
                <MenuItem key={opt.id} value={opt.label}>{opt.label}</MenuItem>
              ))}
            </TextField>
          ) : (
            // Render a text field for string fields
            <TextField
              key={key}
              label={labels[key as keyof AssessmentEditInput] || key}
              value={value === undefined || value === null ? "" : String(value)}
              onChange={handleChange(key as keyof AssessmentEditInput)}
              fullWidth
              error={!!errors[key]}
              helperText={errors[key]}
              type="text"
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
export default EditAssessmentPopover;