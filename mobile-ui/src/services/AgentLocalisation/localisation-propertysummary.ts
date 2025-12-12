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

interface PropertySummaryLocalizedTexts {
  // Page headers
  summaryText: string;
  propertyInfoVerificationText: string;
  
  // Section titles
  propertyDetailsText: string;
  igrsDetailsText: string;
  ownerInformationText: string;
  assessmentDetailsText: string;
  documentsUploadedText: string;
  
  // Property Details labels
  propertyTypeText: string;
  zoneWardText: string;
  doorNoText: string;
  plotAreaText: string;
  locationAddressText: string;
  coordinatesText: string;
  
  // IGRS Details labels
  surveyNumberText: string;
  subDivisionText: string;
  gisReferenceText: string;
  cadastralMapText: string;
  igrsRegistrationText: string;
  
  // Owner Information labels
  ownerNameText: string;
  mobileNumberText: string;
  emailText: string;
  addressText: string;
  
  // Assessment Details labels
  buildingUsageText: string;
  constructionYearText: string;
  floorCountText: string;
  builtupAreaText: string;
  annualRentalValueText: string;
  propertyTaxZoneText: string;
  assessmentStatusText: string;
  notesText: string;
  
  // Button text
  verifyAndSubmitText: string;
  confirmAndSubmitText: string;
  verifyingText: string;
  
  // Units
  sqftText: string;
  floorsText: string;
}

export const usePropertySummaryLocalization = () => {
  const { locale } = useLanguage();
  const [texts, setTexts] = useState<PropertySummaryLocalizedTexts>({
    // Page headers
    summaryText: 'Summary',
    propertyInfoVerificationText: 'Property Information Verification',
    
    // Section titles
    propertyDetailsText: 'Property Details',
    igrsDetailsText: 'IGRS and Building setback details',
    ownerInformationText: 'Owner Information',
    assessmentDetailsText: 'Assessment Details',
    documentsUploadedText: 'Documents Uploaded :',
    
    // Property Details labels
    propertyTypeText: 'Property Type :',
    zoneWardText: 'Zone/Ward :',
    doorNoText: 'Door No. :',
    plotAreaText: 'Plot Area :',
    locationAddressText: 'Location Address :',
    coordinatesText: 'Coordinates :',
    
    // IGRS Details labels
    surveyNumberText: 'Survey Number:',
    subDivisionText: 'Sub-Division:',
    gisReferenceText: 'GIS Reference:',
    cadastralMapText: 'Cadastral Map:',
    igrsRegistrationText: 'IGRS Registration:',
    
    // Owner Information labels
    ownerNameText: 'Owner Name:',
    mobileNumberText: 'Mobile Number:',
    emailText: 'Email:',
    addressText: 'Address:',
    
    // Assessment Details labels
    buildingUsageText: 'Building Usage:',
    constructionYearText: 'Construction Year:',
    floorCountText: 'Floor Count:',
    builtupAreaText: 'Built-up Area:',
    annualRentalValueText: 'Annual Rental Value:',
    propertyTaxZoneText: 'Property Tax Zone:',
    assessmentStatusText: 'Assessment Status:',
    notesText: 'Notes :',
    
    // Button text
    verifyAndSubmitText: 'Submit',
    confirmAndSubmitText: 'Submit',
    verifyingText: 'Verifying...',
    
    // Units
    sqftText: 'sq.ft',
    floorsText: 'Floors'
  });

  // Hardcoded fallback translations
  const getHardcodedTranslation = (code: string, locale: string): string => {
    const translations: Record<string, Record<string, string>> = {
      'hi': {
        'summary.title': 'सारांश',
        'property.info.verification': 'संपत्ति सूचना सत्यापन',
        'property.details.section': 'संपत्ति विवरण',
        'igrs.details.section': 'IGRS विवरण',
        'owner.information.section': 'मालिक की जानकारी',
        'assessment.details.section': 'मूल्यांकन विवरण',
        'documents.uploaded.section': 'दस्तावेज़ अपलोड किए गए :',
        'property.type.label': 'संपत्ति का प्रकार :',
        'zone.ward.label': 'क्षेत्र/वार्ड :',
        'door.no.label': 'दरवाज़ा नंबर :',
        'plot.area.label': 'प्लॉट क्षेत्र :',
        'location.address.label': 'स्थान का पता :',
        'coordinates.label': 'निर्देशांक :',
        'survey.number.label': 'सर्वेक्षण संख्या:',
        'sub.division.label': 'उप-विभाग:',
        'gis.reference.label': 'GIS संदर्भ:',
        'cadastral.map.label': 'कैडस्ट्रल मानचित्र:',
        'igrs.registration.label': 'IGRS पंजीकरण:',
        'owner.name.label': 'मालिक का नाम:',
        'mobile.number.label': 'मोबाइल नंबर:',
        'email.label': 'ईमेल:',
        'address.label': 'पता:',
        'building.usage.label': 'भवन उपयोग:',
        'construction.year.label': 'निर्माण वर्ष:',
        'floor.count.label': 'मंजिल संख्या:',
        'builtup.area.label': 'निर्मित क्षेत्र:',
        'annual.rental.value.label': 'वार्षिक किराया मूल्य:',
        'property.tax.zone.label': 'संपत्ति कर क्षेत्र:',
        'assessment.status.label': 'मूल्यांकन स्थिति:',
        'notes.label': 'नोट्स :',
        'verify.and.submit.btn': 'सत्यापित करें और जमा करें',
        'confirm.and.submit.btn': 'पुष्टि करें और जमा करें',
        'verifying.label': 'सत्यापित कर रहे हैं...',
        'sqft.unit': 'वर्ग फुट',
        'floors.unit': 'मंजिलें'
      },
      'kn': {
        'summary.title': 'ಸಾರಾಂಶ',
        'property.info.verification': 'ಆಸ್ತಿ ಮಾಹಿತಿ ಪರಿಶೀಲನೆ',
        'property.details.section': 'ಆಸ್ತಿ ವಿವರಗಳು',
        'igrs.details.section': 'IGRS ವಿವರಗಳು',
        'owner.information.section': 'ಮಾಲೀಕರ ಮಾಹಿತಿ',
        'assessment.details.section': 'ಮೌಲ್ಯಮಾಪನ ವಿವರಗಳು',
        'documents.uploaded.section': 'ದಾಖಲೆಗಳನ್ನು ಅಪ್ಲೋಡ್ ಮಾಡಲಾಗಿದೆ :',
        'property.type.label': 'ಆಸ್ತಿಯ ಪ್ರಕಾರ :',
        'zone.ward.label': 'ವಲಯ/ವಾರ್ಡ್ :',
        'door.no.label': 'ಬಾಗಿಲು ಸಂಖ್ಯೆ :',
        'plot.area.label': 'ಪ್ಲಾಟ್ ವಿಸ್ತೀರ್ಣ :',
        'location.address.label': 'ಸ್ಥಳದ ವಿಳಾಸ :',
        'coordinates.label': 'ನಿರ್ದೇಶಾಂಕಗಳು :',
        'survey.number.label': 'ಸಮೀಕ್ಷೆ ಸಂಖ್ಯೆ:',
        'sub.division.label': 'ಉಪ-ವಿಭಾಗ:',
        'gis.reference.label': 'GIS ಉಲ್ಲೇಖ:',
        'cadastral.map.label': 'ಕ್ಯಾಡಾಸ್ಟ್ರಲ್ ನಕ್ಷೆ:',
        'igrs.registration.label': 'IGRS ನೋಂದಣಿ:',
        'owner.name.label': 'ಮಾಲೀಕರ ಹೆಸರು:',
        'mobile.number.label': 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ:',
        'email.label': 'ಇಮೇಲ್:',
        'address.label': 'ವಿಳಾಸ:',
        'building.usage.label': 'ಕಟ್ಟಡ ಬಳಕೆ:',
        'construction.year.label': 'ನಿರ್ಮಾಣ ವರ್ಷ:',
        'floor.count.label': 'ಮಹಡಿ ಸಂಖ್ಯೆ:',
        'builtup.area.label': 'ನಿರ್ಮಿತ ವಿಸ್ತೀರ್ಣ:',
        'annual.rental.value.label': 'ವಾರ್ಷಿಕ ಬಾಡಿಗೆ ಮೌಲ್ಯ:',
        'property.tax.zone.label': 'ಆಸ್ತಿ ತೆರಿಗೆ ವಲಯ:',
        'assessment.status.label': 'ಮೌಲ್ಯಮಾಪನ ಸ್ಥಿತಿ:',
        'notes.label': 'ಟಿಪ್ಪಣಿಗಳು :',
        'verify.and.submit.btn': 'ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಸಲ್ಲಿಸಿ',
        'confirm.and.submit.btn': 'ದೃಢೀಕರಿಸಿ ಮತ್ತು ಸಲ್ಲಿಸಿ',
        'verifying.label': 'ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...',
        'sqft.unit': 'ಚದರ ಅಡಿ',
        'floors.unit': 'ಮಹಡಿಗಳು'
      }
    };
    
    return translations[locale]?.[code] || '';
  };

  const messageCodes = [
    'summary.title',
    'property.info.verification',
    'property.details.section',
    'igrs.details.section',
    'owner.information.section',
    'assessment.details.section',
    'documents.uploaded.section',
    'property.type.label',
    'zone.ward.label',
    'door.no.label',
    'plot.area.label',
    'location.address.label',
    'coordinates.label',
    'survey.number.label',
    'sub.division.label',
    'gis.reference.label',
    'cadastral.map.label',
    'igrs.registration.label',
    'owner.name.label',
    'mobile.number.label',
    'email.label',
    'address.label',
    'building.usage.label',
    'construction.year.label',
    'floor.count.label',
    'builtup.area.label',
    'annual.rental.value.label',
    'property.tax.zone.label',
    'assessment.status.label',
    'notes.label',
    'verify.and.submit.btn',
    'confirm.and.submit.btn',
    'verifying.label',
    'sqft.unit',
    'floors.unit'
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
          summaryText: messageMap['summary.title'] || getHardcodedTranslation('summary.title', newLocale) || 'Summary',
          propertyInfoVerificationText: messageMap['property.info.verification'] || getHardcodedTranslation('property.info.verification', newLocale) || 'Property Information Verification',
          propertyDetailsText: messageMap['property.details.section'] || getHardcodedTranslation('property.details.section', newLocale) || 'Property Details',
          igrsDetailsText: messageMap['igrs.details.section'] || getHardcodedTranslation('igrs.details.section', newLocale) || 'IGRS and Building setback details',
          ownerInformationText: messageMap['owner.information.section'] || getHardcodedTranslation('owner.information.section', newLocale) || 'Owner Information',
          assessmentDetailsText: messageMap['assessment.details.section'] || getHardcodedTranslation('assessment.details.section', newLocale) || 'Assessment Details',
          documentsUploadedText: messageMap['documents.uploaded.section'] || getHardcodedTranslation('documents.uploaded.section', newLocale) || 'Documents Uploaded :',
          propertyTypeText: messageMap['property.type.label'] || getHardcodedTranslation('property.type.label', newLocale) || 'Property Type :',
          zoneWardText: messageMap['zone.ward.label'] || getHardcodedTranslation('zone.ward.label', newLocale) || 'Zone/Ward :',
          doorNoText: messageMap['door.no.label'] || getHardcodedTranslation('door.no.label', newLocale) || 'Door No. :',
          plotAreaText: messageMap['plot.area.label'] || getHardcodedTranslation('plot.area.label', newLocale) || 'Plot Area :',
          locationAddressText: messageMap['location.address.label'] || getHardcodedTranslation('location.address.label', newLocale) || 'Location Address :',
          coordinatesText: messageMap['coordinates.label'] || getHardcodedTranslation('coordinates.label', newLocale) || 'Coordinates :',
          surveyNumberText: messageMap['survey.number.label'] || getHardcodedTranslation('survey.number.label', newLocale) || 'Survey Number:',
          subDivisionText: messageMap['sub.division.label'] || getHardcodedTranslation('sub.division.label', newLocale) || 'Sub-Division:',
          gisReferenceText: messageMap['gis.reference.label'] || getHardcodedTranslation('gis.reference.label', newLocale) || 'GIS Reference:',
          cadastralMapText: messageMap['cadastral.map.label'] || getHardcodedTranslation('cadastral.map.label', newLocale) || 'Cadastral Map:',
          igrsRegistrationText: messageMap['igrs.registration.label'] || getHardcodedTranslation('igrs.registration.label', newLocale) || 'IGRS Registration:',
          ownerNameText: messageMap['owner.name.label'] || getHardcodedTranslation('owner.name.label', newLocale) || 'Owner Name:',
          mobileNumberText: messageMap['mobile.number.label'] || getHardcodedTranslation('mobile.number.label', newLocale) || 'Mobile Number:',
          emailText: messageMap['email.label'] || getHardcodedTranslation('email.label', newLocale) || 'Email:',
          addressText: messageMap['address.label'] || getHardcodedTranslation('address.label', newLocale) || 'Address:',
          buildingUsageText: messageMap['building.usage.label'] || getHardcodedTranslation('building.usage.label', newLocale) || 'Building Usage:',
          constructionYearText: messageMap['construction.year.label'] || getHardcodedTranslation('construction.year.label', newLocale) || 'Construction Year:',
          floorCountText: messageMap['floor.count.label'] || getHardcodedTranslation('floor.count.label', newLocale) || 'Floor Count:',
          builtupAreaText: messageMap['builtup.area.label'] || getHardcodedTranslation('builtup.area.label', newLocale) || 'Built-up Area:',
          annualRentalValueText: messageMap['annual.rental.value.label'] || getHardcodedTranslation('annual.rental.value.label', newLocale) || 'Annual Rental Value:',
          propertyTaxZoneText: messageMap['property.tax.zone.label'] || getHardcodedTranslation('property.tax.zone.label', newLocale) || 'Property Tax Zone:',
          assessmentStatusText: messageMap['assessment.status.label'] || getHardcodedTranslation('assessment.status.label', newLocale) || 'Assessment Status:',
          notesText: messageMap['notes.label'] || getHardcodedTranslation('notes.label', newLocale) || 'Notes :',
          verifyAndSubmitText: messageMap['verify.and.submit.btn'] || getHardcodedTranslation('verify.and.submit.btn', newLocale) || 'Submit',
          confirmAndSubmitText: messageMap['confirm.and.submit.btn'] || getHardcodedTranslation('confirm.and.submit.btn', newLocale) || 'Submit',
          verifyingText: messageMap['verifying.label'] || getHardcodedTranslation('verifying.label', newLocale) || 'Verifying...',
          sqftText: messageMap['sqft.unit'] || getHardcodedTranslation('sqft.unit', newLocale) || 'sq.ft',
          floorsText: messageMap['floors.unit'] || getHardcodedTranslation('floors.unit', newLocale) || 'Floors'
        });
      }
    } catch (error) {
      console.error('Error fetching localized texts for PropertySummary:', error);
      console.warn('Using default texts due to API error');
    }
  };

  useEffect(() => {
    const savedLocale = localStorage.getItem('appLocale') || 'en';
    fetchLocalizedTexts(savedLocale);
  }, [locale]);

  return {
    ...texts,
    locale
  };
};
