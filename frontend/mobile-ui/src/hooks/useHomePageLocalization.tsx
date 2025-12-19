// useHomePageLocalization.tsx
// Custom hook for providing localized text for the Home Page based on the current app locale.
import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

// Interface for all localized text fields used on the Home Page
interface HomePageTexts {
  agentIdText: string;
  helpText: string;
  newPropertyText: string;
  calendarText: string;
  allText: string;
  newText: string;
  reviewedText: string;
  draftsText: string;
  addressText: string;
  verifiedText: string;
  noDataFoundText: string;
  noPropertiesFoundText: string;
}

// Hook to provide localized Home Page texts based on current locale
export const useHomePageLocalization = () => {
  const { locale } = useLanguage();
  const [texts, setTexts] = useState<HomePageTexts>({
    // Default English texts
    agentIdText: 'Agent ID',
    helpText: 'Help',
    newPropertyText: '+ New Property',
    calendarText: 'Calendar',
    allText: 'All',
    newText: 'New',
    reviewedText: 'Reviewed',
    draftsText: 'Drafts',
    addressText: 'Address',
    verifiedText: 'Verified',
    noDataFoundText: 'No data found for selected date',
    noPropertiesFoundText: 'No properties found'
  });

  // Update texts when locale changes
  useEffect(() => {
    if (locale === 'kn') {
      setTexts({
        agentIdText: 'ಏಜೆಂಟ್ ಐಡಿ',
        helpText: 'ಸಹಾಯ',
        newPropertyText: '+ ಹೊಸ ಆಸ್ತಿ',
        calendarText: 'ಕ್ಯಾಲೆಂಡರ್',
        allText: 'ಎಲ್ಲಾ',
        newText: 'ಹೊಸ',
        reviewedText: 'ಪರಿಶೀಲಿಸಿದ',
        draftsText: 'ಡ್ರಾಫ್ಟ್‌ಗಳು',
        addressText: 'ವಿಳಾಸ',
        verifiedText: 'ಪರಿಶೀಲಿಸಲಾಗಿದೆ',
        noDataFoundText: 'ಆಯ್ಕೆ ಮಾಡಿದ ದಿನಾಂಕಕ್ಕೆ ಯಾವುದೇ ಡೇಟಾ ಕಂಡುಬಂದಿಲ್ಲ',
        noPropertiesFoundText: 'ಯಾವುದೇ ಆಸ್ತಿಗಳು ಕಂಡುಬಂದಿಲ್ಲ'
      });
    } else {
      setTexts({
        agentIdText: 'Agent ID',
        helpText: 'Help',
        newPropertyText: '+ New Property',
        calendarText: 'Calendar',
        allText: 'All',
        newText: 'New',
        reviewedText: 'Reviewed',
        draftsText: 'Drafts',
        addressText: 'Address',
        verifiedText: 'Verified',
        noDataFoundText: 'No data found for selected date',
        noPropertiesFoundText: 'No properties found'
      });
    }
  }, [locale]);

  return {
    ...texts,
    locale
  };
};