// AssessmentDetails.tsx
// Property Form Assessment Details page
// Collects and manages assessment details for a property, including reason, certificate info, site extent, and land share
// Features:
//   - Form for entering assessment details (reason, certificate number/date, extent, land share)
//   - Uses localization for labels and error messages
//   - Fetches and updates assessment details via RTK Query
//   - Handles form validation, error popups, and draft saving
//   - Dynamic dropdowns and custom input components
//   - Responsive UI with MUI components
// Used in: Property form workflow for property assessment step


import React, { useEffect, useState, useRef } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { useFormMode } from '../../../context/FormModeContext';
import JsonService, {
  getUnitOfMeasurementOptions,
} from '../../../services/jsonServerApiCalls';
import { usePropertyForm } from '../../../context/PropertyFormContext';
import { useAssessmentDetailsLocalization } from '../../../services/AgentLocalisation/localisation-AssessmentDetails';
import CalendarIcon from '../../assets/Agent/date_range.svg';
import StepHeader from '../../features/Agent/components/StepHeader';
import { useLocalization } from '../../../services/AgentLocalisation/formLocalisation';
import CustomDropdown from '../../features/PropertyForm/components/IGRSDetail/IGRSdropdown';
import type { DropdownOption } from '../../features/PropertyForm/components/IGRSDetail/IGRSdropdown';
import FormTextField from '../../features/PropertyForm/components/IGRSDetail/IGRSFormTextFiled';
import { uniformInputSx, verifyButtonSx } from './styles/sharedStyles';
import type { AlertType } from '../../models/AlertType.model';
import {
  useCreateAssessmentDetailsMutation,
  useUpdateAssessmentDetailsMutation,
} from '../../../redux/apis/AssessmentDetails.api';
import { NotificationPopup } from '../../components/Popup/NotificationPopup';

type LocalState = {
  reason: string;
  occupancyCertificateNumber: string;
  occupancyCertificateDate: string;
  extentOfSite: string;
  landUnderBuilding: string;
  isUnspecifiedShare: boolean;
};

const containerStyle = {
  width: '100%',
  margin: '0 auto',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column' as const,
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  bgcolor: '#fff',
};

const headerStyle = {
  backgroundColor: '#F9E6E0',
  padding: '16px',
};

const formContentStyle = {
  flex: 1,
  px: '8%',
  py: 3,
  backgroundColor: '#FFFFFF',
};

const formSubmitSx = {
  padding: '16px 0',
  backgroundColor: '#FFFFFF',
};

const labelSx = {
  fontSize: 14,
  fontWeight: 400,
  color: '#333333',
  textAlign: 'left' as const,
};

const AssessmentDetails: React.FC = () => {
  const { mode } = useFormMode();
  const navigate = useNavigate();
  const { formData, updateForm } = usePropertyForm();

  const propertyId = formData.id ?? '';

  const [createAssessmentDetails] = useCreateAssessmentDetailsMutation();
  const [updateAssessmentDetails] = useUpdateAssessmentDetailsMutation();

  const {
    reasonCreationLabel,
    occupancyCertificateNumberLabel,
    occupancyCertificateDateLabel,
    unspecifiedShareLabel,
    selectOption,
    // draftSavedAlert,
    reasonRequiredError,
    certificateNumberRequiredError,
    certificateDateRequiredError,
    extentSiteRequiredError,
    positiveNumberRequiredError,
    landUnderneathRequiredError,
    reasonOptions: reasonTranslations,
    // propertyFormTitle,
    // newPropertyFormTitle,
    assessmentDetailsSubtitle,
    previousText,
    saveDraftText,
    enterExtentSitePlaceholder,
    enterLandUnderneathPlaceholder,
  } = useAssessmentDetailsLocalization();

  const { nextButtonText, onlyNumbersAreAllowedMSG } = useLocalization();

  const [localData, setLocalData] = useState<LocalState>({
    reason: formData.assessmentDetails?.ReasonOfCreation || '',
    occupancyCertificateNumber:
      formData.assessmentDetails?.OccupancyCertificateNumber || '',
    occupancyCertificateDate: formData.assessmentDetails?.OccupancyCertificateDate || '',
    extentOfSite: formData.assessmentDetails?.ExtentOfSite || '',
    landUnderBuilding:
      formData.assessmentDetails?.IsLandUnderneathBuilding?.toString() || '',
    isUnspecifiedShare: formData.assessmentDetails?.IsUnspecifiedShare || false,
  });

  const [reasonsFromJson, setReasonsFromJson] = useState<DropdownOption[]>([]);
  const [reasons, setReasons] = useState<DropdownOption[]>([]);
  const [showReasonDropdown, setShowReasonDropdown] = useState(false);

  // Error and touched state
  const [errors, setErrors] = useState<Record<keyof LocalState, string>>({
    reason: '',
    occupancyCertificateNumber: '',
    occupancyCertificateDate: '',
    extentOfSite: '',
    landUnderBuilding: '',
    isUnspecifiedShare: '',
  } as Record<keyof LocalState, string>);

  const [touched, setTouched] = useState<Record<keyof LocalState, boolean>>({
    reason: false,
    occupancyCertificateNumber: false,
    occupancyCertificateDate: false,
    extentOfSite: false,
    landUnderBuilding: false,
    isUnspecifiedShare: false,
  });

  // OnlyNumbers warnings (for positive number fields)
  const [showNumberWarnings, setShowNumberWarnings] = useState<Record<string, boolean>>({
    extentOfSite: false,
    landUnderBuilding: false,
  });

  // close other dropdowns helper
  const closeAllDropdowns = () => {
    setShowReasonDropdown(false);
  };

  // unit of measurement MDMS
  const [unitOfMeasurement, setUnitOfMeasurement] = useState<string>('');

  useEffect(() => {
    getUnitOfMeasurementOptions()
      .then((data) => {
        setUnitOfMeasurement(data?.unitOfmeasurement || '');
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  useEffect(() => {
    JsonService.getReasons()
      .then((data) => {
        const jsonReasons: DropdownOption[] = (data || []).map((item: any) => ({
          id: Number(item.id),
          label: item.label,
        }));
        setReasonsFromJson(jsonReasons);

        if (reasonTranslations && reasonTranslations.length > 0) {
          const translated = jsonReasons.map((r, idx) => ({
            id: r.id,
            label: reasonTranslations[idx] || r.label,
          }));
          setReasons(translated);
        } else {
          setReasons(jsonReasons);
        }
      })
      .catch(() => {
        setReasons([]);
      });
  }, [reasonTranslations]);

  useEffect(() => {
    if (
      reasonTranslations &&
      reasonTranslations.length > 0 &&
      reasonsFromJson.length > 0
    ) {
      const translated = reasonsFromJson.map((r, idx) => ({
        id: r.id,
        label: reasonTranslations[idx] || r.label,
      }));
      setReasons(translated);
    } else if (reasonsFromJson.length > 0) {
      setReasons(reasonsFromJson);
    }
  }, [reasonTranslations, reasonsFromJson]);

  // click outside detection for reason dropdown
  const reasonDropdownRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        reasonDropdownRef.current &&
        !reasonDropdownRef.current.contains(event.target as Node)
      ) {
        setShowReasonDropdown(false);
      }
    }
    if (showReasonDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showReasonDropdown]);

  function validateField(field: string, value: string) {
    if (field === 'reason') return !value ? reasonRequiredError : '';
    if (field === 'occupancyCertificateNumber') {
      if (!value.trim()) return certificateNumberRequiredError;
      const ocRegex = /^OC-\d{4}-\d{3}(-REVISED)?$/;
      if (!ocRegex.test(value.trim()))
        return 'Invalid format. Example: OC-0000-000';
      return '';
    }
    if (field === 'extentOfSite' || field === 'landUnderBuilding') {
      if (!value || value.trim() === '')
        return field === 'extentOfSite'
          ? extentSiteRequiredError
          : landUnderneathRequiredError;
      if (!/^\d*\.?\d*$/.test(value)) return onlyNumbersAreAllowedMSG;
      if (value === '.') return 'Must contain at least one digit';
      const num = Number(value);
      if (isNaN(num) || num <= 0) return positiveNumberRequiredError;
      return '';
    }
    if (field === 'occupancyCertificateDate') {
      if (!value) return certificateDateRequiredError;
      return '';
    }
    return '';
  }

  // Number keydown block ('-', 'e', '+')
  const handleNumberKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (['-', 'e', '+'].includes(e.key)) e.preventDefault();
  };

  const handleFieldChange = (field: keyof LocalState) => (value: string) => {
    if (field === 'extentOfSite' || field === 'landUnderBuilding') {
      // Only allow digits and one dot for float
      const isValid = /^\d*\.?\d*$/.test(value);
      let sanitized = value.replace(/[^0-9.]/g, '');
      // Only allow one dot
      const parts = sanitized.split('.');
      if (parts.length > 2) sanitized = parts[0] + '.' + parts.slice(1).join('');
      if (!isValid && value !== '') {
        setShowNumberWarnings((prev) => ({ ...prev, [field]: true }));
        return;
      }
      setLocalData((prev) => ({ ...prev, [field]: sanitized }));
      if (showNumberWarnings[field]) {
        if (/^\d*\.?\d*$/.test(sanitized) || sanitized === '')
          setShowNumberWarnings((prev) => ({ ...prev, [field]: false }));
      }
      if (touched[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
    } else if (field === 'occupancyCertificateNumber') {
      // Accept only uppercase letters, digits and dash
      const partialOcRegex = /^[A-Z0-9\-]*$/;
  const ocRegex = /^OC-\d{4}-\d{3}(-REVISED)?$/;
  if (!partialOcRegex.test(value) && value !== '') {
    setErrors((prev) => ({
      ...prev,
      [field]: 'Only uppercase letters, digits and dash (-) allowed.',
    }));
    setTouched((prev) => ({ ...prev, [field]: true }));
    return;
  }
  // Check full format as user types
  let errorMsg = '';
  if (value && !ocRegex.test(value.trim())) {
    errorMsg = 'Invalid format. Example: OC-0000-000';
  }
  setLocalData((prev) => ({ ...prev, [field]: value }));
  setErrors((prev) => ({ ...prev, [field]: errorMsg }));
  setTouched((prev) => ({ ...prev, [field]: true }));
    } else {
      setLocalData((prev) => ({ ...prev, [field]: value }));
      setTouched((prev) => ({ ...prev, [field]: true }));
      setErrors((prev) => ({ ...prev, [field]: validateField(field as string, value) }));
    }
  };

  // --- LEADING ZEROES LOGIC ON BLUR ---
  const handleBlur = (field: keyof LocalState) => {
    let newValue = localData[field];

    // Remove leading zeros for positive number fields on blur
    if (
      (field === 'extentOfSite' || field === 'landUnderBuilding') &&
      typeof newValue === 'string' &&
      newValue !== ''
    ) {
      // '006.3' => '6.3', '007' => '7', '000' => '0', '.7' untouched
      if (/^\d+(\.\d*)?$/.test(newValue)) {
        const parts = newValue.split('.');
        parts[0] = String(Number(parts[0]));
        newValue = parts.length > 1 ? parts.join('.') : parts[0];
      }
      setLocalData((prev) => ({ ...prev, [field]: newValue }));
    }
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({
      ...prev,
      [field]: validateField(
        field as string,
        typeof newValue === 'string' ? newValue : ''
      ),
    }));
  };

  const handleCheckboxChange = (
    _event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    setLocalData((prev) => ({ ...prev, isUnspecifiedShare: checked }));
  };

  const handleReasonSelect = (label: string) => {
    setLocalData((prev) => ({ ...prev, reason: label }));
    setErrors((prev) => ({ ...prev, reason: '' }));
    setTouched((prev) => ({ ...prev, reason: true }));
    setShowReasonDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = {
      reason: validateField('reason', localData.reason),
      occupancyCertificateNumber: validateField(
        'occupancyCertificateNumber',
        localData.occupancyCertificateNumber
      ),
      occupancyCertificateDate: validateField(
        'occupancyCertificateDate',
        localData.occupancyCertificateDate
      ),
      extentOfSite: validateField('extentOfSite', localData.extentOfSite),
      landUnderBuilding: validateField('landUnderBuilding', localData.landUnderBuilding),
      isUnspecifiedShare: '',
    };

    setErrors(validation as any);
    setTouched({
      reason: true,
      occupancyCertificateNumber: true,
      occupancyCertificateDate: true,
      extentOfSite: true,
      landUnderBuilding: true,
      isUnspecifiedShare: true,
    });

    if (Object.values(validation).some(Boolean)) return;

    const requestBody = {
      reasonOfCreation: localData.reason,
      occupancyCertificateNumber: localData.occupancyCertificateNumber,
      occupancyCertificateDate: localData.occupancyCertificateDate,
      extentOfSite: localData.extentOfSite,
      isLandUnderneathBuilding: localData.landUnderBuilding,
      isUnspecifiedShare: localData.isUnspecifiedShare,
      propertyId,
    };

    try {
      let resp;
      if (formData.assessmentDetails?.ID) {
        resp = await updateAssessmentDetails({
          id: formData.assessmentDetails.ID,
          body: requestBody,
        }).unwrap();
      } else {
        resp = await createAssessmentDetails(requestBody).unwrap();
      }

      if (resp) {
        updateForm({
          assessmentDetails: {
            ID: resp?.data.ID,
            ReasonOfCreation: resp?.data.ReasonOfCreation,
            OccupancyCertificateNumber: resp?.data.OccupancyCertificateNumber,
            OccupancyCertificateDate: resp?.data.OccupancyCertificateDate,
            ExtentOfSite: resp?.data.ExtentOfSite,
            IsLandUnderneathBuilding: resp?.data.IsLandUnderneathBuilding,
            IsUnspecifiedShare: resp?.data.IsUnspecifiedShare,
          },
        });
      }

      // Optionally, show success popup or navigate
      navigate('/property-form/igrs-details');
    } catch (error) {
      showErrorPopup('Failed to save assessment details.');
    }
  };

  useEffect(() => {
    if (formData.assessmentDetails) {
      setLocalData({
        reason: formData.assessmentDetails?.ReasonOfCreation || '',
        occupancyCertificateNumber:
          formData.assessmentDetails?.OccupancyCertificateNumber || '',
        occupancyCertificateDate:
          formData.assessmentDetails?.OccupancyCertificateDate || '',
        extentOfSite: formData.assessmentDetails?.ExtentOfSite || '',
        landUnderBuilding:
          formData.assessmentDetails?.IsLandUnderneathBuilding?.toString() || '',
        isUnspecifiedShare: formData.assessmentDetails?.IsUnspecifiedShare || false,
      });
    }
  }, [formData.assessmentDetails]);

  const handleGoBack = () => navigate(-1);

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

  function showErrorPopup(message: string, duration = 3000) {
    setPopup((prev) => ({ ...prev, open: false }));
    setTimeout(() => {
      setPopup({
        type: 'warning',
        open: true,
        title: 'Warning!',
        message,
        duration,
      });
    }, 10);
  }

  const handleSaveDraft = () => {
    updateForm({
      assessmentDetails: {
        ReasonOfCreation: localData.reason,
        OccupancyCertificateNumber: localData.occupancyCertificateNumber,
        OccupancyCertificateDate: localData.occupancyCertificateDate,
        ExtentOfSite: localData.extentOfSite.toString(),
        IsLandUnderneathBuilding: localData.landUnderBuilding || '',
        IsUnspecifiedShare: localData.isUnspecifiedShare,
      },
    });
  };

  return (
    <>
      <NotificationPopup
        type={popup.type}
        open={popup.open}
        title={popup.title}
        message={popup.message}
        onClose={() => setPopup((p) => ({ ...p, open: false }))}
      />
      <Box sx={containerStyle}>
        <Box sx={headerStyle}>
          <StepHeader
            title={mode === 'new' ? `New Property Form` : `Property Form`}
            subtitle={`${assessmentDetailsSubtitle}`}
            steps={10}
            activeStep={3}
            onPrevious={handleGoBack}
            onSaveDraft={handleSaveDraft}
            saveDraftText={saveDraftText}
            previousText={previousText}
          />
        </Box>

        <Box component="main" sx={formContentStyle}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={1}>
              <CustomDropdown
                label={reasonCreationLabel}
                name="reason"
                value={localData.reason}
                options={reasons}
                showDropdown={showReasonDropdown}
                setShowDropdown={setShowReasonDropdown}
                onSelect={(_field, value) => handleReasonSelect(value)}
                closeOtherDropdowns={closeAllDropdowns}
                selectText={selectOption}
                required
                error={errors.reason}
                touched={touched.reason}
                onBlur={() => handleBlur('reason')}
              />

              <FormTextField
                sx={{ ...uniformInputSx, marginBottom: '30px' }}
                label={occupancyCertificateNumberLabel}
                value={localData.occupancyCertificateNumber}
                onChange={handleFieldChange('occupancyCertificateNumber')}
                onBlur={() => handleBlur('occupancyCertificateNumber')}
                placeholder={occupancyCertificateNumberLabel}
                type="text"
                required
                error={
                  touched.occupancyCertificateNumber
                    ? errors.occupancyCertificateNumber
                    : ''
                }
                touched={touched.occupancyCertificateNumber}
              />

              <Box>
                <Typography sx={labelSx}>
                  {occupancyCertificateDateLabel}
                  <span style={{ color: 'red' }}>*</span>
                  <span style={{ marginLeft: 6 }}>:</span>
                </Typography>
                <DatePicker
                  value={
                    localData.occupancyCertificateDate
                      ? dayjs(localData.occupancyCertificateDate)
                      : null
                  }
                  onChange={(date) => {
                    const value = date ? dayjs(date).format('YYYY-MM-DD') : '';
                    setLocalData((prev) => ({
                      ...prev,
                      occupancyCertificateDate: value,
                    }));
                    setTouched((prev) => ({ ...prev, occupancyCertificateDate: true }));
                    setErrors((prev) => ({
                      ...prev,
                      occupancyCertificateDate: validateField(
                        'occupancyCertificateDate',
                        value
                      ),
                    }));
                  }}
                  disableFuture
                  format="DD/MM/YYYY"
                  slots={{
                    openPickerIcon: () => (
                      <img
                        src={CalendarIcon}
                        alt="calendar"
                        style={{ width: 24, height: 24, marginTop: '-2px' }}
                      />
                    ),
                  }}
                  slotProps={{
                    textField: {
                      required: true,
                      placeholder: occupancyCertificateDateLabel,
                      error:
                        touched.occupancyCertificateDate &&
                        !!errors.occupancyCertificateDate,
                      helperText: touched.occupancyCertificateDate
                        ? errors.occupancyCertificateDate
                        : '',
                      onBlur: () => {
                        setTouched((prev) => ({
                          ...prev,
                          occupancyCertificateDate: true,
                        }));
                        setErrors((prev) => ({
                          ...prev,
                          occupancyCertificateDate: validateField(
                            'occupancyCertificateDate',
                            localData.occupancyCertificateDate
                          ),
                        }));
                      },
                      inputProps: {
                        style: { marginTop: '-8px' },
                      },
                      sx: {
                        width: '100%',
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderRadius: '12px',
                          },
                        },
                        '& .MuiOutlinedInput-input': {
                          padding: '12px 14px',
                        },
                      },
                      FormHelperTextProps: {
                        sx: {
                          color: '#D32F2F',
                          marginTop: '8px',
                          minHeight: '20px',
                        },
                      },
                    },
                    actionBar: { actions: ['clear', 'accept'] },
                  }}
                  maxDate={dayjs()}
                />
              </Box>

              <FormTextField
                sx={{ ...uniformInputSx, marginBottom: '30px' }}
                label={`Extent of Site (${unitOfMeasurement})`}
                value={localData.extentOfSite}
                onChange={handleFieldChange('extentOfSite')}
                onBlur={() => handleBlur('extentOfSite')}
                placeholder={enterExtentSitePlaceholder}
                type="number"
                required
                inputProps={{ onKeyDown: handleNumberKeyDown }}
                error={
                  showNumberWarnings.extentOfSite
                    ? onlyNumbersAreAllowedMSG
                    : errors.extentOfSite
                }
                touched={touched.extentOfSite || showNumberWarnings.extentOfSite}
              />

              <FormTextField
                sx={{ ...uniformInputSx, marginBottom: '30px' }}
                label={
                  localData.isUnspecifiedShare
                    ? `Unspecified / Undivided Share of Land (${unitOfMeasurement})`
                    : `Land Underneath the Building (${unitOfMeasurement})`
                }
                value={localData.landUnderBuilding}
                onChange={handleFieldChange('landUnderBuilding')}
                onBlur={() => handleBlur('landUnderBuilding')}
                placeholder={enterLandUnderneathPlaceholder}
                type="number"
                required
                inputProps={{ onKeyDown: handleNumberKeyDown }}
                error={
                  showNumberWarnings.landUnderBuilding
                    ? onlyNumbersAreAllowedMSG
                    : errors.landUnderBuilding
                }
                touched={
                  touched.landUnderBuilding || showNumberWarnings.landUnderBuilding
                }
              />

              <Box>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={localData.isUnspecifiedShare}
                      onChange={(_e, checked) => handleCheckboxChange(_e as any, checked)}
                    />
                  }
                  label={unspecifiedShareLabel}
                />
              </Box>

              <Box sx={formSubmitSx}>
                <Button
                  type="submit"
                  sx={{ ...verifyButtonSx, display: 'block', marginLeft: 'auto' }}
                  variant="contained"
                >
                  {mode === 'verify' ? 'Verify' : nextButtonText}
                </Button>
              </Box>
            </Stack>
          </form>
        </Box>
      </Box>
    </>
  );
};

export default AssessmentDetails;
