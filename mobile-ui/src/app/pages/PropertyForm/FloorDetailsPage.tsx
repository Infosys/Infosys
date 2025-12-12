// FloorDetailsPage.tsx
// Property Form Floor Details entry page
// Collects and manages details for a single floor in a property
// Features:
//   - Form for entering floor details (number, classification, usage, dimensions, dates, etc.)
//   - Fetches and updates floor details via RTK Query
//   - Handles form validation, error/success popups, and draft saving
//   - Responsive UI with MUI components and custom dropdowns
//   - Supports both add and edit modes based on navigation state
// Used in: Property form workflow for floor details entry/edit step
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
//import Checkbox from '@mui/material/Checkbox';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFormMode } from '../../../context/FormModeContext';
import { usePropertyForm, type FloorDetails } from '../../../context/PropertyFormContext';
import { useFloorDetailsLocalization } from '../../../services/AgentLocalisation/localisation-floor-details';
import StepHeader from '../../features/Agent/components/StepHeader';
import { useLocalization } from '../../../services/AgentLocalisation/formLocalisation';
import CustomDropdown, {
  type DropdownOption,
} from '../../features/PropertyForm/components/IGRSDetail/IGRSdropdown';
import FormTextField from '../../features/PropertyForm/components/IGRSDetail/IGRSFormTextFiled';
import { uniformInputSx, verifyButtonSx } from './styles/sharedStyles';
import type { AlertType } from '../../models/AlertType.model';
import CalendarIcon from '../../assets/Agent/date_range.svg';
import {
  useCreateFloorDetailsMutation,
  useGetFloorDetailsByIdQuery,
  useUpdateFloorDetailsMutation,
  type FloorDetailsRequest,
} from '../../../redux/apis/floorApi';
import { CircularProgress } from '@mui/material';
import { getUnitOfMeasurementOptions } from '../../../services/jsonServerApiCalls';
import { NotificationPopup } from '../../components/Popup/NotificationPopup';

// Existing validateFloor logic (unchanged)
const validateFloor = (data: any, texts: any, isRequiredText: string) => {
  const errors: Partial<Record<keyof FloorDetails, string>> = {};

  errors.floorNumber =
    !data.floorNumber || data.floorNumber === ''
      ? `${texts.floorNumberLabel} ${isRequiredText}.`
      : '';
  errors.buildingClassification =
    !data.buildingClassification || data.buildingClassification === ''
      ? `${texts.buildingClassificationLabel} ${isRequiredText}.`
      : '';
  errors.igrsClassification =
    !data.igrsClassification || data.igrsClassification === ''
      ? `${texts.igrsClassificationLabel} ${isRequiredText}.`
      : '';
  errors.natureOfUsage =
    !data.natureOfUsage || data.natureOfUsage === ''
      ? `${texts.natureOfUsageLabel} ${isRequiredText}.`
      : '';
  errors.occupancy =
    !data.occupancy || data.occupancy === ''
      ? `${texts.occupancyLabel} ${isRequiredText}.`
      : '';
  errors.unstructuredLand =
    !data.unstructuredLand || data.unstructuredLand === ''
      ? `${texts.unstructuredLandLabel} ${isRequiredText}.`
      : '';

  // Alphabets only (optional)
  if (data.firmName && /[^a-zA-Z\s]/.test(data.firmName)) {
    errors.firmName = `${texts.firmNameLabel} - Only alphabets allowed`;
  }
  if (data.occupantName && /[^a-zA-Z\s]/.test(data.occupantName)) {
    errors.occupantName = `${texts.occupantNameLabel} - Only alphabets allowed`;
  }

  // numeric validations
  const numericCheck = (val: string, label: string, required = true) => {
    if (!val || val === '') {
      return required ? `${label} ${isRequiredText}.` : '';
    }
    if (!/^\d*\.?\d*$/.test(val)) return `${label} must be a valid number`;
    if (val === '.') return `${label} must contain at least one digit`;
    const num = Number(val);
    if (isNaN(num) || num <= 0) return `${label} must be a positive number`;
    return '';
  };

  errors.length = numericCheck(data.length, texts.lengthLabel, true);
  errors.breadth = numericCheck(data.breadth, texts.breadthLabel, true);
  errors.plinthArea = numericCheck(data.plinthArea, texts.plinthAreaLabel, true);
  errors.buildingPermissionNo = numericCheck(
    data.buildingPermissionNo,
    texts.buildingPermissionNoLabel,
    false
  );

  // Date validations
  const today = dayjs().endOf('day');
  if (!data.constructionDate || data.constructionDate === '') {
    errors.constructionDate = `${texts.constructionDateLabel} ${isRequiredText}.`;
  } else if (dayjs(data.constructionDate).isAfter(today)) {
    errors.constructionDate = 'Date cannot be in the future';
  }

  if (!data.effectiveFromDate || data.effectiveFromDate === '') {
    errors.effectiveFromDate = `${texts.effectiveFromDateLabel} ${isRequiredText}.`;
  } else if (dayjs(data.effectiveFromDate).isAfter(today)) {
    errors.effectiveFromDate = 'Date cannot be in the future';
  }

  Object.keys(errors).forEach((k) => {
    if (!errors[k as keyof typeof errors]) delete errors[k as keyof typeof errors];
  });

  return errors;
};

const containerSx = {
  width: '100%',
  // maxWidth: 480,
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
const formContentSx = { flex: 1, px: '8%', py: 3, backgroundColor: '#FFFFFF' };
const formSubmitSx = { padding: '16px 0', backgroundColor: '#FFFFFF' };

const FloorDetailsPage: React.FC = () => {
  // Contexts and hooks for form mode, navigation, location, and property form data
  const { mode } = useFormMode();
  const navigate = useNavigate();
  const location = useLocation();
  const { formData, updateForm } = usePropertyForm();

  const floorId = (location.state as any)?.floorId as string | undefined;
  const isEditMode = Boolean(floorId);

  const [createFloorDetails] = useCreateFloorDetailsMutation();
  const [updateFloorDetails] = useUpdateFloorDetailsMutation();

  const {
    data: existingFloorData,
    isLoading: isLoadingFloorData,
    error: loadError,
  } = useGetFloorDetailsByIdQuery(floorId!, {
    skip: !floorId,
  });

  const { saveDraftText } = useFloorDetailsLocalization();
  const floorLoc = useFloorDetailsLocalization();
  const loc = useLocalization();

  const {
    floorNumberLabel,
    buildingClassificationLabel,
    igrsClassificationLabel,
    natureOfUsageLabel,
    firmNameLabel,
    occupancyLabel,
    constructionDateLabel,
    effectiveFromDateLabel,
    unstructuredLandLabel,
    lengthLabel,
    breadthLabel,
    plinthAreaLabel,
    buildingPermissionNoLabel,
    //cloneFloorText,
    addFloorRequiredMsg,
    selectPlaceholder,
    floorNumberOptions,
    buildingClassificationOptions,
    natureOfUsageOptions,
    occupancyOptions,
    unstructuredLandOptions,
    occupantNameLabel,
    previousText,
    propertyFormTitle,
    newPropertyFormTitle,
    floorDetailsSubtitle,
  } = floorLoc;

  const {
    nextButtonText,
    onlyNumbersAllowedInText,
    isRequiredText,
    OnlyalphabetsareallowedMSG,
  } = loc;

  const convertApiToLocal = (apiData: any) => {
    const data = apiData?.data || apiData;
    return {
      floorNumber: (data.FloorNo || data.floorNo || '').toString(),
      buildingClassification: data.Classification || data.classification || '',
      igrsClassification: 'A',
      natureOfUsage: data.NatureOfUsage || data.natureOfUsage || '',
      firmName: data.FirmName || data.firmName || '',
      occupancy: data.OccupancyType || data.occupancyType || '',
      constructionDate: data.ConstructionDate || data.constructionDate || '',
      effectiveFromDate: data.EffectiveFromDate || data.effectiveFromDate || '',
      unstructuredLand: data.UnstructuredLand || data.unstructuredLand || '',
      length: (data.LengthFt || data.lengthFt || '').toString(),
      breadth: (data.BreadthFt || data.breadthFt || '').toString(),
      plinthArea: (data.PlinthAreaSqFt || data.plinthAreaSqFt || '').toString(),
      buildingPermissionNo: data.BuildingPermissionNo || data.buildingPermissionNo || '',
      floorsDetailsEntered: data.FloorDetailsEntered || data.floorDetailsEntered || true,
      occupantName: data.OccupancyName || data.occupancyName || '',
    };
  };

  const getInitialLocalData = () => ({
    floorNumber: '',
    buildingClassification: '',
    igrsClassification: 'A',
    natureOfUsage: '',
    firmName: '',
    occupancy: '',
    constructionDate: '',
    effectiveFromDate: '',
    unstructuredLand: '',
    length: '',
    breadth: '',
    plinthArea: '',
    buildingPermissionNo: '',
    floorsDetailsEntered: true,
    occupantName: '',
  });

  const [localData, setLocalData] = useState(getInitialLocalData());
  const [unitOfMeasurement, setUnitOfMeasurement] = useState<string>('');
  useEffect(() => {
    getUnitOfMeasurementOptions()
      .then((data) => {
        setUnitOfMeasurement(data?.unitOfmeasurement || '');
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (isEditMode && existingFloorData) {
      const convertedData = convertApiToLocal(existingFloorData);
      setLocalData(convertedData);
    } else if (!isEditMode) {
      setLocalData(getInitialLocalData());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingFloorData, isEditMode]);

  const toOptions = (arr: string[] | undefined): DropdownOption[] =>
    (arr || []).map((label, i) => ({ id: i, label: label ?? '' }));

  const [floorNumberOpts] = useState<DropdownOption[]>(toOptions(floorNumberOptions));
  const [buildingClassificationOpts] = useState<DropdownOption[]>(
    toOptions(buildingClassificationOptions)
  );
  const [natureOfUsageOpts] = useState<DropdownOption[]>(toOptions(natureOfUsageOptions));
  const [occupancyOpts] = useState<DropdownOption[]>(toOptions(occupancyOptions));
  const [unstructuredLandOpts] = useState<DropdownOption[]>(
    toOptions(unstructuredLandOptions)
  );

  const [showFloorNumberDropdown, setShowFloorNumberDropdown] = useState(false);
  const [showBuildingClassificationDropdown, setShowBuildingClassificationDropdown] =
    useState(false);
  const [showNatureOfUsageDropdown, setShowNatureOfUsageDropdown] = useState(false);
  const [showOccupancyDropdown, setShowOccupancyDropdown] = useState(false);
  const [showUnstructuredLandDropdown, setShowUnstructuredLandDropdown] = useState(false);

  const closeAllDropdowns = () => {
    setShowFloorNumberDropdown(false);
    setShowBuildingClassificationDropdown(false);
    setShowNatureOfUsageDropdown(false);
    setShowOccupancyDropdown(false);
    setShowUnstructuredLandDropdown(false);
  };

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [showNumberWarnings, setShowNumberWarnings] = useState<Record<string, boolean>>({
    length: false,
    breadth: false,
    plinthArea: false,
    buildingPermissionNo: false,
  });

  const markTouched = (name: string) =>
    setTouchedFields((prev) => ({ ...prev, [name]: true }));

  const handleDropdownSelect = (field: keyof typeof localData) => (val: string) => {
    setLocalData((prev) => ({ ...prev, [field]: val }));
    setFieldErrors((prev) => ({ ...prev, [field]: '' }));
    markTouched(field as string);
    closeAllDropdowns();
  };

  const sanitizeNumberValue = (raw: string) => {
    let v = raw.replace(/[^0-9.]/g, '');
    if ((v.match(/\./g) || []).length > 1) {
      const parts = v.split('.');
      v = parts[0] + '.' + parts.slice(1).join('');
    }
    return v;
  };

  const handleNumberKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const forbidden = ['-', 'e', 'E', '+'];
    if (forbidden.includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleFieldChange = (field: keyof typeof localData) => (value: string) => {
    let newValue = value;

    if (field === 'firmName' || field === 'occupantName') {
      if (/[^a-zA-Z\s]/.test(value)) {
        setFieldErrors((prev) => ({ ...prev, [field]: OnlyalphabetsareallowedMSG }));
      }
      newValue = value.replace(/[^a-zA-Z\s]/g, '');
    }

    if (
      ['length', 'breadth', 'plinthArea', 'buildingPermissionNo'].includes(
        field as string
      )
    ) {
      newValue = sanitizeNumberValue(value);
      if (!/^\d*\.?\d*$/.test(newValue)) {
        setShowNumberWarnings((prev) => ({ ...prev, [field as string]: true }));
      } else {
        setShowNumberWarnings((prev) => ({ ...prev, [field as string]: false }));
      }

      if (
        newValue === '' &&
        touchedFields[field as string] &&
        field !== 'buildingPermissionNo'
      ) {
        const labelMap: any = {
          length: lengthLabel,
          breadth: breadthLabel,
          plinthArea: plinthAreaLabel,
        };
        setFieldErrors((prev) => ({
          ...prev,
          [field]: `${labelMap[field as string]} ${isRequiredText}.`,
        }));
      }
    }

    setLocalData((prev) => ({ ...prev, [field]: newValue }));
    if (touchedFields[field as string])
      setFieldErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleDateChange =
    (field: 'constructionDate' | 'effectiveFromDate') => (date: any) => {
      const value = date ? dayjs(date).format('YYYY-MM-DD') : '';
      setLocalData((prev) => ({ ...prev, [field]: value }));
      markTouched(field);
      setFieldErrors((prev) => ({ ...prev, [field]: '' }));
    };

  // ---- LEADING ZERO REMOVAL ON BLUR ----
  const handleBlurField = (field: keyof typeof localData) => {
    markTouched(field as string);

    let value = localData[field];

    // Remove leading zeros for numeric fields on blur
    if (
  ['length', 'breadth', 'plinthArea', 'buildingPermissionNo'].includes(field as string) &&
  typeof value === 'string' &&
  value !== ''
) {
  if (/^\d+(\.\d*)?$/.test(value)) {
    const parts = value.split('.');
    parts[0] = String(Number(parts[0]));
    value = parts.length > 1 ? parts.join('.') : parts[0];
    setLocalData((prev) => ({ ...prev, [field]: value }));
  }
}

    // Retain the rest of your validation logic
    if (field === 'floorNumber' && (!value || value === '')) {
      setFieldErrors((prev) => ({
        ...prev,
        [field]: `${floorNumberLabel} ${isRequiredText}.`,
      }));
      return;
    }

    if (field === 'buildingClassification' && (!value || value === '')) {
      setFieldErrors((prev) => ({
        ...prev,
        [field]: `${buildingClassificationLabel} ${isRequiredText}.`,
      }));
      return;
    }

    if (field === 'natureOfUsage' && (!value || value === '')) {
      setFieldErrors((prev) => ({
        ...prev,
        [field]: `${natureOfUsageLabel} ${isRequiredText}.`,
      }));
      return;
    }

    if (field === 'occupancy' && (!value || value === '')) {
      setFieldErrors((prev) => ({
        ...prev,
        [field]: `${occupancyLabel} ${isRequiredText}.`,
      }));
      return;
    }

    if (field === 'unstructuredLand' && (!value || value === '')) {
      setFieldErrors((prev) => ({
        ...prev,
        [field]: `${unstructuredLandLabel} ${isRequiredText}.`,
      }));
      return;
    }

    if (
      ['length', 'breadth', 'plinthArea'].includes(field as string) &&
      !value
    ) {
      const labelMap: any = {
        length: lengthLabel,
        breadth: breadthLabel,
        plinthArea: plinthAreaLabel,
      };
      setFieldErrors((prev) => ({
        ...prev,
        [field]: `${labelMap[field as string]} ${isRequiredText}.`,
      }));
    }
  };

  const convertLocalToApi = (localData: any): FloorDetailsRequest => ({
    floorNo: Number(localData.floorNumber),
    classification: localData.buildingClassification,
    natureOfUsage: localData.natureOfUsage,
    firmName: localData.firmName,
    occupancyType: localData.occupancy,
    occupancyName: localData.occupantName,
    constructionDate: localData.constructionDate,
    effectiveFromDate: localData.effectiveFromDate,
    unstructuredLand: localData.unstructuredLand,
    lengthFt: Number(localData.length),
    breadthFt: Number(localData.breadth),
    plinthAreaSqFt: Number(localData.plinthArea),
    buildingPermissionNo: localData.buildingPermissionNo,
    floorDetailsEntered: true,
    constructionDetailsId: formData.constructionDetails!.id!.toString(),
  });

  // handleAddFloor: Validates and submits form, creates/updates floor details via API
  const handleAddFloor = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const textsForValidation = {
      floorNumberLabel,
      buildingClassificationLabel,
      igrsClassificationLabel,
      natureOfUsageLabel,
      firmNameLabel,
      occupancyLabel,
      constructionDateLabel,
      effectiveFromDateLabel,
      unstructuredLandLabel,
      lengthLabel,
      breadthLabel,
      plinthAreaLabel,
      buildingPermissionNoLabel,
      isRequiredText,
    };

    const validation = validateFloor(localData, textsForValidation, isRequiredText);
    setFieldErrors(validation);

    if (Object.keys(validation).length > 0) {
      setError(addFloorRequiredMsg);
      return;
    }
    setError(null);

    const newFloor: FloorDetails = {
      ...localData,
      length: Number(localData.length),
      breadth: Number(localData.breadth),
      plinthArea: Number(localData.plinthArea),
      buildingPermissionNo: localData.buildingPermissionNo,
      occupantName: localData.occupantName,
    };

    try {
      const apiData = convertLocalToApi(localData);
      if (isEditMode && floorId) {
        const result = await updateFloorDetails({ id: floorId, data: apiData }).unwrap();
        console.log(result);
        
        const floorIndex =
          formData.floors?.findIndex((f, idx) => {
            return (
              idx === formData.floors?.indexOf(f) &&
              f.floorNumber === localData.floorNumber
            );
          }) ?? -1;

        if (floorIndex !== -1) {
          const updated = [...(formData.floors ?? [])];
          updated[floorIndex] = newFloor;
          updateForm({ floors: updated });
        }
      } else {
        const result = await createFloorDetails(apiData).unwrap();
        console.log(result);
        
        updateForm({ floors: [...(formData.floors ?? []), newFloor] });
      }
      setLocalData(getInitialLocalData());
      setFieldErrors({});
      navigate('/property-form/floor-details-cards');
    } catch (error: any) {
      console.error('Failed to save floor details:', error);
      const errorMessage =
        error?.data?.message || 'Failed to save floor details. Please try again.';
      showErrorPopup(errorMessage);
      setError(errorMessage);
    }
  };

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
    updateForm({ floors: formData.floors });
  };

  if (isEditMode && isLoadingFloorData) {
    return (
      <Box sx={{ ...containerSx, justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading floor details...</Typography>
      </Box>
    );
  }

  if (isEditMode && loadError) {
    return (
      <Box sx={{ ...containerSx, justifyContent: 'center', alignItems: 'center' }}>
        <Typography color="error" sx={{ mt: 2 }}>
          Failed to load floor details. Please try again.
        </Typography>
        <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Box>
    );
  }

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
            subtitle={floorDetailsSubtitle}
            steps={10}
            activeStep={7}
            onPrevious={handleGoBack}
            onSaveDraft={handleSaveDraft}
            saveDraftText={saveDraftText}
            previousText={previousText}
          />
        </Box>

        <Box component="main" sx={formContentSx}>
          <form onSubmit={(e) => e.preventDefault()}>
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ flex: 1, width: '60%' }}>
                  <CustomDropdown
                    label={floorNumberLabel}
                    name="floorNumber"
                    value={localData.floorNumber}
                    options={floorNumberOpts}
                    showDropdown={showFloorNumberDropdown}
                    setShowDropdown={(b) => {
                      closeAllDropdowns();
                      setShowFloorNumberDropdown(b);
                    }}
                    onSelect={(_n, v) => handleDropdownSelect('floorNumber')(v)}
                    closeOtherDropdowns={closeAllDropdowns}
                    selectText={selectPlaceholder}
                    required
                    error={fieldErrors.floorNumber}
                    touched={!!touchedFields.floorNumber}
                    onBlur={() => handleBlurField('floorNumber')}
                  />
                </Box>

                <Box sx={{ flex: 1, width: '60%' }}>
                  <CustomDropdown
                    label={buildingClassificationLabel}
                    name="buildingClassification"
                    value={localData.buildingClassification}
                    options={buildingClassificationOpts}
                    showDropdown={showBuildingClassificationDropdown}
                    setShowDropdown={(b) => {
                      closeAllDropdowns();
                      setShowBuildingClassificationDropdown(b);
                    }}
                    onSelect={(_n, v) =>
                      handleDropdownSelect('buildingClassification')(v)
                    }
                    closeOtherDropdowns={closeAllDropdowns}
                    selectText={selectPlaceholder}
                    required
                    error={fieldErrors.buildingClassification}
                    touched={!!touchedFields.buildingClassification}
                    onBlur={() => handleBlurField('buildingClassification')}
                  />
                </Box>
              </Box>
              <CustomDropdown
                label={natureOfUsageLabel}
                name="natureOfUsage"
                value={localData.natureOfUsage}
                options={natureOfUsageOpts}
                showDropdown={showNatureOfUsageDropdown}
                setShowDropdown={(b) => {
                  closeAllDropdowns();
                  setShowNatureOfUsageDropdown(b);
                }}
                onSelect={(_n, v) => handleDropdownSelect('natureOfUsage')(v)}
                closeOtherDropdowns={closeAllDropdowns}
                selectText={selectPlaceholder}
                required
                error={fieldErrors.natureOfUsage}
                touched={!!touchedFields.natureOfUsage}
                onBlur={() => handleBlurField('natureOfUsage')}
              />
              <Box>
                <FormTextField
                  label={firmNameLabel}
                  value={localData.firmName}
                  onChange={handleFieldChange('firmName')}
                  onBlur={() => handleBlurField('firmName')}
                  placeholder=""
                  type="text"
                  required={false}
                  error={
                    fieldErrors.firmName ||
                    (touchedFields.firmName ? fieldErrors.firmName : '')
                  }
                  touched={!!touchedFields.firmName}
                  sx={{ ...uniformInputSx }}
                />
              </Box>
              <CustomDropdown
                label={occupancyLabel}
                name="occupancy"
                value={localData.occupancy}
                options={occupancyOpts}
                showDropdown={showOccupancyDropdown}
                setShowDropdown={(b) => {
                  closeAllDropdowns();
                  setShowOccupancyDropdown(b);
                }}
                onSelect={(_n, v) => handleDropdownSelect('occupancy')(v)}
                closeOtherDropdowns={closeAllDropdowns}
                selectText={selectPlaceholder}
                required
                error={fieldErrors.occupancy}
                touched={!!touchedFields.occupancy}
                onBlur={() => handleBlurField('occupancy')}
              />
              <FormTextField
                label={occupantNameLabel}
                value={localData.occupantName}
                onChange={handleFieldChange('occupantName')}
                onBlur={() => handleBlurField('occupantName')}
                placeholder=""
                type="text"
                required={false}
                error={fieldErrors.occupantName}
                touched={!!touchedFields.occupantName}
                sx={{ ...uniformInputSx }}
              />
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography sx={{ fontSize: 14, fontWeight: 400 }}>
                    {constructionDateLabel}
                    <span style={{ color: '#D32F2F', marginLeft: 4 }}>*</span>
                    <span style={{ marginLeft: 6 }}>:</span>
                  </Typography>
                  <DatePicker
                    value={
                      localData.constructionDate
                        ? dayjs(localData.constructionDate)
                        : null
                    }
                    onChange={handleDateChange('constructionDate')}
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
                        placeholder: ' ',
                        onBlur: () => handleBlurField('constructionDate'),
                        inputProps: {
                          style: { marginTop: '-8px' },
                        },
                        sx: {
                          width: '60%',
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
                      },
                      actionBar: { actions: ['clear', 'accept'] },
                    }}
                    maxDate={dayjs()}
                  />
                  {fieldErrors.constructionDate && (
                    <div className="error-message" style={{ marginTop: 8,color: '#D32F2F' }}>
                      {fieldErrors.constructionDate}
                    </div>
                  )}
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 14, fontWeight: 400 }}>
                    {effectiveFromDateLabel}
                    <span style={{ color: '#D32F2F', marginLeft: 4 }}>*</span>
                    <span style={{ marginLeft: 6 }}>:</span>
                  </Typography>
                  <DatePicker
                    value={
                      localData.effectiveFromDate
                        ? dayjs(localData.effectiveFromDate)
                        : null
                    }
                    onChange={handleDateChange('effectiveFromDate')}
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
                        placeholder: ' ',
                        
                        onBlur: () => handleBlurField('effectiveFromDate'),
                        inputProps: {
                          style: { marginTop: '-8px' },
                        },
                        sx: {
                          width: '60%',
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
                      },
                      actionBar: { actions: ['clear', 'accept'] },
                    }}
                    maxDate={dayjs()}
                  />
                  {fieldErrors.effectiveFromDate && (
                    <div className="error-message" style={{ marginTop: 8,color: '#D32F2F'}}>
                      {fieldErrors.effectiveFromDate}
                    </div>
                  )}
                </Box>
              </Box>
              <Box>
                <CustomDropdown
                  label={unstructuredLandLabel}
                  name="unstructuredLand"
                  value={localData.unstructuredLand}
                  options={unstructuredLandOpts}
                  showDropdown={showUnstructuredLandDropdown}
                  setShowDropdown={(b) => {
                    closeAllDropdowns();
                    setShowUnstructuredLandDropdown(b);
                  }}
                  onSelect={(_n, v) => handleDropdownSelect('unstructuredLand')(v)}
                  closeOtherDropdowns={closeAllDropdowns}
                  selectText={selectPlaceholder}
                  required
                  error={fieldErrors.unstructuredLand}
                  touched={!!touchedFields.unstructuredLand}
                  onBlur={() => handleBlurField('unstructuredLand')}
                />
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <FormTextField
                  label={`${lengthLabel} (${unitOfMeasurement})`}
                  value={localData.length}
                  onChange={handleFieldChange('length')}
                  onBlur={() => handleBlurField('length')}
                  placeholder=""
                  type="number"
                  required
                  inputProps={{ onKeyDown: handleNumberKeyDown }}
                  error={
                    touchedFields.length
                      ? fieldErrors.length
                      : showNumberWarnings.length
                      ? `${onlyNumbersAllowedInText} ${lengthLabel}.`
                      : ''
                  }
                  touched={!!touchedFields.length || !!showNumberWarnings.length}
                  sx={{ ...uniformInputSx }}
                />

                <FormTextField
                  label={`${breadthLabel} (${unitOfMeasurement})`}
                  value={localData.breadth}
                  onChange={handleFieldChange('breadth')}
                  onBlur={() => handleBlurField('breadth')}
                  placeholder=""
                  type="number"
                  required
                  inputProps={{ onKeyDown: handleNumberKeyDown }}
                  error={
                    touchedFields.breadth
                      ? fieldErrors.breadth
                      : showNumberWarnings.breadth
                      ? `${onlyNumbersAllowedInText} ${breadthLabel}.`
                      : ''
                  }
                  touched={!!touchedFields.breadth || !!showNumberWarnings.breadth}
                  sx={{ ...uniformInputSx }}
                />
              </Box>
              <FormTextField
                label={`${plinthAreaLabel} (Sq.${unitOfMeasurement})`}
                value={localData.plinthArea}
                onChange={handleFieldChange('plinthArea')}
                onBlur={() => handleBlurField('plinthArea')}
                
                placeholder=""
                type="number"
                required
                inputProps={{ onKeyDown: handleNumberKeyDown,
                  onFocus:() => markTouched('plinthArea')
                 }}
                error={
                  touchedFields.plinthArea
                    ? fieldErrors.plinthArea
                    : showNumberWarnings.plinthArea
                    ? `${onlyNumbersAllowedInText} ${plinthAreaLabel}.`
                    : ''
                }
                touched={!!touchedFields.plinthArea || !!showNumberWarnings.plinthArea}
                sx={{ ...uniformInputSx }}
              />
              <FormTextField
                label={buildingPermissionNoLabel}
                value={localData.buildingPermissionNo}
                onChange={handleFieldChange('buildingPermissionNo')}
                onBlur={() => handleBlurField('buildingPermissionNo')}
                
                placeholder=""
                type="number"
                required={false}
                inputProps={{ onKeyDown: handleNumberKeyDown,
                  onFocus: () => markTouched('buildingPermissionNo')
                 }}
                error={
                  touchedFields.buildingPermissionNo
                    ? fieldErrors.buildingPermissionNo
                    : showNumberWarnings.buildingPermissionNo
                    ? `${onlyNumbersAllowedInText} ${buildingPermissionNoLabel}.`
                    : ''
                }
                touched={
                  !!touchedFields.buildingPermissionNo ||
                  !!showNumberWarnings.buildingPermissionNo
                }
                sx={{ ...uniformInputSx }}
              />
              {/* <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1 }}>
                <Checkbox
                  checked={false}
                  sx={{ color: '#6D4531', '&.Mui-checked': { color: '#6D4531' } }}
                />
                <Typography>{cloneFloorText}</Typography>
              </Box> */}
              {error && (
                <div className="error-message" style={{ color: 'red' }}>
                  {error}
                </div>
              )}
              <Box sx={formSubmitSx}>
                <Button
                  onClick={handleAddFloor}
                  type="button"
                  sx={{
                    ...verifyButtonSx,
                    display: 'block',
                    marginLeft: 'auto',
                    marginTop: '70px',
                  }}
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

export default FloorDetailsPage;