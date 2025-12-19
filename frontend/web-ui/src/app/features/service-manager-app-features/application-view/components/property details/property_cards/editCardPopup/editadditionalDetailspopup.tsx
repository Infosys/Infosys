
// Popup dialog component for editing additional property details, with validation.
import React, { useState, useEffect } from 'react';
import { Dialog, Box, Typography, Button, TextField, FormControlLabel, Checkbox, MenuItem } from '@mui/material';
import { ZodType } from "zod";


// Shape of the additional details field values
export type AdditionalDetailsFieldValue = {
  spaces?: number;
  covered?: boolean;
  type?: string;
  monthly_fee?: number;
  reserved_spaces?: number;
  reasonForCreation?: string;
  documentType?: string;
  [key: string]: string | number | boolean | undefined;
};


// Editable fields for PUT additional-property-details API
export type AdditionalDetailsEditInput = {
  fieldName: string; // Name of the field being edited
  fieldValue: AdditionalDetailsFieldValue; // Values for the additional details
  propertyId: string; // Associated property ID
};


// Props for the EditAdditionalDetailsPopover component
interface EditAdditionalDetailsPopoverProps {
  open: boolean; // Whether the dialog is open
  onClose: () => void; // Handler to close the dialog
  fields: Partial<AdditionalDetailsEditInput>; // Initial field values
  labels: { [key: string]: string }; // Field labels for display
  onSave: (fields: Partial<AdditionalDetailsEditInput>) => void; // Handler for saving the changes
  schema: ZodType<any>; // Zod schema for validation
  reasonOptions?: Array<{ code: string; name: string }>;
  documentTypes: Array<{ id: number; name: string }>;
}


const EditAdditionalDetailsPopover: React.FC<EditAdditionalDetailsPopoverProps> = ({
  open,
  onClose,
  fields,
  labels,
  onSave,
  schema,
  reasonOptions = [],
  documentTypes = [],
}) => {
  // Extract nested fieldValue from fields
  const fieldValue = fields.fieldValue || {};

  // Local state for the editable fields
  const [localFields, setLocalFields] = useState<AdditionalDetailsEditInput>({
    fieldName: fields.fieldName ?? "",
    fieldValue: { ...fieldValue },
    propertyId: fields.propertyId ?? "",
  });
  // Local state for validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Reset local fields and errors when dialog opens or fields change
  useEffect(() => {
    setLocalFields({
      fieldName: fields.fieldName ?? "",
      fieldValue: { ...fieldValue },
      propertyId: fields.propertyId ?? "",
    });
    setErrors({});
    // eslint-disable-next-line
  }, [fields, open]);

  // Handle change for nested fieldValue properties
  const handleFieldValueChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let value: string | number | boolean = e.target.value;
    // Convert to number for numeric fields
    if (key === "spaces" || key === "monthly_fee" || key === "reserved_spaces") value = Number(value);
    // Convert to boolean for checkbox
    if (key === "covered") value = (e.target as HTMLInputElement).checked;
    setLocalFields(prev => ({
      ...prev,
      fieldValue: {
        ...prev.fieldValue,
        [key]: value,
      },
    }));

    // Validate the updated input using the schema
    const result = schema.safeParse({
      ...localFields,
      fieldValue: {
        ...localFields.fieldValue,
        [key]: value,
      },
    });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors(Object.fromEntries(Object.entries(fieldErrors).map(([k, v]) => [k, v?.[0] || ""])));
    } else {
      setErrors({});
    }
  };

  // Handle change for top-level fields (fieldName, propertyId)
  const handleChange = (key: "fieldName" | "propertyId") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalFields(prev => ({
      ...prev,
      [key]: value,
    }));

    // Validate the updated input using the schema
    const result = schema.safeParse({
      ...localFields,
      [key]: value,
    });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors(Object.fromEntries(Object.entries(fieldErrors).map(([k, v]) => [k, v?.[0] || ""])));
    } else {
      setErrors({});
    }
  };

   // Handler for saving the edited details
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
      // fullWidth
      // maxWidth="sm"
      // BackdropProps={{
      //   sx: { backgroundColor: 'rgba(0,0,0,0.3)' }
      // }}
      PaperProps={{ sx: { p: 4, minWidth: 500, borderRadius: 3, boxShadow: 6 } }}
    >
      <Box>
        {/* Dialog title */}
        <Typography variant="h6" sx={{ mb: 2, fontStyle: 'italic' }}>
          Edit Additional Details
        </Typography>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Top level inputs for field name and property ID */}
          <TextField
            label={labels["fieldName"] || "Field Name"}
            value={localFields.fieldName}
            onChange={handleChange("fieldName")}
            fullWidth
            error={!!errors["fieldName"]}
            helperText={errors["fieldName"]}
            type="text"
          />
          {/* <TextField
            label={labels["propertyId"] || "Property ID"}
            value={localFields.propertyId}
            onChange={handleChange("propertyId")}
            fullWidth
            error={!!errors["propertyId"]}
            helperText={errors["propertyId"]}
            type="text"
          /> */}
          {/* Section for editing nested field values */}
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Field Values
          </Typography>
          {/* Render each fieldValue input, using checkbox for boolean fields */}
          {Object.entries(localFields.fieldValue).map(([key, value]) => {
            // Dropdown for reasonForCreation
            if (key === "reasonForCreation" && reasonOptions.length > 0) {
              return (
                <TextField
                  key={key}
                  select
                  label={labels[key] || "Reason for Creation"}
                  value={value ?? ""}
                  onChange={handleFieldValueChange(key)}
                  fullWidth
                  error={!!errors[key]}
                  helperText={errors[key]}
                >
                  {reasonOptions.map(option => (
                    <MenuItem key={option.code} value={option.code}>
                      {option.name}
                    </MenuItem>
                  ))}
                </TextField>
              );
            }
            // Dropdown for documentType
            if (key === "DocumentType" && documentTypes.length > 0) {
  return (
    <TextField
      key={key}
      select
      label={labels[key] || "Document Type"}
      value={value === undefined || value === null ? "" : String(value)}
      onChange={handleFieldValueChange(key)}
      fullWidth
      error={!!errors[key]}
      helperText={errors[key]}
      SelectProps={{
        MenuProps: {
          PaperProps: {
            style: {
              maxHeight: 200,
              // zIndex: 1500, 
            },
          },
        },
      }}
    >
      <MenuItem value="">Select Document Type</MenuItem>
      {documentTypes.map(opt => (
        <MenuItem key={opt.id} value={opt.name}>{opt.name}</MenuItem>
      ))}
    </TextField>
  );
}
            // Checkbox for covered
            if (key === "covered") {
              return (
                <FormControlLabel
                  key={key}
                  label={labels[key] || key}
                  control={
                    <Checkbox
                      checked={!!value}
                      onChange={handleFieldValueChange(key)}
                      color="primary"
                    />
                  }
                />
              );
            }
            // Default text/number input
            return (
              <TextField
                key={key}
                label={labels[key] || key}
                value={value === undefined || value === null ? "" : String(value)}
                onChange={handleFieldValueChange(key)}
                fullWidth
                error={!!errors[key]}
                helperText={errors[key]}
                type={
                  ["spaces", "monthly_fee", "reserved_spaces"].includes(key)
                    ? "number"
                    : "text"
                }
              />
            );
          })}
          {/* Save button */}
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
      </Box>
    </Dialog>
  );
};

export default EditAdditionalDetailsPopover;