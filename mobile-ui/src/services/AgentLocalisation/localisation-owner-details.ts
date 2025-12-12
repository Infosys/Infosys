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

interface OwnerDetailsLocalizedTexts {
  // Page titles
  propertyFormTitle: string;
  newPropertyFormTitle: string;
  ownerDetailsSubtitle: string;
  
  // Button labels
  previousText: string;
  saveDraftText: string;
  addOwnerText: string;
  submitText: string;
  verifyText: string;
  
  // Form field labels
  aadhaarLabel: string;
  ownerNameLabel: string;
  mobileNumberLabel: string;
  genderLabel: string;
  emailLabel: string;
  guardianLabel: string;
  guardianRelationshipLabel: string;
  
  // Messages
  addOwnerSuccessMsg: string;
  saveDraftSuccessMsg: string;
  addOwnerValidationMsg: string;
  minOwnerRequiredMsg: string;
  
  // Error messages
  ownerNameRequiredError: string;
  genderRequiredError: string;
  guardianRequiredError: string;
  guardianRelationshipRequiredError: string;
  
  // Owner card text
  primaryText: string;
  primaryOwnerText: string;
  ownerText: string;
  nameText: string;
  viewOwnersText: string;
  
  // Dropdown options
  genderOptions: string[];
  guardianRelationshipOptions: string[];
}

export const useOwnerDetailsLocalization = () => {
  const { locale, setLocale: setGlobalLocale } = useLanguage();
  const [texts, setTexts] = useState<OwnerDetailsLocalizedTexts>({
    // Page titles
    propertyFormTitle: 'Property Form',
    newPropertyFormTitle: 'New Property Form',
    ownerDetailsSubtitle: 'Owner Details',
    
    // Button labels
    previousText: 'Previous',
    saveDraftText: 'Save Draft',
    addOwnerText: 'Add Owner',
    submitText: 'Submit',
    verifyText: 'Verify',
    
    // Form field labels
    aadhaarLabel: 'Aadhaar No.',
    ownerNameLabel: 'Owner name',
    mobileNumberLabel: 'Mobile Number',
    genderLabel: 'Gender',
    emailLabel: 'Email Address',
    guardianLabel: 'Guardian',
    guardianRelationshipLabel: 'Guardian Relationship',
    
    // Messages
    addOwnerSuccessMsg: 'Owner added successfully',
    saveDraftSuccessMsg: 'Draft saved!',
    addOwnerValidationMsg: 'Please fix errors before adding the owner.',
    minOwnerRequiredMsg: 'Please add at least one owner.',
    
    // Error messages
    ownerNameRequiredError: 'Owner name is required',
    genderRequiredError: 'Gender is required',
    guardianRequiredError: 'Guardian is required',
    guardianRelationshipRequiredError: 'Guardian relationship is required',
    
    // Owner card text
    primaryText: 'Primary',
    primaryOwnerText: 'Primary Owner',
    ownerText: 'Owner',
    nameText: 'Name',
    viewOwnersText: 'View Owners',
    
    // Dropdown options
    genderOptions: ['Male', 'Female', 'Other'],
    guardianRelationshipOptions: ['Father', 'Mother', 'Spouse', 'Guardian']
  });

  const messageCodes = [
    'property.form.title',
    'new.property.form.title',
    'owner.details.subtitle',
    'previous.btn',
    'save.draft.btn',
    'add.owner.btn',
    'submit.btn',
    'verify.btn',
    'aadhaar.label',
    'owner.name.label',
    'mobile.number.label',
    'gender.label',
    'email.label',
    'guardian.label',
    'guardian.relationship.label',
    'add.owner.success',
    'save.draft.success',
    'add.owner.validation',
    'min.owner.required',
    'owner.name.required.error',
    'gender.required.error',
    'guardian.required.error',
    'guardian.relationship.required.error',
    'primary.text',
    'primary.owner.text',
    'owner.text',
    'name.text',
    'view.owners.text',
    // Dropdown options
    'gender.male',
    'gender.female',
    'gender.other',
    'guardian.relationship.father',
    'guardian.relationship.mother',
    'guardian.relationship.spouse',
    'guardian.relationship.guardian'
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
        
        // Update texts with values from API - no hardcoded fallbacks
        setTexts({
          // Page titles
          propertyFormTitle: messageMap['property.form.title'] || 'Property Form',
          newPropertyFormTitle: messageMap['new.property.form.title'] || 'New Property Form',
          ownerDetailsSubtitle: messageMap['owner.details.subtitle'] || 'Owner Details',
          
          // Button labels
          previousText: messageMap['previous.btn'] || 'Previous',
          saveDraftText: messageMap['save.draft.btn'] || 'Save Draft',
          addOwnerText: messageMap['add.owner.btn'] || 'Add Owner',
          submitText: messageMap['submit.btn'] || 'Submit',
          verifyText: messageMap['verify.btn'] || 'Verify',
          
          // Form field labels
          aadhaarLabel: messageMap['aadhaar.label'] || 'Aadhaar No.',
          ownerNameLabel: messageMap['owner.name.label'] || 'Owner name',
          mobileNumberLabel: messageMap['mobile.number.label'] || 'Mobile Number',
          genderLabel: messageMap['gender.label'] || 'Gender',
          emailLabel: messageMap['email.label'] || 'Email Address',
          guardianLabel: messageMap['guardian.label'] || 'Guardian',
          guardianRelationshipLabel: messageMap['guardian.relationship.label'] || 'Guardian Relationship',
          
          // Messages
          addOwnerSuccessMsg: messageMap['add.owner.success'] || 'Owner added successfully',
          saveDraftSuccessMsg: messageMap['save.draft.success'] || 'Draft saved!',
          addOwnerValidationMsg: messageMap['add.owner.validation'] || 'Please fix errors before adding the owner.',
          minOwnerRequiredMsg: messageMap['min.owner.required'] || 'Please add at least one owner.',
          
          // Error messages
          ownerNameRequiredError: messageMap['owner.name.required.error'] || 'Owner name is required',
          genderRequiredError: messageMap['gender.required.error'] || 'Gender is required',
          guardianRequiredError: messageMap['guardian.required.error'] || 'Guardian is required',
          guardianRelationshipRequiredError: messageMap['guardian.relationship.required.error'] || 'Guardian relationship is required',
          
          // Owner card text
          primaryText: messageMap['primary.text'] || 'Primary',
          primaryOwnerText: messageMap['primary.owner.text'] || 'Primary Owner',
          ownerText: messageMap['owner.text'] || 'Owner',
          nameText: messageMap['name.text'] || 'Name',
          viewOwnersText: messageMap['view.owners.text'] || 'View Owners',

          // Dropdown options
          genderOptions: [
            messageMap['gender.male'] || 'Male',
            messageMap['gender.female'] || 'Female',
            messageMap['gender.other'] || 'Other'
          ],
          guardianRelationshipOptions: [
            messageMap['guardian.relationship.father'] || 'Father',
            messageMap['guardian.relationship.mother'] || 'Mother',
            messageMap['guardian.relationship.spouse'] || 'Spouse',
            messageMap['guardian.relationship.guardian'] || 'Guardian'
          ]
        });
      }
    } catch (error) {
      console.error('Error fetching localized texts:', error);
      // If API fails, keep using the default English texts from initial state
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
    const savedLocale = localStorage.getItem('appLocale') || 'en';
    fetchLocalizedTexts(savedLocale);
  }, [locale]);

  return {
    ...texts,
    toggleLanguage,
    setLanguage,
    locale
  };
};
