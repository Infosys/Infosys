import { useState, useEffect, useCallback } from 'react';
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
  newPropertyForm: string;
  habitationText: string;
  IGRSAndBuildingDetailsText: string;
  IGRSwardText: string;
  IGRSLocalityText: string;
  IGRSBlockText: string;
  IGRSDoorNoFromText: string;
  IGRSDoorNoToText: string;
  liftText: string;
  toiletText: string;
  waterTapText: string;
  cableConnectionText: string;
  electricityText: string;
  attachedBathroomText: string;
  waterHarvestingText: string;
  floorTypeText: string;
  roofTypeText: string;
  wallTypeText: string;
  woodTypeText: string;
  submitButtonText: string;
  constructionDetails: string;
  selectText: string;
  saveDraftText: string;
  previousText: string;
 
  IGRSDetailsText: string;
  IGRSClassification: string;
  builtUpArea: string;
  frontSetBack: string;
  rearSetBack: string;
  sideSetBack: string;
  totalPlintArea: string;
  nextButtonText: string;
 
  // need to be added to DB
  Onlynumbersareallowedupto12digitsMSG: string;
  Aadhaarnumbermustbe12digitsMSG: string;
  OnlyalphabetsareallowedMSG: string;
  Mobilenumbermustbe10digitsMSG: string;
  Onlynumbersareallowedupto10digitsMSG: string;
  InvalidemailaddressMSG: string;
  AddGuardianMSG: string;
 
  LocalityIsRequiredMSG?: string;
  ZoneNoIsRequiredMSG?: string;
  WardNoIsRequiredMSG?: string;
  BlockNoIsRequiredMSG?: string;
  StreetIsRequiredMSG?: string;
  ElectionWardIsRequiredMSG?: string;
  SecretariatWardIsRequiredMSG?: string;
  PincodeIsRequiredMSG?: string;
  CorrespondenceAddress1IsRequiredMSG?: string;
  CorrespondencePincodeIsRequiredMSG?: string;
 
  CorrespondencePincodeMustBe6DigitsMSG?: string;
  ZoneNoShouldContainOnlyNumbersMSG?: string;
  PincodeShouldContainOnlyNumbersMSG?: string;
  PincodeShouldBeNumericMSG?: string;
  PincodeMustBe6DigitsMSG?: string;
  ZoneNoShouldBeNumericMSG?: string;
  CorrespondencePincodeShouldBeNumericMSG: string;
  CorrespondencePincodeMustBeNumericMSG: string;
  CorressPondenceAddressMSG: string;
  Address1MSG: string;
  Address2MSG: string;
  PleaseSelectAValueMSG: string;
  onlyNumbersAreAllowedMSG: string;
 
  ThisFieldIsRequiredMSG?: string;
 
  PercentagePlaceholder?: string;
  MetersPlaceholder?: string;
  SquareMetersPlaceholder?: string;
 
  NoFloorDetailsFoundMSG?: string;
 
  addFloorText?: string;
 
  onlyNumbersAllowedInText: string;
      isRequiredText: string;
      SelectFieldsThatRemainTheSameText: string;
      SerialNoText: string;
      RevenueDocumentNumberText: string;
      ImportantNoteText: string;
 
      SendEmailText : string;
      InternalCorrspondenceWithSericeManagerText: string;
      ToText: string;
      FromText: string;
      SubjectText: string;
      ComposeEmailText: string;
      DiscardText: string;
      HomeText: string;
 
      googleMapsText?: string;
      appleMapsText?: string;
      openStreetMapsText?: string;
 
 
}
 
// Dropdown label to message code mapping
const dropdownLabelToCodeMap: Record<string, string> = {
  // Habitation mappings
  'Central Park Colony': 'dropdown.habitation.central.park.colony',
  'Sunrise Apartments': 'dropdown.habitation.sunrise.apartments',
  'Hilltop Residency': 'dropdown.habitation.hilltop.residency',
  'Riverfront Homes': 'dropdown.habitation.riverfront.homes',
  'Maple Street Villas': 'dropdown.habitation.maple.street.villas',
 
  // IGRS Ward mappings
  'Ward A': 'dropdown.ward.a',
  'Ward B': 'dropdown.ward.b',
  'Ward C': 'dropdown.ward.c',
  'Ward D': 'dropdown.ward.d',
  'Ward E': 'dropdown.ward.e',
 
  // IGRS Locality mappings
  'Green Meadows': 'dropdown.locality.green.meadows',
  'Lakeview': 'dropdown.locality.lakeview',
  'Sunshine Valley': 'dropdown.locality.sunshine.valley',
  'Riverdale': 'dropdown.locality.riverdale',
  'Maple Gardens': 'dropdown.locality.maple.gardens',
 
  // IGRS Block mappings
  'Block 12': 'dropdown.block.12',
  'Block 7': 'dropdown.block.7',
  'Block 3': 'dropdown.block.3',
  'Block 9': 'dropdown.block.9',
  'Block 1': 'dropdown.block.1',
 
  // Floor Type mappings
  'Marble': 'dropdown.floortype.marble',
  'Tiles': 'dropdown.floortype.tiles',
  'Granite': 'dropdown.floortype.granite',
  'Concrete': 'dropdown.floortype.concrete',
  'Other': 'dropdown.floortype.other',
 
  // Roof Type mappings
  'Metal': 'dropdown.rooftype.metal',
  'Asbestos': 'dropdown.rooftype.asbestos',
 
  // Wall Type mappings
  'Brick': 'dropdown.walltype.brick',
  'Stone': 'dropdown.walltype.stone',
  'Wood': 'dropdown.walltype.wood',
 
  // Wood Type mappings
  'Teak': 'dropdown.woodtype.teak',
  'Sal': 'dropdown.woodtype.sal',
  'Rosewood': 'dropdown.woodtype.rosewood',
  'Mango': 'dropdown.woodtype.mango',
 
  // Door Number mappings
  '10': 'dropdown.doorNo.10',
  '101': 'dropdown.doorNo.101',
  '201': 'dropdown.doorNo.201',
  '301': 'dropdown.doorNo.301',
  '401': 'dropdown.doorNo.401',
  '15': 'dropdown.doorNo.15',
  '110': 'dropdown.doorNo.110',
  '210': 'dropdown.doorNo.210',
  '310': 'dropdown.doorNo.310',
  '410': 'dropdown.doorNo.410',
 
  // ISGR Additional Options mappings
  'Lifts': 'dropdown.option.lifts',
  'Toilet': 'dropdown.option.toilet',
  'Water Tap': 'dropdown.option.watertap',
  'Cable Connection': 'dropdown.option.cableconnection',
  'Electricity': 'dropdown.option.electricity',
  'Attached Bathroom': 'dropdown.option.attachedbathroom',
  'Water Harvesting': 'dropdown.option.waterharvesting',
 
  //Error Msgs
  'Only numbers are allowed upto 12 digits': 'validation.onlynumbersareallowedupto12digitsMSG',
  'Aadhaar number must be 12 digits': 'validation.aadhaarnumbermustbe12digitsMSG',
  'Only alphabets are allowed': 'validation.onlyalphabetsareallowedMSG',
  'Mobile number must be 10 digits': 'validation.mobilenumbermustbe10digitsMSG',
  'Only numbers are allowed upto 10 digits': 'validation.onlynumbersareallowedupto10digitsMSG',
  'Invalid email address': 'validation.invalidemailaddressMSG',
  'Add Guardian': 'validation.addguardianMSG',
 
  'Locality is required': 'validation.localityisrequiredMSG',
  'Zone No is required': 'validation.zonenoisrequiredMSG',
  'Ward No is required': 'validation.wardnoisrequiredMSG',
  'Block No is required': 'validation.blocknoisrequiredMSG',
  'Street is required': 'validation.streetisrequiredMSG',
  'Election Ward is required': 'validation.electionwardisrequiredMSG',
  'Secretariat Ward is required': 'validation.secretariatwardisrequiredMSG',
  'Pincode is required': 'validation.pincodeisrequiredMSG',
  'Correspondence Address 1 is required': 'validation.correspondenceaddress1isrequiredMSG',
  'Correspondence Pincode is required': 'validation.correspondencepincodeisrequiredMSG',
 
  'Correspondence Pincode must be 6 digits': 'validation.correspondencepincodemustbe6digitsMSG',
  'Zone No should contain only numbers': 'validation.zonenoshouldcontainonlynumbersMSG',
  'Pincode should contain only numbers': 'validation.pincodeshouldcontainonlynumbersMSG',
  'Pincode should be numeric': 'validation.pincodeshouldbenumericMSG',
  'Pincode must be 6 digits': 'validation.pincodemustbe6digitsMSG',
  'Zone No should be numeric': 'validation.zonenoshouldbenumericMSG',
  'Correspondence Pincode should be numeric': 'validation.correspondencepincodeshouldbenumericMSG',
 
  'Corresspondence Address': 'validation.correspondenceaddressMSG',
  'Address 1': 'validation.address1MSG',
  'Address 2': 'validation.address2MSG',
  'Please select a value': 'validation.pleaseselectavalueMSG',
  'Only numbers are allowed': 'validation.onlynumbersareallowedMSG',
  'This field is required': 'validation.thisfieldisrequiredMSG',
 
  'Percentage': 'placeholder.percentage',
  'Meters': 'placeholder.meters',
  'Square Meters': 'placeholder.squaremeters',
  'No floor Details found': 'validation.nofloordetailsfoundMSG',
  'addFloorText': 'button.addfloortextMSG',
 
  'onlyNumbersAllowedInText': 'validation.onlynumbersallowedintextMSG',
  'isRequiredText': 'validation.isrequiredtext',
  'SelectFieldsThatRemainTheSameText': 'validation.selectfieldsthatremainthesametextMSG',
  'serialNoText': 'validation.serialNoText',
  'revenueDocumentNumberText': 'validation.revenueDocumentNumberText',
  'importantNoteText': 'validation.importantNoteText',
 
  'sendEmailText': 'sendemail.sendemailtext',
  'internalCorrspondenceWithSericeManagerText': 'sendemail.internalcorrespondencewithservicemanagertext',
  'toText': 'sendemail.totext',
  'fromText': 'sendemail.fromtext',
  'subjectText': 'sendemail.subjecttext',
  'composeEmailText': 'sendemail.composeemailtext',
  'discardText': 'sendemail.discardtext',
  'homeText': 'sendemail.hometext',
  'googleMapsText': 'maps.googlemapstext',
  'appleMapsText': 'maps.applemapstext',
  'openStreetMapsText': 'maps.openstreetmapstext',
 
 
};
 
export const useLocalization = () => {
  const { locale, setLocale: setGlobalLocale } = useLanguage();
  const [dropdownTranslations, setDropdownTranslations] = useState<Record<string, string>>({});
  const [texts, setTexts] = useState<LocalizedTexts>({
    newPropertyForm: "New Property Form",
    habitationText: "Habitation",
    IGRSAndBuildingDetailsText: "IGRS and Building setback Details",
  IGRSwardText: "IGRS Ward",
  IGRSLocalityText: "IGRS Locality",
  IGRSBlockText: "IGRS Block",
  IGRSDoorNoFromText: "IGRS Door No From",
  IGRSDoorNoToText: "IGRS Door No To",
  liftText: "Lift",
  toiletText: "Toilet",
  waterTapText: "Water Tap",
  cableConnectionText: "Cable Connection",
  electricityText: "Electricity",
  attachedBathroomText: "Attached Bathroom",
  waterHarvestingText:  "Water Harvesting",
  floorTypeText: "Floor Type",
  roofTypeText: "Roof Type",
  wallTypeText: "Wall Type",
  woodTypeText: "Wood Type",
  submitButtonText: "Submit",
  constructionDetails: "Construction Details",
  selectText: "Select",
  saveDraftText: "Save Draft",
  previousText: "Previous",
 
  IGRSDetailsText: "IGRS Details",
  IGRSClassification: "IGRS Classification",
  builtUpArea: "Built-up Area",
  frontSetBack: "Front Setback",
  rearSetBack: "Rear Setback",
  sideSetBack: "Side Setback",
  totalPlintArea: "Total Plinth Area",
  nextButtonText: "Next",
  Onlynumbersareallowedupto12digitsMSG: "Only numbers are allowed upto 12 digits",
  Aadhaarnumbermustbe12digitsMSG: "Aadhaar number must be 12 digits",
  OnlyalphabetsareallowedMSG: "Only alphabets are allowed",
  Mobilenumbermustbe10digitsMSG: "Mobile number must be 10 digits",
  Onlynumbersareallowedupto10digitsMSG: "Only numbers are allowed upto 10 digits",
  InvalidemailaddressMSG: "Invalid email address",
  AddGuardianMSG: "Add Guardian",
 
  LocalityIsRequiredMSG: "Locality is required",
  ZoneNoIsRequiredMSG: "Zone No is required",
  WardNoIsRequiredMSG: "Ward No is required",
  BlockNoIsRequiredMSG: "Block No is required",
  StreetIsRequiredMSG: "Street is required",
  ElectionWardIsRequiredMSG: "Election Ward is required",
  SecretariatWardIsRequiredMSG: "Secretariat Ward is required",
  PincodeIsRequiredMSG: "Pincode is required",
  CorrespondenceAddress1IsRequiredMSG: "Correspondence Address 1 is required",
  CorrespondencePincodeIsRequiredMSG: "Correspondence Pincode is required",
  CorrespondencePincodeMustBe6DigitsMSG: "Correspondence Pincode must be 6 digits",
  ZoneNoShouldContainOnlyNumbersMSG: "Zone No should contain only numbers",
  PincodeShouldContainOnlyNumbersMSG: "Pincode should contain only numbers",
  PincodeShouldBeNumericMSG: "Pincode should be numeric",
  PincodeMustBe6DigitsMSG: "Pincode must be 6 digits",
  ZoneNoShouldBeNumericMSG: "Zone No should be numeric",
  CorrespondencePincodeShouldBeNumericMSG: "Correspondence Pincode should be numeric",
  CorrespondencePincodeMustBeNumericMSG: "Correspondence Pincode must be numeric",
 
    CorressPondenceAddressMSG: "Correspondence Address",
    Address1MSG: "Address 1",
    Address2MSG: "Address 2",
    PleaseSelectAValueMSG: "Please select a value",
 
    onlyNumbersAreAllowedMSG: "Only numbers are allowed",
    ThisFieldIsRequiredMSG: "This field is required",
 
    PercentagePlaceholder: "Percentage",
    MetersPlaceholder: "Meters",
    SquareMetersPlaceholder: "Square Meters",
    NoFloorDetailsFoundMSG: "No floor Details found",
 
    addFloorText: "Add Floor",
    onlyNumbersAllowedInText: "Only numbers allowed in",
    isRequiredText: "This field is required",
    SelectFieldsThatRemainTheSameText: "Select fields that remain the same",
    SerialNoText: "Serial No",
    RevenueDocumentNumberText: "Revenue Document Number",
    ImportantNoteText: "Important Note",
 
    SendEmailText : "Send Email",
    InternalCorrspondenceWithSericeManagerText: "Internal Correspondence with Service Manager",
    ToText: "To",
    FromText: "From",
    SubjectText: "Subject",
    ComposeEmailText: "Compose Email",
    DiscardText: "Discard",
    HomeText: "Home",
    googleMapsText: "Google Maps",
    appleMapsText: "Apple Maps",
    openStreetMapsText: "Open Street Maps",
 
   
  });
 
  const messageCodes = [
    // Form field labels
    'newPropertyForm.label',
    'habitation.label',
    'IGRSAndBuildingDetailsText.label',
    'IGRSward.label',
    'IGRSLocality.label',
    'IGRSBlock.label',
    'IGRSDoorNoFrom.label',
    'IGRSDoorNoTo.label',
    'lift.label',
    'toilet.label',
    'waterTap.label',
    'cableConnection.label',
    'electricity.label',
    'attachedBathroom.label',
    'waterHarvesting.label',
    'floorType.label',
    'roofType.label',
    'wallType.label',
    'woodType.label',
    'submitButton.label',
    'constructionDetails.label',
    'select.label',
    'saveDraft.label',
    'previous.label',
 
    'IGRSDetailsText.label',
    'IGRSClassification.label',
    'builtUpArea.label',
    'frontSetBack.label',
    'rearSetBack.label',
    'sideSetBack.label',
    'totalPlintArea.label',
    'nextButtonText.label',
   
    // Dropdown option codes
    // Habitation options
    'dropdown.habitation.central.park.colony',
    'dropdown.habitation.sunrise.apartments',
    'dropdown.habitation.hilltop.residency',
    'dropdown.habitation.riverfront.homes',
    'dropdown.habitation.maple.street.villas',
   
    // IGRS Ward options
    'dropdown.ward.a',
    'dropdown.ward.b',
    'dropdown.ward.c',
    'dropdown.ward.d',
    'dropdown.ward.e',
   
    // IGRS Locality options
    'dropdown.locality.green.meadows',
    'dropdown.locality.lakeview',
    'dropdown.locality.sunshine.valley',
    'dropdown.locality.riverdale',
    'dropdown.locality.maple.gardens',
   
    // IGRS Block options
    'dropdown.block.12',
    'dropdown.block.7',
    'dropdown.block.3',
    'dropdown.block.9',
    'dropdown.block.1',
   
    // Floor Type options
    'dropdown.floortype.marble',
    'dropdown.floortype.tiles',
    'dropdown.floortype.granite',
    'dropdown.floortype.concrete',
    'dropdown.floortype.other',
   
    // Roof Type options
    'dropdown.rooftype.concrete',
    'dropdown.rooftype.metal',
    'dropdown.rooftype.asbestos',
    'dropdown.rooftype.tiles',
    'dropdown.rooftype.other',
   
    // Wall Type options
    'dropdown.walltype.brick',
    'dropdown.walltype.stone',
    'dropdown.walltype.concrete',
    'dropdown.walltype.wood',
    'dropdown.walltype.other',
   
    // Wood Type options
    'dropdown.woodtype.teak',
    'dropdown.woodtype.sal',
    'dropdown.woodtype.rosewood',
    'dropdown.woodtype.mango',
    'dropdown.woodtype.other',
   
    // Door Number options
    'dropdown.doorNo.10',
    'dropdown.doorNo.101',
    'dropdown.doorNo.201',
    'dropdown.doorNo.301',
    'dropdown.doorNo.401',
    'dropdown.doorNo.15',
    'dropdown.doorNo.110',
    'dropdown.doorNo.210',
    'dropdown.doorNo.310',
    'dropdown.doorNo.410',
   
    // ISGR Additional Options
    'dropdown.option.lifts',
    'dropdown.option.toilet',
    'dropdown.option.watertap',
    'dropdown.option.cableconnection',
    'dropdown.option.electricity',
    'dropdown.option.attachedbathroom',
    'dropdown.option.waterharvesting',
 
    'Onlynumbersareallowedupto12digitsMSG',
    'Aadhaarnumbermustbe12digitsMSG',
    'OnlyalphabetsareallowedMSG',
    'Mobilenumbermustbe10digitsMSG',
    'Onlynumbersareallowedupto10digitsMSG',
    'InvalidemailaddressMSG',
    'AddGuardianMSG',
 
    'LocalityIsRequiredMSG',
    'ZoneNoIsRequiredMSG',
    'WardNoIsRequiredMSG',
    'BlockNoIsRequiredMSG',
    'StreetIsRequiredMSG',
    'ElectionWardIsRequiredMSG',
    'SecretariatWardIsRequiredMSG',
    'PincodeIsRequiredMSG',
    'CorrespondenceAddress1IsRequiredMSG',
    'CorrespondencePincodeIsRequiredMSG',
    'CorressPondenceAddressMSG',
    'Address1MSG',
    'Address2MSG',
    'PleaseSelectAValueMSG',
  'ZoneNoShouldContainOnlyNumbersMSG',
  'PincodeShouldContainOnlyNumbersMSG',
  'validation.zonenoshouldbenumericMSG',
  'validation.pincodeshouldbenumericMSG',
  'validation.pincodemustbe6digitsMSG',
  'validation.onlynumbersareallowedMSG',
  'ThisFieldIsRequiredMSG',
  'PercentagePlaceholder',
  'MetersPlaceholder',
  'SquareMetersPlaceholder',
  'NoFloorDetailsFoundMSG',
  'addFloorText',
  'onlyNumbersAllowedInText',
  'isRequiredText',
  'SelectFieldsThatRemainTheSameText',
  'SerialNoText',
  'RevenueDocumentNumberText',
 
  'SendEmailText',
  'InternalCorrspondenceWithSericeManagerText',
  'ToText',
  'FromText',
  'SubjectText',
  'ComposeEmailText',
  'DiscardText',
  'HomeText',
  'googleMapsText',
  'appleMapsText',
  'openStreetMapsText',
 
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
        const dropdownMap: Record<string, string> = {};
       
        data.messages.forEach(msg => {
          messageMap[msg.code] = msg.message;
          // If it's a dropdown code, create reverse mapping
          if (msg.code.startsWith('dropdown.')) {
            const englishLabel = Object.keys(dropdownLabelToCodeMap).find(
              key => dropdownLabelToCodeMap[key] === msg.code
            );
            if (englishLabel) {
              dropdownMap[englishLabel] = msg.message;
            }
          }
        });
       
        // Store dropdown translations
        setDropdownTranslations(dropdownMap);
        // Helper function to get fallback text
        const getFallback = (key: string, englishText: string, kannadaText: string, hindiText?: string) => {
          const apiValue = messageMap[key];
          if (apiValue) return apiValue;
          if (newLocale === 'kn') return kannadaText;
          if (newLocale === 'hi' && hindiText) return hindiText;
          return englishText;
        };
 
        // Update texts with fetched values or fallbacks
        setTexts({
            newPropertyForm: getFallback('newPropertyForm.label', 'New Property Form', 'ಹೊಸ ಆಸ್ತಿ ಫಾರ್ಮ್', 'नया संपत्ति फॉर्म'),
            habitationText: getFallback('habitation.label', 'Habitation', 'ವಾಸಸ್ಥಾನ', 'आवास'),
            IGRSAndBuildingDetailsText: getFallback('IGRSAndBuildingDetailsText.label', 'IGRS and Building setback Details', 'ಐಜಿಆರ್ಎಸ್ ವಿವರಗಳು', 'आईजीआरएस विवरण'),
            IGRSwardText: getFallback('IGRSward.label', 'IGRS Ward', 'ಐಜಿಆರ್ಎಸ್ ವಾರ್ಡ್', 'आईजीआरएस वार्ड'),
            IGRSLocalityText: getFallback('IGRSLocality.label', 'IGRS Locality', 'ಐಜಿಆರ್ಎಸ್ ಪ್ರದೇಶ', 'आईजीआरएस इलाका'),
            IGRSBlockText: getFallback('IGRSBlock.label', 'IGRS Block', 'ಐಜಿಆರ್ಎಸ್ ಬ್ಲಾಕ್', 'आईजीआरएस ब्लॉक'),
            IGRSDoorNoFromText: getFallback('IGRSDoorNoFrom.label', 'IGRS Door No From', 'ಐಜಿಆರ್ಎಸ್ ಬಾಗಿಲು ಸಂಖ್ಯೆ ಇಂದ', 'आईजीआरएस दरवाजा नं से'),
            IGRSDoorNoToText: getFallback('IGRSDoorNoTo.label', 'IGRS Door No To', 'ಐಜಿಆರ್ಎಸ್ ಬಾಗಿಲು ಸಂಖ್ಯೆ ವರೆಗೆ', 'आईजीआरएस दरवाजा नं'),
            liftText: getFallback('lift.label', 'Lift', 'ಲಿಫ್ಟ್', 'लिफ्ट'),
            toiletText: getFallback('toilet.label', 'Toilet', 'ಶೌಚಾಲಯ', 'शौचालय'),
            waterTapText: getFallback('waterTap.label', 'Water Tap', 'ನೀರಿನ ಕಲ್ಲು', 'पानी का नल'),
            cableConnectionText: getFallback('cableConnection.label', 'Cable Connection', 'ಕೇಬಲ್ ಸಂಪರ್ಕ', 'केबल कनेक्शन'),
            electricityText: getFallback('electricity.label', 'Electricity', 'ವಿದ್ಯುತ್', 'बिजली'),
            attachedBathroomText: getFallback('attachedBathroom.label', 'Attached Bathroom', 'ಲಗತ್ತಿಸಿದ ಸ್ನಾನಗೃಹ', 'संलग्न बाथरूम'),
            waterHarvestingText: getFallback('waterHarvesting.label', 'Water Harvesting', 'ನೀರು ಸಂಗ್ರಹಣೆ', 'जल संचयन'),
            floorTypeText: getFallback('floorType.label', 'Floor Type', 'ನೆಲದ ಪ್ರಕಾರ', 'फर्श का प्रकार'),
            roofTypeText: getFallback('roofType.label', 'Roof Type', 'ಛಾವಣಿಯ ಪ್ರಕಾರ', 'छत का प्रकार'),
            wallTypeText: getFallback('wallType.label', 'Wall Type', 'ಗೋಡೆಯ ಪ್ರಕಾರ', 'दीवार का प्रकार'),
            woodTypeText: getFallback('woodType.label', 'Wood Type', 'ಮರದ ಪ್ರಕಾರ', 'लकड़ी का प्रकार'),
            submitButtonText: getFallback('submitButton.label', 'Submit', 'ಸಲ್ಲಿಸಿ', 'जमा करें'),
            constructionDetails: getFallback('constructionDetails.label', 'Construction Details', 'ನಿರ್ಮಾಣ ವಿವರಗಳು', 'निर्माण विवरण'),
            selectText: getFallback('select.label', 'Select', 'ಆಯ್ಕೆ ಮಾಡಿ', 'चुनें'),
            saveDraftText: getFallback('saveDraft.label', 'Save Draft', 'ಡ್ರಾಫ್ಟ್ ಸೇವ್ ಮಾಡಿ', 'ड्राफ्ट सेव करें'),
            previousText: getFallback('previous.label', 'Previous', 'ಹಿಂದಿನ', 'पिछला'),
 
            IGRSDetailsText: getFallback('IGRSDetailsText.label', 'IGRS Details', 'ಐಜಿಆರ್ಎಸ್ ವಿವರಗಳು', 'आईजीआरएस विवरण'),
            IGRSClassification: getFallback('IGRSClassification.label', 'IGRS Classification', 'ಐಜಿಆರ್ಎಸ್ ವರ್ಗೀಕರಣ', 'आईजीआरएस वर्गीकरण'),
            builtUpArea: getFallback('builtUpArea.label', 'Built Up Area', 'ನಿರ್ಮಿತ ಪ್ರದೇಶ', 'निर्मित क्षेत्र'),
            frontSetBack: getFallback('frontSetBack.label', 'Front Setback', 'ಮುಂಭಾಗದ ಸೆಟ್‌ಬ್ಯಾಕ್', 'फ्रंट सेटबैक'),
            rearSetBack: getFallback('rearSetBack.label', 'Rear Setback', 'ಹಿಂದಿನ ಸೆಟ್‌ಬ್ಯಾಕ್', 'रियर सेटबैक'),
            sideSetBack: getFallback('sideSetBack.label', 'Side Setback', 'ಬದಿಯ ಸೆಟ್‌ಬ್ಯಾಕ್', 'साइड सेटबैक'),
            totalPlintArea: getFallback('totalPlintArea.label', 'Total Plinth Area', 'ಒಟ್ಟು ಪ್ಲಿಂತ್ ಪ್ರದೇಶ', 'कुल प्लिंथ क्षेत्र'),
            nextButtonText: getFallback('nextButtonText.label', 'Next', 'ಮುಂದೆ', 'अगला'),
            Onlynumbersareallowedupto12digitsMSG: getFallback('Onlynumbersareallowedupto12digitsMSG', 'Only numbers are allowed upto 12 digits', 'ಕೆವಲ ಸಂಖ್ಯೆಗಳು 12 ಅಂಕಿಗಳವರೆಗೆ ಅನುಮತಿಸಲಾಗಿದೆ', 'केवल 12 अंकों तक की संख्या की अनुमति है'),
            Aadhaarnumbermustbe12digitsMSG: getFallback('Aadhaarnumbermustbe12digitsMSG', 'Aadhaar number must be 12 digits', 'ಆಧಾರ್ ಸಂಖ್ಯೆ 12 ಅಂಕಿಗಳಾಗಿರಬೇಕು', 'आधार संख्या 12 अंकों की होनी चाहिए'),
            OnlyalphabetsareallowedMSG: getFallback('OnlyalphabetsareallowedMSG', 'Only alphabets are allowed', 'ಕೆವಲ ಅಕ್ಷರಗಳನ್ನು ಅನುಮತಿಸಲಾಗಿದೆ', 'केवल वर्णमाला की अनुमति है'),
            Mobilenumbermustbe10digitsMSG: getFallback('Mobilenumbermustbe10digitsMSG', 'Mobile number must be 10 digits', 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ 10 ಅಂಕಿಗಳಾಗಿರಬೇಕು', 'मोबाइल नंबर 10 अंकों का होना चाहिए'),
            Onlynumbersareallowedupto10digitsMSG: getFallback('Onlynumbersareallowedupto10digitsMSG', 'Only numbers are allowed upto 10 digits', 'ಕೆವಲ ಸಂಖ್ಯೆಗಳು 10 ಅಂಕಿಗಳವರೆಗೆ ಅನುಮತಿಸಲಾಗಿದೆ', 'केवल 10 अंकों तक की संख्या की अनुमति है'),
            InvalidemailaddressMSG: getFallback('InvalidemailaddressMSG', 'Invalid email address', 'ಅಮಾನ್ಯ ಇಮೇಲ್ ವಿಳಾಸ', 'अमान्य ईमेल पता'),  
            AddGuardianMSG: getFallback('AddGuardianMSG', 'Add Guardian', 'ಅಭಿವಂದನವನ್ನು ಸೇರಿಸಿ', 'अभिभावक जोड़ें'),
       
            LocalityIsRequiredMSG: getFallback('LocalityIsRequiredMSG', 'Locality is required', 'ಪ್ರದೇಶ ಅಗತ್ಯವಿದೆ', 'इलाका आवश्यक है'),
            ZoneNoIsRequiredMSG: getFallback('ZoneNoIsRequiredMSG', 'Zone No is required', 'ಝೋನ್ ಸಂಖ್ಯೆ ಅಗತ್ಯವಿದೆ', 'ज़ोन नंबर आवश्यक है'),
            WardNoIsRequiredMSG: getFallback('WardNoIsRequiredMSG', 'Ward No is required', 'ವಾರ್ಡ್ ಸಂಖ್ಯೆ ಅಗತ್ಯವಿದೆ', 'वार्ड नंबर आवश्यक है'),
            BlockNoIsRequiredMSG: getFallback('BlockNoIsRequiredMSG', 'Block No is required', 'ಬ್ಲಾಕ್ ಸಂಖ್ಯೆ ಅಗತ್ಯವಿದೆ', 'ब्लॉक नंबर आवश्यक है'),
            StreetIsRequiredMSG: getFallback('StreetIsRequiredMSG', 'Street is required', 'ರಸ್ತೆ ಅಗತ್ಯವಿದೆ', 'सड़क आवश्यक है'),
            ElectionWardIsRequiredMSG: getFallback('ElectionWardIsRequiredMSG', 'Election Ward is required', 'ಚುನಾವಣೆ ವಾರ್ಡ್ ಅಗತ್ಯವಿದೆ', 'चुनाव वार्ड आवश्यक है'),
            SecretariatWardIsRequiredMSG: getFallback('SecretariatWardIsRequiredMSG', 'Secretariat Ward is required', 'ಸಚಿವಾಲಯ ವಾರ್ಡ್ ಅಗತ್ಯವಿದೆ', 'सचिवालय वार्ड आवश्यक है'),
            PincodeIsRequiredMSG: getFallback('PincodeIsRequiredMSG', 'Pincode is required', 'ಪಿನ್‌ಕೋಡ್ ಅಗತ್ಯವಿದೆ', 'पिनकोड आवश्यक है'),
            CorrespondenceAddress1IsRequiredMSG: getFallback('CorrespondenceAddress1IsRequiredMSG', 'Correspondence Address 1 is required', 'ಸಂದರ್ಶನ ವಿಳಾಸ 1 ಅಗತ್ಯವಿದೆ', 'संदर्भ पता 1 आवश्यक है'),
            CorrespondencePincodeIsRequiredMSG: getFallback('CorrespondencePincodeIsRequiredMSG', 'Correspondence Pincode is required', 'ಸಂದರ್ಶನ ಪಿನ್‌ಕೋಡ್ ಅಗತ್ಯವಿದೆ', 'संदर्भ पिनकोड आवश्यक है'),
            CorrespondencePincodeShouldBeNumericMSG: getFallback('CorrespondencePincodeShouldBeNumericMSG', 'Correspondence Pincode should be numeric', 'ಸಂದರ್ಶನ ಪಿನ್‌ಕೋಡ್ ಸಂಖ್ಯಾತ್ಮಕವಾಗಿರಬೇಕು', 'संदर्भ पिनकोड संख्यात्मक होना चाहिए'),
            CorrespondencePincodeMustBe6DigitsMSG: getFallback('CorrespondencePincodeMustBe6DigitsMSG', 'Correspondence Pincode must be 6 digits', 'ಸಂದರ್ಶನ ಪಿನ್‌ಕೋಡ್ 6 ಅಂಕಿಗಳಾಗಿರಬೇಕು', 'संदर्भ पिनकोड 6 अंकों का होना चाहिए'),
            CorrespondencePincodeMustBeNumericMSG: getFallback('CorrespondencePincodeMustBeNumericMSG', 'Correspondence Pincode must be numeric', 'ಸಂದರ್ಶನ ಪಿನ್‌ಕೋಡ್ ಸಂಖ್ಯಾತ್ಮಕವಾಗಿರಬೇಕು', 'संदर्भ पिनकोड संख्यात्मक होना चाहिए'),
          CorressPondenceAddressMSG: getFallback('CorrespondenceAddressMSG', 'Correspondence Address', 'ಸಂದರ್ಶನ ವಿಳಾಸ', 'संदर्भ पता'),
          Address1MSG: getFallback('Address1MSG', 'Address 1', 'ವಿಳಾಸ 1', 'पता 1'),
          Address2MSG: getFallback('Address2MSG', 'Address 2', 'ವಿಳಾಸ 2', 'पता 2'),
          PleaseSelectAValueMSG: getFallback('PleaseSelectAValueMSG', 'Please select a value', 'ದಯವಿಟ್ಟು ಒಂದು ಮೌಲ್ಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ', 'कृपया एक मान चुनें'),
PincodeShouldContainOnlyNumbersMSG: getFallback('PincodeShouldContainOnlyNumbersMSG', 'Pincode should contain only numbers', 'ಪಿನ್‌ಕೋಡ್‌ನಲ್ಲಿ ಕೇವಲ ಸಂಖ್ಯೆಗಳು ಇರಬೇಕು', 'पिनकोड में केवल संख्याएं होनी चाहिए'),
ZoneNoShouldContainOnlyNumbersMSG: getFallback('ZoneNoShouldContainOnlyNumbersMSG', 'Zone No should contain only numbers', 'ಝೋನ್ ಸಂಖ್ಯೆಯಲ್ಲಿ ಕೇವಲ ಸಂಖ್ಯೆಗಳು ಇರಬೇಕು', 'ज़ोन नंबर में केवल संख्याएं होनी चाहिए'),          
ZoneNoShouldBeNumericMSG: getFallback('validation.zonenoshouldbenumericMSG', 'Zone No should be numeric', 'ಝೋನ್ ಸಂಖ್ಯೆ ಸಂಖ್ಯಾತ್ಮಕವಾಗಿರಬೇಕು', 'ज़ोन नंबर संख्यात्मक होना चाहिए'),
  PincodeShouldBeNumericMSG: getFallback('validation.pincodeshouldbenumericMSG', 'Pincode should be numeric', 'ಪಿನ್‌ಕೋಡ್ ಸಂಖ್ಯಾತ್ಮಕವಾಗಿರಬೇಕು', 'पिनकोड संख्यात्मक होना चाहिए'),
  PincodeMustBe6DigitsMSG: getFallback('validation.pincodemustbe6digitsMSG', 'Pincode must be 6 digits', 'ಪಿನ್‌ಕೋಡ್ 6 ಅಂಕಿಗಳಾಗಿರಬೇಕು', 'पिनकोड 6 अंकों का होना चाहिए'),
          onlyNumbersAreAllowedMSG: getFallback('validation.onlynumbersareallowedMSG', 'Only numbers are allowed', 'ಕೆವಲ ಸಂಖ್ಯೆಗಳು ಅನುಮತಿಸಲಾಗಿದೆ', 'केवल संख्याओं की अनुमति है'),
          ThisFieldIsRequiredMSG: getFallback('ThisFieldIsRequiredMSG', 'This field is required', 'ಈ ಕ್ಷೇತ್ರ ಅಗತ್ಯವಿದೆ', 'यह फ़ील्ड आवश्यक है'),
          PercentagePlaceholder: getFallback('PercentagePlaceholder', 'Percentage', 'ಶೇಕಡಾವಾರು', 'प्रतिशत'),
          MetersPlaceholder: getFallback('MetersPlaceholder', 'Meters', 'ಮೀಟರ್‌ಗಳು', 'मीटर'),
          SquareMetersPlaceholder: getFallback('SquareMetersPlaceholder', 'Square Meters', 'ಚದರ ಮೀಟರ್‌ಗಳು', 'वर्ग मीटर'),
          NoFloorDetailsFoundMSG: getFallback('NoFloorDetailsFoundMSG', 'No floor Details found', 'ಯಾವುದೇ ಮಹಡಿ ವಿವರಗಳು ಕಂಡುಬಂದಿಲ್ಲ', 'कोई फर्श विवरण नहीं मिला'),
          addFloorText: getFallback('addFloorText', 'Add Floor', 'ಮಹಡಿ ಸೇರಿಸಿ', 'मंजिल जोड़ें'),
          onlyNumbersAllowedInText: getFallback('onlyNumbersAllowedInText', 'Only numbers allowed in', 'ಕೆವಲ ಸಂಖ್ಯೆಗಳು ಅನುಮತಿಸಲಾಗಿದೆ', 'केवल संख्याओं की अनुमति है'),
          isRequiredText: getFallback('isRequiredText', 'This field is required', 'ಈ ಕ್ಷೇತ್ರ ಅಗತ್ಯವಿದೆ', 'यह फ़ील्ड आवश्यक है'),
          SelectFieldsThatRemainTheSameText: getFallback('SelectFieldsThatRemainTheSameText', 'Select fields that remain the same', 'ಅದೇ ಇರುವ ಕ್ಷೇತ್ರಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ', 'वे फ़ील्ड चुनें जो समान रहती हैं'),
          SerialNoText: getFallback('SerialNoText', 'Serial No', 'ಕ್ರಮ ಸಂಖ್ಯೆ', 'क्रम संख्या'),
          RevenueDocumentNumberText: getFallback('RevenueDocumentNumberText', 'Revenue Document Number', 'ರೆವೆನ್ಯೂ ಡಾಕ್ಯುಮೆಂಟ್ ಸಂಖ್ಯೆ', 'राजस्व दस्तावेज़ संख्या'),
          ImportantNoteText: getFallback('ImportantNoteText', 'Important Note', 'ಮುಖ್ಯ ಟಿಪ್ಪಣಿ', 'महत्वपूर्ण नोट'),
          SendEmailText: getFallback('SendEmailText', 'Send Email', 'ಇಮೇಲ್ ಕಳುಹಿಸಿ', 'ईमेल भेजें'),
          InternalCorrspondenceWithSericeManagerText: getFallback('InternalCorrspondenceWithSericeManagerText', 'Internal Correspondence with Service Manager', 'ಸೇವಾ ನಿರ್ವಾಹಕರೊಂದಿಗೆ ಆಂತರಿಕ ಪತ್ರವ್ಯವಹಾರ', 'सेवा प्रबंधक के साथ आंतरिक पत्राचार'),
          ToText: getFallback('ToText', 'To', 'ಗೆ', 'को'),
          FromText: getFallback('FromText', 'From', 'ಇಂದ', 'से'),
          SubjectText: getFallback('SubjectText', 'Subject', 'ವಿಷಯ', 'विषय'),
          ComposeEmailText: getFallback('ComposeEmailText', 'Compose Email', 'ಇಮೇಲ್ ರಚಿಸಿ', 'ईमेल बनाएं'),
          DiscardText: getFallback('DiscardText', 'Discard', 'ರದ್ದುಮಾಡಿ', 'त्यागें'),
          HomeText: getFallback('HomeText', 'Home', 'ಮನೆ', 'घर'),
          googleMapsText: getFallback('googleMapsText', 'Google Maps', 'ಗೂಗಲ್ ನಕ್ಷೆಗಳು', 'गूगल मैप्स'),
          appleMapsText: getFallback('appleMapsText', 'Apple Maps', 'ಆಪಲ್ ನಕ್ಷೆಗಳು', 'एप्पल मैप्स'),
          openStreetMapsText: getFallback('openStreetMapsText', 'Open Street Maps', 'ಒಪನ್ ಸ್ಟ್ರೀಟ್ ನಕ್ಷೆಗಳು', 'ओपन स्ट्रीट मैप्स'),
        });
      }
    } catch (error) {
      console.error('Error fetching localized texts:', error);
      // Set fallback texts based on locale
      if (newLocale === 'kn') {
        setTexts({
            newPropertyForm: 'ಹೊಸ ಆಸ್ತಿ ಫಾರ್ಮ್',
            habitationText: 'ವಾಸಸ್ಥಾನ',
            IGRSAndBuildingDetailsText: 'ಐಜಿಆರ್ಎಸ್ ವಿವರಗಳು',
            IGRSwardText: 'ಐಜಿಆರ್ಎಸ್ ವಾರ್ಡ್',
            IGRSLocalityText: 'ಐಜಿಆರ್ಎಸ್ ಪ್ರದೇಶ',
            IGRSBlockText: 'ಐಜಿಆರ್ಎಸ್ ಬ್ಲಾಕ್',
            IGRSDoorNoFromText: 'ಐಜಿಆರ್ಎಸ್ ಬಾಗಿಲು ಸಂಖ್ಯೆ ಇಂದ',
            IGRSDoorNoToText: 'ಐಜಿಆರ್ಎಸ್ ಬಾಗಿಲು ಸಂಖ್ಯೆ ವರೆಗೆ',
            liftText: 'ಲಿಫ್ಟ್',
            toiletText: 'ಶೌಚಾಲಯ',
            waterTapText: 'ನೀರಿನ ಕಲ್ಲು',
            cableConnectionText: 'ಕೇಬಲ್ ಸಂಪರ್ಕ',
            electricityText: 'ವಿದ್ಯುತ್',
            attachedBathroomText: 'ಲಗತ್ತಿಸಿದ ಸ್ನಾನಗೃಹ',
            waterHarvestingText: 'ನೀರು ಸಂಗ್ರಹಣೆ',
            floorTypeText: 'ನೆಲದ ಪ್ರಕಾರ',
            roofTypeText: 'ಛಾವಣಿಯ ಪ್ರಕಾರ',
            wallTypeText: 'ಗೋಡೆಯ ಪ್ರಕಾರ',
            woodTypeText: 'ಮರದ ಪ್ರಕಾರ',
            submitButtonText: 'ಸಲ್ಲಿಸಿ',
            constructionDetails: 'ನಿರ್ಮಾಣ ವಿವರಗಳು',
            selectText: 'ಆಯ್ಕೆ ಮಾಡಿ',
            saveDraftText: 'ಡ್ರಾಫ್ಟ್ ಸೇವ್ ಮಾಡಿ',
            previousText: 'ಹಿಂದಿನ',
            IGRSDetailsText: 'ಐಜಿಆರ್ಎಸ್ ವಿವರಗಳು',
            IGRSClassification: 'ಐಜಿಆರ್ಎಸ್ ವರ್ಗೀಕರಣ',
            builtUpArea: 'ನಿರ್ಮಿತ ಪ್ರದೇಶ',
            frontSetBack: 'ಮುಂಭಾಗದ ಸೆಟ್‌ಬ್ಯಾಕ್',
            rearSetBack: 'ಹಿಂದಿನ ಸೆಟ್‌ಬ್ಯಾಕ್',
            sideSetBack: 'ಬದಿಯ ಸೆಟ್‌ಬ್ಯಾಕ್',
            totalPlintArea: 'ಒಟ್ಟು ಪ್ಲಿಂತ್ ಪ್ರದೇಶ',
            nextButtonText: 'ಮುಂದೆ',
            Onlynumbersareallowedupto12digitsMSG: 'ಕೆವಲ ಸಂಖ್ಯೆಗಳು 12 ಅಂಕಿಗಳವರೆಗೆ ಅನುಮತಿಸಲಾಗಿದೆ',
            Aadhaarnumbermustbe12digitsMSG: 'ಆಧಾರ್ ಸಂಖ್ಯೆ 12 ಅಂಕಿಗಳಾಗಿರಬೇಕು',
            OnlyalphabetsareallowedMSG: 'ಕೆವಲ ಅಕ್ಷರಗಳನ್ನು ಅನುಮತಿಸಲಾಗಿದೆ',
            Mobilenumbermustbe10digitsMSG: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ 10 ಅಂಕಿಗಳಾಗಿರಬೇಕು',
            Onlynumbersareallowedupto10digitsMSG: 'ಕೆವಲ ಸಂಖ್ಯೆಗಳು 10 ಅಂಕಿಗಳವರೆಗೆ ಅನುಮತಿಸಲಾಗಿದೆ',
            InvalidemailaddressMSG: 'ಅಮಾನ್ಯ ಇಮೇಲ್ ವಿಳಾಸ',
            AddGuardianMSG: 'ಅಭಿವಂದನವನ್ನು ಸೇರಿಸಿ',
            LocalityIsRequiredMSG: 'ಪ್ರದೇಶ ಅಗತ್ಯವಿದೆ',
            ZoneNoIsRequiredMSG: 'ಝೋನ್ ಸಂಖ್ಯೆ ಅಗತ್ಯವಿದೆ',
            WardNoIsRequiredMSG: 'ವಾರ್ಡ್ ಸಂಖ್ಯೆ ಅಗತ್ಯವಿದೆ',
            BlockNoIsRequiredMSG: 'ಬ್ಲಾಕ್ ಸಂಖ್ಯೆ ಅಗತ್ಯವಿದೆ',
            StreetIsRequiredMSG: 'ರಸ್ತೆ ಅಗತ್ಯವಿದೆ',
            ElectionWardIsRequiredMSG: 'ಚುನಾವಣೆ ವಾರ್ಡ್ ಅಗತ್ಯವಿದೆ',
            SecretariatWardIsRequiredMSG: 'ಸಚಿವಾಲಯ ವಾರ್ಡ್ ಅಗತ್ಯವಿದೆ',
            PincodeIsRequiredMSG: 'ಪಿನ್‌ಕೋಡ್ ಅಗತ್ಯವಿದೆ',
            CorrespondenceAddress1IsRequiredMSG: 'ಸಂದರ್ಶನ ವಿಳಾಸ 1 ಅಗತ್ಯವಿದೆ',
            CorrespondencePincodeIsRequiredMSG: 'ಸಂದರ್ಶನ ಪಿನ್‌ಕೋಡ್ ಅಗತ್ಯವಿದೆ',
            CorrespondencePincodeShouldBeNumericMSG: 'ಸಂದರ್ಶನ ಪಿನ್‌ಕೋಡ್ ಸಂಖ್ಯಾತ್ಮಕವಾಗಿರಬೇಕು',
            CorrespondencePincodeMustBe6DigitsMSG: 'ಸಂದರ್ಶನ ಪಿನ್‌ಕೋಡ್ 6 ಅಂಕಿಗಳಾಗಿರಬೇಕು',
            CorrespondencePincodeMustBeNumericMSG: 'ಸಂದರ್ಶನ ಪಿನ್‌ಕೋಡ್ ಸಂಖ್ಯಾತ್ಮಕವಾಗಿರಬೇಕು',
            CorressPondenceAddressMSG: 'ಸಂದರ್ಶನ ವಿಳಾಸ',
            Address1MSG: 'ವಿಳಾಸ 1',
            Address2MSG: 'ವಿಳಾಸ 2',
            PleaseSelectAValueMSG: 'ದಯವಿಟ್ಟು ಒಂದು ಮೌಲ್ಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
            PincodeShouldContainOnlyNumbersMSG: 'ಪಿನ್‌ಕೋಡ್‌ನಲ್ಲಿ ಕೇವಲ ಸಂಖ್ಯೆಗಳು ಇರಬೇಕು',
            ZoneNoShouldContainOnlyNumbersMSG: 'ಝೋನ್ ಸಂಖ್ಯೆಯಲ್ಲಿ ಕೇವಲ ಸಂಖ್ಯೆಗಳು ಇರಬೇಕು',
          onlyNumbersAreAllowedMSG: 'ಕೆವಲ ಸಂಖ್ಯೆಗಳು ಅನುಮತಿಸಲಾಗಿದೆ',
          ThisFieldIsRequiredMSG: 'ಈ ಕ್ಷೇತ್ರ ಅಗತ್ಯವಿದೆ',
          PercentagePlaceholder: 'ಶೇಕಡಾವಾರು',
          MetersPlaceholder: 'ಮೀಟರ್‌ಗಳು',
          SquareMetersPlaceholder: 'ಚದರ ಮೀಟರ್‌ಗಳು',
          NoFloorDetailsFoundMSG: 'ಯಾವುದೇ ಮಹಡಿ ವಿವರಗಳು ಕಂಡುಬಂದಿಲ್ಲ',
          addFloorText: 'ಮಹಡಿ ಸೇರಿಸಿ',
          onlyNumbersAllowedInText: 'ಕೆವಲ ಸಂಖ್ಯೆಗಳು ಅನುಮತಿಸಲಾಗಿದೆ',
          isRequiredText: 'ಈ ಕ್ಷೇತ್ರ ಅಗತ್ಯವಿದೆ',
          SelectFieldsThatRemainTheSameText: 'ಅದೇ ಇರುವ ಕ್ಷೇತ್ರಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ',
          SerialNoText: 'ಕ್ರಮ ಸಂಖ್ಯೆ',
          RevenueDocumentNumberText: 'ರೆವೆನ್ಯೂ ಡಾಕ್ಯುಮೆಂಟ್ ಸಂಖ್ಯೆ',
          ImportantNoteText: 'ಮುಖ್ಯ ಟಿಪ್ಪಣಿ',
          SendEmailText: 'ಇಮೇಲ್ ಕಳುಹಿಸಿ',
          InternalCorrspondenceWithSericeManagerText: 'ಸೇವಾ ನಿರ್ವಾಹಕರೊಂದಿಗೆ ಆಂತರಿಕ ಪತ್ರವ್ಯವಹಾರ',
          ToText: 'ಗೆ',
          FromText: 'ಇಂದ',
          SubjectText: 'ವಿಷಯ',
          ComposeEmailText: 'ಇಮೇಲ್ ರಚಿಸಿ',
          DiscardText: 'ರದ್ದುಮಾಡಿ',
          HomeText: 'ಮನೆ',
          googleMapsText: 'ಗೂಗಲ್ ನಕ್ಷೆಗಳು',
          appleMapsText: 'ಆಪಲ್ ನಕ್ಷೆಗಳು',
          openStreetMapsText: 'ಒಪನ್ ಸ್ಟ್ರೀಟ್ ನಕ್ಷೆಗಳು',
        });
      }
       
      else {
        setTexts({
            newPropertyForm: 'New Property Form',
            habitationText: 'Habitation',
            IGRSAndBuildingDetailsText: 'IGRS and Building setback Details',
            IGRSwardText: 'IGRS Ward',
            IGRSLocalityText: 'IGRS Locality',
            IGRSBlockText: 'IGRS Block',
            IGRSDoorNoFromText: 'IGRS Door No From',
            IGRSDoorNoToText: 'IGRS Door No To',
            liftText: 'Lift',
            toiletText: 'Toilet',
            waterTapText: 'Water Tap',
            cableConnectionText: 'Cable Connection',
            electricityText: 'Electricity',
            attachedBathroomText: 'Attached Bathroom',
            waterHarvestingText: 'Water Harvesting',
            floorTypeText: 'Floor Type',
            roofTypeText: 'Roof Type',
            wallTypeText: 'Wall Type',
            woodTypeText: 'Wood Type',
            submitButtonText: 'Submit',
            constructionDetails: 'Construction Details',
            selectText: 'Select',
            saveDraftText: 'Save Draft',
            previousText: 'Previous',
            IGRSDetailsText: 'IGRS Details',
            IGRSClassification: 'IGRS Classification',
            builtUpArea: 'Built Up Area',
            frontSetBack: 'Front Setback',
            rearSetBack: 'Rear Setback',
            sideSetBack: 'Side Setback',
            totalPlintArea: 'Total Plinth Area',
            nextButtonText: 'Next',
            Onlynumbersareallowedupto12digitsMSG: 'Only numbers are allowed upto 12 digits',
            Aadhaarnumbermustbe12digitsMSG: 'Aadhaar number must be 12 digits',
            OnlyalphabetsareallowedMSG: 'Only alphabets are allowed',
            Mobilenumbermustbe10digitsMSG: 'Mobile number must be 10 digits',
            Onlynumbersareallowedupto10digitsMSG: 'Only numbers are allowed upto 10 digits',
            InvalidemailaddressMSG: 'Invalid email address',
            AddGuardianMSG: 'Add Guardian',
            LocalityIsRequiredMSG: 'Locality is required',
            ZoneNoIsRequiredMSG: 'Zone No is required',
            WardNoIsRequiredMSG: 'Ward No is required',
            BlockNoIsRequiredMSG: 'Block No is required',
            StreetIsRequiredMSG: 'Street is required',
            ElectionWardIsRequiredMSG: 'Election Ward is required',
            SecretariatWardIsRequiredMSG: 'Secretariat Ward is required',
            PincodeIsRequiredMSG: 'Pincode is required',
            CorrespondenceAddress1IsRequiredMSG: 'Correspondence Address 1 is required',
            CorrespondencePincodeIsRequiredMSG: 'Correspondence Pincode is required',
            CorrespondencePincodeShouldBeNumericMSG: 'Correspondence Pincode should be numeric',
            CorrespondencePincodeMustBe6DigitsMSG: 'Correspondence Pincode must be 6 digits',
            CorrespondencePincodeMustBeNumericMSG: 'Correspondence Pincode must be numeric',
            CorressPondenceAddressMSG: 'Correspondence Address',
            Address1MSG: 'Address 1',
            Address2MSG: 'Address 2',
            PleaseSelectAValueMSG: 'Please select a value',
            PincodeShouldContainOnlyNumbersMSG: 'Pincode should contain only numbers',
            ZoneNoShouldContainOnlyNumbersMSG: 'Zone No should contain only numbers',
          onlyNumbersAreAllowedMSG: 'Only numbers are allowed',
          ThisFieldIsRequiredMSG: 'This field is required',
          PercentagePlaceholder: 'Percentage',
          MetersPlaceholder: 'Meters',
          SquareMetersPlaceholder: 'Square Meters',
          NoFloorDetailsFoundMSG: 'No floor Details found',
          addFloorText: 'Add Floor',
          onlyNumbersAllowedInText: 'Only numbers allowed in',
          isRequiredText: 'This field is required',
          SelectFieldsThatRemainTheSameText: 'Select fields that remain the same',
        SerialNoText: 'Serial No',
        RevenueDocumentNumberText: 'Revenue Document Number',
          ImportantNoteText: 'Important Note',
          SendEmailText: 'Send Email',
          InternalCorrspondenceWithSericeManagerText: 'Internal Correspondence with Service Manager',
          ToText: 'To',
          FromText: 'From',
          SubjectText: 'Subject',
          ComposeEmailText: 'Compose Email',
          DiscardText: 'Discard',
          HomeText: 'Home',
          googleMapsText: 'Google Maps',
          appleMapsText: 'Apple Maps',
          openStreetMapsText: 'Open Street Maps',
      });
      }
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
 
  // Function to translate dropdown labels using API data
  const translateDropdownLabel = useCallback((label: string): string => {
    // Return translated version if available, otherwise return original label
    if (dropdownTranslations[label]) {
      return dropdownTranslations[label];
    }
    return label;
  }, [dropdownTranslations]);
 
  // Memoized function to translate dropdown options
  const translateDropdownOptions = useCallback((options: {id: string | number, label: string}[]) =>
    options.map(option => ({
      ...option,
      label: translateDropdownLabel(option.label)
    })), [translateDropdownLabel]);
 
  // Initial load
  useEffect(() => {
    const savedLocale = localStorage.getItem('appLocale') || 'en';
    fetchLocalizedTexts(savedLocale);
  }, [locale]);
 
  return {
    ...texts,
    toggleLanguage,
    setLanguage,
    locale,
    translateDropdown: translateDropdownLabel,
    translateDropdownOptions
  };
};