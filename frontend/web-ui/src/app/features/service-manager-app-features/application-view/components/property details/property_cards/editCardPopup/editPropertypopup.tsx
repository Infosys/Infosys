// This component provides a dialog for editing basic property details (not nested objects) of a property.
// It supports form validation using a Zod schema and allows users to edit and save property-related fields.
// The component is reusable and receives its field configuration, labels, and validation schema via props.
import React, { useState, useEffect } from "react";
import {
  Dialog,
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";
import { ZodType } from "zod";
import vacant_land from "../../../../Assets/property-info-icons/border_outer.svg";
import land_with_structure from "../../../../Assets/property-info-icons/cottage.svg";
import land_with_multiple_structures from "../../../../Assets/property-info-icons/domain_add.svg";
import building_unit from "../../../../Assets/property-info-icons/scene.svg";

// Enum for land types - backend values
export const LandTypeValue = {
  VACANT: "vacant",
  STRUCTURE: "structure",
  MULTI: "multi",
  UNIT: "unit",
} as const;

export type LandTypeValue = (typeof LandTypeValue)[keyof typeof LandTypeValue];

export type Property = {
  ID: string;
  PropertyNo: string;
  OwnershipType: string;
  PropertyType: string;
  ComplexName: string;
  typeOfLand: string;
  noOfFloors: number;
  noOfBasements: number;
  noOfBuildings: number;
  hasMezzanineFloor: boolean;
  buildingName?: string;
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
console.log("local fields: ", localFields);

  // Separate state for structure and multi fields - initialize based on typeOfLand
  const [structureFloors, setStructureFloors] = useState<number>(
    localFields.typeOfLand === LandTypeValue.STRUCTURE ? (localFields.noOfFloors || 0) : 0
  );
  const [structureBasements, setStructureBasements] = useState<number>(
    localFields.typeOfLand === LandTypeValue.STRUCTURE ? (localFields.noOfBasements || 0) : 0
  );
  const [multiFloors, setMultiFloors] = useState<number>(
    localFields.typeOfLand === LandTypeValue.MULTI ? (localFields.noOfFloors || 0) : 0
  );
  const [multiBasements, setMultiBasements] = useState<number>(
    localFields.typeOfLand === LandTypeValue.MULTI ? (localFields.noOfBasements || 0) : 0
  );
  const [selectedBuildingName, setSelectedBuildingName] =
    useState<string>(
      localFields.typeOfLand === LandTypeValue.MULTI ? (localFields.buildingName || "") : ""
    );
  console.log("incoming local fields: ", localFields);

  // Reset local fields and errors when the dialog is opened or fields change
  useEffect(() => {
    setLocalFields(fields);
    setErrors({});
    console.log("Fields: ",fields );
    
  }, [fields]);

  // Handle changes to any field in the form
  const handleChange =
    (key: keyof Property) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      setLocalFields((prev) => {
        const updated = {
          ...prev,
          [key]: key === "hasMezzanineFloor" ? newValue === "Yes" : newValue,
        };
        return updated;
      });

      // Validate the updated field using the Zod schema
      const result = schema.safeParse({
        ...localFields,
        [key]: key === "hasMezzanineFloor" ? newValue === "Yes" : newValue,
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
    console.log("Cleaned Fields before adjustment:", localFields);
    // Prepare cleaned fields based on typeOfLand
    const newLocalFields = { ...localFields };

    if (newLocalFields.typeOfLand === LandTypeValue.STRUCTURE) {
      newLocalFields.noOfFloors = Number(structureFloors);
      newLocalFields.noOfBasements = Number(structureBasements);
    } else if (newLocalFields.typeOfLand === LandTypeValue.MULTI) {
      newLocalFields.noOfFloors = Number(multiFloors);
      newLocalFields.noOfBasements = Number(multiBasements);
      newLocalFields.noOfBuildings = Number(localFields.noOfBuildings || 0);
      newLocalFields.hasMezzanineFloor = false;
    }

    const result = schema.safeParse(newLocalFields);
    if (result.success) {
      setErrors({});
      onSave(newLocalFields);
      onClose();
      return;
    }
    
    const fieldErrors: Record<string, string> = {};
    result.error.issues.forEach(issue => {
      const key = issue.path.at(-1)?.toString() || 'unknown';
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    });
    setErrors(fieldErrors);
    console.log("Error occured", errors);
  };

  // Helper function to render the appropriate field based on the key
  const renderField = (key: string, value: any) => {
    if (key === "OwnershipType") {
      return (
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
          {ownershipOptions.map((option) => (
            <MenuItem key={option.id} value={option.name}>
              {option.name}
            </MenuItem>
          ))}
        </TextField>
      );
    }

    if (key === "PropertyType") {
      return (
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
          {propertyTypeOptions.map((option) => (
            <MenuItem key={option.id} value={option.name}>
              {option.name}
            </MenuItem>
          ))}
        </TextField>
      );
    }

    if (key === "typeOfLand") {
      const currentTypeOfLand = localFields.typeOfLand;

      return (
        <FormControl
          key={key}
          component="fieldset"
          error={!!errors[key]}
          fullWidth
        >
          <FormLabel component="legend" sx={{ mb: 1 }}>
            {labels[key as keyof Property] || "Type of Land"}
          </FormLabel>
          <RadioGroup
            value={currentTypeOfLand ?? ""}
            onChange={handleChange(key as keyof Property)}
          >
            {/* Vacant land */}
            <FormControlLabel
              value={LandTypeValue.VACANT}
              control={<Radio />}
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    component="img"
                    src={vacant_land}
                    alt="Vacant land"
                    sx={{ width: 24, height: 24 }}
                  />
                  Vacant land
                </Box>
              }
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: 1,
                mb: 1,
                mx: 0,
                px: 1,
                py: 1,
              }}
            />

            {/* Land with structure */}
            <Box
              sx={{
                border:
                  currentTypeOfLand === LandTypeValue.STRUCTURE
                    ? "2px solid #C84C0E"
                    : "1px solid #e0e0e0",
                borderRadius: 1,
                mb: 1,
                p: 2,
              }}
            >
              <FormControlLabel
                value={LandTypeValue.STRUCTURE}
                control={<Radio />}
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      component="img"
                      src={land_with_structure}
                      alt="Land with structure"
                      sx={{ width: 24, height: 24 }}
                    />
                    Land with structure
                  </Box>
                }
                sx={{
                  mb: currentTypeOfLand === LandTypeValue.STRUCTURE ? 2 : 0,
                }}
              />
              {currentTypeOfLand === LandTypeValue.STRUCTURE && (
                <Box
                  sx={{
                    pl: 4,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <TextField
                      type="number"
                      label="No. of Floors :"
                      value={structureFloors}
                      onChange={(e) => {
                        const val =
                          e.target.value === ""
                            ? 0
                            : Number.parseInt(e.target.value, 10);
                        setStructureFloors(Number.isNaN(val) ? 0 : val);
                      }}
                      size="small"
                      sx={{ flex: 1 }}
                      error={!!errors["noOfFloors"]}
                      helperText={errors["noOfFloors"]}
                    />
                    <TextField
                      type="number"
                      label="No. of Basements :"
                      value={structureBasements}
                      onChange={(e) =>
                        setStructureBasements(Number(e.target.value))
                      }
                      size="small"
                      sx={{ flex: 1 }}
                      error={!!errors["noOfBasements"]}
                      helperText={errors["noOfBasements"]}
                    />
                  </Box>
                  <FormControl component="fieldset">
                    <FormLabel component="legend" sx={{ fontSize: "0.875rem" }}>
                      Does this structure have a Mezzanine Floor?
                    </FormLabel>
                    <RadioGroup
                      row
                      value={
                        localFields.hasMezzanineFloor === true ? "Yes" : "No"
                      }
                      onChange={handleChange(
                        "hasMezzanineFloor" as keyof Property
                      )}
                      sx={{ gap: 2 }}
                    >
                      <FormControlLabel
                        value="Yes"
                        control={<Radio size="small" />}
                        label="Yes"
                      />
                      <FormControlLabel
                        value="No"
                        control={<Radio size="small" />}
                        label="No"
                      />
                    </RadioGroup>
                  </FormControl>
                </Box>
              )}
            </Box>

            {/* Land with multiple structures */}
            <Box
              sx={{
                border:
                  currentTypeOfLand === LandTypeValue.MULTI
                    ? "2px solid #C84C0E"
                    : "1px solid #e0e0e0",
                borderRadius: 1,
                mb: 1,
                p: 2,
              }}
            >
              <FormControlLabel
                value={LandTypeValue.MULTI}
                control={<Radio />}
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      component="img"
                      src={land_with_multiple_structures}
                      alt="Land with multiple structures"
                      sx={{ width: 24, height: 24 }}
                    />
                    Land with multiple structures
                  </Box>
                }
                sx={{ mb: currentTypeOfLand === LandTypeValue.MULTI ? 2 : 0 }}
              />
              {currentTypeOfLand === LandTypeValue.MULTI && (
                <Box
                  sx={{
                    pl: 4,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <TextField
                    type="number"
                    label="No. of Buildings :"
                    placeholder="Add"
                    value={localFields.noOfBuildings ?? ""}
                    onChange={handleChange("noOfBuildings" as keyof Property)}
                    size="small"
                    fullWidth
                    error={!!errors["noOfBuildings"]}
                    helperText={errors["noOfBuildings"]}
                  />

                  <TextField
                    label="Select Building Number / Name:"
                    value={selectedBuildingName ?? ""}
                    onChange={(e) => {
                      setSelectedBuildingName(e.target.value);
                      setLocalFields((prev) => ({
                        ...prev,
                        buildingName: e.target.value,
                      }));
                    }}
                    size="small"
                    fullWidth
                  />

                  <Box sx={{ display: "flex", gap: 2 }}>
                    <TextField
                      type="number"
                      label="No. of Floors :"
                      value={multiFloors}
                      onChange={(e) => setMultiFloors(Number(e.target.value))}
                      size="small"
                      sx={{ flex: 1 }}
                      error={!!errors["noOfFloors"]}
                      helperText={errors["noOfFloors"]}
                    ></TextField>

                    <TextField
                      type="number"
                      label="No. of Basements :"
                      value={multiBasements}
                      onChange={(e) =>
                        setMultiBasements(Number(e.target.value))
                      }
                      size="small"
                      sx={{ flex: 1 }}
                      error={!!errors["noOfBasements"]}
                      helperText={errors["noOfBasements"]}
                    ></TextField>
                  </Box>
                </Box>
              )}
            </Box>

            {/* Building unit */}
            <FormControlLabel
              value={LandTypeValue.UNIT}
              control={<Radio />}
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    component="img"
                    src={building_unit}
                    alt="Building unit"
                    sx={{ width: 24, height: 24 }}
                  />
                  Building unit
                </Box>
              }
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: 1,
                mx: 0,
                px: 1,
                py: 1,
              }}
            />
          </RadioGroup>
          {errors[key] && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
              {errors[key]}
            </Typography>
          )}
        </FormControl>
      );
    }

    return (
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
    );
  };

  // Only render editable string fields, not nested objects or conditional fields.
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        backdrop: { sx: { backgroundColor: "rgba(0,0,0,0.3)" } },
        paper: { sx: { p: 4, minWidth: 400, borderRadius: 3, boxShadow: 6 } },
      }}
    >
      {/* Title for the dialog */}
      <Typography variant="h6" sx={{ mb: 2, fontStyle: "italic" }}>
        Edit Property Details
      </Typography>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        {/* Render editable property fields dynamically based on localFields */}
        {Object.entries(localFields)
          .filter(
            ([key]) =>
              ![
                "noOfFloors",
                "noOfBasements",
                "hasMezzanineFloor",
                "noOfBuildings",
                "buildingName", // <-- Add this line to exclude buildingName
              ].includes(key)
          )
          .map(([key, value]) => renderField(key, value))}
        {/* Save button to submit the form */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Button
            variant="contained"
            sx={{ bgcolor: "#C84C0E", color: "#fff", px: 5, borderRadius: 1 }}
            onClick={handleSave}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default EditPropertyPopover;
