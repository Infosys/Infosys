// FormModeContext.tsx
// Provides context for managing the mode/state of a form (e.g., new, verify, draft).
import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// Possible modes for the form
type FormMode = 'new' | 'verify' | 'none' | 'draft';

// Context value type for FormModeContext
interface FormModeContextType {
  mode: FormMode;
  setMode: (mode: FormMode) => void;
}

// Create FormModeContext for sharing form mode state
const FormModeContext = createContext<FormModeContextType | undefined>(undefined);

// Custom hook to access FormModeContext
export const useFormMode = () => {
  const context = useContext(FormModeContext);
  if (!context) throw new Error('useFormMode must be used inside FormModeProvider');
  return context;
};

// Provider component for FormModeContext
export const FormModeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<FormMode>('new');
  // State for current form mode
  return (
  // Provide form mode and setter to children
    <FormModeContext.Provider value={{ mode, setMode }}>
      {children}
    </FormModeContext.Provider>
  );
};
