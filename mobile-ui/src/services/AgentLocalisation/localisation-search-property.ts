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

interface AllLocalizedTexts {
  // Header buttons
  helpText: string;
  agentIdText: string;
  
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
  landUseTabText: string;
  
  // Search Property Page texts
  searchLocationText: string;
  selectFieldText: string;
  allFieldText: string;
  locationFieldText: string;
  ownerNameFieldText: string;
  phoneNumberFieldText: string;
  searchByOwnerPlaceholder: string;
  searchByLocationPlaceholder: string;
  searchByPhonePlaceholder: string;
  searchAllPlaceholder: string;
  unverifiedText: string;
  voiceSearchText: string;
  
  // Location Page texts
  locationPageTitle: string;
  directionsText: string;
  phoneNumberText: string;
  phonePrefixText: string;
  googleMapsText: string;
  appleMapsText: string;
  openStreetMapsText: string;
  callButtonText: string;
  
  // Common status texts
  propertyIdText: string;
  areaText: string;
  propertyTypeText: string;
  
  // Search actions
  searchButtonText: string;
  clearSearchText: string;
  noResultsText: string;
  searchResultsText: string;
  NotificationsNavText: string;
}

export const useAppLocalization = () => {
  const { locale, setLocale: setGlobalLocale } = useLanguage();
  const [texts, setTexts] = useState<AllLocalizedTexts>({
    // Header buttons
    helpText: 'Help',
    agentIdText: 'Agent ID',
    
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
    landUseTabText: 'Land Use',
    
    // Search Property Page texts
    searchLocationText: 'Search Location',
    selectFieldText: 'Select field',
    allFieldText: 'All',
    locationFieldText: 'Location',
    ownerNameFieldText: 'Owner Name',
    phoneNumberFieldText: 'Phone Number',
    searchByOwnerPlaceholder: 'Search by owner name',
    searchByLocationPlaceholder: 'Search based on location',
    searchByPhonePlaceholder: 'Search by owner phone number',
    searchAllPlaceholder: 'Search properties by location, owner name, or phone number',
    unverifiedText: 'Unverified',
    voiceSearchText: 'Voice search',
    
    // Location Page texts
    locationPageTitle: 'Location',
    directionsText: 'Directions to our address',
    phoneNumberText: 'Phone Number',
    phonePrefixText: 'Phone',
    googleMapsText: 'Google Maps',
    appleMapsText: 'Apple maps',
    openStreetMapsText: 'Open Street Maps',
    callButtonText: 'Call phone number',
    
    // Common status texts
    propertyIdText: 'Property ID',
    areaText: 'Area',
    propertyTypeText: 'Property Type',
    
    // Search actions
    searchButtonText: 'Search',
    clearSearchText: 'Clear',
    noResultsText: 'No properties found',
    searchResultsText: 'Search Results',
    NotificationsNavText: 'Notifications'
  });

  const messageCodes = [
    // Header buttons
    'help.btn',
    'agent.id.btn',
    
    // Main actions
    'new.property.btn',
    'calendar.label',
    'view.map.btn',
    
    // Tab labels
    'all.tab',
    'new.tab',
    'reviewed.tab',
    'drafts.tab',
    
    // Button labels
    'continue.btn',
    'delete.draft.aria',
    
    // Status labels
    'verified.label',
    'saved.label',
    'reason.label',
    'address.label',
    
    // Messages
    'no.properties.found',
    'no.data.selected.date',
    
    // Layout labels
    'jurisdiction.label',
    'language.label',
    'profile.label',
    'logout.label',
    
    // Navigation labels
    'home.nav',
    'inbox.nav',
    'insights.nav',
    'search.nav',
    
    // Map component labels
    'map.tab',
    'landuse.tab',
    
    // Search Property Page texts
    'search.location.title',
    'select.field.label',
    'all.field.option',
    'location.field.option',
    'owner.name.field.option',
    'phone.number.field.option',
    'search.by.owner.placeholder',
    'search.by.location.placeholder',
    'search.by.phone.placeholder',
    'search.all.placeholder',
    'unverified.label',
    'voice.search.aria',
    
    // Location Page texts
    'location.page.title',
    'directions.text',
    'phone.number.label',
    'phone.prefix.label',
    'google.maps.text',
    'apple.maps.text',
    'open.street.maps.text',
    'call.button.aria',
    
    // Common status texts
    'property.id.label',
    'area.label',
    'property.type.label',
    
    // Search actions
    'search.btn',
    'clear.search.btn',
    'search.results.label',
    'notifications.nav.label'
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
          helpText: messageMap['help.btn'] || 'Help',
          agentIdText: messageMap['agent.id.btn'] || 'Agent ID',
          
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
          landUseTabText: messageMap['landuse.tab'] || 'Land Use',
          
          // Search Property Page texts
          searchLocationText: messageMap['search.location.title'] || 'Search Location',
          selectFieldText: messageMap['select.field.label'] || 'Select field',
          allFieldText: messageMap['all.field.option'] || 'All',
          locationFieldText: messageMap['location.field.option'] || 'Location',
          ownerNameFieldText: messageMap['owner.name.field.option'] || 'Owner Name',
          phoneNumberFieldText: messageMap['phone.number.field.option'] || 'Phone Number',
          searchByOwnerPlaceholder: messageMap['search.by.owner.placeholder'] || 'Search by owner name',
          searchByLocationPlaceholder: messageMap['search.by.location.placeholder'] || 'Search based on location',
          searchByPhonePlaceholder: messageMap['search.by.phone.placeholder'] || 'Search by owner phone number',
          searchAllPlaceholder: messageMap['search.all.placeholder'] || 'Search properties by location, owner name, or phone number',
          unverifiedText: messageMap['unverified.label'] || 'Unverified',
          voiceSearchText: messageMap['voice.search.aria'] || 'Voice search',
          
          // Location Page texts
          locationPageTitle: messageMap['location.page.title'] || 'Location',
          directionsText: messageMap['directions.text'] || 'Directions to our address',
          phoneNumberText: messageMap['phone.number.label'] || 'Phone Number',
          phonePrefixText: messageMap['phone.prefix.label'] || 'Phone',
          googleMapsText: messageMap['google.maps.text'] || 'Google Maps',
          appleMapsText: messageMap['apple.maps.text'] || 'Apple maps',
          openStreetMapsText: messageMap['open.street.maps.text'] || 'Open Street Maps',
          callButtonText: messageMap['call.button.aria'] || 'Call phone number',
          
          // Common status texts
          propertyIdText: messageMap['property.id.label'] || 'Property ID',
          areaText: messageMap['area.label'] || 'Area',
          propertyTypeText: messageMap['property.type.label'] || 'Property Type',
          
          // Search actions
          searchButtonText: messageMap['search.btn'] || 'Search',
          clearSearchText: messageMap['clear.search.btn'] || 'Clear',
          noResultsText: messageMap['no.properties.found'] || 'No properties found',
          searchResultsText: messageMap['search.results.label'] || 'Search Results',
          NotificationsNavText: messageMap['notifications.nav.label'] || 'Notifications'
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

// For backward compatibility
export const useLocalization = useAppLocalization;
export const useSearchPropertyLocalization = useAppLocalization;