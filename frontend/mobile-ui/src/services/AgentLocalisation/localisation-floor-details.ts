import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import JsonService from '../jsonServerApiCalls';
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

interface FloorDetailsLocalizedTexts {
  // Page titles
  propertyFormTitle: string;
  newPropertyFormTitle: string;
  floorDetailsSubtitle: string;
  
  // Button labels
  previousText: string;
  saveDraftText: string;
  addFloorText: string;
  submitText: string;
  verifyText: string;
  deleteText: string;
  
  // Form field labels
  floorNumberLabel: string;
  buildingClassificationLabel: string;
  igrsClassificationLabel: string;
  natureOfUsageLabel: string;
  firmNameLabel: string;
  occupancyLabel: string;
  occupantNameLabel: string;
  constructionDateLabel: string;
  effectiveFromDateLabel: string;
  unstructuredLandLabel: string;
  lengthLabel: string;
  breadthLabel: string;
  plinthAreaLabel: string;
  buildingPermissionNoLabel: string;
  floorsDetailsEnteredLabel: string;
  
  // Checkbox texts
  cloneFloorText: string;
  selectSameFieldsText: string;
  
  // Messages
  addFloorRequiredMsg: string;
  atLeastOneFloorMsg: string;
  
  // Error messages
  floorNumberRequiredError: string;
  buildingClassificationRequiredError: string;
  igrsClassificationRequiredError: string;
  natureOfUsageRequiredError: string;
  firmNameRequiredError: string;
  occupancyRequiredError: string;
  constructionDateRequiredError: string;
  effectiveFromDateRequiredError: string;
  unstructuredLandRequiredError: string;
  lengthRequiredError: string;
  breadthRequiredError: string;
  plinthAreaRequiredError: string;
  floorsDetailsEnteredRequiredError: string;
  
  // Select placeholder
  selectPlaceholder: string;
  
  // Floor card text
  floorText: string;
  classificationText: string;
  usageText: string;
  measurementUnitLabel: string;
  sqftLabel: string;
  metersLabel: string;
  
  // Dropdown options
  floorNumberOptions: string[];
  buildingClassificationOptions: string[];
  igrsClassificationOptions: string[];
  natureOfUsageOptions: string[];
  occupancyOptions: string[];
  occupantNameOptions: string[];
  unstructuredLandOptions: string[];
  lengthOptions: string[];
  breadthOptions: string[];
  plinthAreaOptions: string[];
  buildingPermissionNoOptions: string[];
  floorTypeOptions: string[];
  roofTypeOptions: string[];
  wallTypeOptions: string[];
  woodTypeOptions: string[];
  isgrOptions: string[];
}

export const useFloorDetailsLocalization = () => {
  const { locale } = useLanguage();
  
  const [texts, setTexts] = useState<FloorDetailsLocalizedTexts>({
    // Page titles
    propertyFormTitle: 'Property Form',
    newPropertyFormTitle: 'New Property Form',
    floorDetailsSubtitle: 'Floor Details',
    
    // Button labels
    previousText: 'Previous',
    saveDraftText: 'Save Draft',
    addFloorText: 'Add Floor',
    submitText: 'Submit',
    verifyText: 'Verify',
    deleteText: 'Delete',
    
    // Form field labels
    floorNumberLabel: 'Floor Number',
    buildingClassificationLabel: 'Building Classification',
    igrsClassificationLabel: 'IGRS Classification',
    natureOfUsageLabel: 'Nature of Usage',
    firmNameLabel: 'Firm Name',
    occupancyLabel: 'Occupancy',
    occupantNameLabel: 'Occupant Name',
    constructionDateLabel: 'Construction Date',
    effectiveFromDateLabel: 'Effective From Date',
    unstructuredLandLabel: 'Unstructured Land',
    lengthLabel: 'Length',
    breadthLabel: 'Breadth',
    plinthAreaLabel: 'Plinth Area',
    buildingPermissionNoLabel: 'Building Permission No',
    floorsDetailsEnteredLabel: 'Floors Details Entered',
    
    // Checkbox texts
    cloneFloorText: 'Clone Floor',
    selectSameFieldsText: 'Select Same Fields',
    
    // Messages
    addFloorRequiredMsg: 'Please add floor details',
    atLeastOneFloorMsg: 'At least one floor is required',
    
    // Error messages
    floorNumberRequiredError: 'Floor Number is required',
    buildingClassificationRequiredError: 'Building Classification is required',
    igrsClassificationRequiredError: 'IGRS Classification is required',
    natureOfUsageRequiredError: 'Nature of Usage is required',
    firmNameRequiredError: 'Firm Name is required',
    occupancyRequiredError: 'Occupancy is required',
    constructionDateRequiredError: 'Construction Date is required',
    effectiveFromDateRequiredError: 'Effective From Date is required',
    unstructuredLandRequiredError: 'Unstructured Land is required',
    lengthRequiredError: 'Length is required',
    breadthRequiredError: 'Breadth is required',
    plinthAreaRequiredError: 'Plinth Area is required',
    floorsDetailsEnteredRequiredError: 'Please tick Floors Details entered',
    
    // Select placeholder
    selectPlaceholder: 'Select',
    
    // Floor card text
    floorText: 'Floor',
    classificationText: 'Classification',
    usageText: 'Usage',
    measurementUnitLabel: 'Measurement Unit',
    sqftLabel: 'Square Feet',
    metersLabel: 'Meters',
    
    // Dropdown options
    floorNumberOptions: ['1', '2', '3', '4', '5'],
    buildingClassificationOptions: ['BC-0', 'BC-1', 'BC-2', 'BC-3', 'BC-4', 'BC-5', 'BC-6', 'BC-7', 'BC-8', 'BC-9', 'BC-10'],
    igrsClassificationOptions: ['Type 1', 'Type 2', 'Type 3'],
    natureOfUsageOptions: ['Residential', 'Commercial'],
    occupancyOptions: ['Owner', 'Tenant'],
    occupantNameOptions: ['Name 1', 'Name 2', 'Name 3', 'Name 4', 'Name 5'],
    unstructuredLandOptions: ['Yes', 'No'],
    lengthOptions: ['1', '2', '3', '4', '5'],
    breadthOptions: ['1', '2', '3', '4', '5'],
    plinthAreaOptions: ['1', '2', '3', '4', '5'],
    buildingPermissionNoOptions: ['1', '2', '3', '4', '5'],
    floorTypeOptions: ['Type 1', 'Type 2', 'Type 3', 'Type 4', 'Type 5'],
    roofTypeOptions: ['Type 1', 'Type 2', 'Type 3', 'Type 4', 'Type 5'],
    wallTypeOptions: ['Type 1', 'Type 2', 'Type 3', 'Type 4', 'Type 5'],
    woodTypeOptions: ['Type 1', 'Type 2', 'Type 3', 'Type 4', 'Type 5'],
    isgrOptions: ['Lifts', 'Toilet', 'Water Tap', 'Cable Connection', 'Electricity', 'Attached Bathroom', 'Water Harvesting']
  });

  // Load default options from local JSON (json-server/db.json) on mount.
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const [floorNums, buildingClass, igrsClass, natureUsage, occupancies, occupantNames, unstructured, lengths, breadths, plinths, bPermission, floorTypes] = await Promise.all([
          JsonService.getFloorNumbers(),
          JsonService.getBuildingClassifications(),
          JsonService.getIgrsClassifications(),
          JsonService.getNatureOfUsages(),
          JsonService.getOccupancies(),
          JsonService.getOccupantNames(),
          JsonService.getUnstructuredLands(),
          JsonService.getLengths(),
          JsonService.getBreadths(),
          JsonService.getPlinthAreas(),
          JsonService.getBuildingPermissionNos(),
          JsonService.getFloorTypes()
        ]);

        if (!mounted) return;

        setTexts(prev => ({
          ...prev,
          floorNumberOptions: (floorNums || []).map((f: any) => f.label ?? f.name ?? String(f.id)),
          buildingClassificationOptions: (buildingClass || []).map((f: any) => f.label ?? f.name ?? String(f.id)),
          igrsClassificationOptions: (igrsClass || []).map((f: any) => f.label ?? f.name ?? String(f.id)),
          natureOfUsageOptions: (natureUsage || []).map((f: any) => f.label ?? f.name ?? String(f.id)),
          occupancyOptions: (occupancies || []).map((f: any) => f.label ?? f.name ?? String(f.id)),
          occupantNameOptions: (occupantNames || []).map((f: any) => f.label ?? f.name ?? String(f.id)),
          unstructuredLandOptions: (unstructured || []).map((f: any) => f.label ?? f.name ?? String(f.id)),
          lengthOptions: (lengths || []).map((f: any) => f.label ?? f.name ?? String(f.id)),
          breadthOptions: (breadths || []).map((f: any) => f.label ?? f.name ?? String(f.id)),
          plinthAreaOptions: (plinths || []).map((f: any) => f.label ?? f.name ?? String(f.id)),
          buildingPermissionNoOptions: (bPermission || []).map((f: any) => f.label ?? f.name ?? String(f.id)),
          floorTypeOptions: (floorTypes || []).map((f: any) => f.label ?? f.name ?? String(f.id))
        }));
      } catch (e) {
        // ignore — defaults remain
        console.warn('[FloorDetailsLocalization] could not load defaults from JSON', e);
      }
    })();

    return () => { mounted = false; };
  }, []);

  const messageCodes = [
    // Page titles
    'form.title.verify',
    'form.title.new',
    'floor.details.subtitle',
    
    // Button labels
    'btn.previous',
    'btn.save.draft',
    'btn.add.floor',
    'btn.submit',
    'btn.verify',
    'delete.text',
    
    // Form field labels
    'field.floorNumber',
    'field.buildingClassification',
    'field.igrsClassification',
    'field.natureOfUsage',
    'field.firmName',
    'field.occupancy',
    'field.occupantName',
    'field.constructionDate',
    'field.effectiveFromDate',
    'field.unstructuredLand',
    'field.length',
    'field.breadth',
    'field.plinthArea',
    'field.buildingPermissionNo',
    'field.floorsDetailsEntered',
    
    // Checkbox texts
    'checkbox.clone.floor',
    'checkbox.select.same.fields',
    
    // Messages
    'error.add.floor.required',
    'error.at.least.one.floor',
    
    // Error messages
    'validation.floorNumber',
    'validation.buildingClassification',
    'validation.igrsClassification',
    'validation.natureOfUsage',
    'validation.firmName',
    'validation.occupancy',
    'validation.constructionDate',
    'validation.effectiveFromDate',
    'validation.unstructuredLand',
    'validation.length',
    'validation.breadth',
    'validation.plinthArea',
    'validation.floorsDetailsEntered',
    
    // Select placeholder
    'select.placeholder',
    
    // Floor card text
    'floor.label',
    'classification.text',
    'usage.text',
    'measurement.unit.label',
    'sqft.label',
    'meters.label',
    
    // Dropdown options - Floor Number
    'dropdown.floorNumber.1',
    'dropdown.floorNumber.2',
    'dropdown.floorNumber.3',
    'dropdown.floorNumber.4',
    'dropdown.floorNumber.5',
    
    // Building Classification
    'dropdown.buildingClassification.bc-0',
    'dropdown.buildingClassification.bc-1',
    'dropdown.buildingClassification.bc-2',
    'dropdown.buildingClassification.bc-3',
    'dropdown.buildingClassification.bc-4',
    'dropdown.buildingClassification.bc-5',
    'dropdown.buildingClassification.bc-6',
    'dropdown.buildingClassification.bc-7',
    'dropdown.buildingClassification.bc-8',
    'dropdown.buildingClassification.bc-9',
    'dropdown.buildingClassification.bc-10',
    
    // IGRS Classification
    'dropdown.igrsClassification.1',
    'dropdown.igrsClassification.2',
    'dropdown.igrsClassification.3',
    
    // Nature of Usage
    'dropdown.natureOfUsage.1',
    'dropdown.natureOfUsage.2',
    
    // Occupancy
    'dropdown.occupancy.1',
    'dropdown.occupancy.2',
    
    // Occupant Name
    'dropdown.occupantName.1',
    'dropdown.occupantName.2',
    'dropdown.occupantName.3',
    'dropdown.occupantName.4',
    'dropdown.occupantName.5',
    
    // Unstructured Land
    'dropdown.unstructuredLand.1',
    'dropdown.unstructuredLand.2',
    
    // Length
    'dropdown.length.1',
    'dropdown.length.2',
    'dropdown.length.3',
    'dropdown.length.4',
    'dropdown.length.5',
    
    // Breadth
    'dropdown.breadth.1',
    'dropdown.breadth.2',
    'dropdown.breadth.3',
    'dropdown.breadth.4',
    'dropdown.breadth.5',
    
    // Plinth Area
    'dropdown.plinthArea.1',
    'dropdown.plinthArea.2',
    'dropdown.plinthArea.3',
    'dropdown.plinthArea.4',
    'dropdown.plinthArea.5',
    
    // Building Permission No
    'dropdown.buildingPermissionNo.1',
    'dropdown.buildingPermissionNo.2',
    'dropdown.buildingPermissionNo.3',
    'dropdown.buildingPermissionNo.4',
    'dropdown.buildingPermissionNo.5',
    
    // Floor Type
    'dropdown.floorType.1',
    'dropdown.floorType.2',
    'dropdown.floorType.3',
    'dropdown.floorType.4',
    'dropdown.floorType.5',
    
    // Roof Type
    'dropdown.roofType.1',
    'dropdown.roofType.2',
    'dropdown.roofType.3',
    'dropdown.roofType.4',
    'dropdown.roofType.5',
    
    // Wall Type
    'dropdown.wallType.1',
    'dropdown.wallType.2',
    'dropdown.wallType.3',
    'dropdown.wallType.4',
    'dropdown.wallType.5',
    
    // Wood Type
    'dropdown.woodType.1',
    'dropdown.woodType.2',
    'dropdown.woodType.3',
    'dropdown.woodType.4',
    'dropdown.woodType.5',
    
    // ISGR options
    'dropdown.isgr.lifts',
    'dropdown.isgr.toilet',
    'dropdown.isgr.watertap',
    'dropdown.isgr.cableConnection',
    'dropdown.isgr.electricity',
    'dropdown.isgr.attachedBathroom',
    'dropdown.isgr.waterHarvesting'
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
        
    // Update texts with values from API
    setTexts({
          // Page titles
          propertyFormTitle: messageMap['form.title.verify'] || 'Property Form',
          newPropertyFormTitle: messageMap['form.title.new'] || 'New Property Form',
          floorDetailsSubtitle: messageMap['floor.details.subtitle'] || 'Floor Details',
          
          // Button labels
          previousText: messageMap['btn.previous'] || 'Previous',
          saveDraftText: messageMap['btn.save.draft'] || 'Save Draft',
          addFloorText: messageMap['btn.add.floor'] || 'Add Floor',
          submitText: messageMap['btn.submit'] || 'Submit',
          verifyText: messageMap['btn.verify'] || 'Verify',
          deleteText: messageMap['delete.text'] || 'Delete',
          
          // Form field labels
          floorNumberLabel: messageMap['field.floorNumber'] || 'Floor Number',
          buildingClassificationLabel: messageMap['field.buildingClassification'] || 'Building Classification',
          igrsClassificationLabel: messageMap['field.igrsClassification'] || 'IGRS Classification',
          natureOfUsageLabel: messageMap['field.natureOfUsage'] || 'Nature of Usage',
          firmNameLabel: messageMap['field.firmName'] || 'Firm Name',
          occupancyLabel: messageMap['field.occupancy'] || 'Occupancy',
          occupantNameLabel: messageMap['field.occupantName'] || 'Occupant Name',
          constructionDateLabel: messageMap['field.constructionDate'] || 'Construction Date',
          effectiveFromDateLabel: messageMap['field.effectiveFromDate'] || 'Effective From Date',
          unstructuredLandLabel: messageMap['field.unstructuredLand'] || 'Unstructured Land',
          lengthLabel: messageMap['field.length'] || 'Length',
          breadthLabel: messageMap['field.breadth'] || 'Breadth',
          plinthAreaLabel: messageMap['field.plinthArea'] || 'Plinth Area',
          buildingPermissionNoLabel: messageMap['field.buildingPermissionNo'] || 'Building Permission No',
          floorsDetailsEnteredLabel: messageMap['field.floorsDetailsEntered'] || 'Floors Details Entered',
          
          // Checkbox texts
          cloneFloorText: messageMap['checkbox.clone.floor'] || 'Clone Floor',
          selectSameFieldsText: messageMap['checkbox.select.same.fields'] || 'Select Same Fields',
          
          // Messages
          addFloorRequiredMsg: messageMap['error.add.floor.required'] || 'Please add floor details',
          atLeastOneFloorMsg: messageMap['error.at.least.one.floor'] || 'At least one floor is required',
          
          // Error messages
          floorNumberRequiredError: messageMap['validation.floorNumber'] || 'Floor Number is required',
          buildingClassificationRequiredError: messageMap['validation.buildingClassification'] || 'Building Classification is required',
          igrsClassificationRequiredError: messageMap['validation.igrsClassification'] || 'IGRS Classification is required',
          natureOfUsageRequiredError: messageMap['validation.natureOfUsage'] || 'Nature of Usage is required',
          firmNameRequiredError: messageMap['validation.firmName'] || 'Firm Name is required',
          occupancyRequiredError: messageMap['validation.occupancy'] || 'Occupancy is required',
          constructionDateRequiredError: messageMap['validation.constructionDate'] || 'Construction Date is required',
          effectiveFromDateRequiredError: messageMap['validation.effectiveFromDate'] || 'Effective From Date is required',
          unstructuredLandRequiredError: messageMap['validation.unstructuredLand'] || 'Unstructured Land is required',
          lengthRequiredError: messageMap['validation.length'] || 'Length is required',
          breadthRequiredError: messageMap['validation.breadth'] || 'Breadth is required',
          plinthAreaRequiredError: messageMap['validation.plinthArea'] || 'Plinth Area is required',
          floorsDetailsEnteredRequiredError: messageMap['validation.floorsDetailsEntered'] || 'Please tick Floors Details entered',
          
          // Select placeholder
          selectPlaceholder: messageMap['select.placeholder'] || 'Select',
          
          // Floor card text
          floorText: messageMap['floor.label'] || 'Floor',
          classificationText: messageMap['classification.text'] || 'Classification',
          usageText: messageMap['usage.text'] || 'Usage',
          measurementUnitLabel: messageMap['measurement.unit.label'] || 'Measurement Unit',
          sqftLabel: messageMap['sqft.label'] || 'Square Feet',
          metersLabel: messageMap['meters.label'] || 'Meters',
          
          // Dropdown options
          floorNumberOptions: [
            messageMap['dropdown.floorNumber.1'] || '1',
            messageMap['dropdown.floorNumber.2'] || '2',
            messageMap['dropdown.floorNumber.3'] || '3',
            messageMap['dropdown.floorNumber.4'] || '4',
            messageMap['dropdown.floorNumber.5'] || '5'
          ],
          buildingClassificationOptions: [
            messageMap['dropdown.buildingClassification.bc-0'] || 'BC-0',
            messageMap['dropdown.buildingClassification.bc-1'] || 'BC-1',
            messageMap['dropdown.buildingClassification.bc-2'] || 'BC-2',
            messageMap['dropdown.buildingClassification.bc-3'] || 'BC-3',
            messageMap['dropdown.buildingClassification.bc-4'] || 'BC-4',
            messageMap['dropdown.buildingClassification.bc-5'] || 'BC-5',
            messageMap['dropdown.buildingClassification.bc-6'] || 'BC-6',
            messageMap['dropdown.buildingClassification.bc-7'] || 'BC-7',
            messageMap['dropdown.buildingClassification.bc-8'] || 'BC-8',
            messageMap['dropdown.buildingClassification.bc-9'] || 'BC-9',
            messageMap['dropdown.buildingClassification.bc-10'] || 'BC-10'
          ],
          igrsClassificationOptions: [
            messageMap['dropdown.igrsClassification.1'] || 'Type 1',
            messageMap['dropdown.igrsClassification.2'] || 'Type 2',
            messageMap['dropdown.igrsClassification.3'] || 'Type 3'
          ],
          natureOfUsageOptions: [
            messageMap['dropdown.natureOfUsage.1'] || 'Residential',
            messageMap['dropdown.natureOfUsage.2'] || 'Commercial'
          ],
          occupancyOptions: [
            messageMap['dropdown.occupancy.1'] || 'Owner',
            messageMap['dropdown.occupancy.2'] || 'Tenant'
          ],
          occupantNameOptions: [
            messageMap['dropdown.occupantName.1'] || 'Name 1',
            messageMap['dropdown.occupantName.2'] || 'Name 2',
            messageMap['dropdown.occupantName.3'] || 'Name 3',
            messageMap['dropdown.occupantName.4'] || 'Name 4',
            messageMap['dropdown.occupantName.5'] || 'Name 5'
          ],
          unstructuredLandOptions: [
            messageMap['dropdown.unstructuredLand.1'] || 'Yes',
            messageMap['dropdown.unstructuredLand.2'] || 'No'
          ],
          lengthOptions: [
            messageMap['dropdown.length.1'] || '1',
            messageMap['dropdown.length.2'] || '2',
            messageMap['dropdown.length.3'] || '3',
            messageMap['dropdown.length.4'] || '4',
            messageMap['dropdown.length.5'] || '5'
          ],
          breadthOptions: [
            messageMap['dropdown.breadth.1'] || '1',
            messageMap['dropdown.breadth.2'] || '2',
            messageMap['dropdown.breadth.3'] || '3',
            messageMap['dropdown.breadth.4'] || '4',
            messageMap['dropdown.breadth.5'] || '5'
          ],
          plinthAreaOptions: [
            messageMap['dropdown.plinthArea.1'] || '1',
            messageMap['dropdown.plinthArea.2'] || '2',
            messageMap['dropdown.plinthArea.3'] || '3',
            messageMap['dropdown.plinthArea.4'] || '4',
            messageMap['dropdown.plinthArea.5'] || '5'
          ],
          buildingPermissionNoOptions: [
            messageMap['dropdown.buildingPermissionNo.1'] || '1',
            messageMap['dropdown.buildingPermissionNo.2'] || '2',
            messageMap['dropdown.buildingPermissionNo.3'] || '3',
            messageMap['dropdown.buildingPermissionNo.4'] || '4',
            messageMap['dropdown.buildingPermissionNo.5'] || '5'
          ],
          floorTypeOptions: [
            messageMap['dropdown.floorType.1'] || 'Type 1',
            messageMap['dropdown.floorType.2'] || 'Type 2',
            messageMap['dropdown.floorType.3'] || 'Type 3',
            messageMap['dropdown.floorType.4'] || 'Type 4',
            messageMap['dropdown.floorType.5'] || 'Type 5'
          ],
          roofTypeOptions: [
            messageMap['dropdown.roofType.1'] || 'Type 1',
            messageMap['dropdown.roofType.2'] || 'Type 2',
            messageMap['dropdown.roofType.3'] || 'Type 3',
            messageMap['dropdown.roofType.4'] || 'Type 4',
            messageMap['dropdown.roofType.5'] || 'Type 5'
          ],
          wallTypeOptions: [
            messageMap['dropdown.wallType.1'] || 'Type 1',
            messageMap['dropdown.wallType.2'] || 'Type 2',
            messageMap['dropdown.wallType.3'] || 'Type 3',
            messageMap['dropdown.wallType.4'] || 'Type 4',
            messageMap['dropdown.wallType.5'] || 'Type 5'
          ],
          woodTypeOptions: [
            messageMap['dropdown.woodType.1'] || 'Type 1',
            messageMap['dropdown.woodType.2'] || 'Type 2',
            messageMap['dropdown.woodType.3'] || 'Type 3',
            messageMap['dropdown.woodType.4'] || 'Type 4',
            messageMap['dropdown.woodType.5'] || 'Type 5'
          ],
          isgrOptions: [
            messageMap['dropdown.isgr.lifts'] || 'Lifts',
            messageMap['dropdown.isgr.toilet'] || 'Toilet',
            messageMap['dropdown.isgr.watertap'] || 'Water Tap',
            messageMap['dropdown.isgr.cableConnection'] || 'Cable Connection',
            messageMap['dropdown.isgr.electricity'] || 'Electricity',
            messageMap['dropdown.isgr.attachedBathroom'] || 'Attached Bathroom',
            messageMap['dropdown.isgr.waterHarvesting'] || 'Water Harvesting'
          ]
        });
      }
    } catch (error) {
      console.error('[FloorDetailsLocalization] Error fetching localized texts:', error);
      // If API fails, keep using the default English texts from initial state
      console.warn('[FloorDetailsLocalization] Using default texts due to API error');
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