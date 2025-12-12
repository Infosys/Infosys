import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import { useNavigate, useLocation } from 'react-router-dom';
import OwnerCard from '../../features/PropertyForm/components/OwnerDetail/OwnerCard';
import { useFormMode } from '../../../context/FormModeContext';
import { useOwnerDetailsLocalization } from '../../../services/AgentLocalisation/localisation-owner-details';
import {
  validateAadhar,
  validateMobile,
  validateEmail,
} from '../../../validations/formValidations';
import { usePropertyForm } from '../../../context/PropertyFormContext';
import StepHeader from '../../features/Agent/components/StepHeader';
import { useValidationLocalization } from '../../../services/AgentLocalisation/localisation-FormValidations';
import { useLocalization } from '../../../services/AgentLocalisation/formLocalisation';
import CustomDropdown from '../../features/PropertyForm/components/IGRSDetail/IGRSdropdown';
import FormTextField from '../../features/PropertyForm/components/IGRSDetail/IGRSFormTextFiled';
import { uniformInputSx, verifyButtonSx } from './styles/sharedStyles';
import {
  useAddOwnerMutation,
  useDeleteOwnerMutation,
  useGetOwnersByPropertyIdQuery,
  useUpdateOwnerMutation,
} from '../../../redux/apis/ownerApi';
import type {
  AddOwnerResponse,
  Owner,
  UpdateOwnerResponse,
} from '../../../redux/apis/ownerApi';
import type { AlertType } from '../../models/AlertType.model';
import { NotificationPopup } from '../../components/Popup/NotificationPopup';

// Allow only alphabetic input (for names, etc.)
const onlyAlphabetInput = (value: string) => value.replace(/[^a-zA-Z\s]/g, '');

// Sanitizer AND keyboard handler for mobile number input
const onlyMobileInput = (value: string, maxLen: number = 10) => {
  let digits = value.replace(/[^0-9]/g, '');
  digits = digits.replace(/^0+/, '');
  if (digits.length > maxLen) digits = digits.slice(0, maxLen);
  if (digits.length > 0 && !/^[6-9]/.test(digits)) {
    digits = '';
  }
  return digits;
};

// Block forbidden characters for number input (same as igrs-details-page)
const handleNumberKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  const forbidden = ['-', 'e', 'E', '+', '.', ' '];
  if (forbidden.includes(e.key)) {
    e.preventDefault();
  }
};

// Main component for entering and managing property owner details
const OwnerDetails: React.FC = () => {
  const { mode } = useFormMode();
  const navigate = useNavigate();
  const location = useLocation();
  const editingOwner = location.state?.editOwner as Owner | undefined;

  const { formData, updateForm } = usePropertyForm();
  const propertyId = formData.id;

  const [addOwner] = useAddOwnerMutation();
  const [updateOwner] = useUpdateOwnerMutation();
  const { data: ownersData, refetch } = useGetOwnersByPropertyIdQuery(propertyId, {
    skip: !propertyId,
  });

  const {
    aadhaarLabel,
    ownerNameLabel,
    mobileNumberLabel,
    genderLabel,
    emailLabel,
    guardianLabel,
    guardianRelationshipLabel,
    addOwnerValidationMsg,
    ownerNameRequiredError,
    genderRequiredError,
    guardianRequiredError,
    guardianRelationshipRequiredError,
    primaryOwnerText,
    ownerText,
    nameText,
    viewOwnersText,
    genderOptions,
    guardianRelationshipOptions,
    propertyFormTitle,
    newPropertyFormTitle,
    ownerDetailsSubtitle,
    previousText,
    saveDraftText,
  } = useOwnerDetailsLocalization();

  const {
    nextButtonText,
    Onlynumbersareallowedupto12digitsMSG,
    Aadhaarnumbermustbe12digitsMSG,
    OnlyalphabetsareallowedMSG,
    Mobilenumbermustbe10digitsMSG,
    Onlynumbersareallowedupto10digitsMSG,
    InvalidemailaddressMSG,
    AddGuardianMSG,
    ThisFieldIsRequiredMSG,
  } = useLocalization();

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

  // Show error popup with message
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

  const { messages: validationMessages } = useValidationLocalization();

  // List of owners fetched from API
  const owners = ownersData?.data ?? [];

  useEffect(()=>{
    if(owners){
      updateForm({owners: owners});
    }
  }, [owners]);

  
  console.log(formData);
  
  // State for editing, dropdowns, and guardian fields
  const [isEditing, setIsEditing] = useState(false);
  const [showGuardianFields, setShowGuardianFields] = useState(false);
  const [showGuardianRelationshipDropdown, setShowGuardianRelationshipDropdown] =
    useState(false);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [deleteOwner] = useDeleteOwnerMutation();

  // Initial state for owner form
  const initialOwnerForm: Owner = {
    ID: '',
    PropertyID: propertyId ?? '',
    Name: '',
    AdhaarNo: 0,
    ContactNo: '',
    Email: '',
    Gender: '',
    Guardian: '',
    GuardianType: '',
    RelationshipToProperty: '',
    OwnershipShare: 100,
    IsPrimaryOwner: false,
    CreatedAt: '',
    UpdatedAt: '',
  };

  // State for owner form fields
  const [ownerForm, setOwnerForm] = useState<Owner>(initialOwnerForm);

  // State for form field errors
  const [errors, setErrors] = useState<Record<string, string>>({
    ownerName: '',
    aadhaar: '',
    mobile: '',
    email: '',
    gender: '',
    guardian: '',
    guardianRelationship: '',
  });

  // Handle guardian name input change
  const handleGuardianChange = (val: string) => {
    if (val && /[^a-zA-Z\s]/.test(val)) {
      setErrors((e) => ({ ...e, guardian: OnlyalphabetsareallowedMSG }));
    } else if (!val && showGuardianFields) {
      setErrors((e) => ({ ...e, guardian: guardianRequiredError }));
    } else {
      setErrors((e) => ({ ...e, guardian: '' }));
    }
    setOwnerForm((f) => ({ ...f, Guardian: onlyAlphabetInput(val) }));
  };

  // Handle blur event for form fields (validation)
  const handleBlur = (field: string, value: string) => {
    const v = value ?? '';
    let error: string = '';

    if (!v.trim()) {
      switch (field) {
        case 'AdhaarNo':
          error = ThisFieldIsRequiredMSG ?? '';
          break;
        case 'Name':
          error = ownerNameRequiredError;
          break;
        case 'ContactNo':
          error = ThisFieldIsRequiredMSG ?? '';
          break;
        case 'Email':
          error = ThisFieldIsRequiredMSG ?? '';
          break;
        case 'Gender':
          error = genderRequiredError;
          break;
        case 'Guardian':
          if (showGuardianFields) error = guardianRequiredError;
          break;
        case 'GuardianType':
          if (showGuardianFields) error = guardianRelationshipRequiredError;
          break;
      }
    }

    if (field === 'AdhaarNo') {
      if (v && v.length !== 12) error = Aadhaarnumbermustbe12digitsMSG;
      else if (v && /[^0-9]/.test(v)) error = Onlynumbersareallowedupto12digitsMSG;
      else if (v && /^\d{12}$/.test(v)) {
        const out = validateAadhar(v, validationMessages);
        if (out) error = out;
      }
    }

    if (field === 'ContactNo') {
      if (v && v.length !== 10) error = Mobilenumbermustbe10digitsMSG;
      else if (v && /[^0-9]/.test(v)) error = Onlynumbersareallowedupto10digitsMSG;
      else if (v && !/^[6-9]/.test(v))
        error = 'Mobile number should start with 6, 7, 8, or 9';
      else if (v && /^\d{10}$/.test(v)) {
        const out = validateMobile(v, validationMessages);
        if (out) error = out;
      }
    }

    if (field === 'Email') {
      if (v && !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(v))
        error = InvalidemailaddressMSG;
      else if (v) {
        const out = validateEmail(v, validationMessages);
        if (out) error = out;
      }
    }

    if (field === 'Name' && v && /[^a-zA-Z\s]/.test(v))
      error = OnlyalphabetsareallowedMSG;
    if (field === 'Guardian' && v && /[^a-zA-Z\s]/.test(v))
      error = OnlyalphabetsareallowedMSG;

    setErrors((s) => ({
      ...s,
      [field === 'GuardianType'
        ? 'guardianRelationship'
        : field === 'Guardian'
        ? 'guardian'
        : field.toLowerCase()]: error,
    }));
  };

  // Handle gender dropdown selection
  const handleGenderSelect = (option: string) => {
    setOwnerForm((prev) => ({ ...prev, Gender: option }));
    setShowGenderDropdown(false);
    setErrors((e) => ({
      ...e,
      gender: option ? '' : genderRequiredError,
    }));
  };

  // Handle guardian relationship dropdown selection
  const handleGuardianRelationshipSelect = (_f: string, option: string) => {
    setOwnerForm((prev) => ({ ...prev, GuardianType: option }));
    setShowGuardianRelationshipDropdown(false);
    setErrors((e) => ({
      ...e,
      guardianRelationship: option ? '' : guardianRelationshipRequiredError,
    }));
  };

  // Validate all owner fields and return error messages
  function validateOwner(owner: Owner) {
    return {
      ownerName: owner.Name
        ? /[^a-zA-Z\s]/.test(owner.Name)
          ? OnlyalphabetsareallowedMSG
          : ''
        : ownerNameRequiredError,
      aadhaar: owner.AdhaarNo
        ? owner.AdhaarNo.toString().length === 12
          ? /^\d{12}$/.test(owner.AdhaarNo.toString())
            ? validateAadhar(owner.AdhaarNo.toString(), validationMessages) || ''
            : Onlynumbersareallowedupto12digitsMSG
          : Aadhaarnumbermustbe12digitsMSG
        : Aadhaarnumbermustbe12digitsMSG,
      mobile: owner.ContactNo
        ? owner.ContactNo.length === 10
          ? /^\d{10}$/.test(owner.ContactNo)
            ? /^[6-9]/.test(owner.ContactNo)
              ? validateMobile(owner.ContactNo, validationMessages) || ''
              : 'Mobile number should start with 6, 7, 8, or 9'
            : Onlynumbersareallowedupto10digitsMSG
          : Mobilenumbermustbe10digitsMSG
        : Mobilenumbermustbe10digitsMSG,
      email: owner.Email
        ? /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(owner.Email)
          ? validateEmail(owner.Email, validationMessages) || ''
          : InvalidemailaddressMSG
        : InvalidemailaddressMSG,
      gender: owner.Gender ? '' : genderRequiredError,
      guardian: showGuardianFields
        ? owner.Guardian
          ? /[^a-zA-Z\s]/.test(owner.Guardian)
            ? OnlyalphabetsareallowedMSG
            : ''
          : guardianRequiredError
        : '',
      guardianRelationship: showGuardianFields
        ? owner.GuardianType
          ? ''
          : guardianRelationshipRequiredError
        : '',
    };
  }

  // Handle add owner button click (save and go to next step)
  const handleAddOwner = async () => {
    try {
      await handleSaveDraft();
      navigate('/property-form/owner-details-two');
    } catch (e) {
      console.error(e);
    }
  };

  // Handle delete owner action
  const handleDeleteOwner = async (id: string) => {
    try {
      await deleteOwner(id).unwrap();

      // Wait for refetch to get fresh data
      const { data: freshOwnersData } = await refetch();
      const freshOwners = freshOwnersData?.data ?? [];

      // Update form with fresh data from server
      updateForm({ owners: freshOwners as Owner[] });
    } catch (error) {
      showErrorPopup('Failed to delete owner');
      console.error('Delete owner error:', error);
    }
  };
  
  // Handle back navigation
  const handleGoBack = () => navigate(-1);

  // Handle save draft action (validate and save owner)
  const handleSaveDraft = async () => {
    if (!formData.id) {
      showErrorPopup('Property ID is missing. Please complete previous steps.');
      return;
    }

    const validationResults = validateOwner(ownerForm);
    setErrors(validationResults);

    const hasError = Object.values(validationResults).some(Boolean);
    if (hasError) {
      showErrorPopup(addOwnerValidationMsg);
      throw new Error(addOwnerValidationMsg);
    }

    const payload: Omit<Owner, 'ID' | 'CreatedAt' | 'UpdatedAt'> = {
      PropertyID: formData.id,
      Name: ownerForm.Name,
      AdhaarNo: Number(ownerForm.AdhaarNo),
      ContactNo: ownerForm.ContactNo,
      Email: ownerForm.Email,
      Gender: ownerForm.Gender.toUpperCase(),
      Guardian: ownerForm.Guardian,
      GuardianType: ownerForm.GuardianType?.toUpperCase() ?? '',
      RelationshipToProperty: 'OWNER',
      OwnershipShare: 100.0,
      IsPrimaryOwner: owners.length === 0,
    };

    let response: UpdateOwnerResponse | AddOwnerResponse | undefined;

    try {
      if (ownerForm.ID) {
        // Update owner (PUT)
        response = await updateOwner({ id: ownerForm.ID, data: payload as any }).unwrap();
      } else {
        // Add owner (POST)
        response = await addOwner(payload).unwrap();
      }

      console.log(response);

      // Wait for refetch to complete and get fresh data
      const { data: freshOwnersData } = await refetch();
      const freshOwners = freshOwnersData?.data ?? [];

      console.log('Fresh owners from refetch:', freshOwners);

      // Update context with fresh data from server
      await updateForm({
        owners: freshOwners as Owner[],
      });
      // Reset form after successful operation
      setOwnerForm(initialOwnerForm);
      setErrors({
        ownerName: '',
        aadhaar: '',
        mobile: '',
        email: '',
        gender: '',
        guardian: '',
        guardianRelationship: '',
      });
      setShowGuardianFields(false);
      setIsEditing(false);
    } catch (error) {
      showErrorPopup('Failed to add owner');
      throw error;
    }
  };

  // On mount: if editing owner, populate form fields
  useEffect(() => {
    if (editingOwner) {
      setOwnerForm(editingOwner);
      setIsEditing(true);
      setShowGuardianFields(!!editingOwner.Guardian || !!editingOwner.GuardianType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingOwner]);

  // Prepare gender dropdown options
  const genderDropdownOptions = (genderOptions || []).map((g, i) => ({
    id: i,
    label: g ?? '',
  }));
  // Prepare guardian relationship dropdown options
  const guardianRelOptions = (guardianRelationshipOptions || []).map((g, i) => ({
    id: i,
    label: g ?? '',
  }));

  // Styles for container and form layout
  const containerSx = {
    width: '100%',
    margin: '0 auto',
    minHeight: '100vh' as const,
    bgcolor: '#fff',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    display: 'flex' as const,
    flexDirection: 'column' as const,
  };
  const headerSx = { backgroundColor: '#F9E6E0', padding: '16px' };
  const formContentSx = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    px: '8%',
    py: 3,
    backgroundColor: '#FFFFFF',
  };

  // Main render: notification popup, step header, owner cards, and owner form
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
            title={`${mode === 'new' ? newPropertyFormTitle : propertyFormTitle}`}
            subtitle={ownerDetailsSubtitle}
            steps={10}
            activeStep={1}
            onPrevious={handleGoBack}
            onSaveDraft={handleSaveDraft}
            previousText={previousText}
            saveDraftText={saveDraftText}
          />
        </Box>

        {/* owner cards */}
        {!isEditing && owners.length > 0 && (
          <Box sx={{ px: '8%', mt: 2 }}>
            {owners.map((owner) => (
              <OwnerCard
                key={owner.ID}
                name={owner.Name}
                isPrimary={owner.ID === owners[0].ID}
                onDelete={() => handleDeleteOwner(owner.ID)}
                onViewOwners={() => navigate('/property-form/owner-details-two')}
                primaryOwnerText={primaryOwnerText}
                ownerText={ownerText}
                nameText={nameText}
                viewOwnersText={viewOwnersText}
              />
            ))}
          </Box>
        )}

        {owners.length > 0 && (
          <Typography sx={{ mt: 2, ml: 1, fontWeight: 700 }}>
            Additional Owner Details:
          </Typography>
        )}

        <Box component="main" sx={formContentSx}>
          <Stack
            spacing={2}
            component="form"
            sx={{ flex: 1 }}
            onSubmit={(e) => {
              e.preventDefault();
              handleAddOwner();
            }}
          >
            {/* Aadhaar */}
            <Box sx={{ width: '100%' }}>
              <FormTextField
                label={aadhaarLabel}
                value={ownerForm.AdhaarNo === 0 ? '' : ownerForm.AdhaarNo.toString()}
                onChange={(val) =>
                  setOwnerForm((f) => ({
                    ...f,
                    AdhaarNo: Number(val.replace(/[^0-9]/g, '').slice(0, 12)),
                  }))
                }
                onBlur={() => handleBlur('AdhaarNo', ownerForm.AdhaarNo.toString())}
                placeholder=""
                type="number"
                required
                error={errors.aadhaar}
                touched={!!errors.aadhaar}
                sx={{ width: '100%', ...uniformInputSx }}
                inputProps={{ onKeyDown: handleNumberKeyDown }}
              />
            </Box>

            {/* Owner name */}
            <Box>
              <FormTextField
                label={ownerNameLabel}
                value={ownerForm.Name}
                onChange={(val) =>
                  setOwnerForm((f) => ({ ...f, Name: onlyAlphabetInput(val) }))
                }
                onBlur={() => handleBlur('Name', ownerForm.Name)}
                placeholder=""
                type="text"
                required
                error={errors.ownerName}
                touched={!!errors.ownerName}
                sx={{ width: '100%', ...uniformInputSx }}
              />
            </Box>

            {/* Mobile */}
            <Box>
              <FormTextField
                label={mobileNumberLabel}
                value={ownerForm.ContactNo}
                onChange={(val) =>
                  setOwnerForm((f) => ({
                    ...f,
                    ContactNo: onlyMobileInput(val, 10),
                  }))
                }
                onBlur={() => handleBlur('ContactNo', ownerForm.ContactNo)}
                placeholder=""
                type="number"
                required
                error={errors.mobile}
                touched={!!errors.mobile}
                sx={{ width: '100%', ...uniformInputSx }}
                inputProps={{ onKeyDown: handleNumberKeyDown }}
              />
            </Box>

            {/* Gender */}
            <CustomDropdown
              label={genderLabel}
              name="Gender"
              value={ownerForm.Gender}
              options={genderDropdownOptions}
              showDropdown={showGenderDropdown}
              setShowDropdown={setShowGenderDropdown}
              onSelect={(_n, v) => handleGenderSelect(v)}
              closeOtherDropdowns={() => setShowGenderDropdown(false)}
              onBlur={() => handleBlur('Gender', ownerForm.Gender)}
              required
              error={errors.gender}
              touched={!!errors.gender}
            />

            {/* Email */}
            <Box>
              <FormTextField
                label={emailLabel}
                value={ownerForm.Email}
                onChange={(val) => {
                  setOwnerForm((prev) => ({ ...prev, Email: val }));
                  setErrors((e) => ({ ...e, email: '' }));
                }}
                onBlur={() => handleBlur('Email', ownerForm.Email)}
                placeholder=""
                type="text"
                required
                error={errors.email}
                touched={!!errors.email}
                sx={{ width: '100%', ...uniformInputSx }}
              />
            </Box>

            {/* Guardian checkbox */}
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <Checkbox
                checked={showGuardianFields}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setShowGuardianFields(checked);
                  if (!checked) {
                    setOwnerForm((prev) => ({
                      ...prev,
                      Guardian: '',
                      GuardianType: '',
                    }));
                    setErrors((prev) => ({
                      ...prev,
                      guardian: '',
                      guardianRelationship: '',
                    }));
                  }
                }}
                sx={{ mr: 1, color: '#8a4a20', '&.Mui-checked': { color: '#8a4a20' } }}
              />
              <Typography sx={{ fontWeight: 600 }}>{AddGuardianMSG}</Typography>
            </Box>

            {showGuardianFields && (
              <>
                <Box>
                  <FormTextField
                    label={guardianLabel}
                    value={ownerForm.Guardian}
                    onChange={(val) => handleGuardianChange(val)}
                    onBlur={() => handleBlur('Guardian', ownerForm.Guardian ?? '')}
                    placeholder=""
                    type="text"
                    required
                    error={errors.guardian}
                    touched={!!errors.guardian}
                    sx={{ width: '100%', ...uniformInputSx }}
                  />
                </Box>

                <CustomDropdown
                  label={guardianRelationshipLabel}
                  name="GuardianType"
                  value={ownerForm.GuardianType}
                  options={guardianRelOptions}
                  showDropdown={showGuardianRelationshipDropdown}
                  setShowDropdown={setShowGuardianRelationshipDropdown}
                  onSelect={(_n, v) => handleGuardianRelationshipSelect(_n, v)}
                  closeOtherDropdowns={() => setShowGuardianRelationshipDropdown(false)}
                  selectText=""
                  onBlur={() => handleBlur('GuardianType', ownerForm.GuardianType ?? '')}
                  required
                  error={errors.guardianRelationship}
                  touched={!!errors.guardianRelationship}
                />
              </>
            )}

            <Box sx={{ width: '100%', height: '100%' }}>
              <Button
                type="button"
                onClick={handleAddOwner}
                variant="contained"
                sx={{ ...verifyButtonSx, display: 'block', marginLeft: 'auto' }}
              >
                {nextButtonText}
              </Button>
            </Box>
          </Stack>
        </Box>
      </Box>
    </>
  );
};

export default OwnerDetails;
