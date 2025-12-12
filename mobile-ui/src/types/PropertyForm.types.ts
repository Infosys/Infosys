// Data structure for property form fields (used in property form UI)
export interface PropertyFormData {
  documentType: string;
  serialNo: string;
  mroProceedingNumber: string;
  
}

// Structure for a single form field (for dynamic forms)
export interface FormField {
  id: string;
  label: string;
  type: 'number' | 'select' ;
  required?: boolean;
  placeholder?: string;
  options?: string[];
}