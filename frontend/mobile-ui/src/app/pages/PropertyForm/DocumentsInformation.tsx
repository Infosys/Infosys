// DocumentsInformation.tsx
// Property Form Documents Information page
// Collects and manages document details for a property (type, serial number, revenue document number)
// Features:
//   - Form for entering document information using dropdowns and text fields
//   - Fetches and updates document info via RTK Query
//   - Uses localization for labels, dropdown options, and error messages
//   - Handles form validation, error popups, and draft saving
//   - Responsive UI with MUI components and custom dropdowns
// Used in: Property form workflow for document information step
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { useFormMode } from '../../../context/FormModeContext';
import { usePropertyForm } from '../../../context/PropertyFormContext';
import { useDocumentsLocalization } from '../../../services/AgentLocalisation/localisation-documents';
import StepHeader from '../../features/Agent/components/StepHeader';
import { useLocalization } from '../../../services/AgentLocalisation/formLocalisation';
import CustomDropdown, {
  type DropdownOption,
} from '../../features/PropertyForm/components/IGRSDetail/IGRSdropdown';
import FormTextField from '../../features/PropertyForm/components/IGRSDetail/IGRSFormTextFiled';
import { uniformInputSx, verifyButtonSx } from './styles/sharedStyles';
import type { AlertType } from '../../models/AlertType.model';
import {
  useCreateDocumentInfoMutation,
  useGetDocumentInfoByPropertyIdQuery,
  useUpdateDocumentInfoMutation,
} from '../../features/PropertyForm/api/documentInfo.api';
import { NotificationPopup } from '../../components/Popup/NotificationPopup';
import JsonService from '../../../services/jsonServerApiCalls';

// ApiError: interface for API error responses
interface ApiError {
  data?: {
    errors?: string[];
    message?: string;
  };
  message?: string;
}

// Inline styles for layout and UI
const containerSx = {
  width: '100%',
  margin: '0 auto',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column' as const,
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  bgcolor: '#fff',
};

const headerSx = {
  backgroundColor: '#F9E6E0',
  padding: '16px',
};

const formContentSx = {
  flex: 1,
  px: '8%',
  py: 3,
  backgroundColor: '#FFFFFF',
};

const formSubmitSx = { padding: '16px 0', backgroundColor: '#FFFFFF' };


const getEmptyFieldError = (field: string): string => {
  switch (field) {
    case 'documentType':
      return 'Select Document Type to proceed';
    case 'serialNoLabel':
      return 'Serial Number is mandatory';
    case 'revenueDocumentNumber':
      return 'Revenue Document Number is mandatory';
    default:
      return '';
  }
};

const DocumentsInformation: React.FC = () => {
  // Contexts and hooks for form mode, navigation, and property form data
  const { mode } = useFormMode();
  const navigate = useNavigate();
  const { formData, updateForm } = usePropertyForm();
  const [hasModified, setHasModified] = useState(false);

  const markModified = () => {
    if (mode === "verify") setHasModified(true);
  };

  const PROPERTY_ID = formData.id ?? (localStorage.getItem('propertyId') || '');

  // Fetch existing document info
  const { data: existingDocInfo, isLoading: isFetchingDocInfo } = useGetDocumentInfoByPropertyIdQuery(PROPERTY_ID, {
    skip: mode !== 'verify' && mode !== 'draft'
  });

  const {
    propertyFormTitle,
    newPropertyFormTitle,
    documentsSubtitle,
    documentTypeLabel,
    enterNumberPlaceholder,
    // saveDraftSuccessMsg,
    selectPlaceholder,
    saveDraftText,
    previousText,
  } = useDocumentsLocalization();

  const {
    nextButtonText,
    SerialNoText,
    onlyNumbersAreAllowedMSG,
  } = useLocalization();

  const [createDocumentInfo, { isLoading: isCreating }] = useCreateDocumentInfoMutation();
  const [updateDocumentInfo, { isLoading: isUpdating }] = useUpdateDocumentInfoMutation();

  const isSubmitting = isCreating || isUpdating;
  const [documentTypeOptions, setDocumentTypeOptions] = useState<DropdownOption[]>([]);

  const [documentInfoId, setDocumentInfoId] = useState<string | null>(null);

  const getSubmitButtonText = () => {
    if (isSubmitting) return 'Submitting...';
    if (mode === 'verify') return 'Verify';
    return nextButtonText;
  };

  const [localData, setLocalData] = useState({
    documentType: formData.documents?.[0]?.documentType || '',
    serialNoLabel: formData.documents?.[0]?.serialNoLabel || '',
    revenueDocumentNumber: formData.documents?.[0]?.revenueDocumentNumber || '',
  });

  const [errors, setErrors] = useState({
    documentType: '',
    serialNoLabel: '',
    revenueDocumentNumber: '',
  });

  const [touched, setTouched] = useState({
    documentType: false,
    serialNoLabel: false,
    revenueDocumentNumber: false,
  });

  const [showNumberWarnings, setShowNumberWarnings] = useState({
    serialNoLabel: false,
    revenueDocumentNumber: false,
  });

  // dropdown open state
  const [showDocumentTypeDropdown, setShowDocumentTypeDropdown] = useState(false);

  useEffect(() => {
    JsonService.getDocumentTypes().then((data) => {
      if (Array.isArray(data)) {
        setDocumentTypeOptions(
          data
            .filter((item) => item.name !== 'select')
            .map((item, index) => ({ id: index, label: item.name }))
        );
      }
    });
  }, []);

  // Effect: Prepopulate form when existing document info is fetched
  useEffect(() => {
    if (
      existingDocInfo?.success &&
      existingDocInfo?.data &&
      Array.isArray(existingDocInfo.data)
    ) {
      const documentInfoEntries = existingDocInfo.data.filter(
        (item) => item.FieldName === 'DocumentInfo'
      );

      if (documentInfoEntries.length > 0) {
        const latestEntry = documentInfoEntries.reduce((latest, current) => {
          const latestDate = new Date(latest.UpdatedAt);
          const currentDate = new Date(current.UpdatedAt);
          return currentDate > latestDate ? current : latest;
        }, documentInfoEntries[0]);

        setDocumentInfoId(latestEntry.ID);

        let docTypeOption;
        if (
          documentTypeOptions &&
          documentTypeOptions.length > 0 &&
          latestEntry.fieldValue
        ) {
          if (typeof latestEntry.fieldValue.DocumentType === 'number') {
            docTypeOption = documentTypeOptions.find(
              (opt) => Number(opt.id) === Number(latestEntry.fieldValue.DocumentType)
            );
          } else {
            docTypeOption = documentTypeOptions.find(
              (opt) => opt.label === latestEntry.fieldValue.DocumentType
            );
          }

          setLocalData({
            documentType: docTypeOption?.label || '',
            serialNoLabel: latestEntry.fieldValue.serialNo?.toString() || '',
            revenueDocumentNumber:
              latestEntry.fieldValue.revenueDocumentNo?.toString() || '',
          });
        } else {
          setLocalData({
            documentType: '',
            serialNoLabel: latestEntry.fieldValue.serialNo?.toString() || '',
            revenueDocumentNumber:
              latestEntry.fieldValue.revenueDocumentNo?.toString() || '',
          });
        }
      } else {
        showErrorPopup('No DocumentInfo entries found');
      }
    }
  }, [existingDocInfo, documentTypeOptions]);

  // ===============
  // Numeric Validation and Input Handling
  // ===============
  const validateField = (name: keyof typeof localData, value: string) => {
    if (!value || value.trim() === '') return getEmptyFieldError(name);
    if (['serialNoLabel', 'revenueDocumentNumber'].includes(name)) {
      // Only allow whole numbers (no decimals)
      if (!/^\d+$/.test(value)) return onlyNumbersAreAllowedMSG;
      const num = Number(value);
      if (Number.isNaN(num) || num <= 0) return 'Must be a positive number';
    }
    return '';
  };

  // ENHANCED: strip leading zeros from number fields on blur!
  const handleBlur = (name: keyof typeof localData) => {
    let newValue = localData[name];

    // Strip leading zeros for these fields on blur
    if (
      (name === 'serialNoLabel' || name === 'revenueDocumentNumber') &&
      newValue !== ''
    ) {
      if (/^\d+(\.\d*)?$/.test(newValue)) {
        const parts = newValue.split('.');
        parts[0] = String(Number(parts[0]));
        newValue = parts.length > 1 ? parts.join('.') : parts[0];
      }
      setLocalData((prev) => ({ ...prev, [name]: newValue }));
    }

    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, newValue) }));
  };

  // Prevent '-', 'e', '+', '.'
  const handleNumberKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const forbidden = ['-', 'e', '+', '.'];
    if (forbidden.includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleFieldChange = (field: keyof typeof localData) => (value: string) => {
    markModified();
    let sanitized = value;
    if (field === 'serialNoLabel' || field === 'revenueDocumentNumber') {
      // Only allow digits and one dot for float
      // const isValid = /^\d*\.?\d*$/.test(value);
      sanitized = value.replaceAll(/\D/g, '');

      const isValid = /^\d*$/.test(value);
      if (!isValid && value !== '') {
        setShowNumberWarnings((prev) => ({ ...prev, [field]: true }));
        return;
      }
    }
    setLocalData((prev) => ({ ...prev, [field]: sanitized }));
    if (field === 'serialNoLabel' || field === 'revenueDocumentNumber') {
      if (showNumberWarnings[field]) {
        if (/^\d*$/.test(sanitized) || sanitized === '')
          setShowNumberWarnings((prev) => ({ ...prev, [field]: false }));
      }
    }
    if (touched[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  // handleDocumentTypeSelect: Handles selection from document type dropdown
  const handleDocumentTypeSelect = (_field: string, value: string) => {
    markModified();
    setLocalData((prev) => ({ ...prev, documentType: value }));
    setErrors((prev) => ({ ...prev, documentType: '' }));
    setTouched((prev) => ({ ...prev, documentType: true }));
    setShowDocumentTypeDropdown(false);
  };

  // Local state for popup messages
  const [popup, setPopup] = useState<{
    type: AlertType;
    open: boolean;
    title: string;
    message: string;
    duration: number;
  }>({
    type: 'warning',
    open: false,
    title: '',
    message: '',
    duration: 3000,
  });

  function showErrorPopup(
    message: string,
    duration = 3000,
    type: AlertType = 'information',
    title: string = 'Information'
  ) {
    setPopup((prev) => ({ ...prev, open: false }));
    setTimeout(() => {
      setPopup({
        type,
        open: true,
        title,
        message,
        duration,
      });
    }, 10);
  }

  // handleSubmit: Validates and submits form, creates/updates document info via API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submitErrors = {
      documentType: validateField('documentType', localData.documentType),
      serialNoLabel: validateField('serialNoLabel', localData.serialNoLabel),
      revenueDocumentNumber: validateField(
        'revenueDocumentNumber',
        localData.revenueDocumentNumber
      ),
    };

    setErrors({
      documentType: submitErrors.documentType || '',
      serialNoLabel: submitErrors.serialNoLabel || '',
      revenueDocumentNumber: submitErrors.revenueDocumentNumber || '',
    });
    setTouched({ documentType: true, serialNoLabel: true, revenueDocumentNumber: true });

    if (Object.values(submitErrors).some(Boolean)) return;

    const applicationId = localStorage.getItem("applicationLogId") || "";
    const isVerifying = mode === "verify" && hasModified;

    try {
      const payload = {
        fieldName: 'DocumentInfo',
        fieldValue: {
          DocumentType: localData.documentType,
          serialNo: Number(localData.serialNoLabel),
          revenueDocumentNo: Number(localData.revenueDocumentNumber),
        },
        propertyId: PROPERTY_ID,
      };

      let response;

      if (documentInfoId) {
        response = await updateDocumentInfo({
          documentId: documentInfoId,
          body: payload,
          applicationId,
          isVerifying,
        }).unwrap();
      } else {
        response = await createDocumentInfo(payload).unwrap();
      }

      console.log(response);

      // Update form context
      updateForm({
        documents: [
          {
            ...localData,
            files: formData.documents?.[0]?.files || [],
          },
        ],
      });

      // Navigate to next page
      navigate('/property-form/documents-upload');
    } catch (err) {
      const error = err as ApiError;
      showErrorPopup(
        error?.data?.errors?.[0] ||
          error?.message ||
          'Failed to save document information. Please try again.'
      );
    }
  };

  // handleSaveDraft: Saves current form data as draft in context
  const handleSaveDraft = () => {
    updateForm({
      documents: [
        {
          ...localData,
          files: formData.documents?.[0]?.files || [],
        },
      ],
    });
  };

  // handleBack: Navigates to previous page
  const handleBack = () => {
    navigate(-1);
  };

  if (isFetchingDocInfo) {
    return (
      <Box sx={containerSx}>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>Loading document information...</p>
        </div>
      </Box>
    );
  }

  // UI rendering: WarningPopup, header, form with dropdowns and submit button
  return (
    <>
      <NotificationPopup
        type={popup.type}
        open={popup.open}
        title={popup.title}
        message={popup.message}
        onClose={() => setPopup((p) => ({ ...p, open: false }))}
      />
      <Box sx={containerSx}>
        <Box sx={headerSx}>
          <StepHeader
            title={`${
              mode === 'new' ? `${newPropertyFormTitle}` : `${propertyFormTitle}`
            }`}
            subtitle={`${documentsSubtitle}`}
            steps={10}
            activeStep={8}
            onPrevious={handleBack}
            onSaveDraft={handleSaveDraft}
            saveDraftText={saveDraftText}
            previousText={previousText}
          />
        </Box>

        <Box component="main" sx={formContentSx}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={1}>
              <CustomDropdown
                label={documentTypeLabel}
                name="documentType"
                value={localData.documentType}
                options={documentTypeOptions}
                showDropdown={showDocumentTypeDropdown}
                setShowDropdown={setShowDocumentTypeDropdown}
                onSelect={handleDocumentTypeSelect}
                closeOtherDropdowns={() => setShowDocumentTypeDropdown(false)}
                selectText={selectPlaceholder || 'Select'}
                required
                error={errors.documentType}
                touched={touched.documentType}
                onBlur={() => handleBlur('documentType')}
              />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <FormTextField
                    sx={uniformInputSx}
                    label={SerialNoText}
                    value={localData.serialNoLabel}
                    onChange={handleFieldChange('serialNoLabel')}
                    onBlur={() => handleBlur('serialNoLabel')}
                    placeholder=""
                    type="number"
                    required
                    inputProps={{ onKeyDown: handleNumberKeyDown }}
                    error={
                      showNumberWarnings.serialNoLabel
                        ? onlyNumbersAreAllowedMSG
                        : errors.serialNoLabel
                    }
                    touched={touched.serialNoLabel || showNumberWarnings.serialNoLabel}
                  />
                </Box>

                <FormTextField
                  sx={uniformInputSx}
                  label="Revenue Document No."
                  value={localData.revenueDocumentNumber}
                  onChange={handleFieldChange('revenueDocumentNumber')}
                  onBlur={() => handleBlur('revenueDocumentNumber')}
                  placeholder={enterNumberPlaceholder}
                  type="number"
                  required
                  inputProps={{ onKeyDown: handleNumberKeyDown }}
                  error={
                    showNumberWarnings.revenueDocumentNumber
                      ? onlyNumbersAreAllowedMSG
                      : errors.revenueDocumentNumber
                  }
                  touched={
                    touched.revenueDocumentNumber ||
                    showNumberWarnings.revenueDocumentNumber
                  }
                />
              </Box>

              <Box sx={formSubmitSx}>
                <Button
                  type="submit"
                  sx={{
                    ...verifyButtonSx,
                    display: 'block',
                    marginLeft: 'auto',
                    marginTop: '100px',
                  }}
                  variant="contained"
                  disabled={isSubmitting}
                >
                  {getSubmitButtonText()}
                </Button>
              </Box>
            </Stack>
          </form>
        </Box>
      </Box>
    </>
  );
};

export default DocumentsInformation;
