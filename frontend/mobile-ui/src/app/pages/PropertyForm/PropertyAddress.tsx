// PropertyAddress.tsx
// This component renders the property address form in the property registration flow.
// It handles address input, validation, dropdowns for wards/blocks, and conditional correspondence address fields.
// Uses localization, context, and MUI for UI and state management.
import React, { useEffect, useState, useRef } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';

import { useNavigate } from 'react-router-dom';
import { useFormMode } from '../../../context/FormModeContext';
import JsonService from '../../../services/jsonServerApiCalls';
import { usePropertyAddressLocalization } from '../../../services/AgentLocalisation/localisation-PropertyAddress';
import { usePropertyForm } from '../../../context/PropertyFormContext';
import StepHeader from '../../features/Agent/components/StepHeader';
import { useLocalization } from '../../../services/AgentLocalisation/formLocalisation';
import CustomDropdown, {
  type DropdownOption,
} from '../../features/PropertyForm/components/IGRSDetail/IGRSdropdown';
import FormTextField from '../../features/PropertyForm/components/IGRSDetail/IGRSFormTextFiled';
import { uniformInputSx, verifyButtonSx, selectDropdownSx } from './styles/sharedStyles';
import type { AlertType } from '../../models/AlertType.model';
import type { Address } from '../../../redux/apis/addressApi';
import {
  useAddAddressMutation,
  useUpdateAddressMutation,
} from '../../../redux/apis/addressApi';
import { NotificationPopup } from '../../components/Popup/NotificationPopup';

// Container styles for the main layout
const containerSx = {
  width: '100%',
  // maxWidth: 375,
  margin: '0 auto',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column' as const,
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  bgcolor: '#fff',
};

const headerSx = { backgroundColor: '#F9E6E0', padding: '16px' };
const contentSx = { flex: 1, px: '8%', py: 3, backgroundColor: '#FFFFFF' };

/**
 * PropertyAddress component
 * Renders the address form for a property, including validation, dropdowns, and conditional fields.
 * Integrates with context for form data and localization, and uses MUI for UI.
 */
const PropertyAddress: React.FC = () => {
  // Context and navigation hooks
  const { mode } = useFormMode();
  const navigate = useNavigate();
  const { formData, updateForm } = usePropertyForm();
  const localizationData = usePropertyAddressLocalization();

  // Destructure localized strings for labels and messages
  const {
    propertyFormTitle,
    newPropertyFormTitle,
    propertyAddressSubtitle,
    previousText,
    saveDraftText,
    localityLabel,
    zoneNoLabel,
    wardNoLabel,
    blockNoLabel,
    streetLabel,
    electionWardLabel,
    secretariatWardLabel,
    pincodeLabel,
    correspondenceAddressDifferentLabel,
    fixErrorsAlert,
    // draftSavedAlert,
  } = localizationData;

  // Destructure more localized strings for validation and messages
  const {
    nextButtonText,
    LocalityIsRequiredMSG,
    ZoneNoIsRequiredMSG,
    // ZoneNoShouldBeNumericMSG,
    ElectionWardIsRequiredMSG,
    SecretariatWardIsRequiredMSG,
    PincodeIsRequiredMSG,
    PincodeShouldBeNumericMSG,
    PincodeMustBe6DigitsMSG,
    CorrespondenceAddress1IsRequiredMSG,
    CorrespondencePincodeIsRequiredMSG,
    CorrespondencePincodeMustBe6DigitsMSG,
    // PincodeShouldContainOnlyNumbersMSG,
    CorressPondenceAddressMSG,
    Address1MSG,
    Address2MSG,
    PleaseSelectAValueMSG,
  } = useLocalization();

  // RTK Query hooks for address API
  const [addAddress] = useAddAddressMutation();
  const [updateAddress] = useUpdateAddressMutation();

  // Translation fallbacks for dropdowns (from localization or JSON)
  const wardNoTranslations = (localizationData as any).wardNoOptions || [];
  const blockNoTranslations = (localizationData as any).blockNoOptions || [];
  const electionWardTranslations = (localizationData as any).electionWardOptions || [];
  const secretariatWardTranslations =
    (localizationData as any).secretariatWardOptions || [];

  // State for field errors
  const [errors, setErrors] = useState<Record<string, string>>({
    locality: '',
    zoneNo: '',
    wardNo: '',
    blockNo: '',
    electionWard: '',
    secretariatWard: '',
    pincode: '',
    correspondenceAddress1: '',
    correspondencePincode: '',
    street: '',
  });

  // State for touched fields (for validation UI)
  const [touched, setTouched] = useState<Record<string, boolean>>({
    locality: false,
    zoneNo: false,
    wardNo: false,
    blockNo: false,
    electionWard: false,
    secretariatWard: false,
    pincode: false,
    correspondenceAddress1: false,
    correspondencePincode: false,
    street: false,
  });

  // State for dropdown touched (for validation UI)
  const [dropdownTouched, setDropdownTouched] = useState({
    wardNo: false,
    blockNo: false,
  });

  // State for address form data
  const [addressData, setAddressData] = useState({
    locality: formData.propertyAddress?.Locality || '',
    zoneNo: formData.propertyAddress?.ZoneNo || '',
    wardNo: formData.propertyAddress?.WardNo || '',
    blockNo: formData.propertyAddress?.BlockNo || '',
    street: formData.propertyAddress?.Street || '',
    electionWard: formData.propertyAddress?.ElectionWard || '',
    secretariatWard: formData.propertyAddress?.SecretariatWard || '',
    pincode: formData.propertyAddress?.PinCode || '',
    isCorrespondenceAddressDifferent:
      formData.propertyAddress?.DifferentCorrespondenceAddress ?? false,
    correspondenceAddress1: formData.propertyAddress?.CororespondenceAddress1 || '',
    correspondenceAddress2: formData.propertyAddress?.CororespondenceAddress2 || '',
    correspondencePincode: formData.propertyAddress?.CorrespondencePincode || '',
  });

  // Sync addressData with formData from context when propertyAddress changes
  useEffect(() => {
    setAddressData({
      locality: formData.propertyAddress?.Locality || '',
      zoneNo: formData.propertyAddress?.ZoneNo || '',
      wardNo: formData.propertyAddress?.WardNo || '',
      blockNo: formData.propertyAddress?.BlockNo || '',
      street: formData.propertyAddress?.Street || '',
      electionWard: formData.propertyAddress?.ElectionWard || '',
      secretariatWard: formData.propertyAddress?.SecretariatWard || '',
      pincode: formData.propertyAddress?.PinCode || '',
      isCorrespondenceAddressDifferent:
        formData.propertyAddress?.DifferentCorrespondenceAddress ?? false,
      correspondenceAddress1: formData.propertyAddress?.CororespondenceAddress1 || '',
      correspondenceAddress2: formData.propertyAddress?.CororespondenceAddress2 || '',
      correspondencePincode: formData.propertyAddress?.CorrespondencePincode || '',
    });
  }, [formData.propertyAddress]);

  // Dropdown option state (normalized for CustomDropdown)
  const [wardNoOptions, setWardNoOptions] = useState<DropdownOption[]>([]);
  const [blockNoOptions, setBlockNoOptions] = useState<DropdownOption[]>([]);
  const [electionWardOptions, setElectionWardOptions] = useState<DropdownOption[]>([]);
  const [secretariatWardOptions, setSecretariatWardOptions] = useState<DropdownOption[]>([]);

  // Raw-from-JSON lists for dropdowns (used if no translations)
  const [wardNoOptionsFromJson, setWardNoOptionsFromJson] = useState<string[]>([]);
  const [blockNoOptionsFromJson, setBlockNoOptionsFromJson] = useState<string[]>([]);
  const [electionWardOptionsFromJson, setElectionWardOptionsFromJson] = useState<string[]>([]);
  const [secretariatWardOptionsFromJson, setSecretariatWardOptionsFromJson] = useState<string[]>([]);

  // Open states for CustomDropdowns (parent-controlled)
  const [showWardNoDropdown, setShowWardNoDropdown] = useState(false);
  const [showBlockNoDropdown, setShowBlockNoDropdown] = useState(false);
  const [showElectionWardDropdown, setShowElectionWardDropdown] = useState(false);
  const [showSecretariatWardDropdown, setShowSecretariatWardDropdown] = useState(false);

  // Refs for outside-click handling (optional, not used in this code)
  const wardDropdownRef = useRef<HTMLDivElement | null>(null);
  const blockDropdownRef = useRef<HTMLDivElement | null>(null);
  const electionWardDropdownRef = useRef<HTMLDivElement | null>(null);
  const secretariatWardDropdownRef = useRef<HTMLDivElement | null>(null);

  // Fetch dropdown options from JSON service on mount
  useEffect(() => {
    JsonService.getWardNoOptions()
      .then((data) => {
        const jsonOptions = (data || []).map((item: any) => item.name ?? '');
        setWardNoOptionsFromJson(jsonOptions);
      })
      .catch(() => setWardNoOptionsFromJson([]));

    JsonService.getBlockNoOptions()
      .then((data) => {
        const jsonOptions = (data || []).map((item: any) => item.name ?? '');
        setBlockNoOptionsFromJson(jsonOptions);
      })
      .catch(() => setBlockNoOptionsFromJson([]));

    JsonService.getElectionWardOptions()
      .then((data) => {
        const jsonOptions = (data || []).map((item: any) => item.name ?? '');
        setElectionWardOptionsFromJson(jsonOptions);
      })
      .catch(() => setElectionWardOptionsFromJson([]));

    JsonService.getSecretariatWardOptions()
      .then((data) => {
        const jsonOptions = (data || []).map((item: any) => item.name ?? '');
        setSecretariatWardOptionsFromJson(jsonOptions);
      })
      .catch(() => setSecretariatWardOptionsFromJson([]));
  }, []);

  // Normalize source arrays into DropdownOption[] and prefer translations when provided
  useEffect(() => {
    const normalize = (arr: string[]) =>
      (arr || []).map((label, i) => ({ id: i, label: label ?? '' }));

    const wardSource =
      wardNoTranslations && wardNoTranslations.length > 0
        ? wardNoTranslations
        : wardNoOptionsFromJson;
    const blockSource =
      blockNoTranslations && blockNoTranslations.length > 0
        ? blockNoTranslations
        : blockNoOptionsFromJson;
    const electSource =
      electionWardTranslations && electionWardTranslations.length > 0
        ? electionWardTranslations
        : electionWardOptionsFromJson;
    const secretSource =
      secretariatWardTranslations && secretariatWardTranslations.length > 0
        ? secretariatWardTranslations
        : secretariatWardOptionsFromJson;

    setWardNoOptions(normalize(wardSource));
    setBlockNoOptions(normalize(blockSource));
    setElectionWardOptions(normalize(electSource));
    setSecretariatWardOptions(normalize(secretSource));
  }, [
    wardNoTranslations,
    blockNoTranslations,
    electionWardTranslations,
    secretariatWardTranslations,
    wardNoOptionsFromJson,
    blockNoOptionsFromJson,
    electionWardOptionsFromJson,
    secretariatWardOptionsFromJson,
  ]);

  // Outside click close behavior for dropdowns (closes dropdown if click outside)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wardDropdownRef.current &&
        !wardDropdownRef.current.contains(event.target as Node)
      )
        setShowWardNoDropdown(false);
      if (
        blockDropdownRef.current &&
        !blockDropdownRef.current.contains(event.target as Node)
      )
        setShowBlockNoDropdown(false);
      if (
        electionWardDropdownRef.current &&
        !electionWardDropdownRef.current.contains(event.target as Node)
      )
        setShowElectionWardDropdown(false);
      if (
        secretariatWardDropdownRef.current &&
        !secretariatWardDropdownRef.current.contains(event.target as Node)
      )
        setShowSecretariatWardDropdown(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /**
   * Validation helper for address fields
   * @param name Field name
   * @param value Field value
   * @returns Error message or empty string
   */
  const validateField = (name: string, value: string) => {
    const v = value ?? '';
    let error = '';
    if (name === 'locality') {
      if (!v.trim()) error = LocalityIsRequiredMSG ?? '';
    }
    if (name === 'zoneNo') {
      if (!v.trim()) error = ZoneNoIsRequiredMSG ?? '';
      else if (!/^Zone-\d+$/.test(v))
        error = 'Zone number must be in format: Zone-<number>';
    }
    if (name === 'electionWard') {
      if (!v.trim()) error = ElectionWardIsRequiredMSG ?? '';
    }
    if (name === 'secretariatWard') {
      if (!v.trim()) error = SecretariatWardIsRequiredMSG ?? '';
    }
    if (name === 'pincode') {
      if (!v.trim()) error = PincodeIsRequiredMSG ?? '';
      else if (/[^0-9]/.test(v)) error = PincodeShouldBeNumericMSG ?? '';
      else if (v.length !== 6) error = PincodeMustBe6DigitsMSG ?? '';
    }
    if (name === 'wardNo' || name === 'blockNo') {
      if (!v) error = PleaseSelectAValueMSG;
    }
    if (name === 'correspondenceAddress1') {
      if (!v.trim()) error = CorrespondenceAddress1IsRequiredMSG ?? '';
    }
    if (name === 'correspondencePincode') {
      if (!v.trim()) error = CorrespondencePincodeIsRequiredMSG ?? '';
      else if (!/^\d{6}$/.test(v)) error = CorrespondencePincodeMustBe6DigitsMSG ?? '';
    }
    return error;
  };

  // text input change handler
  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   let newValue = value;
  //   let errorMsg = '';

  //   if (name === 'zoneNo' || name === 'pincode') {
  //     if (/[^0-9]/.test(value)) {
  //       errorMsg = name === 'zoneNo' ? (ZoneNoShouldBeNumericMSG ?? '') : (PincodeShouldContainOnlyNumbersMSG ?? '');
  //       newValue = value.replace(/[^0-9]/g, '');
  //     }
  //   }
  //   if (name === 'pincode' && newValue.length > 6) newValue = newValue.slice(0, 6);

  //   setAddressData(prev => ({ ...prev, [name]: newValue }));
  //   setTouched(prev => ({ ...prev, [name]: true }));
  //   setErrors(prev => ({ ...prev, [name]: errorMsg ? errorMsg : validateField(name, newValue) }));
  // };

  // Dropdown select handlers (ward/block/election/secretariat)
  // Sets value, marks as touched, clears error, and closes dropdown
  const handleDropdownSelect =
    (field: 'wardNo' | 'blockNo' | 'electionWard' | 'secretariatWard') =>
    (optionLabel: string) => {
      setAddressData((prev) => ({ ...prev, [field]: optionLabel }));
      setTouched((prev) => ({ ...prev, [field]: true }));
      setErrors((prev) => ({ ...prev, [field]: '' }));
      if (field === 'wardNo') setShowWardNoDropdown(false);
      if (field === 'blockNo') setShowBlockNoDropdown(false);
      if (field === 'electionWard') setShowElectionWardDropdown(false);
      if (field === 'secretariatWard') setShowSecretariatWardDropdown(false);
    };

  // Dropdown blur handler (validates and marks as touched)
  const handleDropdownBlur = (
    field: 'wardNo' | 'blockNo' | 'electionWard' | 'secretariatWard'
  ) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validateField(field, addressData[field]) }));
    if (field === 'wardNo' || field === 'blockNo') {
      setDropdownTouched((prev) => ({ ...prev, [field]: true }));
    }
  };

  // State for notification popup
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

  // Helper to show error notification popup
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

  /**
   * Handles form submission: validates fields, prepares payload, calls add/update API, updates context, and navigates.
   */
  const handleSubmit = async () => {
    // Check for property id
    if (!formData.id) {
      showErrorPopup('Property ID is missing');
      return;
    }

    // validate all
    const validation = {
      locality: validateField('locality', addressData.locality),
      zoneNo: validateField('zoneNo', addressData.zoneNo),
      wardNo: validateField('wardNo', addressData.wardNo),
      blockNo: validateField('blockNo', addressData.blockNo),
      electionWard: validateField('electionWard', addressData.electionWard),
      secretariatWard: validateField('secretariatWard', addressData.secretariatWard),
      pincode: validateField('pincode', addressData.pincode.toString()),
      correspondenceAddress1: addressData.isCorrespondenceAddressDifferent
        ? validateField('correspondenceAddress1', addressData.correspondenceAddress1)
        : '',
      correspondencePincode: addressData.isCorrespondenceAddressDifferent
        ? validateField(
            'correspondencePincode',
            addressData.correspondencePincode.toString()
          )
        : '',
      street: validateField('street', addressData.street),
    };

    setTouched({
      locality: true,
      zoneNo: true,
      wardNo: true,
      blockNo: true,
      electionWard: true,
      secretariatWard: true,
      pincode: true,
      correspondenceAddress1: true,
      correspondencePincode: true,
      street: true,
    });
    setDropdownTouched({ wardNo: true, blockNo: true });
    setErrors(validation);

    if (
      (addressData.isCorrespondenceAddressDifferent &&
        (!addressData.correspondenceAddress1.trim() ||
          !addressData.correspondencePincode.toString().trim())) ||
      Object.values(validation).some(Boolean)
    ) {
      showErrorPopup(fixErrorsAlert);
      return;
    }

    const payload: Address = {
      Locality: addressData.locality,
      ZoneNo: addressData.zoneNo,
      WardNo: addressData.wardNo,
      BlockNo: addressData.blockNo,
      Street: addressData.street,
      ElectionWard: addressData.electionWard,
      SecretariatWard: addressData.secretariatWard,
      PinCode: Number(addressData.pincode),
      DifferentCorrespondenceAddress: addressData.isCorrespondenceAddressDifferent,
      PropertyId: formData.id,
      CororespondenceAddress1: addressData.correspondenceAddress1,
      CororespondenceAddress2: addressData.correspondenceAddress2,
      CorrespondencePincode: addressData.correspondencePincode
        ? Number(addressData.correspondencePincode)
        : undefined,
    };

    try {
      let response;
      if (formData.propertyAddress?.ID) {
        response = await updateAddress({
          id: formData.propertyAddress!.ID,
          address: payload,
        }).unwrap();
      } else {
        response = await addAddress(payload).unwrap();
      }

      updateForm({
        propertyAddress: {
          ...response.data,
        },
      });
      navigate('/property-form/assessment-details');
    } catch (err: any) {
      showErrorPopup(err?.data?.message || 'Failed to save address');
    }
  };

  // Handler for back navigation
  const handleGoBack = () => navigate(-1);

  // Handler for saving draft (currently commented out)
  const handleSaveDraft = () => {
    // updateForm({ propertyAddress: { ...addressData } });
    // showErrorPopup(draftSavedAlert);
  };
  // Prevents non-numeric input in number fields
  const handleNumberKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const forbidden = ['-', 'e', 'E', '+', '.', ' '];
    if (forbidden.includes(e.key)) {
      e.preventDefault();
    }
  };

  // Render the property address form UI
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
            title={mode === 'verify' ? propertyFormTitle : newPropertyFormTitle}
            subtitle={propertyAddressSubtitle}
            steps={10}
            activeStep={2}
            onPrevious={handleGoBack}
            previousText={previousText}
            onSaveDraft={handleSaveDraft}
            saveDraftText={saveDraftText}
          />
        </Box>

        <Box component="main" sx={contentSx}>
          <Stack spacing={1}>
            <Box>
              <FormTextField
                label={localityLabel}
                value={addressData.locality}
                onChange={(v) => {
                  setAddressData((prev) => ({ ...prev, locality: v }));
                  setTouched((prev) => ({ ...prev, locality: true }));
                  setErrors((prev) => ({
                    ...prev,
                    locality: validateField('locality', v),
                  }));
                }}
                onBlur={() => {
                  setTouched((prev) => ({ ...prev, locality: true }));
                  setErrors((prev) => ({
                    ...prev,
                    locality: validateField('locality', addressData.locality),
                  }));
                }}
                required
                error={touched.locality ? errors.locality : ''}
                touched={touched.locality}
                sx={{ ...uniformInputSx }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Box sx={{ flex: 1 }}>
                <FormTextField
                  label={zoneNoLabel}
                  value={addressData.zoneNo}
                  onChange={(v) => {
                    // Allow only 'Zone-' prefix followed by numbers
                    let sanitized = v;
                    if (!v.startsWith('Zone-')) {
                      sanitized = 'Zone-';
                    } else {
                      const afterPrefix = v.substring(5);
                      sanitized = 'Zone-' + afterPrefix.replace(/[^0-9]/g, '');
                    }
                    setAddressData((prev) => ({ ...prev, zoneNo: sanitized }));
                    setTouched((prev) => ({ ...prev, zoneNo: true }));
                    setErrors((prev) => ({
                      ...prev,
                      zoneNo: validateField('zoneNo', sanitized),
                    }));
                  }}
                  onBlur={() => {
                    setTouched((prev) => ({ ...prev, zoneNo: true }));
                    setErrors((prev) => ({
                      ...prev,
                      zoneNo: validateField('zoneNo', addressData.zoneNo),
                    }));
                  }}
                  required
                  error={touched.zoneNo ? errors.zoneNo : ''}
                  touched={touched.zoneNo}
                  sx={{ width: '100%', ...uniformInputSx }}
                  type="text"
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <CustomDropdown
                  label={wardNoLabel}
                  name="wardNo"
                  value={addressData.wardNo}
                  options={wardNoOptions}
                  showDropdown={showWardNoDropdown}
                  setShowDropdown={setShowWardNoDropdown}
                  onSelect={(_n, v) => handleDropdownSelect('wardNo')(v)}
                  closeOtherDropdowns={() => setShowWardNoDropdown(false)}
                  selectText=""
                  required
                  error={dropdownTouched.wardNo || touched.wardNo ? errors.wardNo : ''}
                  touched={dropdownTouched.wardNo || touched.wardNo}
                  onBlur={() => handleDropdownBlur('wardNo')}
                  sx={{ ...selectDropdownSx }}
                />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Box sx={{ flex: 1 }}>
                <CustomDropdown
                  label={blockNoLabel}
                  name="blockNo"
                  value={addressData.blockNo}
                  options={blockNoOptions}
                  showDropdown={showBlockNoDropdown}
                  setShowDropdown={setShowBlockNoDropdown}
                  onSelect={(_n, v) => handleDropdownSelect('blockNo')(v)}
                  closeOtherDropdowns={() => setShowBlockNoDropdown(false)}
                  selectText=""
                  required
                  error={dropdownTouched.blockNo || touched.blockNo ? errors.blockNo : ''}
                  touched={dropdownTouched.blockNo || touched.blockNo}
                  onBlur={() => handleDropdownBlur('blockNo')}
                  sx={{ ...selectDropdownSx }}
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <FormTextField
                  label={streetLabel}
                  value={addressData.street}
                  onChange={(v) => {
                    setAddressData((prev) => ({ ...prev, street: v }));
                    setTouched((prev) => ({ ...prev, street: true }));
                    setErrors((prev) => ({ ...prev, street: '' }));
                  }}
                  onBlur={() => {
                    setTouched((prev) => ({ ...prev, street: true }));
                  }}
                  required={false}
                  error={touched.street ? errors.street : ''}
                  touched={touched.street}
                  sx={{ ...uniformInputSx }}
                />
              </Box>
            </Box>

            <CustomDropdown
              label={electionWardLabel}
              name="electionWard"
              value={addressData.electionWard}
              options={electionWardOptions}
              showDropdown={showElectionWardDropdown}
              setShowDropdown={setShowElectionWardDropdown}
              onSelect={(_n, v) => handleDropdownSelect('electionWard')(v)}
              closeOtherDropdowns={() => setShowElectionWardDropdown(false)}
              selectText=""
              required
              error={touched.electionWard ? errors.electionWard : ''}
              touched={touched.electionWard}
              onBlur={() => handleDropdownBlur('electionWard')}
              sx={{ ...selectDropdownSx }}
            />

            <CustomDropdown
              label={secretariatWardLabel}
              name="secretariatWard"
              value={addressData.secretariatWard}
              options={secretariatWardOptions}
              showDropdown={showSecretariatWardDropdown}
              setShowDropdown={setShowSecretariatWardDropdown}
              onSelect={(_n, v) => handleDropdownSelect('secretariatWard')(v)}
              closeOtherDropdowns={() => setShowSecretariatWardDropdown(false)}
              selectText=""
              required
              error={touched.secretariatWard ? errors.secretariatWard : ''}
              touched={touched.secretariatWard}
              onBlur={() => handleDropdownBlur('secretariatWard')}
              sx={{ ...selectDropdownSx }}
            />

            <Box>
              <FormTextField
                label={pincodeLabel}
                value={addressData.pincode.toString()}
                onChange={(v) => {
                  let val = v.replace(/[^0-9]/g, '');
                  if (val.length > 6) val = val.slice(0, 6);
                  setAddressData((prev) => ({ ...prev, pincode: val }));
                  setTouched((prev) => ({ ...prev, pincode: true }));
                  setErrors((prev) => ({
                    ...prev,
                    pincode: validateField('pincode', val),
                  }));
                }}
                onBlur={() => {
                  setTouched((prev) => ({ ...prev, pincode: true }));
                  setErrors((prev) => ({
                    ...prev,
                    pincode: validateField('pincode', addressData.pincode.toString()),
                  }));
                }}
                required
                error={touched.pincode ? errors.pincode : ''}
                touched={touched.pincode}
                type="number"
                sx={{ ...uniformInputSx }}
                inputProps={{ onKeyDown: handleNumberKeyDown }}
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <Checkbox
                checked={addressData.isCorrespondenceAddressDifferent}
                onChange={(e) =>
                  setAddressData((prev) => ({
                    ...prev,
                    isCorrespondenceAddressDifferent: e.target.checked,
                  }))
                }
                sx={{ color: '#8a4a20', '&.Mui-checked': { color: '#8a4a20' } }}
              />
              <Typography sx={{ fontWeight: 600 }}>
                {correspondenceAddressDifferentLabel}
              </Typography>
            </Box>

            {addressData.isCorrespondenceAddressDifferent && (
              <Box sx={{ p: 1, borderRadius: 1 }}>
                <Typography sx={{ color: '#C8504B', mb: 1 }}>
                  {CorressPondenceAddressMSG}
                </Typography>

                <FormTextField
                  label={Address1MSG}
                  value={addressData.correspondenceAddress1}
                  onChange={(v) => {
                    setAddressData((prev) => ({ ...prev, correspondenceAddress1: v }));
                    setTouched((prev) => ({ ...prev, correspondenceAddress1: true }));
                    setErrors((prev) => ({
                      ...prev,
                      correspondenceAddress1: validateField('correspondenceAddress1', v),
                    }));
                  }}
                  onBlur={() => {
                    setTouched((prev) => ({ ...prev, correspondenceAddress1: true }));
                    setErrors((prev) => ({
                      ...prev,
                      correspondenceAddress1: validateField(
                        'correspondenceAddress1',
                        addressData.correspondenceAddress1
                      ),
                    }));
                  }}
                  required
                  error={
                    touched.correspondenceAddress1 ? errors.correspondenceAddress1 : ''
                  }
                  touched={touched.correspondenceAddress1}
                  sx={{ ...uniformInputSx }}
                />

                <FormTextField
                  label={Address2MSG}
                  value={addressData.correspondenceAddress2}
                  onChange={(v) =>
                    setAddressData((prev) => ({ ...prev, correspondenceAddress2: v }))
                  }
                  required={false}
                  sx={{ ...uniformInputSx }}
                />

                <FormTextField
                  label={pincodeLabel}
                  value={addressData.correspondencePincode.toString()}
                  onChange={(v) => {
                    let val = v.replace(/[^0-9]/g, '');
                    if (val.length > 6) val = val.slice(0, 6);
                    setAddressData((prev) => ({ ...prev, correspondencePincode: val }));
                    setTouched((prev) => ({ ...prev, correspondencePincode: true }));
                    setErrors((prev) => ({
                      ...prev,
                      correspondencePincode: validateField('correspondencePincode', val),
                    }));
                  }}
                  onBlur={() => {
                    setTouched((prev) => ({ ...prev, correspondencePincode: true }));
                    setErrors((prev) => ({
                      ...prev,
                      correspondencePincode: validateField(
                        'correspondencePincode',
                        addressData.correspondencePincode.toString()
                      ),
                    }));
                  }}
                  required
                  error={
                    touched.correspondencePincode ? errors.correspondencePincode : ''
                  }
                  touched={touched.correspondencePincode}
                  type="number"
                  sx={{ ...uniformInputSx }}
                  inputProps={{ onKeyDown: handleNumberKeyDown }}
                />
              </Box>
            )}

            <Box sx={{ width: '100%' }}>
              <Button
                type="button"
                sx={{ ...verifyButtonSx, display: 'block', marginLeft: 'auto' }}
                variant="contained"
                onClick={handleSubmit}
              >
                {mode === 'verify' ? 'Verify' :nextButtonText}
              </Button>
            </Box>
          </Stack>
        </Box>
      </Box>
    </>
  );
};

// Export the PropertyAddress component as default
export default PropertyAddress;
