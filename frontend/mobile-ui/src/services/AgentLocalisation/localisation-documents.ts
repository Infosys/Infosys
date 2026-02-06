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

interface DocumentsLocalizedTexts {
  propertyFormTitle: string;
  newPropertyFormTitle: string;
  documentsSubtitle: string;

  previousText: string;
  saveDraftText: string;
  verifyText: string;
  submitText: string;

  documentTypeLabel: string;
  serialNoLabel: string;
  constructionDateLabel: string;
  mroProceedingNumberLabel: string;
  mroProceedingDateLabel: string;
  courtNameLabel: string;

  revenueDocumentNumber: string;

  testatorWitnessesSignedLabel: string;

  enterNumberPlaceholder: string;
  enterNamePlaceholder: string;

  saveDraftSuccessMsg: string;

  // validation messages
  validationDocumentTypeRequired: string;
  validationNoRequired: string;
  validationNoNumeric: string;
  validationConstructionDateRequired: string;
  validationMroProceedingNumberRequired: string;
  validationMroProceedingNumberNumeric: string;
  validationMroProceedingDateRequired: string;
  validationCourtNameRequired: string;
  validationCourtNameAlpha: string;

  // dropdowns
  documentTypeOptions: string[];

  // select placeholder
  selectPlaceholder: string;

  nextButtonText: string;
}

export const useDocumentsLocalization = () => {
  const { locale } = useLanguage();
  
  const [texts, setTexts] = useState<DocumentsLocalizedTexts>({
    propertyFormTitle: 'Property Form',
    newPropertyFormTitle: 'New Property Form',
    documentsSubtitle: 'Documents',

    previousText: 'Previous',
    saveDraftText: 'Save Draft',
    verifyText: 'Verify',
    submitText: 'Submit',

    documentTypeLabel: 'Document Type',
    serialNoLabel: 'Serial No',
    constructionDateLabel: 'Construction Date',
    mroProceedingNumberLabel: 'MRO Proceeding Number',
    mroProceedingDateLabel: 'MRO Proceeding Date',
    courtNameLabel: 'Court Name',
    testatorWitnessesSignedLabel: 'Testator and Two Witnesses Signed',

    revenueDocumentNumber: 'Revenue Document Number',

    enterNumberPlaceholder: 'Enter Number',
    enterNamePlaceholder: 'Enter Name',

    saveDraftSuccessMsg: 'Draft saved!',

  // validation defaults
  validationDocumentTypeRequired: 'Document Type is required',
  validationNoRequired: 'No is required',
  validationNoNumeric: 'No must contain only numbers',
  validationConstructionDateRequired: 'Construction Date is required',
  validationMroProceedingNumberRequired: 'MRO Proceeding Number is required',
  validationMroProceedingNumberNumeric: 'MRO Proceeding Number must contain only numbers',
  validationMroProceedingDateRequired: 'MRO Proceeding Date is required',
  validationCourtNameRequired: 'Court Name is required',
  validationCourtNameAlpha: 'Court Name must contain only alphabets',

    documentTypeOptions: ['Type 1', 'Type 2', 'Type 3', 'Type 4', 'Type 5', 'Type 6'],

    selectPlaceholder: 'Select',
    nextButtonText: 'Next'
  });

  const messageCodes = [
    'form.title.verify',
    'form.title.new',
    'document.title',
    'btn.back',
    'btn.save.draft',
    'btn.verify',
    'btn.submit',
    'btn.submit',

    'document.fields.document.type',
    'document.fields.number',
    'document.fields.construction.date',
    'document.fields.mro.proceeding.number',
    'document.fields.mro.proceeding.date',
    'document.fields.court.name',
    'document.fields.testator.witnesses.signed',

    'placeholder.enter.number',
    'placeholder.enter.name',
    'save.draft.success',
    'select.placeholder',

  //validation msgs
  'validation.document.documentType.required',
  'validation.document.no.required',
  'validation.document.no.numeric',
  'validation.document.constructionDate.required',
  'validation.document.mroProceedingNumber.required',
  'validation.document.mroProceedingNumber.numeric',
  'validation.document.mroProceedingDate.required',
  'validation.document.courtName.required',
  'validation.document.courtName.alpha',
 
    // document type dropdown keys
    'dropdown.documentType.1','dropdown.documentType.2','dropdown.documentType.3','dropdown.documentType.4','dropdown.documentType.5','dropdown.documentType.6'
  ];

  // Load default document type options and other defaults from local JSON on mount
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const [docTypes] = await Promise.all([
          JsonService.getDocumentTypes()
        ]);

        if (!mounted) return;

        setTexts(prev => ({
          ...prev,
          documentTypeOptions: (docTypes || []).map((d: any) => d.label ?? d.name ?? String(d.code ?? d.id))
        }));
      } catch (e) {
        console.warn('[DocumentsLocalization] could not load defaults from JSON', e);
      }
    })();

    return () => { mounted = false; };
  }, []);
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
        const messageMap: Record<string, string> = {};
        data.messages.forEach(msg => { messageMap[msg.code] = msg.message; });
        setTexts({
          propertyFormTitle: messageMap['form.title.verify'] || 'Property Form',
          newPropertyFormTitle: messageMap['form.title.new'] || 'New Property Form',
          documentsSubtitle: messageMap['document.title'] || 'Documents',

          previousText: messageMap['btn.back'] || 'Previous',
          saveDraftText: messageMap['btn.save.draft'] || 'Save Draft',
          verifyText: messageMap['btn.verify'] || 'Verify',
          submitText: messageMap['btn.submit'] || 'Submit',

          documentTypeLabel: messageMap['document.fields.document.type'] || 'Document Type',
          serialNoLabel: messageMap['document.fields.serial.number'] || 'Serial No',
          constructionDateLabel: messageMap['document.fields.construction.date'] || 'Construction Date',
          mroProceedingNumberLabel: messageMap['document.fields.mro.proceeding.number'] || 'MRO Proceeding Number',
          mroProceedingDateLabel: messageMap['document.fields.mro.proceeding.date'] || 'MRO Proceeding Date',
          courtNameLabel: messageMap['document.fields.court.name'] || 'Court Name',
          revenueDocumentNumber: messageMap['document.fields.revenue.document.number'] || 'Revenue Document Number',

          testatorWitnessesSignedLabel: messageMap['document.fields.testator.witnesses.signed'] || 'Testator and Two Witnesses Signed',

          enterNumberPlaceholder: messageMap['placeholder.enter.number'] || 'Enter Number',
          enterNamePlaceholder: messageMap['placeholder.enter.name'] || 'Enter Name',

          saveDraftSuccessMsg: messageMap['save.draft.success'] || 'Draft saved!',

          selectPlaceholder: messageMap['select.placeholder'] || 'Select',

          nextButtonText: messageMap['btn.next'] || 'Next',

          documentTypeOptions: [
            messageMap['dropdown.documentType.1'] || 'Type 1',
            messageMap['dropdown.documentType.2'] || 'Type 2',
            messageMap['dropdown.documentType.3'] || 'Type 3',
            messageMap['dropdown.documentType.4'] || 'Type 4',
            messageMap['dropdown.documentType.5'] || 'Type 5',
            messageMap['dropdown.documentType.6'] || 'Type 6'
          ],

          // validation messages
          validationDocumentTypeRequired: messageMap['validation.document.documentType.required'] || 'Document Type is required',
          validationNoRequired: messageMap['validation.document.no.required'] || 'No is required',
          validationNoNumeric: messageMap['validation.document.no.numeric'] || 'No must contain only numbers',
          validationConstructionDateRequired: messageMap['validation.document.constructionDate.required'] || 'Construction Date is required',
          validationMroProceedingNumberRequired: messageMap['validation.document.mroProceedingNumber.required'] || 'MRO Proceeding Number is required',
          validationMroProceedingNumberNumeric: messageMap['validation.document.mroProceedingNumber.numeric'] || 'MRO Proceeding Number must contain only numbers',
          validationMroProceedingDateRequired: messageMap['validation.document.mroProceedingDate.required'] || 'MRO Proceeding Date is required',
          validationCourtNameRequired: messageMap['validation.document.courtName.required'] || 'Court Name is required',
          validationCourtNameAlpha: messageMap['validation.document.courtName.alpha'] || 'Court Name must contain only alphabets',
        });
      }
    } catch (error) {
      console.error('[DocumentsLocalization] Error fetching localized texts:', error);
      console.warn('[DocumentsLocalization] Using default texts due to API error');
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

export default useDocumentsLocalization;