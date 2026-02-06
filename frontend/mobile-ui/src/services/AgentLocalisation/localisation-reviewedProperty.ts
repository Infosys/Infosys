import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import env from '../../config/env';

interface LocalizationMessage {
  uuid: string;
  code: string;
  message: string;
  module: string;
  locale: string;
}

interface LocalizationResponse {
  messages: LocalizationMessage[];
}

interface ReviewedPropertyLocalizedTexts {
  // Page title
  reviewedPropertiesTitleText: string;
  
  // Navigation
  previousText: string;
  
  // Search
  searchPlaceholderText: string;
  searchBtnText: string;
  
  // Filter
  dateLabelText: string;
  earliestText: string;
  oldestText: string;
  
  // Property card labels
  verifiedText: string;
  categoryIdText: string;
  addressText: string;
  
  // Messages
  noPropertiesFoundText: string;
}

export const useReviewedPropertyLocalization = () => {
  const { locale, setLocale: setGlobalLocale } = useLanguage();
  const [texts, setTexts] = useState<ReviewedPropertyLocalizedTexts>({
    // Page title
    reviewedPropertiesTitleText: 'Reviewed Properties',
    
    // Navigation
    previousText: 'Previous',
    
    // Search
    searchPlaceholderText: 'Search based on location',
    searchBtnText: 'Search',
    
    // Filter
    dateLabelText: 'Date',
    earliestText: 'Earliest',
    oldestText: 'Oldest',
    
    // Property card labels
    verifiedText: 'Verified',
    categoryIdText: 'Category ID',
    addressText: 'Address',
    
    // Messages
    noPropertiesFoundText: 'No reviewed properties found',
  });

  const messageCodes = [
    // Page title
    'reviewed.properties.title',      // "Reviewed Properties"
    
    // Navigation
    'previous.btn',                   // "Previous"
    
    // Search
    'search.location.placeholder',    // "Search based on location"
    'search.btn',                     // "Search"
    
    // Filter
    'date.label',                     // "Date"
    'earliest.label',                 // "Earliest"
    'oldest.label',                   // "Oldest"
    
    // Property card labels
    'verified.label',                 // "Verified"
    'category.id.label',              // "Category ID"
    'address.label',                  // "Address"
    
    // Messages
    'no.reviewed.properties.found',   // "No reviewed properties found"
  ];

  const fetchLocalizedTexts = async (newLocale: string) => {
    try {
      // Convert locale format: 'en' -> 'en_IN', 'kn' -> 'kn_IN', 'hi' -> 'hi_IN'
      const backendLocale = newLocale.includes('_') ? newLocale : `${newLocale}_IN`;
      
      const codesParam = messageCodes.join(',');
      const url = `${env.LOCALIZATION_HOST}/localization/v1/messages?module=common&locale=${backendLocale}&codes=${codesParam}`;

      const response = await fetch(url, {
        headers: {
          'X-Tenant-ID': 'pg',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data: LocalizationResponse = await response.json();
        // Create a map of messages by code
        const messageMap: Record<string, string> = {};
        data.messages.forEach(msg => {
          messageMap[msg.code] = msg.message;
        });
        // Update texts with values from API
        setTexts({
          // Page title
          reviewedPropertiesTitleText: messageMap['reviewed.properties.title'] || 'Reviewed Properties',
          
          // Navigation
          previousText: messageMap['previous.btn'] || 'Previous',
          
          // Search
          searchPlaceholderText: messageMap['search.location.placeholder'] || 'Search based on location',
          searchBtnText: messageMap['search.btn'] || 'Search',
          
          // Filter
          dateLabelText: messageMap['date.label'] || 'Date',
          earliestText: messageMap['earliest.label'] || 'Earliest',
          oldestText: messageMap['oldest.label'] || 'Oldest',
          
          // Property card labels
          verifiedText: messageMap['verified.label'] || 'Verified',
          categoryIdText: messageMap['category.id.label'] || 'Category ID',
          addressText: messageMap['address.label'] || 'Address',
          
          // Messages
          noPropertiesFoundText: messageMap['no.reviewed.properties.found'] || 'No reviewed properties found',
        });
      } else {
        console.error('❌ Failed to fetch translations. Status:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
      }
    } catch (error) {
      console.error('❌ Error fetching localized texts for reviewed property:', error);
      console.warn('⚠️ Using default English texts due to API error');
    }
  };

  const toggleLanguage = () => {
    const newLocale = locale === 'en' ? 'kn' : 'en';
    setGlobalLocale(newLocale);
    fetchLocalizedTexts(newLocale);
  };

  const setLanguage = (newLocale: string) => {
    setGlobalLocale(newLocale);
    fetchLocalizedTexts(newLocale);
  };

  // Initial load and when locale changes from context
  useEffect(() => {
    fetchLocalizedTexts(locale);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  return {
    ...texts,
    toggleLanguage,
    setLanguage,
    locale
  };
};
