import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import { useNavigate, useLocation } from "react-router-dom";
import OwnerCard from "../../features/PropertyForm/components/OwnerDetail/OwnerCard";
import { useFormMode } from "../../../context/FormModeContext";
import { useOwnerDetailsLocalization } from "../../../services/AgentLocalisation/localisation-owner-details";
import {
  validateAadhar,
  validateMobile,
  validateEmail,
} from "../../../validations/formValidations";
import { usePropertyForm } from "../../../context/PropertyFormContext";
import StepHeader from "../../features/Agent/components/StepHeader";
import { useValidationLocalization } from "../../../services/AgentLocalisation/localisation-FormValidations";
import { useLocalization } from "../../../services/AgentLocalisation/formLocalisation";
import CustomDropdown from "../../features/PropertyForm/components/IGRSDetail/IGRSdropdown";
import FormTextField from "../../features/PropertyForm/components/IGRSDetail/IGRSFormTextFiled";
import { uniformInputSx, verifyButtonSx } from "./styles/sharedStyles";
import {
  useAddOwnerMutation,
  useDeleteOwnerMutation,
  useGetOwnersByPropertyIdQuery,
  useUpdateOwnerMutation,
} from "../../../redux/apis/ownerApi";
import type {
  AddOwnerResponse,
  Owner,
  UpdateOwnerResponse,
} from '../../../redux/apis/ownerApi';
import type { AlertType } from '../../models/AlertType.model';
import { NotificationPopup } from '../../components/Popup/NotificationPopup';
import type { DropdownOption } from '../../features/PropertyForm/components/ConstructionDetail/ConstructionDropdown';
import JsonService from '../../../services/jsonServerApiCalls';
import CountIncrementor from '../../features/PropertyForm/components/CountIncrementors';

// Allow only alphabetic input (for names, etc.)
const onlyAlphabetInput = (value: string) =>
  value.replaceAll(/[^a-zA-Z\s]/g, "");

// Sanitizer AND keyboard handler for mobile number input
const onlyMobileInput = (value: string, maxLen: number = 10) => {
  let digits = value.replaceAll(/\D/g, "");
  digits = digits.replace(/^0+/, "");
  if (digits.length > maxLen) digits = digits.slice(0, maxLen);
  if (digits.length > 0 && !/^[6-9]/.test(digits)) {
    digits = "";
  }
  return digits;
};

// Block forbidden characters for number input (same as igrs-details-page)
const handleNumberKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  const forbidden = ["-", "e", "E", "+", ".", " "];
  if (forbidden.includes(e.key)) {
    e.preventDefault();
  }
};

const getEmptyFieldError = (
  field: string,
  showGuardianFields: boolean,
  
): string => {
  switch (field) {
    case 'AdhaarNo':
      return 'Aadhaar number is mandatory';
    case 'ContactNo':
      return 'Mobile number is mandatory';
    case 'Email':
      return 'Email is mandatory';
    case 'Name':
      return 'Owner name is mandatory';
    case 'Gender':
      return 'Select Gender to proceed';
    case 'Guardian':
      return showGuardianFields ? 'Guardian is mandatory' : '';
    case 'GuardianType':
      return showGuardianFields ? 'Select Guardian relationship to proceed' : '';
    default:
      return '';
  }
};

const validateAadhaarField = (
  value: string,
  messages: {
    length: string;
    numeric: string;
  },
  validationMessages: any
): string => {
  if (!value) return '';
  if (value.length !== 12) return messages.length;
  if (/\D/.test(value)) return messages.numeric;
  if (/^\d{12}$/.test(value)) {
    return validateAadhar(value, validationMessages) || '';
  }
  return '';
};

const validateContactField = (
  value: string,
  messages: {
    length: string;
    numeric: string;
    startsWith: string;
  },
  validationMessages: any
): string => {
  if (!value) return '';
  if (value.length !== 10) return messages.length;
  if (/\D/.test(value)) return messages.numeric;
  if (!/^[6-9]/.test(value)) return messages.startsWith;
  if (/^\d{10}$/.test(value)) {
    return validateMobile(value, validationMessages) || '';
  }
  return '';
};

const validateEmailFieldBlur = (
  value: string,
  messages: {
    required: string;
    invalid: string;
  },
  validationMessages: any
): string => {
  if (!value.trim()) return messages.required;
  if (/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value)) {
    return validateEmail(value, validationMessages) || '';
  }
  return messages.invalid;
};

const validateAlphabeticName = (value: string, errorMsg: string): string => {
  if (value && /[^a-zA-Z\s]/.test(value)) return errorMsg;
  return '';
};

const getErrorFieldKey = (field: string): string => {
  if (field === 'GuardianType') return 'guardianRelationship';
  if (field === 'Guardian') return 'guardian';
  if (field === 'AdhaarNo') return 'aadhaar';  
  if (field === 'ContactNo') return 'mobile';   
  if (field === 'Name') return 'ownerName';     
  if (field === 'Email') return 'email';       
  if (field === 'Gender') return 'gender';
  return field.toLowerCase();
};

const validateOwnerName = (name: string, messages: { required: string; alphabetsOnly: string }): string => {
  if (!name) return messages.required;
  if (/[^a-zA-Z\s]/.test(name)) return messages.alphabetsOnly;
  return '';
};

const validateOwnerAadhaar = (
  aadhaarNo: number,
  messages: { required: string; length: string; numeric: string },
  validationMessages: any
): string => {
  if (!aadhaarNo) return messages.required;
  
  const aadhaarStr = aadhaarNo.toString();
  if (aadhaarStr.length !== 12) return messages.length;
  if (!/^\d{12}$/.test(aadhaarStr)) return messages.numeric;
  
  return validateAadhar(aadhaarStr, validationMessages) || '';
};

const validateOwnerMobile = (
  contactNo: string,
  messages: { required: string; length: string; numeric: string; startsWith: string },
  validationMessages: any
): string => {
  if (!contactNo) return messages.required;
  if (contactNo.length !== 10) return messages.length;
  if (!/^\d{10}$/.test(contactNo)) return messages.numeric;
  if (!/^[6-9]/.test(contactNo)) return messages.startsWith;
  
  return validateMobile(contactNo, validationMessages) || '';
};

const validateOwnerEmail = (
  email: string,
  messages: { required: string; invalid: string },
  validationMessages: any
): string => {
  if (!email?.trim()) return messages.required;
  
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  if (!emailRegex.test(email)) return messages.invalid;
  
  return validateEmail(email, validationMessages) || '';
};

const validateOwnerGender = (gender: string, errorMsg: string): string => {
  return gender ? '' : errorMsg;
};

const validateOwnerGuardian = (
  guardian: string,
  showGuardianFields: boolean,
  messages: { required: string; alphabetsOnly: string }
): string => {
  if (!showGuardianFields) return '';
  if (!guardian) return messages.required;
  if (/[^a-zA-Z\s]/.test(guardian)) return messages.alphabetsOnly;
  return '';
};

const validateOwnerGuardianRelationship = (
  guardianType: string,
  showGuardianFields: boolean,
  errorMsg: string
): string => {
  if (!showGuardianFields) return '';
  return guardianType ? '' : errorMsg;
};

// Main component for entering and managing property owner details
const OwnerDetails: React.FC = () => {
  const { mode } = useFormMode();
  const navigate = useNavigate();
  const location = useLocation();
  const editingOwner = location.state?.editOwner as Owner | undefined;

  const { formData, updateForm } = usePropertyForm();
  const propertyId = formData.id;
  const applicationId = localStorage.getItem('applicationId') || localStorage.getItem('applicationLogId') || '';

  const [addOwner] = useAddOwnerMutation();
  const [updateOwner] = useUpdateOwnerMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasModified, setHasModified] = useState(false);

  const markModified = () => {
    if (mode === "verify") setHasModified(true);
  };

  const { data: ownersData, refetch } = useGetOwnersByPropertyIdQuery(
    propertyId,
    {
      skip: !propertyId,
    }
  );

  const {
    aadhaarLabel,
    ownerNameLabel,
    mobileNumberLabel,
    genderLabel,
    emailLabel,
    guardianLabel,
    guardianRelationshipLabel,
    addOwnerValidationMsg,
    primaryOwnerText,
    nameText,
    viewOwnersText,
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
  } = useLocalization();

  // State for notification popup
  const [popup, setPopup] = useState<{
    type: AlertType;
    open: boolean;
    title: string;
    message: string;
    duration: number;
  }>({
    type: "warning",
    open: false,
    title: "",
    message: "",
    duration: 3000,
  });

  // Show error popup with message
  function showErrorPopup(message: string, duration = 3000) {
    setPopup((prev) => ({ ...prev, open: false }));
    setTimeout(() => {
      setPopup({
        type: "warning",
        open: true,
        title: "Warning!",
        message,
        duration,
      });
    }, 10);
  }

  const [genderOptions, setGenderOptions] = useState<DropdownOption[]>([]);
  const [guardianRelationshipOptions, setGuardianRelationshipOptions] =
    useState<DropdownOption[]>([]);

  useEffect(() => {
    JsonService.getGenderOptions().then((data) => {
      if (Array.isArray(data)) {
        setGenderOptions(
          data
            .filter((item) => item.name !== "select")
            .map((item, index) => ({ id: index, label: item.name }))
        );
      }
    });

    JsonService.getGuardianRelationshipOptions().then((data) => {
      if (Array.isArray(data)) {
        setGuardianRelationshipOptions(
          data
            .filter((item) => item.name !== "select")
            .map((item, index) => ({ id: index, label: item.name }))
        );
      }
    });
  }, []);

  const { messages: validationMessages } = useValidationLocalization();

  // List of owners fetched from API
  const owners = ownersData?.data ?? [];

  useEffect(() => {
    if (owners) {
      updateForm({ owners: owners });
    }
  }, [owners.length]);

  // State for editing, dropdowns, and guardian fields
  const [isEditing, setIsEditing] = useState(false);
  const [showGuardianFields, setShowGuardianFields] = useState(false);
  const [
    showGuardianRelationshipDropdown,
    setShowGuardianRelationshipDropdown,
  ] = useState(false);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [deleteOwner] = useDeleteOwnerMutation();

  // Calculate remaining ownership percentage
  const totalOwnership = owners.reduce(
    (sum, owner) => sum + (owner.OwnershipShare || 0),
    0
  );
  const remainingOwnership = 100 - totalOwnership;

  // Initial state for owner form - use remaining ownership if owners exist
  const initialOwnerForm: Owner = {
    ID: "",
    PropertyID: propertyId ?? "",
    Name: "",
    AdhaarNo: 0,
    ContactNo: "",
    Email: "",
    Gender: "",
    Guardian: "",
    GuardianType: "",
    RelationshipToProperty: "",
    OwnershipShare: owners.length > 0 ? remainingOwnership : 100,
    IsPrimaryOwner: false,
    CreatedAt: "",
    UpdatedAt: "",
  };

  // State for owner form fields
  const [ownerForm, setOwnerForm] = useState<Owner>(initialOwnerForm);

  // State for form field errors
  const [errors, setErrors] = useState<Record<string, string>>({
    ownerName: "",
    aadhaar: "",
    mobile: "",
    email: "",
    gender: "",
    guardian: "",
    guardianRelationship: "",
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({
  ownerName: false,
  aadhaar: false,
  mobile: false,
  email: false,
  gender: false,
  guardian: false,
  guardianRelationship: false,
});

  // Handle guardian name input change
  const handleGuardianChange = (val: string) => {
    markModified();
    if (val && /[^a-zA-Z\s]/.test(val)) {
      setErrors((e) => ({ ...e, guardian: OnlyalphabetsareallowedMSG }));
    } else if (!val && showGuardianFields) {
      setErrors((e) => ({ ...e, guardian: 'Guardian is mandatory' }));
    } else {
      setErrors((e) => ({ ...e, guardian: "" }));
    }
    setOwnerForm((f) => ({ ...f, Guardian: onlyAlphabetInput(val) }));
  };

  // Handle blur event for form fields (validation)
  const handleBlur = (field: string, value: string) => {
    markModified();
    const v = value ?? '';
    const fieldKey = getErrorFieldKey(field);
    let error: string = '';

     // Check for empty value first
  if (!v.trim()) {
    error = getEmptyFieldError(field, showGuardianFields);
  }

  // Validate Aadhaar
  if (field === 'AdhaarNo') {
    const aadhaarError = validateAadhaarField(
      v,
      {
        length: Aadhaarnumbermustbe12digitsMSG,
        numeric: Onlynumbersareallowedupto12digitsMSG,
      },
      validationMessages
    );
    if (aadhaarError) error = aadhaarError;
  }

  // Validate Contact
  if (field === 'ContactNo') {
    const contactError = validateContactField(
      v,
      {
        length: Mobilenumbermustbe10digitsMSG,
        numeric: Onlynumbersareallowedupto10digitsMSG,
        startsWith: 'Mobile number should start with 6, 7, 8, or 9',
      },
      validationMessages
    );
    if (contactError) error = contactError;
  }

  // Validate Email
  if (field === 'Email') {
    error = validateEmailFieldBlur(
      value,
      {
        required: 'Email is mandatory',
        invalid: InvalidemailaddressMSG,
      },
      validationMessages
    );
  }

  // Validate alphabetic fields
  if (field === 'Name') {
    const nameError = validateAlphabeticName(v, OnlyalphabetsareallowedMSG);
    if (nameError) error = nameError;
  }

  if (field === 'Guardian') {
    const guardianError = validateAlphabeticName(v, OnlyalphabetsareallowedMSG);
    if (guardianError) error = guardianError;
  }

    setTouched((prev) => ({ ...prev, [fieldKey]: true }));
    setErrors((prev) => ({ ...prev, [fieldKey]: error }));

  };

  // Handle gender dropdown selection
  const handleGenderSelect = (option: string) => {
    markModified();
    setOwnerForm((prev) => ({ ...prev, Gender: option }));
    setShowGenderDropdown(false);
    setErrors((e) => ({
      ...e,
      gender: option ? "" : 'Select Gender to proceed',
    }));
  };

  // Handle guardian relationship dropdown selection
  const handleGuardianRelationshipSelect = (_f: string, option: string) => {
    markModified();
    setOwnerForm((prev) => ({ ...prev, GuardianType: option }));
    setShowGuardianRelationshipDropdown(false);
    setErrors((e) => ({
      ...e,
      guardianRelationship: option ? "" : 'Select Guardian relationship to proceed',
    }));
  };

  // Validate all owner fields and return error messages
  function validateOwner(owner: Owner) {
  return {
    ownerName: validateOwnerName(owner.Name, {
      required: 'Owner name is mandatory',
      alphabetsOnly: OnlyalphabetsareallowedMSG,
    }),
    
    aadhaar: validateOwnerAadhaar(
      owner.AdhaarNo,
      {
        required: 'Aadhaar number is mandatory',
        length: Aadhaarnumbermustbe12digitsMSG,
        numeric: Onlynumbersareallowedupto12digitsMSG,
      },
      validationMessages
    ),
    
    mobile: validateOwnerMobile(
      owner.ContactNo,
      {
        required: 'Mobile number is mandatory',
        length: Mobilenumbermustbe10digitsMSG,
        numeric: Onlynumbersareallowedupto10digitsMSG,
        startsWith: 'Mobile number should start with 6, 7, 8, or 9',
      },
      validationMessages
    ),
    
    email: validateOwnerEmail(
      owner.Email,
      {
        required: 'Email is mandatory',
        invalid: InvalidemailaddressMSG,
      },
      validationMessages
    ),
    
    gender: validateOwnerGender(owner.Gender, 'Select Gender to proceed'),
    
    guardian: validateOwnerGuardian(
      owner.Guardian ?? '',
      showGuardianFields,
      {
        required: 'Guardian is mandatory',
        alphabetsOnly: OnlyalphabetsareallowedMSG,
      }
    ),
    
    guardianRelationship: validateOwnerGuardianRelationship(
      owner.GuardianType ?? '',
      showGuardianFields,
      'Select Guardian relationship to proceed'
    ),
  };
}

  // Handle add owner button click (save and go to next step)
  const handleAddOwner = async () => {
    try {
      setIsSubmitting(true);
      await handleSaveDraft();
      navigate(-1);
    } catch (e) {
      setIsSubmitting(false);
      console.error(e);
    }
  };

  // Handle delete owner action
  const handleDeleteOwner = async (id: string) => {
    try {
      setIsSubmitting(true);
      await deleteOwner({
        id,
        applicationId,
        isVerifying: hasModified,
      }).unwrap();

      // Wait for refetch to get fresh data
      const { data: freshOwnersData } = await refetch();
      const freshOwners = freshOwnersData?.data ?? [];

      // Update form with fresh data from server
      updateForm({ owners: freshOwners });
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      showErrorPopup("Failed to delete owner");
      console.error("Delete owner error:", error);
    }
  };

  // Handle back navigation
  const handleGoBack = () => {
    navigate(-1);
  };

  // Handle save draft action (validate and save owner)
  const handleSaveDraft = async () => {
    if (!formData.id) {
      showErrorPopup("Property ID is missing. Please complete previous steps.");
      return;
    }

    const touchedState = {
    ownerName: true,
    aadhaar: true,
    mobile: true,
    email: true,
    gender: true,
    guardian: showGuardianFields,
    guardianRelationship: showGuardianFields,
  };

    setTouched(touchedState);

    const validationResults = validateOwner(ownerForm);
    setErrors(validationResults);

    const hasError = Object.values(validationResults).some(Boolean);
    console.log(hasError);

    if (hasError) {
      showErrorPopup(addOwnerValidationMsg);
      throw new Error(addOwnerValidationMsg);
    }

    const payload: Omit<Owner, "ID" | "CreatedAt" | "UpdatedAt"> = {
      PropertyID: formData.id,
      Name: ownerForm.Name,
      AdhaarNo: Number(ownerForm.AdhaarNo),
      ContactNo: ownerForm.ContactNo,
      Email: ownerForm.Email,
      Gender: ownerForm.Gender.toUpperCase(),
      Guardian: ownerForm.Guardian,
      GuardianType: ownerForm.GuardianType?.toUpperCase() ?? "",
      RelationshipToProperty: "OWNER",
      OwnershipShare: ownerForm.OwnershipShare,
      IsPrimaryOwner: owners.length === 0,
    };

    let response: UpdateOwnerResponse | AddOwnerResponse | undefined;

    try {
      setIsSubmitting(true);

      if (ownerForm.ID) {
        response = await updateOwner({
          id: ownerForm.ID,
          data: payload as any,
          applicationId,
          isVerifying: mode === 'verify' && hasModified,
        }).unwrap();
      } else {
        response = await addOwner({
          ...payload,
          applicationId,
          isVerifying: mode === 'verify' && hasModified,
        }).unwrap();
      }

      console.log(response);

      // Wait for refetch to complete and get fresh data
      const { data: freshOwnersData } = await refetch();
      const freshOwners = freshOwnersData?.data ?? [];

      // Update context with fresh data from server
      updateForm({
        owners: freshOwners,
      });
      
      // If editing an existing owner, repopulate the form with updated data
      if (ownerForm.ID) {
        const updatedOwner = freshOwners.find(o => o.ID === ownerForm.ID);
        if (updatedOwner) {
          setOwnerForm(updatedOwner);
          setShowGuardianFields(
            !!updatedOwner.Guardian || !!updatedOwner.GuardianType
          );
        }
      } else {
        setOwnerForm(initialOwnerForm);
        setShowGuardianFields(false);
      }
      
      setErrors({
        ownerName: "",
        aadhaar: "",
        mobile: "",
        email: "",
        gender: "",
        guardian: "",
        guardianRelationship: "",
      });
      setTouched({
        ownerName: false,
        aadhaar: false,
        mobile: false,
        email: false,
        gender: false,
        guardian: false,
        guardianRelationship: false,
      });
      setShowGuardianFields(false);
      setIsEditing(false);
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      showErrorPopup("Failed to add owner");
      throw error;
    }
  };

  // On mount: if editing owner, populate form fields
  useEffect(() => {
    if (editingOwner) {
      setOwnerForm(editingOwner);
      setIsEditing(true);
      setShowGuardianFields(
        !!editingOwner.Guardian || !!editingOwner.GuardianType
      );
    } else {
      // When not editing, set ownership share to remaining percentage
      setOwnerForm((prev) => ({
        ...prev,
        OwnershipShare: owners.length > 0 ? remainingOwnership : 100,
      }));
    }
  }, [editingOwner]);

  // Styles for container and form layout
  const containerSx = {
    width: "100%",
    minHeight: "100vh" as const,
    bgcolor: "#fff",
    display: "flex" as const,
    flexDirection: "column" as const,
  };
  const formContentSx = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    px: "4%",
    py: 3,
    backgroundColor: "#FFFFFF",
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
        <StepHeader
          title={`${mode === "new" ? newPropertyFormTitle : propertyFormTitle}`}
          subtitle={ownerDetailsSubtitle}
          steps={10}
          activeStep={1}
          onPrevious={handleGoBack}
          onSaveDraft={handleSaveDraft}
          previousText={previousText}
          saveDraftText={saveDraftText}
        />

        {/* owner cards */}
        {!isEditing && owners.length > 0 && (
          <Box>
            {owners.map((owner) => (
              <OwnerCard
                key={owner.ID}
                name={owner.Name}
                isPrimary={owner.ID === owners[0].ID}
                onDelete={() => handleDeleteOwner(owner.ID)}
                onViewOwners={() =>
                  navigate("/property-form/owner-details-two")
                }
                primaryOwnerText={primaryOwnerText}
                ownerText={"Secondary Owner"}
                nameText={nameText}
                viewOwnersText={viewOwnersText}
              />
            ))}
          </Box>
        )}

        {owners.length > 0 && (
          <Typography sx={{ mt: 2, ml: 2, fontWeight: 700 }}>
            {location.state?.editMode
              ? "Edit Owner Details"
              : " Secondary Owner Details:"}
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
            <Box sx={{ width: "100%" }}>
              <FormTextField
                label={aadhaarLabel}
                value={
                  ownerForm.AdhaarNo === 0 ? "" : ownerForm.AdhaarNo.toString()
                }
                onChange={(val) => {
                  markModified();
                  setOwnerForm((f) => ({
                    ...f,
                    AdhaarNo: Number(val.replaceAll(/\D/g, "").slice(0, 12)),
                  }));
                  setErrors((e) => ({ ...e, aadhaar: "" }));
                }}
                onBlur={() => {
                  const value =
                    ownerForm.AdhaarNo === 0
                      ? ""
                      : ownerForm.AdhaarNo.toString();
                  handleBlur("AdhaarNo", value);
                }}
                placeholder=""
                type="number"
                required
                error={errors.aadhaar}
                touched={touched.aadhaar}
                sx={{ width: "100%", ...uniformInputSx }}
                inputProps={{ onKeyDown: handleNumberKeyDown }}
              />
            </Box>

            {/* Owner name */}
            <Box>
              <FormTextField
                label={ownerNameLabel}
                value={ownerForm.Name}
                onChange={(val) => {
                  markModified();
                  setOwnerForm((f) => ({ ...f, Name: onlyAlphabetInput(val) }));
                  setErrors((e) => ({ ...e, ownerName: "" }));
                }}
                onBlur={() => {
                  const value = ownerForm.Name || "";
                  handleBlur("Name", value);
                }}
                placeholder=""
                type="text"
                required
                error={errors.ownerName}
                touched={touched.ownerName}
                sx={{ width: "100%", ...uniformInputSx }}
              />
            </Box>

            {/* Mobile */}
            <Box>
              <FormTextField
                label={mobileNumberLabel}
                value={ownerForm.ContactNo}
                onChange={(val) => {
                  markModified();
                  setOwnerForm((f) => ({
                    ...f,
                    ContactNo: onlyMobileInput(val, 10),
                  }));
                  setErrors((e) => ({ ...e, mobile: "" }));
                }}
                onBlur={() => {
                  const value = ownerForm.ContactNo || "";
                  handleBlur("ContactNo", value);
                }}
                placeholder=""
                type="number"
                required
                error={errors.mobile}
                touched={touched.mobile}
                sx={{ width: "100%", ...uniformInputSx }}
                inputProps={{ onKeyDown: handleNumberKeyDown }}
              />
            </Box>

            {/* Gender */}
            <CustomDropdown
              label={genderLabel}
              name="Gender"
              value={ownerForm.Gender}
              options={genderOptions}
              showDropdown={showGenderDropdown}
              setShowDropdown={setShowGenderDropdown}
              onSelect={(_n, v) => handleGenderSelect(v)}
              closeOtherDropdowns={() => setShowGenderDropdown(false)}
              onBlur={() => handleBlur("Gender", ownerForm.Gender)}
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
                  markModified();
                  setOwnerForm((prev) => ({ ...prev, Email: val }));
                  setErrors((e) => ({ ...e, email: "" }));
                }}
                onBlur={() => handleBlur("Email", ownerForm.Email)}
                placeholder=""
                type="text"
                required
                error={errors.email}
                touched={touched.email}
                sx={{ width: "100%", ...uniformInputSx }}
              />
            </Box>

            {/* Ownership Share */}
            <Box>
              <CountIncrementor
                label="Ownership Share (%)"
                value={ownerForm.OwnershipShare}
                setValue={(val) => {
                  markModified();
                  setOwnerForm((prev) => ({ ...prev, OwnershipShare: val }));
                }}
                min={0}
                max={
                  ownerForm.ID
                    ? remainingOwnership + (editingOwner?.OwnershipShare || 0)
                    : remainingOwnership
                }
              />
            </Box>

            {/* Guardian checkbox */}
            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              <Checkbox
                checked={showGuardianFields}
                onChange={(e) => {
                  markModified();
                  const checked = e.target.checked;
                  setShowGuardianFields(checked);
                  if (!checked) {
                    setOwnerForm((prev) => ({
                      ...prev,
                      Guardian: "",
                      GuardianType: "",
                    }));
                    setErrors((prev) => ({
                      ...prev,
                      guardian: "",
                      guardianRelationship: "",
                    }));
                  }
                }}
                sx={{
                  mr: 1,
                  color: "#8a4a20",
                  "&.Mui-checked": { color: "#8a4a20" },
                }}
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
                    onBlur={() =>
                      handleBlur("Guardian", ownerForm.Guardian ?? "")
                    }
                    placeholder=""
                    type="text"
                    required
                    error={errors.guardian}
                    touched={touched.guardian}
                    sx={{ width: "100%", ...uniformInputSx }}
                  />
                </Box>

                <CustomDropdown
                  label={guardianRelationshipLabel}
                  name="GuardianType"
                  value={ownerForm.GuardianType}
                  options={guardianRelationshipOptions}
                  showDropdown={showGuardianRelationshipDropdown}
                  setShowDropdown={setShowGuardianRelationshipDropdown}
                  onSelect={(_n, v) => handleGuardianRelationshipSelect(_n, v)}
                  closeOtherDropdowns={() =>
                    setShowGuardianRelationshipDropdown(false)
                  }
                  selectText=""
                  onBlur={() =>
                    handleBlur("GuardianType", ownerForm.GuardianType ?? "")
                  }
                  required
                  error={errors.guardianRelationship}
                  touched={!!errors.guardianRelationship}
                />
              </>
            )}

            <Box sx={{ width: "100%", height: "100%" }}>
              <Button
                type="button"
                disabled={isSubmitting}
                onClick={handleAddOwner}
                variant="contained"
                sx={{ ...verifyButtonSx, display: "block", marginLeft: "auto" }}
              >
                {isSubmitting ? "Submitting" : nextButtonText}
              </Button>
            </Box>
          </Stack>
        </Box>
      </Box>
    </>
  );
};

export default OwnerDetails;
