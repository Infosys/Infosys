
// Popup dialog component for editing property amenities, with validation and checkbox selection.
import React, { useState, useEffect } from 'react';
import { Dialog, Box, Typography, Button, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { ZodType } from "zod";


// Editable fields for PUT amenities API
export type AmenitiesEditInput = {
  property_id: string; // Property ID
  type: string[];      // List of selected amenity types
};


// Props for the EditAmenitiesPopover component
interface EditAmenitiesPopoverProps {
  open: boolean;
  onClose: () => void;
  fields: Partial<AmenitiesEditInput>;
  onSave: (fields: Partial<AmenitiesEditInput>) => void;
  schema: ZodType<any>;
  options: Array<{ key: string; label: string }>;
}


const EditAmenitiesPopover: React.FC<EditAmenitiesPopoverProps> = ({
  open,
  onClose,
  fields,
  onSave,
  schema,
  options,
}) => {
  // State for amenity checkbox selections
  const [amenityCheckboxes, setAmenityCheckboxes] = useState<{ [key: string]: boolean }>({});

  // Reset amenity checkboxes when dialog opens or fields/options change
  useEffect(() => {
    const checkedArr = Array.isArray(fields.type) ? fields.type : [];
    setAmenityCheckboxes(
      Object.fromEntries(options.map(opt => [opt.label, checkedArr.includes(opt.label)]))
    );
  }, [fields, open, options]);

  const handleCheckboxChange = (label: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAmenityCheckboxes(prev => ({
      ...prev,
      [label]: event.target.checked
    }));
  };

  // Handler for saving the selected amenities
  const handleSave = () => {
    const checkedAmenities = Object.entries(amenityCheckboxes)
      .filter(([_, checked]) => checked)
      .map(([label]) => label);

    const property_id = fields.property_id ?? "";
    const dataToValidate: Partial<AmenitiesEditInput> = {
      property_id,
      type: checkedAmenities,
    };

    // Validate the selected amenities using the schema
    const result = schema.safeParse(dataToValidate);
    if (!result.success) {
      return;
    }

    onSave(dataToValidate);
    onClose();
  };


  return (
    <Dialog
      open={open}
      onClose={onClose}
      // BackdropProps={{
      //   sx: { backgroundColor: 'rgba(0,0,0,0.3)' } // Lower opacity for dim effect
      // }}
      PaperProps={{ sx: { p: 4, minWidth: 300, borderRadius: 3, boxShadow: 6 } }}
    >
      {/* Dialog title */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Edit Amenities
      </Typography>
      {/* Checkbox group for amenity options */}
      <FormGroup>
        {options.map(opt => (
          <FormControlLabel
            key={opt.key}
            control={
              <Checkbox
                checked={!!amenityCheckboxes[opt.label]}
                onChange={handleCheckboxChange(opt.label)}
              />
            }
            label={opt.label}
          />
        ))}
      </FormGroup>
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
    </Dialog>
  );
};

export default EditAmenitiesPopover;