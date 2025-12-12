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
  assessmentDetailsSubtitle: string;
  previousText: string;
  saveDraftText: string;
  verifyText: string;
  submitText: string;
  reasonCreationLabel: string;
  occupancyCertificateNumberLabel: string;
  occupancyCertificateDateLabel: string;
  extentSiteLabel: string;
  landUnderBuildingLabel: string;
  unspecifiedShareLabel: string;
  selectOption: string;
  enterCertificateNumberPlaceholder: string;
  enterExtentSitePlaceholder: string;
  enterLandUnderneathPlaceholder: string;
  draftSavedAlert: string;
  failedLoadReasonsError: string;
  reasonRequiredError: string;
  certificateNumberRequiredError: string;
  certificateDateRequiredError: string;
  extentSiteRequiredError: string;
  positiveNumberRequiredError: string;
  landUnderneathRequiredError: string;
  // Dropdown options
  reasonOptions: string[];
}

export const useAssessmentDetailsLocalization = () => {
  const { locale, setLocale } = useLanguage();
  const [texts, setTexts] = useState<LocalizedTexts>({
    propertyFormTitle: 'Property Form',
    newPropertyFormTitle: 'New Property Form',
    assessmentDetailsSubtitle: 'Assessment Details',
    previousText: 'Previous',
    saveDraftText: 'Save Draft',
    verifyText: 'Verify',
    submitText: 'Submit',
    reasonCreationLabel: 'Reason for Creation',
    occupancyCertificateNumberLabel: 'Occupancy Certificate Number',
    occupancyCertificateDateLabel: 'Occupancy Certificate Date',
    extentSiteLabel: 'Extent of Site',
    landUnderBuildingLabel: 'Land Underneath the Building',
    unspecifiedShareLabel: 'Is Unspecified / Undivided Share?',
    selectOption: 'Select',
    enterCertificateNumberPlaceholder: 'Enter certificate number',
    enterExtentSitePlaceholder: 'Enter extent of site',
    enterLandUnderneathPlaceholder: 'Enter land underneath',
    draftSavedAlert: 'Draft saved!',
    failedLoadReasonsError: 'Failed to load reasons!',
    reasonRequiredError: 'Reason is required',
    certificateNumberRequiredError: 'Certificate Number is required',
    certificateDateRequiredError: 'Certificate Date is required',
    extentSiteRequiredError: 'Extent of Site is required',
    positiveNumberRequiredError: 'Must be a positive number',
    landUnderneathRequiredError: 'Land Underneath is required',
    // Dropdown options
    reasonOptions: ['New Construction', 'Renovation', 'Demolition', 'Extension', 'Change of Use']
  });

  const messageCodes = [
    'property.form.title',
    'new.property.form.title',
    'assessment.details.subtitle',
    'previous.btn',
    'save.draft.btn',
    'verify.btn',
    'submit.btn',
    'reason.creation.label',
    'occupancy.certificate.number.label',
    'occupancy.certificate.date.label',
    'extent.site.label',
    'land.under.building.label',
    'unspecified.share.label',
    'select.option',
    'enter.certificate.number.placeholder',
    'enter.extent.site.placeholder',
    'enter.land.underneath.placeholder',
    'draft.saved.alert',
    'failed.load.reasons.error',
    'reason.required.error',
    'certificate.number.required.error',
    'certificate.date.required.error',
    'extent.site.required.error',
    'positive.number.required.error',
    'land.underneath.required.error',
    // Dropdown options
    'reason.option.new.construction',
    'reason.option.renovation',
    'reason.option.demolition',
    'reason.option.extension',
    'reason.option.changeofuse'
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
          assessmentDetailsSubtitle: messageMap['assessment.details.subtitle'] || 'Assessment Details',
          previousText: messageMap['previous.btn'] || 'Previous',
          saveDraftText: messageMap['save.draft.btn'] || 'Save Draft',
          verifyText: messageMap['verify.btn'] || 'Verify',
          submitText: messageMap['submit.btn'] || 'Submit',
          reasonCreationLabel: messageMap['reason.creation.label'] || 'Reason for Creation',
          occupancyCertificateNumberLabel: messageMap['occupancy.certificate.number.label'] || 'Occupancy Certificate Number',
          occupancyCertificateDateLabel: messageMap['occupancy.certificate.date.label'] || 'Occupancy Certificate Date',
          extentSiteLabel: messageMap['extent.site.label'] || 'Extent of Site',
          landUnderBuildingLabel: messageMap['land.under.building.label'] || 'Land Underneath the Building',
          unspecifiedShareLabel: messageMap['unspecified.share.label'] || 'Is Unspecified / Undivided Share?',
          selectOption: messageMap['select.option'] || 'Select',
          enterCertificateNumberPlaceholder: messageMap['enter.certificate.number.placeholder'] || 'Enter certificate number',
          enterExtentSitePlaceholder: messageMap['enter.extent.site.placeholder'] || 'Enter extent of site',
          enterLandUnderneathPlaceholder: messageMap['enter.land.underneath.placeholder'] || 'Enter land underneath',
          draftSavedAlert: messageMap['draft.saved.alert'] || 'Draft saved!',
          failedLoadReasonsError: messageMap['failed.load.reasons.error'] || 'Failed to load reasons!',
          reasonRequiredError: messageMap['reason.required.error'] || 'Reason is required',
          certificateNumberRequiredError: messageMap['certificate.number.required.error'] || 'Certificate Number is required',
          certificateDateRequiredError: messageMap['certificate.date.required.error'] || 'Certificate Date is required',
          extentSiteRequiredError: messageMap['extent.site.required.error'] || 'Extent of Site is required',
          positiveNumberRequiredError: messageMap['positive.number.required.error'] || 'Must be a positive number',
          landUnderneathRequiredError: messageMap['land.underneath.required.error'] || 'Land Underneath is required',
          
          // Dropdown options
          reasonOptions: [
            messageMap['reason.option.new.construction'] || 'New Construction',
            messageMap['reason.option.renovation'] || 'Renovation',
            messageMap['reason.option.demolition'] || 'Demolition',
            messageMap['reason.option.extension'] || 'Extension',
            messageMap['reason.option.changeofuse'] || 'Change of Use'
          ]
        });
      }
    } catch (error) {
      console.error('Error fetching localized texts for AssessmentDetails:', error);
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
    fetchLocalizedTexts(locale);
  }, []);

  return {
    ...texts,
    toggleLanguage,
    setLanguage,
    locale
  };
};
