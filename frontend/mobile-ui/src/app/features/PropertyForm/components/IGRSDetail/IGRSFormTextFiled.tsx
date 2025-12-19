
// Custom text field for IGRS details in property forms. Supports validation, placeholder, error display, and style overrides.

import React from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

interface FormTextFieldProps {
  label: string;
  // allow undefined values safely
  value?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: 'text' | 'number';
  required?: boolean;
  error?: string;
  touched?: boolean;
  sx?: any;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

// Style object for label
const labelSx = {
  fontSize: 14,
  fontWeight: 400,
  color: '#333333',
  marginBottom: '6px',
  textAlign: 'left' as const,
};

const FormTextField: React.FC<FormTextFieldProps> = ({
  label,
  value,
  onChange,
  onBlur,
  onKeyPress,
  placeholder,
  type = 'text',
  required = false,
  error,
  touched,
  inputProps,
  sx,
}) => {
  // Ensure we never pass undefined to TextField value prop
  const safeValue = value ?? '';

  // Render text field UI
  return (
    <div style={{ width: '100%', marginBottom: 12 }}>
      {/* Field label with required indicator */}
      <Typography component="label" sx={labelSx}>
        {label}
        {required ? <span style={{ color: '#C8504B', marginLeft: 6 }}>*</span> : null}
        <span style={{ marginLeft: 6 }}>:</span>
      </Typography>

      <TextField
        fullWidth
        variant="outlined"
        value={safeValue}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        onKeyPress={onKeyPress}
        placeholder={placeholder ?? ''}
        type={type}
        inputProps={{ inputMode: type === 'number' ? 'decimal' : 'text', ...inputProps }}
        error={!!(touched && error)}
        helperText={touched && error ? error : '\u00A0'}
        FormHelperTextProps={{ sx: { minHeight: 20 } }}
        sx={{
          fontFamily: 'Roboto, sans-serif !important',
          '& .MuiOutlinedInput-input': {
            fontFamily: 'Roboto, sans-serif',
            boxSizing: 'border-box !important',
            minHeight: '48px',
            borderRadius: '10px',
          },
          '& .MuiOutlinedInput-root': {
            borderRadius: '10px',
            fontSize: '16px !important',
            boxSizing: 'border-box !important',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#C4C4C4 !important',
            borderRadius: '10px !important',
          },
          ...sx,
        }}
      />
    </div>
  );
};

// Export FormTextField for use in IGRS detail forms
export default FormTextField;
