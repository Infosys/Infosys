import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, FormControlLabel, Checkbox, MenuItem, Dialog } from '@mui/material';
import { ZodType } from "zod";

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
  CorrespondencePincode: number;
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
  open, onClose, fields, labels, onSave, schema,
  blockNoOptions, wardNoOptions, electionWardOptions, secretariatWardOptions,
}) => {
  const [localFields, setLocalFields] = useState<Partial<AddressEditInput>>(fields || {});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setLocalFields(fields || {});
    setErrors({});
    console.log("fields :", fields);
    
  }, [fields, open]);

  const showCorrespondence = !!localFields?.DifferentCorrespondenceAddress;

  const handleChange = (key: keyof AddressEditInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let value: string | number | boolean = e.target.value;
    if (key === "DifferentCorrespondenceAddress") {
      value = (e.target as HTMLInputElement).checked;
    } else if (key === "PinCode" || key === "CorrespondencePincode") {
      const raw = (e.target as HTMLInputElement).value;
      value = raw === "" ? "" : Number(raw);
    }

    const updated: Partial<AddressEditInput> = {
      ...localFields,
      [key]: value,
    };

    if (key === "DifferentCorrespondenceAddress" && value === false) {
      updated.CorrespondenceAddress1 = "";
      updated.CorrespondenceAddress2 = "";
      updated.CorrespondencePincode = 0;
    }

    setLocalFields(updated);

    // exclude correspondence fields from validation when not applicable
    const payloadForValidation: Partial<AddressEditInput> = { ...updated };
    if (!payloadForValidation.DifferentCorrespondenceAddress) {
      delete (payloadForValidation as any).CorrespondenceAddress1;
      delete (payloadForValidation as any).CorrespondenceAddress2;
      delete (payloadForValidation as any).CorrespondencePincode;
    }

    const result = schema.safeParse(payloadForValidation);
    if (result.success) {
      setErrors({});
    } else {
      const newErrors: { [key: string]: string } = {};
      result.error.issues.forEach(issue => {
        const path = issue.path.join('.');
        if (path && !newErrors[path]) {
          newErrors[path] = issue.message;
        }
      });
      setErrors(newErrors);
    }
  };

  const handleSave = () => {
    const payload: Partial<AddressEditInput> = { ...localFields };
    if (!payload.DifferentCorrespondenceAddress) {
      payload.CorrespondenceAddress1 = "";
      payload.CorrespondenceAddress2 = "";
      payload.CorrespondencePincode = 0;
    }
    const payloadForValidation: Partial<AddressEditInput> = { ...payload };
    if (!payloadForValidation.DifferentCorrespondenceAddress) {
      delete (payloadForValidation as any).CorrespondenceAddress1;
      delete (payloadForValidation as any).CorrespondenceAddress2;
      delete (payloadForValidation as any).CorrespondencePincode;
    }

    const result = schema.safeParse(payloadForValidation);
    if (result.success) {
      setErrors({});
      onSave(payload);
      onClose();
    } else {
      const newErrors: { [key: string]: string } = {};
      result.error.issues.forEach(issue => {
        const path = issue.path.join('.');
        if (path && !newErrors[path]) {
          newErrors[path] = issue.message;
        }
      });
      setErrors(newErrors);
    }
  };

  const renderCheckboxField = (key: string, value: any) => (
    <FormControlLabel
      key={key}
      label={labels[key as keyof AddressEditInput] || "Different Correspondence Address"}
      control={<Checkbox checked={!!value} onChange={handleChange(key as keyof AddressEditInput)} color="primary" />}
    />
  );

  const renderSelectField = (key: string, value: any, options: Array<{ id: string; name: string }>, placeholder: string) => (
    <TextField 
      key={key} 
      select 
      label={labels[key as keyof AddressEditInput] || key} 
      value={value === undefined || value === null ? "" : String(value)} 
      onChange={handleChange(key as keyof AddressEditInput)} 
      fullWidth 
      error={!!(errors as any)[key]} 
      helperText={(errors as any)[key]}
    >
      <MenuItem value=""><em>{placeholder}</em></MenuItem>
      {options.map(opt => <MenuItem key={opt.id} value={opt.name}>{opt.name}</MenuItem>)}
    </TextField>
  );

  const renderTextField = (key: string, value: any, isNumberField: boolean) => (
    <TextField 
      key={key} 
      label={labels[key as keyof AddressEditInput] || key} 
      value={value === undefined || value === null ? "" : String(value)} 
      onChange={handleChange(key as keyof AddressEditInput)} 
      fullWidth 
      error={!!(errors as any)[key]} 
      helperText={(errors as any)[key]} 
      type={isNumberField ? "number" : "text"} 
    />
  );

  const renderField = (key: string, value: any) => {
    if (String(key) === "DifferentCorrespondenceAddress") {
      return renderCheckboxField(key, value);
    }

    if (key === "BlockNo") {
      return renderSelectField(key, value, blockNoOptions, "Select Block");
    }
    if (key === "WardNo") {
      return renderSelectField(key, value, wardNoOptions, "Select Ward");
    }
    if (key === "ElectionWard") {
      return renderSelectField(key, value, electionWardOptions, "Select Election Ward");
    }
    if (key === "SecretariatWard") {
      return renderSelectField(key, value, secretariatWardOptions, "Select Secretariat Ward");
    }

    const isNumberField = key === "PinCode" || key === "CorrespondencePincode";
    return renderTextField(key, value, isNumberField);
  };

  return (
    <Dialog open={open} onClose={onClose} slotProps={{ paper: { sx: { p: 4, minWidth: 400, borderRadius: 3, boxShadow: 6 } } }}>
      <Typography variant="h6" sx={{ mb: 2, fontStyle: 'italic' }}>Edit Address Details</Typography>
      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {Object.entries(localFields).map(([key, value]) => {
          if (["CorrespondenceAddress1", "CorrespondenceAddress2", "CorrespondencePincode"].includes(key) && !showCorrespondence) return null;
          return renderField(key, value);
        })}

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button variant="contained" sx={{ bgcolor: '#C84C0E', color: '#fff', px: 5, borderRadius: 1 }} onClick={handleSave}>Save</Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default EditAddressPopover;