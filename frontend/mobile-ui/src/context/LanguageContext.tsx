// LanguageContext.tsx
// Provides context for managing and updating the application's language/locale.
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// Context value type for LanguageContext
interface LanguageContextType {
  locale: string;
  setLocale: (locale: string) => void;
}

// Create LanguageContext for sharing locale state
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Props for LanguageProvider
interface LanguageProviderProps {
  children: ReactNode;
}

// Provider component for LanguageContext
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // On provider mount, check localStorage for appLocale
  const [locale, setLocaleState] = useState<string>(() => {
    const savedLocale = localStorage.getItem('appLocale');
    return savedLocale ?? 'en';
  });

  // Whenever locale changes, update localStorage
  useEffect(() => {
    localStorage.setItem('appLocale', locale);
    // (Optional) Any side effects such as i18n library update can go here
  }, [locale]);

  // Expose a function to change locale at any time
  const setLocale = (newLocale: string) => {
    setLocaleState(newLocale);
  };

  // Context value to provide to consumers
  const value: LanguageContextType = {
    locale,
    setLocale
  };

  // Provide locale and setter to children
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for accessing LanguageContext
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);

  if (context === undefined) {
    console.error('useLanguage hook called outside of LanguageProvider');
    // Fallback to defaults
    return {
      locale: 'en',
      setLocale: () => {},
    };
  }

  return context;
};