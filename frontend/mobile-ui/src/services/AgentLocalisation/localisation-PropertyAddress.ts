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

interface LocalizedTexts {
  propertyFormTitle: string;
  newPropertyFormTitle: string;
  propertyAddressSubtitle: string;
  previousText: string;
  saveDraftText: string;
  localityLabel: string;
  zoneNoLabel: string;
  wardNoLabel: string;
  blockNoLabel: string;
  streetLabel: string;
  electionWardLabel: string;
  secretariatWardLabel: string;
  pincodeLabel: string;
  correspondenceAddressDifferentLabel: string;
  verifyText: string;
  submitText: string;
  fixErrorsAlert: string;
  draftSavedAlert: string;
  // Dropdown options
  wardNoOptions: string[];
  blockNoOptions: string[];
  streetOptions: string[];

  electionWardOptions: string[];      // ADD THIS
  secretariatWardOptions: string[];
}

export const usePropertyAddressLocalization = () => {
  const { locale, setLocale } = useLanguage();
  const [texts, setTexts] = useState<LocalizedTexts>({
    propertyFormTitle: 'Property Form',
    newPropertyFormTitle: 'New Property Form',
    propertyAddressSubtitle: 'Property Address',
    previousText: 'Previous',
    saveDraftText: 'Save Draft',
    localityLabel: 'Locality',
    zoneNoLabel: 'Zone no',
    wardNoLabel: 'Ward No',
    blockNoLabel: 'Block No',
    streetLabel: 'Street',
    electionWardLabel: 'Election Ward',
    secretariatWardLabel: 'Secretariat Ward',
    pincodeLabel: 'Pincode',
    correspondenceAddressDifferentLabel: 'Is correspondence address different from property address?',
    verifyText: 'Verify',
    submitText: 'Submit',
    fixErrorsAlert: 'Please fix errors before submitting!',
    draftSavedAlert: 'Draft saved!',
    // Dropdown options
    wardNoOptions: ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4'],
    blockNoOptions: ['Block A', 'Block B', 'Block C', 'Block D'],
    streetOptions: ['Main Street', 'First Street', 'Second Street', 'Third Street'],
    electionWardOptions: ['Election ward 1', 'Election ward 2', 'Election ward 3', 'Election ward 4'],
    secretariatWardOptions: ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4']
  });

  const messageCodes = [
    'property.form.title',
    'new.property.form.title',
    'property.address.subtitle',
    'previous.btn',
    'save.draft.btn',
    'locality.label',
    'zone.no.label',
    'ward.no.label',
    'block.no.label',
    'street.label',
    'election.ward.label',
    'secretariat.ward.label',
    'pincode.label',
    'correspondence.address.different.label',
    'verify.btn',
    'submit.btn',
    'fix.errors.alert',
    'draft.saved.alert',
    //Dropdown Options
  // Ward dropdown options
    'ward.option.ward1',
    'ward.option.ward2',
    'ward.option.ward3',
    'ward.option.ward4',
  // Block dropdown options
    'block.option.blocka',
    'block.option.blockb',
    'block.option.blockc',
    'block.option.blockd',
  // Street dropdown options
    'street.option.main',
    'street.option.first',
    'street.option.second',
    'street.option.third',

    'electionward.option.electionward1',
    'electionward.option.electionward2',
    'electionward.option.electionward3',
    'electionward.option.electionward4',
    // ADD THESE: Secretariat Ward options
    'secretariatward.option.ward1',
    'secretariatward.option.ward2',
    'secretariatward.option.ward3',
    'secretariatward.option.ward4',
  ];

  const fetchLocalizedTexts = async (newLocale: string) => {
    try {
      const codesParam = messageCodes.join(',');
      const url = `${env.LOCALIZATION_HOST}/localization/v1/messages?module=common&locale=${newLocale}&codes=${codesParam}`;

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
          propertyAddressSubtitle: messageMap['property.address.subtitle'] || 'Property Address',
          previousText: messageMap['previous.btn'] || 'Previous',
          saveDraftText: messageMap['save.draft.btn'] || 'Save Draft',
          localityLabel: messageMap['locality.label'] || 'Locality',
          zoneNoLabel: messageMap['zone.no.label'] || 'Zone no',
          wardNoLabel: messageMap['ward.no.label'] || 'Ward No',
          blockNoLabel: messageMap['block.no.label'] || 'Block No',
          streetLabel: messageMap['street.label'] || 'Street',
          electionWardLabel: messageMap['election.ward.label'] || 'Election Ward',
          secretariatWardLabel: messageMap['secretariat.ward.label'] || 'Secretariat Ward',
          pincodeLabel: messageMap['pincode.label'] || 'Pincode',
          correspondenceAddressDifferentLabel: messageMap['correspondence.address.different.label'] || 'Is correspondence address different from property address?',
          verifyText: messageMap['verify.btn'] || 'Verify',
          submitText: messageMap['submit.btn'] || 'Submit',
          fixErrorsAlert: messageMap['fix.errors.alert'] || 'Please fix errors before submitting!',
          draftSavedAlert: messageMap['draft.saved.alert'] || 'Draft saved!',
          // Dropdown options
          wardNoOptions: [
            messageMap['ward.option.ward1'] || 'Ward 1',
            messageMap['ward.option.ward2'] || 'Ward 2',
            messageMap['ward.option.ward3'] || 'Ward 3',
            messageMap['ward.option.ward4'] || 'Ward 4'
          ],
          blockNoOptions: [
            messageMap['block.option.blocka'] || 'Block A',
            messageMap['block.option.blockb'] || 'Block B',
            messageMap['block.option.blockc'] || 'Block C',
            messageMap['block.option.blockd'] || 'Block D'
          ],
          streetOptions: [
            messageMap['street.option.main'] || 'Main Street',
            messageMap['street.option.first'] || 'First Street',
            messageMap['street.option.second'] || 'Second Street',
            messageMap['street.option.third'] || 'Third Street'
          ],
          electionWardOptions: [
            messageMap['electionward.option.electionward1'] || 'Election ward 1',
            messageMap['electionward.option.electionward2'] || 'Election ward 2',
            messageMap['electionward.option.electionward3'] || 'Election ward 3',
            messageMap['electionward.option.electionward4'] || 'Election ward 4',
            
          ],
          // ADD THESE: Secretariat Ward options
          secretariatWardOptions: [
            messageMap['secretariatward.option.ward1'] || 'Ward 1',
            messageMap['secretariatward.option.ward2'] || 'Ward 2',
            messageMap['secretariatward.option.ward3'] || 'Ward 3',
            messageMap['secretariatward.option.ward4'] || 'Ward 4',
          ]
        });
      }
    } catch (error) {
      console.error('Error fetching localized texts for PropertyAddress:', error);
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

