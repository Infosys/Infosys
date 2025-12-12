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

interface VerificationTexts {
  propertyFormVerificationText: string;
  summaryInformationText: string;
  backToHomeText: string;
  addressText: string;
  phoneNoText: string;
  formCompletionText: string;
  viewLocationText: string;
  needReviewText: string;
  missingText: string;
  requiredFieldsMissingText: string;
  fieldsNeedVerificationText: string;
  missingRequiredFieldsText: string;
  fieldsNeedingVerificationText: string;
  propertyOwnerNameText: string;
  surveyNumberText: string;
  builtUpAreaText: string;
  constructionTypeText: string;
  propertyUsageText: string;
  amenitiesText: string;
  floorDetailsText: string;
  ownerInformationText: string;
  propertyDetailsText: string;
  propertyMeasurementsText: string;
  propertyClassificationText: string;
  propertyFeaturesText: string;
  propertyStructureText: string;
  fullLegalNameText: string;
  governmentSurveyNumberText: string;
  totalBuiltUpAreaText: string;
  primaryConstructionMaterialText: string;
  primaryUsageText: string;
  selectAmenitiesText: string;
  floorWiseUsageText: string;
  requiredText: string;
  needsVerificationText: string;
  commentOrAddNoteText: string;
  applicationLogText: string;
  sendEmailText: string;
  continueToFormText: string;
  noRequiredFieldsMissingText: string;
  noFieldsNeedVerificationText: string;
  // Location view specific texts
  propertyLocationTitleText: string;
  viewPropertyLocationText: string;
  backToVerificationText: string;
  addressSimpleText: string;
}

const kannadaFallback: Record<string, string> = {
  'property.form.verification.title': 'ಆಸ್ತಿ ಫಾರ್ಮ್ ಪರಿಶೀಲನೆ',
  'summary.information.label': 'ಸಾರಾಂಶ ಮಾಹಿತಿ',
  'back.to.home.btn': 'ಮನೆಗೆ ಹಿಂತಿರುಗಿ',
  'address.label': 'ವಿಳಾಸ',
  'phone.no.label': 'ಫೋನ್ ಸಂಖ್ಯೆ',
  'form.completion.label': 'ಫಾರ್ಮ್ ಪೂರ್ಣಗೊಳಿಸುವಿಕೆ',
  'view.location.btn': 'ಸ್ಥಳ ವೀಕ್ಷಿಸಿ',
  'need.review.label': 'ಪರಿಶೀಲನೆ ಅಗತ್ಯ',
  'missing.label': 'ಕಾಣೆಯಾಗಿದೆ',
  'required.fields.missing.msg': 'ಅಗತ್ಯ ಕ್ಷೇತ್ರಗಳು ಕಾಣೆಯಾಗಿವೆ. ಮುಂದುವರಿಯಲು ಇವುಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ.',
  'fields.need.verification.msg': 'ಕ್ಷೇತ್ರಗಳಿಗೆ ಪರಿಶೀಲನೆ ಅಗತ್ಯವಿದೆ. ದಯವಿಟ್ಟು ಆಯ್ಕೆಗಳನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ಪರಿಶೀಲಿಸಿ.',
  'missing.required.fields.title': 'ಕಾಣೆಯಾಗಿರುವ ಅಗತ್ಯ ಕ್ಷೇತ್ರಗಳು',
  'fields.needing.verification.title': 'ಪರಿಶೀಲನೆ ಅಗತ್ಯವಿರುವ ಕ್ಷೇತ್ರಗಳು',
  'property.owner.name.label': 'ಆಸ್ತಿ ಮಾಲೀಕರ ಹೆಸರು',
  'survey.number.label': 'ಸರ್ವೇ ಸಂಖ್ಯೆ',
  'built.up.area.label': 'ನಿರ್ಮಿತ ಪ್ರದೇಶ',
  'construction.type.label': 'ನಿರ್ಮಾಣ ಪ್ರಕಾರ',
  'property.usage.label': 'ಆಸ್ತಿ ಬಳಕೆ',
  'amenities.label': 'ಸೌಕರ್ಯಗಳು',
  'floor.details.label': 'ಮಹಡಿ ವಿವರಗಳು',
  'owner.information.section': 'ಮಾಲೀಕರ ಮಾಹಿತಿ',
  'property.details.section': 'ಆಸ್ತಿ ವಿವರಗಳು',
  'property.measurements.section': 'ಆಸ್ತಿ ಅಳತೆಗಳು',
  'property.classification.section': 'ಆಸ್ತಿ ವರ್ಗೀಕರಣ',
  'property.features.section': 'ಆಸ್ತಿ ವೈಶಿಷ್ಟ್ಯಗಳು',
  'property.structure.section': 'ಆಸ್ತಿ ರಚನೆ',
  'full.legal.name.desc': 'ದಾಖಲೆಗಳ ಪ್ರಕಾರ ಪೂರ್ಣ ಕಾನೂನು ಹೆಸರು',
  'government.survey.number.desc': 'ಆಸ್ತಿಗಾಗಿ ಸರ್ಕಾರದ ಸರ್ವೇ ಸಂಖ್ಯೆ',
  'total.built.up.area.desc': 'ಚದರ ಅಡಿಗಳಲ್ಲಿ ಒಟ್ಟು ನಿರ್ಮಿತ ಪ್ರದೇಶ',
  'primary.construction.material.desc': 'ಪ್ರಾಥಮಿಕ ನಿರ್ಮಾಣ ವಸ್ತುವನ್ನು ನಿರ್ದಿಷ್ಟಪಡಿಸಿ.',
  'primary.usage.desc': 'ಆಸ್ತಿಯ ಪ್ರಾಥಮಿಕ ಬಳಕೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
  'select.amenities.desc': 'ಎಲ್ಲಾ ಅನ್ವಯವಾಗುವ ಸೌಕರ್ಯಗಳು ಮತ್ತು ಸೌಲಭ್ಯಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ',
  'floor.wise.usage.desc': 'ಮಹಡಿ ವಾರು ಬಳಕೆ ಮತ್ತು ಪ್ರದೇಶದ ವಿವರಗಳನ್ನು ನಿರ್ದಿಷ್ಟಪಡಿಸಿ',
  'required.badge': 'ಅಗತ್ಯ',
  'needs.verification.badge': 'ಪರಿಶೀಲನೆ ಅಗತ್ಯ',
  'comment.add.note.title': 'ಕಾಮೆಂಟ್ ಅಥವಾ ಟಿಪ್ಪಣಿ ಸೇರಿಸಿ',
  'application.log.btn': 'ಅಪ್ಲಿಕೇಶನ್ ಲಾಗ್',
  'send.email.btn': 'ಇಮೇಲ್ ಕಳುಹಿಸಿ',
  'continue.to.form.btn': 'ಫಾರ್ಮ್‌ಗೆ ಮುಂದುವರಿಯಿರಿ',
  'no.required.fields.missing.msg': 'ಯಾವುದೇ ಅಗತ್ಯ ಕ್ಷೇತ್ರಗಳು ಕಾಣೆಯಾಗಿಲ್ಲ.',
  'no.fields.need.verification.msg': 'ಯಾವುದೇ ಕ್ಷೇತ್ರಗಳಿಗೆ ಪರಿಶೀಲನೆ ಅಗತ್ಯವಿಲ್ಲ.',
  // Location view specific
  'property.location.title': 'ಆಸ್ತಿ ಸ್ಥಳ',
  'view.property.location': 'ಆಸ್ತಿ ಸ್ಥಳ ವೀಕ್ಷಿಸಿ',
  'back.to.verification': 'ಪರಿಶೀಲನೆಗೆ ಹಿಂತಿರುಗಿ',
  'address.simple': 'ವಿಳಾಸ'
};

const hindiFallback: Record<string, string> = {
  'property.form.verification.title': 'संपत्ति फॉर्म सत्यापन',
  'summary.information.label': 'सारांश जानकारी',
  'back.to.home.btn': 'होम पर वापस जाएं',
  'address.label': 'पता',
  'phone.no.label': 'फोन नंबर',
  'form.completion.label': 'फॉर्म पूर्णता',
  'view.location.btn': 'स्थान देखें',
  'need.review.label': 'समीक्षा आवश्यक',
  'missing.label': 'गुम',
  'required.fields.missing.msg': 'आवश्यक फ़ील्ड गुम हैं। आगे बढ़ने के लिए इन्हें पूरा करें।',
  'fields.need.verification.msg': 'फ़ील्ड को सत्यापन की आवश्यकता है। कृपया विकल्पों की सावधानीपूर्वक समीक्षा करें।',
  'missing.required.fields.title': 'आवश्यक फ़ील्ड गुम हैं',
  'fields.needing.verification.title': 'सत्यापन की आवश्यकता वाले फ़ील्ड',
  'property.owner.name.label': 'संपत्ति मालिक का नाम',
  'survey.number.label': 'सर्वेक्षण संख्या',
  'built.up.area.label': 'निर्मित क्षेत्र',
  'construction.type.label': 'निर्माण प्रकार',
  'property.usage.label': 'संपत्ति उपयोग',
  'amenities.label': 'सुविधाएं',
  'floor.details.label': 'मंजिल विवरण',
  'owner.information.section': 'मालिक की जानकारी',
  'property.details.section': 'संपत्ति विवरण',
  'property.measurements.section': 'संपत्ति माप',
  'property.classification.section': 'संपत्ति वर्गीकरण',
  'property.features.section': 'संपत्ति विशेषताएं',
  'property.structure.section': 'संपत्ति संरचना',
  'full.legal.name.desc': 'दस्तावेजों के अनुसार पूर्ण कानूनी नाम',
  'government.survey.number.desc': 'संपत्ति के लिए सरकारी सर्वेक्षण संख्या',
  'total.built.up.area.desc': 'वर्ग फुट में कुल निर्मित क्षेत्र',
  'primary.construction.material.desc': 'प्राथमिक निर्माण सामग्री निर्दिष्ट करें।',
  'primary.usage.desc': 'संपत्ति का प्राथमिक उपयोग चुनें',
  'select.amenities.desc': 'सभी लागू सुविधाओं और सुविधाओं का चयन करें',
  'floor.wise.usage.desc': 'मंजिल-वार उपयोग और क्षेत्र विवरण निर्दिष्ट करें',
  'required.badge': 'आवश्यक',
  'needs.verification.badge': 'सत्यापन आवश्यक',
  'comment.add.note.title': 'टिप्पणी करें या नोट जोड़ें',
  'application.log.btn': 'आवेदन लॉग',
  'send.email.btn': 'ईमेल भेजें',
  'continue.to.form.btn': 'फॉर्म पर जारी रखें',
  'no.required.fields.missing.msg': 'कोई आवश्यक फ़ील्ड गुम नहीं हैं।',
  'no.fields.need.verification.msg': 'किसी फ़ील्ड को सत्यापन की आवश्यकता नहीं है।',
  // Location view specific
  'property.location.title': 'संपत्ति स्थान',
  'view.property.location': 'संपत्ति स्थान देखें',
  'back.to.verification': 'सत्यापन पर वापस जाएं',
  'address.simple': 'पता'
};

export const usePropertyFormVerificationLocalization = () => {
  const { locale, setLocale: setGlobalLocale } = useLanguage();
  const [texts, setTexts] = useState<VerificationTexts>({
    propertyFormVerificationText: 'Property Form Verification',
    summaryInformationText: 'Summary Information',
    backToHomeText: 'Back to Home',
    addressText: 'Address',
    phoneNoText: 'Phone no',
    formCompletionText: 'Form Completion',
    viewLocationText: 'View Location',
    needReviewText: 'Need Review',
    missingText: 'Missing',
    requiredFieldsMissingText: 'required fields are missing. Complete these to proceed.',
    fieldsNeedVerificationText: 'fields need verification. Please review the options carefully.',
    missingRequiredFieldsText: 'Missing Required Fields',
    fieldsNeedingVerificationText: 'Fields Needing Verification',
    propertyOwnerNameText: 'Property Owner Name',
    surveyNumberText: 'Survey Number',
    builtUpAreaText: 'Built-up Area',
    constructionTypeText: 'Construction Type',
    propertyUsageText: 'Property Usage',
    amenitiesText: 'Amenities',
    floorDetailsText: 'Floor Details',
    ownerInformationText: 'Owner Information',
    propertyDetailsText: 'Property Details',
    propertyMeasurementsText: 'Property Measurements',
    propertyClassificationText: 'Property Classification',
    propertyFeaturesText: 'Property Features',
    propertyStructureText: 'Property Structure',
    fullLegalNameText: 'Full legal name as per documents',
    governmentSurveyNumberText: 'Government survey number for the property',
    totalBuiltUpAreaText: 'Total built-up area in square feet',
    primaryConstructionMaterialText: 'Specify the primary construction material.',
    primaryUsageText: 'Select the primary usage of the property',
    selectAmenitiesText: 'Select all applicable amenities and facilities',
    floorWiseUsageText: 'Specify floor wise usage and area details',
    requiredText: 'Required',
    needsVerificationText: 'Needs Verification',
    commentOrAddNoteText: 'Comment or Add Note',
    applicationLogText: 'Application Log',
    sendEmailText: 'Send Email',
    continueToFormText: 'Continue to Form',
    noRequiredFieldsMissingText: 'No required fields missing.',
    noFieldsNeedVerificationText: 'No fields need verification.',
    // Location view specific texts
    propertyLocationTitleText: 'Property Location',
    viewPropertyLocationText: 'View Property Location',
    backToVerificationText: 'Back to Verification',
    addressSimpleText: 'Address'
  });

  const messageCodes = [
    'property.form.verification.title',
    'summary.information.label',
    'back.to.home.btn',
    'address.label',
    'phone.no.label',
    'form.completion.label',
    'view.location.btn',
    'need.review.label',
    'missing.label',
    'required.fields.missing.msg',
    'fields.need.verification.msg',
    'missing.required.fields.title',
    'fields.needing.verification.title',
    'property.owner.name.label',
    'survey.number.label',
    'built.up.area.label',
    'construction.type.label',
    'property.usage.label',
    'amenities.label',
    'floor.details.label',
    'owner.information.section',
    'property.details.section',
    'property.measurements.section',
    'property.classification.section',
    'property.features.section',
    'property.structure.section',
    'full.legal.name.desc',
    'government.survey.number.desc',
    'total.built.up.area.desc',
    'primary.construction.material.desc',
    'primary.usage.desc',
    'select.amenities.desc',
    'floor.wise.usage.desc',
    'required.badge',
    'needs.verification.badge',
    'comment.add.note.title',
    'application.log.btn',
    'send.email.btn',
    'continue.to.form.btn',
    'no.required.fields.missing.msg',
    'no.fields.need.verification.msg',
    // Location view specific codes
    'property.location.title',
    'view.property.location',
    'back.to.verification',
    'address.simple'
  ];

  const keys = messageCodes;

  const fetchLocalizedTexts = async (newLocale: string) => {
    try {
      const fallback = newLocale === 'kn' ? kannadaFallback : newLocale === 'hi' ? hindiFallback : {};
      
      const codesParam = messageCodes.join(',');
      const url = `${import.meta.env.VITE_LOCALIZATION_HOST}/localization/v1/messages?module=property-verification&locale=${newLocale}&codes=${codesParam}`;

      const response = await fetch(url, {
        headers: {
          'X-Tenant-ID': 'pg',
          'Content-Type': 'application/json'
        }
      });

      let messageMap: Record<string, string> = { ...fallback };

      if (response.ok) {
        const data: LocalizationResponse = await response.json();
        data.messages.forEach(msg => {
          messageMap[msg.code] = msg.message;
        });
      }

      setTexts({
        propertyFormVerificationText: messageMap['property.form.verification.title'] || 'Property Form Verification',
        summaryInformationText: messageMap['summary.information.label'] || 'Summary Information',
        backToHomeText: messageMap['back.to.home.btn'] || 'Back to Home',
        addressText: messageMap['address.label'] || 'Address',
        phoneNoText: messageMap['phone.no.label'] || 'Phone no',
        formCompletionText: messageMap['form.completion.label'] || 'Form Completion',
        viewLocationText: messageMap['view.location.btn'] || 'View Location',
        needReviewText: messageMap['need.review.label'] || 'Need Review',
        missingText: messageMap['missing.label'] || 'Missing',
        requiredFieldsMissingText: messageMap['required.fields.missing.msg'] || 'required fields are missing. Complete these to proceed.',
        fieldsNeedVerificationText: messageMap['fields.need.verification.msg'] || 'fields need verification. Please review the options carefully.',
        missingRequiredFieldsText: messageMap['missing.required.fields.title'] || 'Missing Required Fields',
        fieldsNeedingVerificationText: messageMap['fields.needing.verification.title'] || 'Fields Needing Verification',
        propertyOwnerNameText: messageMap['property.owner.name.label'] || 'Property Owner Name',
        surveyNumberText: messageMap['survey.number.label'] || 'Survey Number',
        builtUpAreaText: messageMap['built.up.area.label'] || 'Built-up Area',
        constructionTypeText: messageMap['construction.type.label'] || 'Construction Type',
        propertyUsageText: messageMap['property.usage.label'] || 'Property Usage',
        amenitiesText: messageMap['amenities.label'] || 'Amenities',
        floorDetailsText: messageMap['floor.details.label'] || 'Floor Details',
        ownerInformationText: messageMap['owner.information.section'] || 'Owner Information',
        propertyDetailsText: messageMap['property.details.section'] || 'Property Details',
        propertyMeasurementsText: messageMap['property.measurements.section'] || 'Property Measurements',
        propertyClassificationText: messageMap['property.classification.section'] || 'Property Classification',
        propertyFeaturesText: messageMap['property.features.section'] || 'Property Features',
        propertyStructureText: messageMap['property.structure.section'] || 'Property Structure',
        fullLegalNameText: messageMap['full.legal.name.desc'] || 'Full legal name as per documents',
        governmentSurveyNumberText: messageMap['government.survey.number.desc'] || 'Government survey number for the property',
        totalBuiltUpAreaText: messageMap['total.built.up.area.desc'] || 'Total built-up area in square feet',
        primaryConstructionMaterialText: messageMap['primary.construction.material.desc'] || 'Specify the primary construction material.',
        primaryUsageText: messageMap['primary.usage.desc'] || 'Select the primary usage of the property',
        selectAmenitiesText: messageMap['select.amenities.desc'] || 'Select all applicable amenities and facilities',
        floorWiseUsageText: messageMap['floor.wise.usage.desc'] || 'Specify floor wise usage and area details',
        requiredText: messageMap['required.badge'] || 'Required',
        needsVerificationText: messageMap['needs.verification.badge'] || 'Needs Verification',
        commentOrAddNoteText: messageMap['comment.add.note.title'] || 'Comment or Add Note',
        applicationLogText: messageMap['application.log.btn'] || 'Application Log',
        sendEmailText: messageMap['send.email.btn'] || 'Send Email',
        continueToFormText: messageMap['continue.to.form.btn'] || 'Continue to Form',
        noRequiredFieldsMissingText: messageMap['no.required.fields.missing.msg'] || 'No required fields missing.',
        noFieldsNeedVerificationText: messageMap['no.fields.need.verification.msg'] || 'No fields need verification.',
        propertyLocationTitleText: messageMap['property.location.title'] || 'Property Location',
        viewPropertyLocationText: messageMap['view.property.location'] || 'View Property Location',
        backToVerificationText: messageMap['back.to.verification'] || 'Back to Verification',
        addressSimpleText: messageMap['address.simple'] || 'Address'
      });
    } catch (error) {
      console.error('Error fetching verification localized texts:', error);
    }
  };

  const t = (key: string): string => {
    const fieldMap: Record<string, keyof VerificationTexts> = {
      'property.form.verification.title': 'propertyFormVerificationText',
      'summary.information.label': 'summaryInformationText',
      'back.to.home.btn': 'backToHomeText',
      'address.label': 'addressText',
      'phone.no.label': 'phoneNoText',
      'form.completion.label': 'formCompletionText',
      'view.location.btn': 'viewLocationText',
      'need.review.label': 'needReviewText',
      'missing.label': 'missingText',
      'required.fields.missing.msg': 'requiredFieldsMissingText',
      'fields.need.verification.msg': 'fieldsNeedVerificationText',
      'missing.required.fields.title': 'missingRequiredFieldsText',
      'fields.needing.verification.title': 'fieldsNeedingVerificationText',
      'property.owner.name.label': 'propertyOwnerNameText',
      'survey.number.label': 'surveyNumberText',
      'built.up.area.label': 'builtUpAreaText',
      'construction.type.label': 'constructionTypeText',
      'property.usage.label': 'propertyUsageText',
      'amenities.label': 'amenitiesText',
      'floor.details.label': 'floorDetailsText',
      'owner.information.section': 'ownerInformationText',
      'property.details.section': 'propertyDetailsText',
      'property.measurements.section': 'propertyMeasurementsText',
      'property.classification.section': 'propertyClassificationText',
      'property.features.section': 'propertyFeaturesText',
      'property.structure.section': 'propertyStructureText',
      'full.legal.name.desc': 'fullLegalNameText',
      'government.survey.number.desc': 'governmentSurveyNumberText',
      'total.built.up.area.desc': 'totalBuiltUpAreaText',
      'primary.construction.material.desc': 'primaryConstructionMaterialText',
      'primary.usage.desc': 'primaryUsageText',
      'select.amenities.desc': 'selectAmenitiesText',
      'floor.wise.usage.desc': 'floorWiseUsageText',
      'required.badge': 'requiredText',
      'needs.verification.badge': 'needsVerificationText',
      'comment.add.note.title': 'commentOrAddNoteText',
      'application.log.btn': 'applicationLogText',
      'send.email.btn': 'sendEmailText',
      'continue.to.form.btn': 'continueToFormText',
      'no.required.fields.missing.msg': 'noRequiredFieldsMissingText',
      'no.fields.need.verification.msg': 'noFieldsNeedVerificationText'
    };
    const field = fieldMap[key];
    return field ? texts[field] : key;
  };

  const toggleLanguage = () => {
    const newLocale = locale === 'en' ? 'kn' : locale === 'kn' ? 'hi' : 'en';
    setGlobalLocale(newLocale);
  };

  const setLanguage = (newLocale: string) => {
    setGlobalLocale(newLocale);
  };

  useEffect(() => {
    fetchLocalizedTexts(locale);
  }, [locale]);

  return {
    ...texts,
    t,
    keys,
    toggleLanguage,
    setLanguage,
    locale
  };
};
