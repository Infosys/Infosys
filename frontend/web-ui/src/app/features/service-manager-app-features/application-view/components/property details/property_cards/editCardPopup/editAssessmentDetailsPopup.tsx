// This component provides a popover dialog for editing assessment details of a property.
// It supports form validation using a Zod schema and allows users to edit and save assessment fields.
// The component is reusable and receives its field configuration, labels, and validation schema via props.
import React, { useState, useEffect } from 'react';
import {  Box, Typography, Button, TextField, FormControlLabel, Checkbox, MenuItem, Dialog } from '@mui/material';
import { ZodType } from "zod";
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
  labels: { [key in keyof AssessmentEditInput]?: string | ((unit?: string) => string) };
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
    // Clean up: if OccupancyCertificateNumber is empty, set OccupancyCertificateDate to empty string
    const cleanedFields = { ...fields };
    if (!cleanedFields.OccupancyCertificateNumber || cleanedFields.OccupancyCertificateNumber === "") {
      cleanedFields.OccupancyCertificateDate = "";
    }
    setLocalFields(cleanedFields);
    setErrors({});
  }, [fields, open]);


  const handleChange = (key: keyof AssessmentEditInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let value: string | boolean = e.target.value;
    // Special handling for checkbox (boolean field)
    if (key === "isUnspecifiedShare") {
      value = (e.target as HTMLInputElement).checked;
    }
    
    const updatedFields = {
      ...localFields,
      [key]: value
    };
    
    // If OccupancyCertificateNumber is set to empty, clear OccupancyCertificateDate
    if (key === "OccupancyCertificateNumber" && value === "") {
      updatedFields.OccupancyCertificateDate = "";
    }
    
    setLocalFields(updatedFields);

    // Validate the updated field using the Zod schema
    const result = schema.safeParse(updatedFields);
    if (result.success) {
      setErrors({});
    } else {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        const key = issue.path.at(-1)?.toString() || 'unknown';
        // Skip OccupancyCertificateDate errors if certificate number is empty
        if (key === 'OccupancyCertificateDate' && 
            (!updatedFields.OccupancyCertificateNumber || updatedFields.OccupancyCertificateNumber === "")) {
          return;
        }
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
    }
  };

  // Save edited fields to parent if valid
  const handleSave = () => {
    // Clean up: if OccupancyCertificateNumber is empty, ensure OccupancyCertificateDate is empty
    const cleanedFields = { ...localFields };
    if (!cleanedFields.OccupancyCertificateNumber || cleanedFields.OccupancyCertificateNumber === "") {
      cleanedFields.OccupancyCertificateDate = "";
    }
    
    const result = schema.safeParse(cleanedFields);
    if (result.success) {
      setErrors({});
      onSave(cleanedFields);
      onClose();
      return;
    }
    
    const fieldErrors: Record<string, string> = {};
    result.error.issues.forEach(issue => {
      const key = issue.path.at(-1)?.toString() || 'unknown';
      // Skip OccupancyCertificateDate errors if certificate number is empty
      if (key === 'OccupancyCertificateDate' && 
          (!cleanedFields.OccupancyCertificateNumber || cleanedFields.OccupancyCertificateNumber === "")) {
        return;
      }
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    });
    setErrors(fieldErrors);
  };

  // Helper to get display label from labels prop
  const getDisplayLabel = (key: string) => {
    const label = labels[key as keyof AssessmentEditInput];
    return typeof label === "function" ? label() : label || key;
  };

  // Render checkbox field
  const renderCheckboxField = (key: string, value: any) => (
    <FormControlLabel
      key={key}
      label={getDisplayLabel(key)}
      control={
        <Checkbox
          checked={!!value}
          onChange={handleChange(key as keyof AssessmentEditInput)}
          color="primary"
        />
      }
    />
  );

  // Render dropdown field for ReasonOfCreation
  const renderReasonDropdown = (key: string) => (
    <TextField
      key={key}
      select
      label={getDisplayLabel(key)}
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
  );

  // Render date field with validation
  const renderDateField = (key: string, value: any) => {
    const today = new Date().toISOString().split("T")[0];
    const isFutureDate = value && value > today;
    return (
      <TextField
        key={key}
        label={getDisplayLabel(key)}
        type="date"
        value={value || ""}
        onChange={handleChange(key as keyof AssessmentEditInput)}
        fullWidth
        error={!!errors[key] || isFutureDate}
        helperText={
          errors[key] || (isFutureDate ? "Future dates are not allowed" : "")
        }
        slotProps={{ 
          inputLabel: { shrink: true },
          htmlInput: { max: today }
        }}
      />
    );
  };

  // Render default text field
  const renderTextField = (key: string, value: any) => (
    <TextField
      key={key}
      label={getDisplayLabel(key)}
      value={value === undefined || value === null ? "" : String(value)}
      onChange={handleChange(key as keyof AssessmentEditInput)}
      fullWidth
      error={!!errors[key]}
      helperText={errors[key]}
      type="text"
      slotProps={{ inputLabel: { shrink: true } }}
    />
  );

  // Render individual field based on its type
  const renderField = (key: string, value: any) => {
    // Don't render OccupancyCertificateDate if OccupancyCertificateNumber is empty
    if (key === "OccupancyCertificateDate" && 
        (!localFields.OccupancyCertificateNumber || localFields.OccupancyCertificateNumber === "")) {
      return null;
    }
    
    if (key === "isUnspecifiedShare") return renderCheckboxField(key, value);
    if (key === "ReasonOfCreation") return renderReasonDropdown(key);
    if (key === "OccupancyCertificateDate") return renderDateField(key, value);
    return renderTextField(key, value);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{ paper: { sx: { p: 4, minWidth: 400, borderRadius: 3, boxShadow: 6 } } }}
    >
      {/* Title for the popover dialog */}
      <Typography variant="h6" sx={{ mb: 2, fontStyle: 'italic' }}>
        Edit Assessment Details
      </Typography>
      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Render editable assessment fields dynamically based on localFields */}
        {Object.entries(localFields).map(([key, value]) => renderField(key, value))}
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