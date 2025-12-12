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

interface PropertyInformationLocalizedTexts {
  // PropertyInformation texts
  propertyFormTitle: string;
  newPropertyFormTitle: string;
  propertyInfoSubtitle: string;
  previousBtn: string;
  saveDraftBtn: string;
  categoryOwnershipLabel: string;
  propertyTypeLabel: string;
  apartmentNameLabel: string;
  apartmentNamePlaceholder: string;
  addLocationTagBtn: string;
  addPolygonBtn: string;
  addressLabel: string;
  coordinatesLabel: string;
  addedAtText: string;
  onText: string;
  removeTagBtn: string;
  editLocationBtn: string;
  polygonLabel: string;
  pointText: string;
  removePolygonBtn: string;
  editPolygonBtn: string;
  verifyBtn: string;
  submitBtn: string;
  // LocationSelectionPage texts
  addLocationTitle: string;
  searchPlaceholder: string;
  startDrawingBtn: string;
  finishDrawingBtn: string;
  selectedLocationTitle: string;
  loadingAddressText: string;
  multiplePropertiesTitle: string;
  loadingPropertiesText: string;
  noPropertiesText: string;
  confirmLocationBtn: string;
  doNotConsiderText: string;
  // Dropdown options
  dropdown_vacant_land: string;
  dropdown_private: string;
  dropdown_central_govt_50: string;
  dropdown_central_govt_75: string;
  dropdown_state_govt: string;
  dropdown_mixed: string;
  dropdown_residential: string;
  dropdown_non_residential: string;
}

export const usePropertyInformationLocalization = () => {
  const { locale, setLocale: setGlobalLocale } = useLanguage();
  const [texts, setTexts] = useState<PropertyInformationLocalizedTexts>({
    // PropertyInformation defaults (English)
    propertyFormTitle: 'Property Form',
    newPropertyFormTitle: 'New Property Form',
    propertyInfoSubtitle: 'Property Information',
    previousBtn: 'Previous',
    saveDraftBtn: 'Save Draft',
    categoryOwnershipLabel: 'Category of Ownership :',
    propertyTypeLabel: 'Property Type :',
    apartmentNameLabel: 'Apartment/Complex Name :',
    apartmentNamePlaceholder: 'Enter Name Of Residence',
    addLocationTagBtn: 'Add Location Tag',
    addPolygonBtn: 'Add Polygon',
    addressLabel: 'Address:',
    coordinatesLabel: 'Coordinates:',
    addedAtText: 'added at',
    onText: 'on',
    removeTagBtn: 'Remove Tag',
    editLocationBtn: 'Edit Location',
    polygonLabel: 'Polygon',
    pointText: 'Point',
    removePolygonBtn: 'Remove Polygon',
    editPolygonBtn: 'Edit Polygon',
    verifyBtn: 'Verify',
    submitBtn: 'Submit',
    // LocationSelectionPage defaults (English)
    addLocationTitle: 'Add Location',
    searchPlaceholder: 'Search for a location...',
    startDrawingBtn: 'Start Drawing',
    finishDrawingBtn: 'Finish Drawing',
    selectedLocationTitle: 'Selected Location',
    loadingAddressText: 'Loading address...',
    multiplePropertiesTitle: 'Multiple Properties Identified',
    loadingPropertiesText: 'Loading property options...',
    noPropertiesText: 'No properties identified in the selected polygon area.',
    confirmLocationBtn: 'Confirm Location',
    doNotConsiderText: 'Do not consider duplicate properties detected',
    // Dropdown defaults (English)
    dropdown_vacant_land: 'Vacant Land',
    dropdown_private: 'Private',
    dropdown_central_govt_50: 'Central Government 50%',
    dropdown_central_govt_75: 'Central Government 75%',
    dropdown_state_govt: 'State Government',
    dropdown_mixed: 'Mixed',
    dropdown_residential: 'Residential',
    dropdown_non_residential: 'Non- Residential',
  });

  const messageCodes = [
    'property.form.title',
    'property.new.form.title',
    'property.info.subtitle',
    'previous.btn',
    'save.draft.btn',
    'category.ownership.label',
    'property.type.label',
    'apartment.name.label',
    'apartment.name.placeholder',
    'add.location.tag.btn',
    'add.polygon.btn',
    'address.label',
    'coordinates.label',
    'added.at.text',
    'on.text',
    'remove.tag.btn',
    'edit.location.btn',
    'polygon.label',
    'point.text',
    'remove.polygon.btn',
    'edit.polygon.btn',
    'verify.btn',
    'submit.btn',
    // LocationSelectionPage codes
    'add.location.title',
    'search.placeholder',
    'start.drawing.btn',
    'finish.drawing.btn',
    'selected.location.title',
    'loading.address.text',
    'multiple.properties.title',
    'loading.properties.text',
    'no.properties.text',
    'confirm.location.btn',
    'do.not.consider.text',
    // Dropdown option codes
    'dropdown.vacant.land',
    'dropdown.private',
    'dropdown.central.govt.50',
    'dropdown.central.govt.75',
    'dropdown.state.govt',
    'dropdown.mixed',
    'dropdown.residential',
    'dropdown.non.residential',
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

        // Update texts with fetched values or English fallbacks
        const newTexts = {
          propertyFormTitle: messageMap['property.form.title'] || 'Property Form',
          newPropertyFormTitle: messageMap['property.new.form.title'] || 'New Property Form',
          propertyInfoSubtitle: messageMap['property.info.subtitle'] || 'Property Information',
          previousBtn: messageMap['previous.btn'] || 'Previous',
          saveDraftBtn: messageMap['save.draft.btn'] || 'Save Draft',
          categoryOwnershipLabel: messageMap['category.ownership.label'] || 'Category of Ownership :',
          propertyTypeLabel: messageMap['property.type.label'] || 'Property Type :',
          apartmentNameLabel: messageMap['apartment.name.label'] || 'Apartment/Complex Name :',
          apartmentNamePlaceholder: messageMap['apartment.name.placeholder'] || 'Enter Name Of Residence',
          addLocationTagBtn: messageMap['add.location.tag.btn'] || 'Add Location Tag',
          addPolygonBtn: messageMap['add.polygon.btn'] || 'Add Polygon',
          addressLabel: messageMap['address.label'] || 'Address:',
          coordinatesLabel: messageMap['coordinates.label'] || 'Coordinates:',
          addedAtText: messageMap['added.at.text'] || 'added at',
          onText: messageMap['on.text'] || 'on',
          removeTagBtn: messageMap['remove.tag.btn'] || 'Remove Tag',
          editLocationBtn: messageMap['edit.location.btn'] || 'Edit Location',
          polygonLabel: messageMap['polygon.label'] || 'Polygon',
          pointText: messageMap['point.text'] || 'Point',
          removePolygonBtn: messageMap['remove.polygon.btn'] || 'Remove Polygon',
          editPolygonBtn: messageMap['edit.polygon.btn'] || 'Edit Polygon',
          verifyBtn: messageMap['verify.btn'] || 'Verify',
          submitBtn: messageMap['submit.btn'] || 'Submit',
          // LocationSelectionPage
          addLocationTitle: messageMap['add.location.title'] || 'Add Location',
          searchPlaceholder: messageMap['search.placeholder'] || 'Search for a location...',
          startDrawingBtn: messageMap['start.drawing.btn'] || 'Start Drawing',
          finishDrawingBtn: messageMap['finish.drawing.btn'] || 'Finish Drawing',
          selectedLocationTitle: messageMap['selected.location.title'] || 'Selected Location',
          loadingAddressText: messageMap['loading.address.text'] || 'Loading address...',
          multiplePropertiesTitle: messageMap['multiple.properties.title'] || 'Multiple Properties Identified',
          loadingPropertiesText: messageMap['loading.properties.text'] || 'Loading property options...',
          noPropertiesText: messageMap['no.properties.text'] || 'No properties identified in the selected polygon area.',
          confirmLocationBtn: messageMap['confirm.location.btn'] || 'Confirm Location',
          doNotConsiderText: messageMap['do.not.consider.text'] || 'Do not consider duplicate properties detected',
          // Dropdown options
          dropdown_vacant_land: messageMap['dropdown.vacant.land'] || 'Vacant Land',
          dropdown_private: messageMap['dropdown.private'] || 'Private',
          dropdown_central_govt_50: messageMap['dropdown.central.govt.50'] || 'Central Government 50%',
          dropdown_central_govt_75: messageMap['dropdown.central.govt.75'] || 'Central Government 75%',
          dropdown_state_govt: messageMap['dropdown.state.govt'] || 'State Government',
          dropdown_mixed: messageMap['dropdown.mixed'] || 'Mixed',
          dropdown_residential: messageMap['dropdown.residential'] || 'Residential',
          dropdown_non_residential: messageMap['dropdown.non.residential'] || 'Non- Residential',
        };

        setTexts(newTexts);
      } else {
        console.error('Failed to fetch localization, status:', response.status);
        throw new Error('Failed to fetch');
      }
    } catch (error) {
      console.error('Error fetching localized texts:', error);
      setTexts({
        propertyFormTitle: 'Property Form',
        newPropertyFormTitle: 'New Property Form',
        propertyInfoSubtitle: 'Property Information',
        previousBtn: 'Previous',
        saveDraftBtn: 'Save Draft',
        categoryOwnershipLabel: 'Category of Ownership :',
        propertyTypeLabel: 'Property Type :',
        apartmentNameLabel: 'Apartment/Complex Name :',
        apartmentNamePlaceholder: 'Enter Name Of Residence',
        addLocationTagBtn: 'Add Location Tag',
        addPolygonBtn: 'Add Polygon',
        addressLabel: 'Address:',
        coordinatesLabel: 'Coordinates:',
        addedAtText: 'added at',
        onText: 'on',
        removeTagBtn: 'Remove Tag',
        editLocationBtn: 'Edit Location',
        polygonLabel: 'Polygon',
        pointText: 'Point',
        removePolygonBtn: 'Remove Polygon',
        editPolygonBtn: 'Edit Polygon',
        verifyBtn: 'Verify',
        submitBtn: 'Submit',
        // LocationSelectionPage
        addLocationTitle: 'Add Location',
        searchPlaceholder: 'Search for a location...',
        startDrawingBtn: 'Start Drawing',
        finishDrawingBtn: 'Finish Drawing',
        selectedLocationTitle: 'Selected Location',
        loadingAddressText: 'Loading address...',
        multiplePropertiesTitle: 'Multiple Properties Identified',
        loadingPropertiesText: 'Loading property options...',
        noPropertiesText: 'No properties identified in the selected polygon area.',
        confirmLocationBtn: 'Confirm Location',
        doNotConsiderText: 'Do not consider duplicate properties detected',
        // Dropdown fallbacks (English)
        dropdown_vacant_land: 'Vacant Land',
        dropdown_private: 'Private',
        dropdown_central_govt_50: 'Central Government 50%',
        dropdown_central_govt_75: 'Central Government 75%',
        dropdown_state_govt: 'State Government',
        dropdown_mixed: 'Mixed',
        dropdown_residential: 'Residential',
        dropdown_non_residential: 'Non- Residential',
      });
    }
  };

  const translateDropdownOption = (value: string): string => {
    if (!value) return value;
    
    // Map dropdown values to their corresponding text field names
    const valueToFieldMap: Record<string, keyof PropertyInformationLocalizedTexts> = {
      'Vacant Land': 'dropdown_vacant_land',
      'Private': 'dropdown_private', 
      'Central Government 50%': 'dropdown_central_govt_50',
      'Central Government 75%': 'dropdown_central_govt_75',
      'State Government': 'dropdown_state_govt',
      'Mixed': 'dropdown_mixed',
      'Residential': 'dropdown_residential',
      'RESIDENTIAL': 'dropdown_residential',
      'Non- Residential': 'dropdown_non_residential',
      'NON RESIDENTIAL': 'dropdown_non_residential',
    };

    const fieldName = valueToFieldMap[value];
    if (fieldName && texts[fieldName]) {
      return texts[fieldName];
    }
    
    return value; // Return original if no translation found
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

  // Sync with LanguageContext changes
  useEffect(() => {
    const savedLocale = localStorage.getItem('appLocale') || 'en';
    fetchLocalizedTexts(savedLocale);
  }, [locale]);

  return {
    ...texts,
    translateDropdownOption,
    toggleLanguage,
    setLanguage,
    locale
  };
};
