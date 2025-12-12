import { useState, useEffect } from 'react';

interface LocalizationMessage {
  uuid?: string;
  code: string;
  message: string;
  module?: string;
  locale?: string;
}

interface LocalizationResponse {
  messages: LocalizationMessage[];
}

// Basic typed shape of texts that the floor page needs
interface FloorLocalizedTexts {
  floorDetailsSubtitle: string;
  previousText: string;
  saveDraftText: string;
  addFloorButtonText: string;
  cloneFloorText: string;
  selectFieldsRemainSameText: string;
  addFloorValidationError: string;
  addAtLeastOneFloorError: string;
  deleteText: string;
  floorLabel: string;
  field_floorNumber: string;
  field_buildingClassification: string;
  field_igrsClassification: string;
  field_natureOfUsage: string;
  field_firmName: string;
  field_occupancy: string;
  field_occupantName: string;
  field_constructionDate: string;
  field_effectiveFromDate: string;
  field_unstructuredLand: string;
  field_length: string;
  field_breadth: string;
  field_plinthArea: string;
  field_buildingPermissionNo: string;
  field_floorsDetailsEntered: string;
  validation_floorNumber: string;
  validation_buildingClassification: string;
  validation_igrsClassification: string;
  validation_natureOfUsage: string;
  validation_firmName: string;
  validation_occupancy: string;
  validation_constructionDate: string;
  validation_effectiveFromDate: string;
  validation_unstructuredLand: string;
  validation_length: string;
  validation_breadth: string;
  validation_plinthArea: string;
  validation_floorsDetailsEntered: string;
}

const defaultEn: FloorLocalizedTexts = {
  floorDetailsSubtitle: 'Floor details',
  previousText: 'Previous',
  saveDraftText: 'Save Draft',
  addFloorButtonText: '+ Add Floor',
  cloneFloorText: 'Clone floor',
  selectFieldsRemainSameText: 'Select fields that remain the same',
  addFloorValidationError: 'Please fill all required fields before adding floor.',
  addAtLeastOneFloorError: 'Please add at least one floor before continuing.',
  deleteText: 'Delete',
  floorLabel: 'Floor',
  field_floorNumber: 'Floor Number',
  field_buildingClassification: 'Classification of Building',
  field_igrsClassification: 'IGRS Classification',
  field_natureOfUsage: 'Nature of Usage',
  field_firmName: 'Firm Name',
  field_occupancy: 'Occupancy',
  field_occupantName: 'Occupant Name',
  field_constructionDate: 'Construction Date',
  field_effectiveFromDate: 'Effective From Date',
  field_unstructuredLand: 'Unstructured land',
  field_length: 'Length (Ft)',
  field_breadth: 'Breadth (Ft)',
  field_plinthArea: 'Plinth Area (Sq.Ft)',
  field_buildingPermissionNo: 'Building Permission no',
  field_floorsDetailsEntered: 'Floors Details entered',
  validation_floorNumber: 'Floor Number is required',
  validation_buildingClassification: 'Building Classification is required',
  validation_igrsClassification: 'IGRS Classification is required',
  validation_natureOfUsage: 'Nature of Usage is required',
  validation_firmName: 'Firm Name is required',
  validation_occupancy: 'Occupancy is required',
  validation_constructionDate: 'Construction Date is required',
  validation_effectiveFromDate: 'Effective From Date is required',
  validation_unstructuredLand: 'Unstructured Land is required',
  validation_length: 'Length is required',
  validation_breadth: 'Breadth is required',
  validation_plinthArea: 'Plinth Area is required',
  validation_floorsDetailsEntered: 'Please tick Floors Details entered'
};

const defaultHi: Partial<FloorLocalizedTexts> = {
  floorDetailsSubtitle: 'मंजिल विवरण',
  previousText: 'पहले',
  saveDraftText: 'ड्राफ्ट सहेजें',
  addFloorButtonText: '+ मंजिल जोड़ें',
  cloneFloorText: 'मंजिल क्लोन करें',
  selectFieldsRemainSameText: 'वे फ़ील्ड चुनें जो समान रहें',
  addFloorValidationError: 'कृपया मंजिल जोड़ने से पहले सभी आवश्यक फ़ील्ड भरें।',
  addAtLeastOneFloorError: 'कृपया जारी रखने से पहले कम से कम एक मंजिल जोड़ें।',
  deleteText: 'हटाएँ',
  floorLabel: 'मंजिल',
  field_floorNumber: 'मंजिल संख्या',
  field_buildingClassification: 'भवन का वर्गीकरण',
  field_igrsClassification: 'IGRS वर्गीकरण',
  field_natureOfUsage: 'उपयोग की प्रकृति',
  field_firmName: 'फर्म का नाम',
  field_occupancy: 'कब्जा',
  field_occupantName: 'कब्जाधारी का नाम',
  field_constructionDate: 'निर्माण तिथि',
  field_effectiveFromDate: 'प्रभावी तिथि से',
  field_unstructuredLand: 'असंरचित भूमि',
  field_length: 'लंबाई (फुट)',
  field_breadth: 'चौड़ाई (फुट)',
  field_plinthArea: 'प्लिंथ क्षेत्र (वर्ग फुट)',
  field_buildingPermissionNo: 'भवन अनुमति संख्या',
  field_floorsDetailsEntered: 'मंजिल विवरण दर्ज किया गया',
  validation_floorNumber: 'मंजिल संख्या आवश्यक है',
  validation_buildingClassification: 'भवन वर्गीकरण आवश्यक है',
  validation_igrsClassification: 'IGRS वर्गीकरण आवश्यक है',
  validation_natureOfUsage: 'उपयोग की प्रकृति आवश्यक है',
  validation_firmName: 'फ़र्म का नाम आवश्यक है',
  validation_occupancy: 'कब्जा आवश्यक है',
  validation_constructionDate: 'निर्माण तिथि आवश्यक है',
  validation_effectiveFromDate: 'प्रभावी तिथि आवश्यक है',
  validation_unstructuredLand: 'अनस्ट्रक्चर्ड भूमि आवश्यक है',
  validation_length: 'लंबाई आवश्यक है',
  validation_breadth: 'चौड़ाई आवश्यक है',
  validation_plinthArea: 'प्लिंथ क्षेत्र आवश्यक है',
  validation_floorsDetailsEntered: 'कृपया फ़्लोर विवरण दर्ज करने की पुष्टि करें'
};

const messageCodes = [
  'floor.details.subtitle','btn.previous','btn.save.draft','btn.add.floor','checkbox.clone.floor','checkbox.select.same.fields','error.add.floor.required','error.at.least.one.floor',
  'delete.text','floor.label',
  'validation.floorNumber','validation.buildingClassification','validation.igrsClassification','validation.natureOfUsage','validation.firmName','validation.occupancy','validation.constructionDate','validation.effectiveFromDate','validation.unstructuredLand','validation.length','validation.breadth','validation.plinthArea','validation.floorsDetailsEntered',
  'field.floorNumber','field.buildingClassification','field.igrsClassification','field.natureOfUsage','field.firmName','field.occupancy','field.occupantName','field.constructionDate','field.effectiveFromDate','field.unstructuredLand','field.length','field.breadth','field.plinthArea','field.buildingPermissionNo','field.floorsDetailsEntered'
];

export const useFloorLocalization = () => {
  const [locale, setLocale] = useState<string>('en');
  const [texts, setTexts] = useState<FloorLocalizedTexts>(defaultEn);

  const fetchLocalizedTexts = async (newLocale: string) => {
    try {
      const codesParam = messageCodes.join(',');
      const url = `${import.meta.env.VITE_LOCALIZATION_HOST}/localization/v1/messages?module=common&locale=${newLocale}&codes=${codesParam}`;
  const res = await fetch(url, { headers: { 'X-Tenant-ID': 'pg' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: LocalizationResponse = await res.json();
      const map: Record<string, string> = {};
      data.messages.forEach(m => { if (m.code && m.message) map[m.code] = m.message; });

      // Merge fetched values into the texts shape using keys
      setTexts({
        floorDetailsSubtitle: map['floor.details.subtitle'] || (newLocale === 'hi' ? defaultHi.floorDetailsSubtitle! : defaultEn.floorDetailsSubtitle),
        previousText: map['btn.previous'] || (newLocale === 'hi' ? defaultHi.previousText! : defaultEn.previousText),
        saveDraftText: map['btn.save.draft'] || (newLocale === 'hi' ? defaultHi.saveDraftText! : defaultEn.saveDraftText),
        addFloorButtonText: map['btn.add.floor'] || (newLocale === 'hi' ? defaultHi.addFloorButtonText! : defaultEn.addFloorButtonText),
        cloneFloorText: map['checkbox.clone.floor'] || (newLocale === 'hi' ? defaultHi.cloneFloorText! : defaultEn.cloneFloorText),
        selectFieldsRemainSameText: map['checkbox.select.same.fields'] || (newLocale === 'hi' ? defaultHi.selectFieldsRemainSameText! : defaultEn.selectFieldsRemainSameText),
        addFloorValidationError: map['error.add.floor.required'] || (newLocale === 'hi' ? defaultHi.addFloorValidationError! : defaultEn.addFloorValidationError),
        addAtLeastOneFloorError: map['error.at.least.one.floor'] || (newLocale === 'hi' ? defaultHi.addAtLeastOneFloorError! : defaultEn.addAtLeastOneFloorError),
        deleteText: map['delete.text'] || (newLocale === 'hi' ? defaultHi.deleteText! : defaultEn.deleteText),
        floorLabel: map['floor.label'] || (newLocale === 'hi' ? defaultHi.floorLabel! : defaultEn.floorLabel),
        field_floorNumber: map['field.floorNumber'] || (newLocale === 'hi' ? defaultHi.field_floorNumber! : defaultEn.field_floorNumber),
        field_buildingClassification: map['field.buildingClassification'] || (newLocale === 'hi' ? defaultHi.field_buildingClassification! : defaultEn.field_buildingClassification),
        field_igrsClassification: map['field.igrsClassification'] || (newLocale === 'hi' ? defaultHi.field_igrsClassification! : defaultEn.field_igrsClassification),
        field_natureOfUsage: map['field.natureOfUsage'] || (newLocale === 'hi' ? defaultHi.field_natureOfUsage! : defaultEn.field_natureOfUsage),
        field_firmName: map['field.firmName'] || (newLocale === 'hi' ? defaultHi.field_firmName! : defaultEn.field_firmName),
        field_occupancy: map['field.occupancy'] || (newLocale === 'hi' ? defaultHi.field_occupancy! : defaultEn.field_occupancy),
        field_occupantName: map['field.occupantName'] || (newLocale === 'hi' ? defaultHi.field_occupantName! : defaultEn.field_occupantName),
        field_constructionDate: map['field.constructionDate'] || (newLocale === 'hi' ? defaultHi.field_constructionDate! : defaultEn.field_constructionDate),
        field_effectiveFromDate: map['field.effectiveFromDate'] || (newLocale === 'hi' ? defaultHi.field_effectiveFromDate! : defaultEn.field_effectiveFromDate),
        field_unstructuredLand: map['field.unstructuredLand'] || (newLocale === 'hi' ? defaultHi.field_unstructuredLand! : defaultEn.field_unstructuredLand),
        field_length: map['field.length'] || (newLocale === 'hi' ? defaultHi.field_length! : defaultEn.field_length),
        field_breadth: map['field.breadth'] || (newLocale === 'hi' ? defaultHi.field_breadth! : defaultEn.field_breadth),
        field_plinthArea: map['field.plinthArea'] || (newLocale === 'hi' ? defaultHi.field_plinthArea! : defaultEn.field_plinthArea),
        field_buildingPermissionNo: map['field.buildingPermissionNo'] || (newLocale === 'hi' ? defaultHi.field_buildingPermissionNo! : defaultEn.field_buildingPermissionNo),
        field_floorsDetailsEntered: map['field.floorsDetailsEntered'] || (newLocale === 'hi' ? defaultHi.field_floorsDetailsEntered! : defaultEn.field_floorsDetailsEntered),
        validation_floorNumber: map['validation.floorNumber'] || (newLocale === 'hi' ? defaultHi.validation_floorNumber! : defaultEn.validation_floorNumber),
        validation_buildingClassification: map['validation.buildingClassification'] || (newLocale === 'hi' ? defaultHi.validation_buildingClassification! : defaultEn.validation_buildingClassification),
        validation_igrsClassification: map['validation.igrsClassification'] || (newLocale === 'hi' ? defaultHi.validation_igrsClassification! : defaultEn.validation_igrsClassification),
        validation_natureOfUsage: map['validation.natureOfUsage'] || (newLocale === 'hi' ? defaultHi.validation_natureOfUsage! : defaultEn.validation_natureOfUsage),
        validation_firmName: map['validation.firmName'] || (newLocale === 'hi' ? defaultHi.validation_firmName! : defaultEn.validation_firmName),
        validation_occupancy: map['validation.occupancy'] || (newLocale === 'hi' ? defaultHi.validation_occupancy! : defaultEn.validation_occupancy),
        validation_constructionDate: map['validation.constructionDate'] || (newLocale === 'hi' ? defaultHi.validation_constructionDate! : defaultEn.validation_constructionDate),
        validation_effectiveFromDate: map['validation.effectiveFromDate'] || (newLocale === 'hi' ? defaultHi.validation_effectiveFromDate! : defaultEn.validation_effectiveFromDate),
        validation_unstructuredLand: map['validation.unstructuredLand'] || (newLocale === 'hi' ? defaultHi.validation_unstructuredLand! : defaultEn.validation_unstructuredLand),
        validation_length: map['validation.length'] || (newLocale === 'hi' ? defaultHi.validation_length! : defaultEn.validation_length),
        validation_breadth: map['validation.breadth'] || (newLocale === 'hi' ? defaultHi.validation_breadth! : defaultEn.validation_breadth),
        validation_plinthArea: map['validation.plinthArea'] || (newLocale === 'hi' ? defaultHi.validation_plinthArea! : defaultEn.validation_plinthArea),
        validation_floorsDetailsEntered: map['validation.floorsDetailsEntered'] || (newLocale === 'hi' ? defaultHi.validation_floorsDetailsEntered! : defaultEn.validation_floorsDetailsEntered)
      });
    } catch (err) {
      console.error('Failed to fetch floor localization', err);
      // fallback to defaults (already set) — if hi requested, try to merge defaults
      if (newLocale === 'hi') setTexts(prev => ({ ...prev, ...defaultHi } as FloorLocalizedTexts));
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

  useEffect(() => {
    fetchLocalizedTexts(locale);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ...texts, toggleLanguage, setLanguage, locale } as const;
};

export const floorLocalizationMessagesHi = {
  messages: [
    { code: 'floor.details.subtitle', message: 'मंजिल विवरण', module: 'common', locale: 'hi' },
    { code: 'btn.previous', message: 'पहले', module: 'common', locale: 'hi' },
    { code: 'btn.save.draft', message: 'ड्राफ्ट सहेजें', module: 'common', locale: 'hi' },
    { code: 'btn.add.floor', message: '+ मंजिल जोड़ें', module: 'common', locale: 'hi' },
    { code: 'checkbox.clone.floor', message: 'मंजिल क्लोन करें', module: 'common', locale: 'hi' },
    { code: 'checkbox.select.same.fields', message: 'वे फ़ील्ड चुनें जो समान रहें', module: 'common', locale: 'hi' },
    { code: 'error.add.floor.required', message: 'कृपया मंजिल जोड़ने से पहले सभी आवश्यक फ़ील्ड भरें।', module: 'common', locale: 'hi' },
    { code: 'error.at.least.one.floor', message: 'कृपया जारी रखने से पहले कम से कम एक मंजिल जोड़ें।', module: 'common', locale: 'hi' },
    { code: 'delete.text', message: 'हटाएँ', module: 'common', locale: 'hi' },
    { code: 'floor.label', message: 'मंजिल', module: 'common', locale: 'hi' },
    { code: 'field.floorNumber', message: 'मंजिल संख्या', module: 'common', locale: 'hi' },
    { code: 'field.buildingClassification', message: 'भवन का वर्गीकरण', module: 'common', locale: 'hi' },
    { code: 'field.igrsClassification', message: 'IGRS वर्गीकरण', module: 'common', locale: 'hi' },
    { code: 'field.natureOfUsage', message: 'उपयोग की प्रकृति', module: 'common', locale: 'hi' },
    { code: 'field.firmName', message: 'फर्म का नाम', module: 'common', locale: 'hi' },
    { code: 'field.occupancy', message: 'कब्जा', module: 'common', locale: 'hi' },
    { code: 'field.occupantName', message: 'कब्जाधारी का नाम', module: 'common', locale: 'hi' },
    { code: 'field.constructionDate', message: 'निर्माण तिथि', module: 'common', locale: 'hi' },
    { code: 'field.effectiveFromDate', message: 'प्रभावी तिथि से', module: 'common', locale: 'hi' },
    { code: 'field.unstructuredLand', message: 'असंरचित भूमि', module: 'common', locale: 'hi' },
    { code: 'field.length', message: 'लंबाई (फुट)', module: 'common', locale: 'hi' },
    { code: 'field.breadth', message: 'चौड़ाई (फुट)', module: 'common', locale: 'hi' },
    { code: 'field.plinthArea', message: 'प्लिंथ क्षेत्र (वर्ग फुट)', module: 'common', locale: 'hi' },
    { code: 'field.buildingPermissionNo', message: 'भवन अनुमति संख्या', module: 'common', locale: 'hi' },
    { code: 'field.floorsDetailsEntered', message: 'मंजिल विवरण दर्ज किया गया', module: 'common', locale: 'hi' },
    { code: 'validation.floorNumber', message: 'मंजिल संख्या आवश्यक है', module: 'common', locale: 'hi' },
    { code: 'validation.buildingClassification', message: 'भवन वर्गीकरण आवश्यक है', module: 'common', locale: 'hi' },
    { code: 'validation.igrsClassification', message: 'IGRS वर्गीकरण आवश्यक है', module: 'common', locale: 'hi' },
    { code: 'validation.natureOfUsage', message: 'उपयोग की प्रकृति आवश्यक है', module: 'common', locale: 'hi' },
    { code: 'validation.firmName', message: 'फ़र्म का नाम आवश्यक है', module: 'common', locale: 'hi' },
    { code: 'validation.occupancy', message: 'कब्जा आवश्यक है', module: 'common', locale: 'hi' },
    { code: 'validation.constructionDate', message: 'निर्माण तिथि आवश्यक है', module: 'common', locale: 'hi' },
    { code: 'validation.effectiveFromDate', message: 'प्रभावी तिथि आवश्यक है', module: 'common', locale: 'hi' },
    { code: 'validation.unstructuredLand', message: 'अनस्ट्रक्चर्ड भूमि आवश्यक है', module: 'common', locale: 'hi' },
    { code: 'validation.length', message: 'लंबाई आवश्यक है', module: 'common', locale: 'hi' },
    { code: 'validation.breadth', message: 'चौड़ाई आवश्यक है', module: 'common', locale: 'hi' },
    { code: 'validation.plinthArea', message: 'प्लिंथ क्षेत्र आवश्यक है', module: 'common', locale: 'hi' },
    { code: 'validation.floorsDetailsEntered', message: 'कृपया फ़्लोर विवरण दर्ज करने की पुष्टि करें', module: 'common', locale: 'hi' }
  ]
};

export default useFloorLocalization;
