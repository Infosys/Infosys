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

interface LocalizedTexts {
  propertyFormTitle: string;
  newPropertyFormTitle: string;
  ownerDetailsSubtitle: string;
  previousText: string;
  saveDraftText: string;
  noOwnersFoundText: string;
  addOwnerText: string;
  verifyText: string;
  submitText: string;
  addOwnerRequiredAlert: string;
  draftSavedAlert: string;
  aadhaarLabel: string;
  ownerNameLabel: string;
  mobileNumberLabel: string;
  genderLabel: string;
  emailLabel: string;
  guardianLabel: string;
  guardianRelationshipLabel: string;
  primaryOwnerText: string;
}

export const useOwnerDetailsLocalization = () => {
  const { locale, setLocale } = useLanguage();
  const [texts, setTexts] = useState<LocalizedTexts>({
    propertyFormTitle: 'Property Form',
    newPropertyFormTitle: 'New Property Form',
    ownerDetailsSubtitle: 'Owner Details',
    previousText: 'Previous',
    saveDraftText: 'Save Draft',
    noOwnersFoundText: 'No owners found.',
    addOwnerText: 'Add Owner',
    verifyText: 'Verify',
    submitText: 'Submit',
    addOwnerRequiredAlert: 'Please add at least one owner.',
    draftSavedAlert: 'Draft saved!',
     // Form field labels
    aadhaarLabel: 'Aadhaar No.',
    ownerNameLabel: 'Owner name',
    mobileNumberLabel: 'Mobile Number',
    genderLabel: 'Gender',
    emailLabel: 'Email Address',
    guardianLabel: 'Guardian',
    guardianRelationshipLabel: 'Guardian Relationship',
    primaryOwnerText: 'Primary Owner',
  });

  const messageCodes = [
    'property.form.title',
    'new.property.form.title',
    'owner.details.subtitle',
    'previous.btn',
    'save.draft.btn',
    'no.owners.found',
    'add.owner.btn',
    'verify.btn',
    'submit.btn',
    'add.owner.required.alert',
    'draft.saved.alert',
    'aadhaar.label',
    'owner.name.label',
    'mobile.number.label',
    'gender.label',
    'email.label',
    'guardian.label',
    'guardian.relationship.label',
    'primary.owner.text'
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
        
        // Update texts with fetched values or keep defaults if not found
        setTexts({
          propertyFormTitle: messageMap['property.form.title'] || 'Property Form',
          newPropertyFormTitle: messageMap['new.property.form.title'] || 'New Property Form',
          ownerDetailsSubtitle: messageMap['owner.details.subtitle'] || 'Owner Details',
          previousText: messageMap['previous.btn'] || 'Previous',
          saveDraftText: messageMap['save.draft.btn'] || 'Save Draft',
          noOwnersFoundText: messageMap['no.owners.found'] || 'No owners found.',
          addOwnerText: messageMap['add.owner.btn'] || 'Add Owner',
          verifyText: messageMap['verify.btn'] || 'Verify',
          submitText: messageMap['submit.btn'] || 'Submit',
          addOwnerRequiredAlert: messageMap['add.owner.required.alert'] || 'Please add at least one owner.',
          draftSavedAlert: messageMap['draft.saved.alert'] || 'Draft saved!',
          aadhaarLabel: messageMap['aadhaar.label'] || 'Aadhaar No.',
          ownerNameLabel: messageMap['owner.name.label'] || 'Owner name',
          mobileNumberLabel: messageMap['mobile.number.label'] || 'Mobile Number',
          genderLabel: messageMap['gender.label'] || 'Gender',
          emailLabel: messageMap['email.label'] || 'Email Address',
          guardianLabel: messageMap['guardian.label'] || 'Guardian',
          guardianRelationshipLabel: messageMap['guardian.relationship.label'] || 'Guardian Relationship',
          primaryOwnerText: messageMap['primary.owner.text'] || 'Primary Owner'
        });
      }
    } catch (error) {
      console.error('Error fetching localized texts for OwnerDetailsTwo:', error);
    }
  };

  const toggleLanguage = () => {
    const newLocale = locale === 'en' ? 'hi' : 'en';
    setLocale(newLocale);
    fetchLocalizedTexts(newLocale);
  };

  const setLanguage = (newLocale: string) => {
    setLocale(newLocale);
    fetchLocalizedTexts(newLocale);
  };

  // Initial load
  useEffect(() => {
    const savedLocale = localStorage.getItem('appLocale') || 'en';
    fetchLocalizedTexts(savedLocale);
  }, []);

  return {
    ...texts,
    toggleLanguage,
    setLanguage,
    locale
  };
};