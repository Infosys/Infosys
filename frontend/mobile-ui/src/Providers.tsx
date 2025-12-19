// Global providers wrapper for all React context and localization
import React from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { SignUpFormProvider } from './context/SignUpFormContext';
import { PropertyApplicationsProvider } from './context/PropertyApplicationsContext';
import { PropertyFormProvider } from './context/PropertyFormContext';
import { FormModeProvider } from './context/FormModeContext';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { LocalizationProvider as LangProvider } from './services/Citizen/Localization/LocalizationContext';
import { useAuth } from './context/AuthProvider';

// Props for Providers component (children to render)
interface ProvidersProps {
  children: React.ReactNode;
}

// Providers component wraps the app with all required context providers
// Includes language, form, property, and localization providers
const Providers: React.FC<ProvidersProps> = ({ children }) => {
  // Get user role from Auth context (used for localization)
  const { role } = useAuth();
  return (
    <LanguageProvider>
      <SignUpFormProvider>
        <PropertyApplicationsProvider>
          <PropertyFormProvider>
            <FormModeProvider>
              {/* MUI date localization and app language localization */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <LangProvider role={role!}>{children}</LangProvider>
              </LocalizationProvider>
            </FormModeProvider>
          </PropertyFormProvider>
        </PropertyApplicationsProvider>
      </SignUpFormProvider>
    </LanguageProvider>
  );
};

export default Providers;
