// Type for mapping field names to error messages
export type FieldErrors = Record<string, string>;

// Validate that a field contains only alphabets (and spaces)
export function validateAlphabetsOnly(value: string, fieldLabel: string, required = false, isRequiredText: string): string {
  if (required && !value.trim()) return `${isRequiredText}.`;
  if (value && !/^[a-zA-Z\s]*$/.test(value)) return `Only alphabets allowed in ${fieldLabel}.`;
  return "";
}

// Validate that a field contains only numbers (optionally one decimal point)
export function validateNumbersOnly(
  value: string,
  fieldLabel: string,
  required = false,
  isRequiredText: string
): string {
  if (required && !value.trim()) return `${isRequiredText}.`;
  // Accept optional decimal, but only one
  // Valid: '', '123', '123.45', '.45', '0.5'
  // Invalid: '123..45', '12.34.56', '1.2.3', 'abc', '12.3a'
  if (
    value &&
    !/^(\d+(\.\d*)?|\.\d+)$/.test(value)
  )
    return `Only numbers allowed in ${fieldLabel}, with at most one decimal point.`;
  return "";
}

// Validate that a dropdown field is selected if required
export function validateDropdown(value: string, _fieldLabel: string, required = false, isRequiredText:string): string {
  if (required && !value) return `${isRequiredText}.`;
  return "";
}

// Utility: Remove all non-alphabet characters from input (for onType)
export function onlyAlphabetsInput(value: string): string {
  return value.replaceAll(/[^a-zA-Z\s]/g, '');
}

// Utility: Remove all non-numeric characters from input (for onType)
export function onlyNumbersInput(value: string): string {
  return value.replaceAll(/[^0-9]/g, '');
}