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

interface AddCommentLocalizedTexts {
  // Header
  addCommentTitleText: string;
  addCommentSubtitleText: string;
  
  // Navigation
  previousText: string;
  homeText: string;
  
  // Form
  enterRequestLabelText: string;
  dragDropText: string;
  browseSystemText: string;
  uploadingText: string;
  downloadText: string;
  attachDocumentsText: string;
  
  // Buttons
  cancelText: string;
  submitText: string;
  
  // Error messages
  fileUploadFailedText: string;
  propertyIdMissingText: string;
  pleaseEnterCommentText: string;
  failedToSubmitText: string;
}

export const useAddCommentLocalization = () => {
  const { locale } = useLanguage();
  const [texts, setTexts] = useState<AddCommentLocalizedTexts>({
    // Header
    addCommentTitleText: 'Add Comment or Request',
    addCommentSubtitleText: 'add documents leave a comment/request for Admin',
    
    // Navigation
    previousText: 'Previous',
    homeText: 'Home',
    
    // Form
    enterRequestLabelText: 'Enter Request or Comment',
    dragDropText: 'Drag and Drop your file or',
    browseSystemText: 'Browse system',
    uploadingText: 'Uploading...',
    downloadText: 'Download',
    attachDocumentsText: 'Attach all documents.',
    
    // Buttons
    cancelText: 'Cancel',
    submitText: 'Submit',
    
    // Error messages
    fileUploadFailedText: 'File upload failed',
    propertyIdMissingText: 'Property ID missing',
    pleaseEnterCommentText: 'Please enter a comment or request',
    failedToSubmitText: 'Failed to submit request'
  });

  // Hardcoded fallback translations
  const getHardcodedTranslation = (code: string, locale: string): string => {
    const translations: Record<string, Record<string, string>> = {
      'hi': {
        'add.comment.title': 'टिप्पणी या अनुरोध जोड़ें',
        'add.comment.subtitle': 'दस्तावेज़ जोड़ें और प्रशासक के लिए टिप्पणी/अनुरोध छोड़ें',
        'previous.btn': 'पिछला',
        'home.btn': 'होम',
        'enter.request.label': 'अनुरोध या टिप्पणी दर्ज करें',
        'drag.drop.text': 'अपनी फ़ाइल खींचें और छोड़ें या',
        'browse.system.text': 'सिस्टम ब्राउज़ करें',
        'uploading.text': 'अपलोड हो रहा है...',
        'download.btn': 'डाउनलोड',
        'attach.documents.text': 'सभी दस्तावेज़ संलग्न करें।',
        'cancel.btn': 'रद्द करें',
        'submit.btn': 'जमा करें',
        'file.upload.failed': 'फ़ाइल अपलोड विफल',
        'property.id.missing': 'संपत्ति आईडी गायब',
        'please.enter.comment': 'कृपया एक टिप्पणी या अनुरोध दर्ज करें',
        'failed.to.submit': 'अनुरोध जमा करने में विफल'
      },
      'kn': {
        'add.comment.title': 'ಕಾಮೆಂಟ್ ಅಥವಾ ವಿನಂತಿಯನ್ನು ಸೇರಿಸಿ',
        'add.comment.subtitle': 'ದಾಖಲೆಗಳನ್ನು ಸೇರಿಸಿ ಮತ್ತು ನಿರ್ವಾಹಕರಿಗೆ ಕಾಮೆಂಟ್/ವಿನಂತಿಯನ್ನು ಬಿಡಿ',
        'previous.btn': 'ಹಿಂದಿನದು',
        'home.btn': 'ಮುಖಪುಟ',
        'enter.request.label': 'ವಿನಂತಿ ಅಥವಾ ಕಾಮೆಂಟ್ ನಮೂದಿಸಿ',
        'drag.drop.text': 'ನಿಮ್ಮ ಫೈಲ್ ಅನ್ನು ಎಳೆದು ಬಿಡಿ ಅಥವಾ',
        'browse.system.text': 'ಸಿಸ್ಟಮ್ ಬ್ರೌಸ್ ಮಾಡಿ',
        'uploading.text': 'ಅಪ್ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
        'download.btn': 'ಡೌನ್‌ಲೋಡ್',
        'attach.documents.text': 'ಎಲ್ಲಾ ದಾಖಲೆಗಳನ್ನು ಲಗತ್ತಿಸಿ।',
        'cancel.btn': 'ರದ್ದುಮಾಡಿ',
        'submit.btn': 'ಸಲ್ಲಿಸಿ',
        'file.upload.failed': 'ಫೈಲ್ ಅಪ್ಲೋಡ್ ವಿಫಲವಾಗಿದೆ',
        'property.id.missing': 'ಆಸ್ತಿ ಐಡಿ ಕಾಣೆಯಾಗಿದೆ',
        'please.enter.comment': 'ದಯವಿಟ್ಟು ಕಾಮೆಂಟ್ ಅಥವಾ ವಿನಂತಿಯನ್ನು ನಮೂದಿಸಿ',
        'failed.to.submit': 'ವಿನಂತಿಯನ್ನು ಸಲ್ಲಿಸಲು ವಿಫಲವಾಗಿದೆ'
      }
    };
    
    return translations[locale]?.[code] || '';
  };

  const messageCodes = [
    'add.comment.title',
    'add.comment.subtitle',
    'previous.btn',
    'home.btn',
    'enter.request.label',
    'drag.drop.text',
    'browse.system.text',
    'uploading.text',
    'download.btn',
    'attach.documents.text',
    'cancel.btn',
    'submit.btn',
    'file.upload.failed',
    'property.id.missing',
    'please.enter.comment',
    'failed.to.submit'
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
        const messageMap: Record<string, string> = {};
        data.messages.forEach(msg => {
          messageMap[msg.code] = msg.message;
        });
        // Update texts with values from API, with hardcoded fallback
        setTexts({
          addCommentTitleText: messageMap['add.comment.title'] || getHardcodedTranslation('add.comment.title', newLocale) || 'Add Comment or Request',
          addCommentSubtitleText: messageMap['add.comment.subtitle'] || getHardcodedTranslation('add.comment.subtitle', newLocale) || 'add documents leave a comment/request for Admin',
          previousText: messageMap['previous.btn'] || getHardcodedTranslation('previous.btn', newLocale) || 'Previous',
          homeText: messageMap['home.btn'] || getHardcodedTranslation('home.btn', newLocale) || 'Home',
          enterRequestLabelText: messageMap['enter.request.label'] || getHardcodedTranslation('enter.request.label', newLocale) || 'Enter Request or Comment',
          dragDropText: messageMap['drag.drop.text'] || getHardcodedTranslation('drag.drop.text', newLocale) || 'Drag and Drop your file or',
          browseSystemText: messageMap['browse.system.text'] || getHardcodedTranslation('browse.system.text', newLocale) || 'Browse system',
          uploadingText: messageMap['uploading.text'] || getHardcodedTranslation('uploading.text', newLocale) || 'Uploading...',
          downloadText: messageMap['download.btn'] || getHardcodedTranslation('download.btn', newLocale) || 'Download',
          attachDocumentsText: messageMap['attach.documents.text'] || getHardcodedTranslation('attach.documents.text', newLocale) || 'Attach all documents.',
          cancelText: messageMap['cancel.btn'] || getHardcodedTranslation('cancel.btn', newLocale) || 'Cancel',
          submitText: messageMap['submit.btn'] || getHardcodedTranslation('submit.btn', newLocale) || 'Submit',
          fileUploadFailedText: messageMap['file.upload.failed'] || getHardcodedTranslation('file.upload.failed', newLocale) || 'File upload failed',
          propertyIdMissingText: messageMap['property.id.missing'] || getHardcodedTranslation('property.id.missing', newLocale) || 'Property ID missing',
          pleaseEnterCommentText: messageMap['please.enter.comment'] || getHardcodedTranslation('please.enter.comment', newLocale) || 'Please enter a comment or request',
          failedToSubmitText: messageMap['failed.to.submit'] || getHardcodedTranslation('failed.to.submit', newLocale) || 'Failed to submit request'
        });
      }
    } catch (error) {
      console.error('Error fetching localized texts for AddComment:', error);
      console.warn('Using default texts due to API error');
    }
  };

  useEffect(() => {
    fetchLocalizedTexts(locale);
  }, [locale]);

  return {
    ...texts,
    locale
  };
};
