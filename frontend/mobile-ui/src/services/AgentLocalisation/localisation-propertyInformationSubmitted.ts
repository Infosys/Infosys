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

interface PropertyInformationSubmittedLocalizedTexts {
  propertyInformationSubmittedText: string;
  propertyDetailsText: string;
  propertyTypeText: string;
  zoneWardText: string;
  doorNoText: string;
  plotAreaText: string;
  igsrDetailsText: string;
  surveyNumberText: string;
  subDivisionText: string;
  gisReferenceText: string;
  cadastralMapText: string;
  igrsRegistrationText: string;
  ownerInformationText: string;
  ownerNameText: string;
  mobileNumberText: string;
  emailText: string;
  addressText: string;
  assessmentDetailsText: string;
  buildingUsageText: string;
  constructionYearText: string;
  floorCountText: string;
  builtupAreaText: string;
  annualRentalValueText: string;
  propertyTaxZoneText: string;
  assessmentStatusText: string;
  notesText: string;
  documentsUploadedText: string;
  backText: string;
  googleMapsText: string;
  appleMapsText: string;
  openStreetMapsText: string;
  previousText: string;
}


export const usePropertyInformationSubmittedLocalization = () => {
  const { locale } = useLanguage();
  const [texts, setTexts] = useState<PropertyInformationSubmittedLocalizedTexts>({
    propertyInformationSubmittedText: 'Property Information Submitted',
    propertyDetailsText: 'Property Details',
    propertyTypeText: 'Property Type',
    zoneWardText: 'Zone/Ward',
    doorNoText: 'Door No.',
    plotAreaText: 'Plot Area',
    igsrDetailsText: 'IGSR Details',
    surveyNumberText: 'Survey Number',
    subDivisionText: 'Sub-Division',
    gisReferenceText: 'GIS Reference',
    cadastralMapText: 'Cadastral Map',
    igrsRegistrationText: 'IGRS Registration',
    ownerInformationText: 'Owner Information',
    ownerNameText: 'Owner Name',
    mobileNumberText: 'Mobile Number',
    emailText: 'Email',
    addressText: 'Address',
    assessmentDetailsText: 'Assessment Details',
    buildingUsageText: 'Building Usage',
    constructionYearText: 'Construction Year',
    floorCountText: 'Floor Count',
    builtupAreaText: 'Built-up Area',
    annualRentalValueText: 'Annual Rental Value',
    propertyTaxZoneText: 'Property Tax Zone',
    assessmentStatusText: 'Assessment Status',
    notesText: 'Notes',
    documentsUploadedText: 'Documents Uploaded',
    backText: 'Back',
    googleMapsText: 'Google Maps',
    appleMapsText: 'Apple maps',
    openStreetMapsText: 'Open Street Maps',
    previousText: 'Previous',
  });

  // List of all codes to fetch
  const messageCodes = [
    'property.information.submitted',
    'property.details',
    'property.type',
    'zone.ward',
    'door.no',
    'plot.area',
    'igsr.details',
    'survey.number',
    'sub.division',
    'gis.reference',
    'cadastral.map',
    'igrs.registration',
    'owner.information',
    'owner.name',
    'mobile.number',
    'email',
    'address',
    'assessment.details',
    'building.usage',
    'construction.year',
    'floor.count',
    'builtup.area',
    'annual.rental.value',
    'property.tax.zone',
    'assessment.status',
    'notes',
    'documents.uploaded',
    'back.button',
    'google.maps',
    'apple.maps',
    'open.street.maps',
    'previous.button',
  ];

  const fetchLocalizedTexts = async (currentLocale: string) => {
    try {
      const codesParam = messageCodes.join(',');
      const url = `${env.LOCALIZATION_HOST}/localization/v1/messages?module=propertyInformationSubmitted&locale=${currentLocale}&codes=${codesParam}`;
      const response = await fetch(url, {
        headers: {
          'X-Tenant-ID': 'pg',
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data: LocalizationResponse = await response.json();
        const messages = data.messages || [];
        const messageMap: { [key: string]: string } = {};
        messages.forEach((msg) => {
          messageMap[msg.code] = msg.message;
        });
        setTexts({
          propertyInformationSubmittedText: messageMap['property.information.submitted'] || 'Property Information Submitted',
          propertyDetailsText: messageMap['property.details'] || 'Property Details',
          propertyTypeText: messageMap['property.type'] || 'Property Type',
          zoneWardText: messageMap['zone.ward'] || 'Zone/Ward',
          doorNoText: messageMap['door.no'] || 'Door No.',
          plotAreaText: messageMap['plot.area'] || 'Plot Area',
          igsrDetailsText: messageMap['igsr.details'] || 'IGSR Details',
          surveyNumberText: messageMap['survey.number'] || 'Survey Number',
          subDivisionText: messageMap['sub.division'] || 'Sub-Division',
          gisReferenceText: messageMap['gis.reference'] || 'GIS Reference',
          cadastralMapText: messageMap['cadastral.map'] || 'Cadastral Map',
          igrsRegistrationText: messageMap['igrs.registration'] || 'IGRS Registration',
          ownerInformationText: messageMap['owner.information'] || 'Owner Information',
          ownerNameText: messageMap['owner.name'] || 'Owner Name',
          mobileNumberText: messageMap['mobile.number'] || 'Mobile Number',
          emailText: messageMap['email'] || 'Email',
          addressText: messageMap['address'] || 'Address',
          assessmentDetailsText: messageMap['assessment.details'] || 'Assessment Details',
          buildingUsageText: messageMap['building.usage'] || 'Building Usage',
          constructionYearText: messageMap['construction.year'] || 'Construction Year',
          floorCountText: messageMap['floor.count'] || 'Floor Count',
          builtupAreaText: messageMap['builtup.area'] || 'Built-up Area',
          annualRentalValueText: messageMap['annual.rental.value'] || 'Annual Rental Value',
          propertyTaxZoneText: messageMap['property.tax.zone'] || 'Property Tax Zone',
          assessmentStatusText: messageMap['assessment.status'] || 'Assessment Status',
          notesText: messageMap['notes'] || 'Notes',
          documentsUploadedText: messageMap['documents.uploaded'] || 'Documents Uploaded',
          backText: messageMap['back.button'] || 'Back',
          googleMapsText: messageMap['google.maps'] || 'Google Maps',
          appleMapsText: messageMap['apple.maps'] || 'Apple maps',
          openStreetMapsText: messageMap['open.street.maps'] || 'Open Street Maps',
          previousText: messageMap['previous.button'] || 'Previous',
        });
      } else {
        console.error('[PropertyInformationSubmitted] Failed to fetch localization, status:', response.status);
      }
    } catch (error) {
      console.error('[PropertyInformationSubmitted] Error fetching localization:', error);
    }
  };

  useEffect(() => {
    fetchLocalizedTexts(locale);
  }, [locale]);

  return texts;
};
