import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
 
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
 
interface HomePageLocalizedTexts {
  // Header buttons
  agentIdText: string;
  helpText: string;
 
  // Main actions
  newPropertyText: string;
  calendarText: string;
  viewMapText: string;
 
  // Tab labels
  allTabText: string;
  newTabText: string;
  reviewedTabText: string;
  draftsTabText: string;
 
  // Button labels
  continueText: string;
  deleteText: string;
 
  // Status labels
  verifiedText: string;
  savedText: string;
  reasonText: string;
  addressText: string;
 
  // Messages
  noPropertiesText: string;
  noDataSelectedDateText: string;
 
  // Date dropdown labels
  dateLabelText: string;
  earliestText: string;
  oldestText: string;
 
  // Layout labels
  jurisdictionText: string;
  languageText: string;
  profileText: string;
  logoutText: string;
 
  // Navigation labels
  homeNavText: string;
  inboxNavText: string;
  insightsNavText: string;
  searchNavText: string;
 
  // Map component labels
  mapTabText: string;
  landuseTabText: string;
}
 
export const useHomePageLocalization = () => {
  const { locale, setLocale: setGlobalLocale } = useLanguage();
  const [texts, setTexts] = useState<HomePageLocalizedTexts>({
    // Header buttons
    agentIdText: 'Agent ID',
    helpText: 'Help',
   
    // Main actions
    newPropertyText: '+ New Property',
    calendarText: 'Calendar',
    viewMapText: 'View Map',
   
    // Tab labels
    allTabText: 'All',
    newTabText: 'New',
    reviewedTabText: 'Reviewed',
    draftsTabText: 'Drafts',
   
    // Button labels
    continueText: 'Continue',
    deleteText: 'Delete draft',
   
    // Status labels
    verifiedText: 'Verified',
    savedText: 'Saved',
    reasonText: 'Reason',
    addressText: 'Address',
   
    // Messages
    noPropertiesText: 'No properties found',
    noDataSelectedDateText: 'No data available for the selected date',
   
    // Date dropdown labels
    dateLabelText: 'Date',
    earliestText: 'Earliest',
    oldestText: 'Oldest',
   
    // Layout labels
    jurisdictionText: 'Jurisdiction',
    languageText: 'Language',
    profileText: 'Profile',
    logoutText: 'Logout',
   
    // Navigation labels
    homeNavText: 'Home',
    inboxNavText: 'Inbox',
    insightsNavText: 'Insights',
    searchNavText: 'Search',
   
    // Map component labels
    mapTabText: 'Map',
    landuseTabText: 'Landuse'
  });
 
  const messageCodes = [
    // Date dropdown
    'date.label',             // "Date"
    'earliest.label',         // "Earliest"
    'oldest.label',           // "Oldest"
   
    // Header buttons
    'agent.id.btn',           // "Agent ID" - exists in API
    'help.btn',               // "Help" - exists in API
   
    // Main actions
    'new.property.btn',       // "+ New Property" - exists in API
    'calendar.label',         // "Calendar" - exists in API
    'view.map.btn',           // "View Map" - exists in API
   
    // Tab labels
    'all.tab',                // "All" - exists in API
    'new.tab',                // "New" - exists in API
    'reviewed.tab',           // "Reviewed" - exists in API
    'drafts.tab',             // "Drafts" - exists in API
   
    // Button labels
    'continue.btn',           // "Continue" - exists in API
    'delete.draft.aria',      // "Delete draft" - exists in API
   
    // Status labels
    'verified.label',         // "Verified" - exists in API
    'saved.label',            // "Saved" - exists in API
    'reason.label',           // "Reason" - exists in API
    'address.label',          // "Address" - exists in API
   
    // Messages
    'no.properties.found',    // "No properties found" - exists in API
    'no.data.selected.date',  // "No data found for selected date" - exists in API
   
    // Layout labels
    'jurisdiction.label',     // "Jurisdiction" - exists in API
    'language.label',         // "Language" - exists in API
    'profile.label',          // "Profile" - exists in API
    'logout.label',           // "Logout" - exists in API
   
    // Navigation labels
    'home.nav',               // "Home" - exists in API
    'inbox.nav',              // "Inbox" - exists in API
    'insights.nav',           // "Insights" - exists in API
    'search.nav',             // "Search" - exists in API
   
    // Map component labels
    'map.tab',                // "Map" - exists in API
    'landuse.tab'             // "Land Use" - exists in API
  ];
 
  const fetchLocalizedTexts = async (newLocale: string) => {
    try {
      const codesParam = messageCodes.join(',');
      const url = `${import.meta.env.VITE_LOCALIZATION_HOST}/localization/v1/messages?module=common&locale=${newLocale}&codes=${codesParam}`;
 
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
          // Header buttons
          agentIdText: messageMap['agent.id.btn'] || 'Agent ID',
          helpText: messageMap['help.btn'] || 'Help',
         
          // Main actions
          newPropertyText: messageMap['new.property.btn'] || '+ New Property',
          calendarText: messageMap['calendar.label'] || 'Calendar',
          viewMapText: messageMap['view.map.btn'] || 'View Map',
         
          // Tab labels
          allTabText: messageMap['all.tab'] || 'All',
          newTabText: messageMap['new.tab'] || 'New',
          reviewedTabText: messageMap['reviewed.tab'] || 'Reviewed',
          draftsTabText: messageMap['drafts.tab'] || 'Drafts',
         
          // Button labels
          continueText: messageMap['continue.btn'] || 'Continue',
          deleteText: messageMap['delete.draft.aria'] || 'Delete draft',
         
          // Status labels
          verifiedText: messageMap['verified.label'] || 'Verified',
          savedText: messageMap['saved.label'] || 'Saved',
          reasonText: messageMap['reason.label'] || 'Reason',
          addressText: messageMap['address.label'] || 'Address',
         
          // Messages
          noPropertiesText: messageMap['no.properties.found'] || 'No properties found',
          noDataSelectedDateText: messageMap['no.data.selected.date'] || 'No data available for the selected date',
         
          // Date dropdown labels
          dateLabelText: messageMap['date.label'] || 'Date',
          earliestText: messageMap['earliest.label'] || 'Earliest',
          oldestText: messageMap['oldest.label'] || 'Oldest',
         
          // Layout labels
          jurisdictionText: messageMap['jurisdiction.label'] || 'Jurisdiction',
          languageText: messageMap['language.label'] || 'Language',
          profileText: messageMap['profile.label'] || 'Profile',
          logoutText: messageMap['logout.label'] || 'Logout',
         
          // Navigation labels
          homeNavText: messageMap['home.nav'] || 'Home',
          inboxNavText: messageMap['inbox.nav'] || 'Inbox',
          insightsNavText: messageMap['insights.nav'] || 'Insights',
          searchNavText: messageMap['search.nav'] || 'Search',
         
          // Map component labels
          mapTabText: messageMap['map.tab'] || 'Map',
          landuseTabText: messageMap['landuse.tab'] || 'Landuse'
        });
      }
    } catch (error) {
      console.error('Error fetching localized texts:', error);
      console.warn('Using default texts due to API error');
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
  }, [locale]);
 
  return {
    ...texts,
    toggleLanguage,
    setLanguage,
    locale
  };
};
 
 