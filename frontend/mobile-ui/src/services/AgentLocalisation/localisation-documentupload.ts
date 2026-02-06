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

interface DocumentUploadLocalizedTexts {
  // Header texts
  propertyFormText: string;
  newPropertyFormText: string;
  documentUploadText: string;
  
  // Navigation buttons
  previousText: string;
  saveDraftText: string;
  
  // Upload status
  documentsUploadedText: string;
  uploadedSuccessfullyText: string;
  
  // File info
  fileTypesText: string;
  
  // Action buttons
  chooseFileText: string;
  takePhotoText: string;
  verifyText: string;
  confirmText: string;
  
  // Document type labels
  twoNonJudicialStampPapersText: string;
  notarizedAffidavitText: string;
  deathCertificateText: string;
  thirdPartyVerificationText: string;
  pattaCertificateText: string;
  mroProceedingsText: string;
  willDeedText: string;
  decreeDocumentText: string;
  registeredDocumentText: string;
  photoOfPropertyText: string;
  
  // Alert messages
  draftSavedText: string;
  fileUploadFailedText: string;
  fileNotFoundText: string;
  downloadFailedText: string;
  unableToOpenFileText: string;
}

export const useDocumentUploadLocalization = () => {
  const { locale } = useLanguage();
  const [texts, setTexts] = useState<DocumentUploadLocalizedTexts>({
    // Header texts
    propertyFormText: 'Property Form',
    newPropertyFormText: 'New Property Form',
    documentUploadText: 'Document Upload',
    
    // Navigation buttons
    previousText: 'Previous',
    saveDraftText: 'Save Draft',
    
    // Upload status
    documentsUploadedText: 'documents uploaded',
    uploadedSuccessfullyText: 'Uploaded successfully',
    
    // File info
    fileTypesText: 'PDF, JPG, PNG (max 5MB)',
    
    // Action buttons
    chooseFileText: 'Choose File',
    takePhotoText: 'Take Photo',
    verifyText: 'VERIFY',
    confirmText: 'Confirm',
    
    // Document type labels
    twoNonJudicialStampPapersText: 'Two Non-Judicial stamp papers of Rs.10',
    notarizedAffidavitText: 'Notarized Affidavit Cum Indemnity Bond On Rs.100 Stamp Paper',
    deathCertificateText: 'Copy Of Death Certificate/ Succession Certificate/ Legal Heir Certificate',
    thirdPartyVerificationText: 'Third Party Verification Copy',
    pattaCertificateText: 'Patta Certificate',
    mroProceedingsText: 'MRO Proceedings',
    willDeedText: 'Will Deed',
    decreeDocumentText: 'Decree Document',
    registeredDocumentText: 'Registered Document',
    photoOfPropertyText: 'Photo of Property With Holder',
    
    // Alert messages
    draftSavedText: 'Draft saved!',
    fileUploadFailedText: 'File upload failed!',
    fileNotFoundText: 'File not found',
    downloadFailedText: 'Download failed',
    unableToOpenFileText: 'Unable to open file'
  });

  const messageCodes = [
    // Header texts
    'property.form.title',           // "Property Form"
    'new.property.form.title',       // "New Property Form"
    'document.upload.title',         // "Document Upload"
    
    // Navigation buttons
    'previous.btn',                  // "Previous"
    'save.draft.btn',                // "Save Draft"
    
    // Upload status
    'documents.uploaded.label',      // "documents uploaded"
    'uploaded.successfully.label',   // "Uploaded successfully"
    
    // File info
    'file.types.label',              // "PDF, JPG, PNG (max 5MB)"
    
    // Action buttons
    'choose.file.btn',               // "Choose File"
    'take.photo.btn',                // "Take Photo"
    'verify.btn',                    // "Verify"
    'confirm.btn',                   // "Confirm"
    
    // Document type labels
    'doc.two.non.judicial.stamp',    // "Two Non-Judicial stamp papers of Rs.10"
    'doc.notarized.affidavit',       // "Notarized Affidavit Cum Indemnity Bond On Rs.100 Stamp Paper"
    'doc.death.certificate',         // "Copy Of Death Certificate/ Succession Certificate/ Legal Heir Certificate"
    'doc.third.party.verification',  // "Third Party Verification Copy"
    'doc.patta.certificate',         // "Patta Certificate"
    'doc.mro.proceedings',           // "MRO Proceedings"
    'doc.will.deed',                 // "Will Deed"
    'doc.decree.document',           // "Decree Document"
    'doc.registered.document',       // "Registered Document"
    'doc.photo.property.holder',     // "Photo of Property With Holder"
    
    // Alert messages
    'draft.saved.alert',             // "Draft saved!"
    'file.upload.failed.alert',      // "File upload failed!"
    'file.not.found.alert',          // "File not found"
    'download.failed.alert',         // "Download failed"
    'unable.to.open.file.alert'      // "Unable to open file"
  ];

  // Hardcoded fallback translations
  const getHardcodedTranslation = (code: string, locale: string): string => {
    const translations: Record<string, Record<string, string>> = {
      'hi': {
        'document.upload.title': 'दस्तावेज़ अपलोड',
        'documents.uploaded.label': 'दस्तावेज़ अपलोड किए गए',
        'uploaded.successfully.label': 'सफलतापूर्वक अपलोड किया गया',
        'file.types.label': 'PDF, JPG, PNG (अधिकतम 5MB)',
        'choose.file.btn': 'फ़ाइल चुनें',
        'take.photo.btn': 'फोटो लें',
        'verify.btn': 'सत्यापित करें',
        'confirm.btn': 'पुष्टि करें',
        'doc.two.non.judicial.stamp': 'रु.10 के दो गैर-न्यायिक स्टाम्प पेपर',
        'doc.notarized.affidavit': 'रु.100 स्टाम्प पेपर पर नोटरीकृत शपथ पत्र कम क्षतिपूर्ति बांड',
        'doc.death.certificate': 'मृत्यु प्रमाण पत्र / उत्तराधिकार प्रमाण पत्र / कानूनी उत्तराधिकारी प्रमाण पत्र की प्रति',
        'doc.third.party.verification': 'तीसरे पक्ष का सत्यापन प्रति',
        'doc.patta.certificate': 'पट्टा प्रमाण पत्र',
        'doc.mro.proceedings': 'एमआरओ कार्यवाही',
        'doc.will.deed': 'वसीयत विलेख',
        'doc.decree.document': 'डिक्री दस्तावेज़',
        'doc.registered.document': 'पंजीकृत दस्तावेज़',
        'doc.photo.property.holder': 'संपत्ति धारक के साथ फोटो',
        'draft.saved.alert': 'ड्राफ्ट सहेजा गया!',
        'file.upload.failed.alert': 'फ़ाइल अपलोड विफल!',
        'file.not.found.alert': 'फ़ाइल नहीं मिली',
        'download.failed.alert': 'डाउनलोड विफल',
        'unable.to.open.file.alert': 'फ़ाइल खोलने में असमर्थ'
      },
      'kn': {
        'document.upload.title': 'ದಾಖಲೆ ಅಪ್ಲೋಡ್',
        'documents.uploaded.label': 'ದಾಖಲೆಗಳನ್ನು ಅಪ್ಲೋಡ್ ಮಾಡಲಾಗಿದೆ',
        'uploaded.successfully.label': 'ಯಶಸ್ವಿಯಾಗಿ ಅಪ್ಲೋಡ್ ಮಾಡಲಾಗಿದೆ',
        'file.types.label': 'PDF, JPG, PNG (ಗರಿಷ್ಠ 5MB)',
        'choose.file.btn': 'ಫೈಲ್ ಆಯ್ಕೆಮಾಡಿ',
        'take.photo.btn': 'ಫೋಟೋ ತೆಗೆಯಿರಿ',
        'verify.btn': 'ಪರಿಶೀಲಿಸಿ',
        'confirm.btn': 'ದೃಢೀಕರಿಸಿ',
        'doc.two.non.judicial.stamp': 'ರೂ.10 ರ ಎರಡು ನ್ಯಾಯಾಂಗವಲ್ಲದ ಸ್ಟಾಂಪ್ ಪೇಪರ್‌ಗಳು',
        'doc.notarized.affidavit': 'ರೂ.100 ಸ್ಟಾಂಪ್ ಪೇಪರ್‌ನಲ್ಲಿ ನೋಟರೈಸ್ ಮಾಡಿದ ಅಫಿಡವಿಟ್ ಕಮ್ ಇಂಡೆಮ್ನಿಟಿ ಬಾಂಡ್',
        'doc.death.certificate': 'ಮರಣ ಪ್ರಮಾಣಪತ್ರ / ಉತ್ತರಾಧಿಕಾರ ಪ್ರಮಾಣಪತ್ರ / ಕಾನೂನು ಉತ್ತರಾಧಿಕಾರಿ ಪ್ರಮಾಣಪತ್ರದ ಪ್ರತಿ',
        'doc.third.party.verification': 'ಮೂರನೇ ವ್ಯಕ್ತಿ ಪರಿಶೀಲನೆ ಪ್ರತಿ',
        'doc.patta.certificate': 'ಪಟ್ಟಾ ಪ್ರಮಾಣಪತ್ರ',
        'doc.mro.proceedings': 'MRO ಕಾರ್ಯವಾಹಿ',
        'doc.will.deed': 'ಇಚ್ಛೆ ಪತ್ರ',
        'doc.decree.document': 'ತೀರ್ಪು ದಾಖಲೆ',
        'doc.registered.document': 'ನೋಂದಾಯಿತ ದಾಖಲೆ',
        'doc.photo.property.holder': 'ಆಸ್ತಿ ಹೊಂದಿರುವವರ ಜೊತೆ ಫೋಟೋ',
        'draft.saved.alert': 'ಡ್ರಾಫ್ಟ್ ಉಳಿಸಲಾಗಿದೆ!',
        'file.upload.failed.alert': 'ಫೈಲ್ ಅಪ್ಲೋಡ್ ವಿಫಲವಾಗಿದೆ!',
        'file.not.found.alert': 'ಫೈಲ್ ಕಂಡುಬಂದಿಲ್ಲ',
        'download.failed.alert': 'ಡೌನ್‌ಲೋಡ್ ವಿಫಲವಾಗಿದೆ',
        'unable.to.open.file.alert': 'ಫೈಲ್ ತೆರೆಯಲು ಸಾಧ್ಯವಿಲ್ಲ'
      }
    };
    
    return translations[locale]?.[code] || '';
  };

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
        
        // Update texts with values from API, with hardcoded fallback
        setTexts({
          // Header texts
          propertyFormText: messageMap['property.form.title'] || 'Property Form',
          newPropertyFormText: messageMap['new.property.form.title'] || 'New Property Form',
          documentUploadText: messageMap['document.upload.title'] || getHardcodedTranslation('document.upload.title', newLocale) || 'Document Upload',
          
          // Navigation buttons
          previousText: messageMap['previous.btn'] || 'Previous',
          saveDraftText: messageMap['save.draft.btn'] || 'Save Draft',
          
          // Upload status
          documentsUploadedText: messageMap['documents.uploaded.label'] || getHardcodedTranslation('documents.uploaded.label', newLocale) || 'documents uploaded',
          uploadedSuccessfullyText: messageMap['uploaded.successfully.label'] || getHardcodedTranslation('uploaded.successfully.label', newLocale) || 'Uploaded successfully',
          
          // File info
          fileTypesText: messageMap['file.types.label'] || getHardcodedTranslation('file.types.label', newLocale) || 'PDF, JPG, PNG (max 5MB)',
          
          // Action buttons
          chooseFileText: messageMap['choose.file.btn'] || getHardcodedTranslation('choose.file.btn', newLocale) || 'Choose File',
          takePhotoText: messageMap['take.photo.btn'] || getHardcodedTranslation('take.photo.btn', newLocale) || 'Take Photo',
          verifyText: messageMap['verify.btn'] || getHardcodedTranslation('verify.btn', newLocale) || 'Verify',
          confirmText: messageMap['confirm.btn'] || getHardcodedTranslation('confirm.btn', newLocale) || 'Confirm',
          
          // Document type labels
          twoNonJudicialStampPapersText: messageMap['doc.two.non.judicial.stamp'] || getHardcodedTranslation('doc.two.non.judicial.stamp', newLocale) || 'Two Non-Judicial stamp papers of Rs.10',
          notarizedAffidavitText: messageMap['doc.notarized.affidavit'] || getHardcodedTranslation('doc.notarized.affidavit', newLocale) || 'Notarized Affidavit Cum Indemnity Bond On Rs.100 Stamp Paper',
          deathCertificateText: messageMap['doc.death.certificate'] || getHardcodedTranslation('doc.death.certificate', newLocale) || 'Copy Of Death Certificate/ Succession Certificate/ Legal Heir Certificate',
          thirdPartyVerificationText: messageMap['doc.third.party.verification'] || getHardcodedTranslation('doc.third.party.verification', newLocale) || 'Third Party Verification Copy',
          pattaCertificateText: messageMap['doc.patta.certificate'] || getHardcodedTranslation('doc.patta.certificate', newLocale) || 'Patta Certificate',
          mroProceedingsText: messageMap['doc.mro.proceedings'] || getHardcodedTranslation('doc.mro.proceedings', newLocale) || 'MRO Proceedings',
          willDeedText: messageMap['doc.will.deed'] || getHardcodedTranslation('doc.will.deed', newLocale) || 'Will Deed',
          decreeDocumentText: messageMap['doc.decree.document'] || getHardcodedTranslation('doc.decree.document', newLocale) || 'Decree Document',
          registeredDocumentText: messageMap['doc.registered.document'] || getHardcodedTranslation('doc.registered.document', newLocale) || 'Registered Document',
          photoOfPropertyText: messageMap['doc.photo.property.holder'] || getHardcodedTranslation('doc.photo.property.holder', newLocale) || 'Photo of Property With Holder',
          
          // Alert messages
          draftSavedText: messageMap['draft.saved.alert'] || getHardcodedTranslation('draft.saved.alert', newLocale) || 'Draft saved!',
          fileUploadFailedText: messageMap['file.upload.failed.alert'] || getHardcodedTranslation('file.upload.failed.alert', newLocale) || 'File upload failed!',
          fileNotFoundText: messageMap['file.not.found.alert'] || getHardcodedTranslation('file.not.found.alert', newLocale) || 'File not found',
          downloadFailedText: messageMap['download.failed.alert'] || getHardcodedTranslation('download.failed.alert', newLocale) || 'Download failed',
          unableToOpenFileText: messageMap['unable.to.open.file.alert'] || getHardcodedTranslation('unable.to.open.file.alert', newLocale) || 'Unable to open file'
        });
      }
    } catch (error) {
      console.error('Error fetching localized texts for DocumentUpload:', error);
      console.warn('Using default texts due to API error');
    }
  };

  // Initial load and when locale changes from context
  useEffect(() => {
    fetchLocalizedTexts(locale);
  }, [locale]);

  return {
    ...texts,
    locale
  };
};
