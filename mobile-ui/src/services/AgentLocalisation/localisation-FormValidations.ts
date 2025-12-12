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

interface ValidationMessages {
  [key: string]: string;
}

export const useValidationLocalization = () => {
  const { locale } = useLanguage();
  const [messages, setMessages] = useState<ValidationMessages>({});

  const messageCodes = [
    'aadhar.required',
    'aadhar.invalid',
    'mobile.required',
    'mobile.invalid',
    'certificate.required',
    'certificate.invalid',
    'email.required',
    'email.invalid',
    'date.required',
    'date.future',
    'locality.required',
    'zone.invalid',
    'ward.required',
    'block.required',
    'electionWard.required',
    'secretariatWard.required',
    'pincode.invalid',
    'reason.required',
    'certificateNumber.required',
    'certificateDate.required',
    'extentSite.required',
    'extentSite.positive',
    'landUnderneath.required',
    'landUnderneath.positive',
    'habitation.required',
    'igrsWard.required',
    'igrsLocality.required',
    'igrsBlock.required',
    'doorNoFrom.required',
    'doorNoTo.required',
    'documentType.required',
    'no.required',
    'no.invalid',
    'constructionDate.required',
    'mroProceedingNumber.required',
    'mroProceedingNumber.invalid',
    'mroProceedingDate.required',
    'courtName.required',
    'courtName.invalid'
  ];

  const fetchLocalizedMessages = async (newLocale: string) => {
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
        setMessages(messageMap);
      } else {
        console.error('Failed to fetch validation messages:', response.status);
        // Set default English messages if API fails
        setDefaultMessages();
      }
    } catch (error) {
      console.error('Error fetching validation messages:', error);
      // Set default English messages if API fails
      setDefaultMessages();
    }
  };

  const setDefaultMessages = () => {
    setMessages({
      'aadhar.required': 'Aadhar number is required',
      'aadhar.invalid': 'Aadhar number must be 12 digits',
      'mobile.required': 'Mobile number is required',
      'mobile.invalid': 'Mobile number must start with 6-9 and be 10 digits',
      'certificate.required': 'Certificate number is required',
      'certificate.invalid': 'Certificate number must be 6-20 alphanumeric characters',
      'email.required': 'Email is required',
      'email.invalid': 'Invalid email address',
      'date.required': 'Date is required',
      'date.future': 'Date cannot be in the future',
      'locality.required': 'Locality is required',
      'zone.invalid': 'Zone No must be 1-3 digits',
      'ward.required': 'Ward No is required',
      'block.required': 'Block No is required',
      'electionWard.required': 'Election Ward is required',
      'secretariatWard.required': 'Secretariat Ward is required',
      'pincode.invalid': 'Pincode must be 6 digits',
      'reason.required': 'Reason is required',
      'certificateNumber.required': 'Certificate Number is required',
      'certificateDate.required': 'Certificate Date is required',
      'extentSite.required': 'Extent of Site is required',
      'extentSite.positive': 'Must be a positive number',
      'landUnderneath.required': 'Land Underneath is required',
      'landUnderneath.positive': 'Must be a positive number',
      'habitation.required': 'Habitation is required',
      'igrsWard.required': 'IGRS Ward is required',
      'igrsLocality.required': 'IGRS Locality is required',
      'igrsBlock.required': 'IGRS Block is required',
      'doorNoFrom.required': 'IGRS Door No From is required',
      'doorNoTo.required': 'IGRS Door No To is required',
      'documentType.required': 'Document Type is required',
      'no.required': 'No is required',
      'no.invalid': 'No must contain only numbers',
      'constructionDate.required': 'Construction Date is required',
      'mroProceedingNumber.required': 'MRO Proceeding Number is required',
      'mroProceedingNumber.invalid': 'MRO Proceeding Number must contain only numbers',
      'mroProceedingDate.required': 'MRO Proceeding Date is required',
      'courtName.required': 'Court Name is required',
      'courtName.invalid': 'Court Name must contain only alphabets'
    });
  };

  // Fetch messages when locale changes
  useEffect(() => {
    fetchLocalizedMessages(locale);
  }, [locale]);

  return { messages };
};