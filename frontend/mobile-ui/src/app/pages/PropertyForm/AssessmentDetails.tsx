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

import React, { useEffect, useState, useRef } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useFormMode } from "../../../context/FormModeContext";
import JsonService, {
  getUnitOfMeasurementOptions,
} from "../../../services/jsonServerApiCalls";
import { usePropertyForm } from "../../../context/PropertyFormContext";
import { useAssessmentDetailsLocalization } from "../../../services/AgentLocalisation/localisation-AssessmentDetails";
import CalendarIcon from "../../assets/Agent/date_range.svg";
import StepHeader from "../../features/Agent/components/StepHeader";
import { useLocalization } from "../../../services/AgentLocalisation/formLocalisation";
import CustomDropdown from "../../features/PropertyForm/components/IGRSDetail/IGRSdropdown";
import type { DropdownOption } from "../../features/PropertyForm/components/IGRSDetail/IGRSdropdown";
import FormTextField from "../../features/PropertyForm/components/IGRSDetail/IGRSFormTextFiled";
import { uniformInputSx, verifyButtonSx } from "./styles/sharedStyles";
import type { AlertType } from "../../models/AlertType.model";
import {
  useCreateAssessmentDetailsMutation,
  useUpdateAssessmentDetailsMutation,
} from "../../../redux/apis/AssessmentDetails.api";
import { NotificationPopup } from "../../components/Popup/NotificationPopup";

type LocalState = {
  reason: string;
  occupancyCertificateNumber: string;
  occupancyCertificateDate: string;
  extentOfSite: string;
  landUnderBuilding: string;
  isUnspecifiedShare: boolean;
};

const containerStyle = {
  width: "100%",
  margin: "0 auto",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column" as const,
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  bgcolor: "#fff",
};

const formContentStyle = {
  flex: 1,
  px: "8%",
  py: 3,
  backgroundColor: "#FFFFFF",
};

const formSubmitSx = {
  padding: "16px 0",
  backgroundColor: "#FFFFFF",
};

const labelSx = {
  fontSize: 14,
  fontWeight: 400,
  color: "#333333",
  textAlign: "left" as const,
};

// Calendar icon component for DatePicker
const CalendarIconComponent = () => (
  <img
    src={CalendarIcon}
    alt="calendar"
    style={{ width: 24, height: 24, marginTop: "-2px" }}
  />
);

const validateReason = (value: string, errorMessage: string): string => {
  return value ? '' : errorMessage;
};

const validateOccupancyCertificate = (value: string): string => {
  if (!value?.trim()) return '';
  
  const ocRegex = /^OC-\d{4}-\d{3}(-REVISED)?$/;
  return ocRegex.test(value.trim()) 
    ? '' 
    : 'Invalid format. Example: OC-0000-000';
};

const validateNumericField = (
  field: string,
  value: string,
  messages: {
    required: string;
    onlyNumbers: string;
    positiveNumber: string;
  }
): string => {
  console.log(field);
  // Check if empty
  if (!value || value.trim() === '') {
    return messages.required;
  }

  // Check format
  if (!/^\d*\.?\d*$/.test(value)) {
    return messages.onlyNumbers;
  }

  // Check for lone dot
  if (value === '.') {
    return 'Must contain at least one digit';
  }

  // Check positive number
  const num = Number(value);
  if (Number.isNaN(num) || num <= 0) {
    return messages.positiveNumber;
  }

  return '';
};

const AssessmentDetails: React.FC = () => {
  const { mode } = useFormMode();
  const navigate = useNavigate();
  const { formData, updateForm } = usePropertyForm();

  const propertyId = formData.id ?? "";

  const [createAssessmentDetails] = useCreateAssessmentDetailsMutation();
  const [updateAssessmentDetails] = useUpdateAssessmentDetailsMutation();

  const {
    reasonCreationLabel,
    occupancyCertificateNumberLabel,
    occupancyCertificateDateLabel,
    unspecifiedShareLabel,
    selectOption,
    positiveNumberRequiredError,
    reasonOptions: reasonTranslations,
    assessmentDetailsSubtitle,
    previousText,
    saveDraftText,
    enterExtentSitePlaceholder,
    enterLandUnderneathPlaceholder,
  } = useAssessmentDetailsLocalization();

  const { nextButtonText, onlyNumbersAreAllowedMSG } = useLocalization();

  const [localData, setLocalData] = useState<LocalState>({
    reason: formData.assessmentDetails?.ReasonOfCreation || "",
    occupancyCertificateNumber:
      formData.assessmentDetails?.OccupancyCertificateNumber || "",
    occupancyCertificateDate:
      formData.assessmentDetails?.OccupancyCertificateDate || "",
    extentOfSite: formData.assessmentDetails?.ExtentOfSite || "",
    landUnderBuilding:
      formData.assessmentDetails?.IsLandUnderneathBuilding?.toString() || "",
    isUnspecifiedShare: formData.assessmentDetails?.IsUnspecifiedShare || false,
  });

  const [reasonsFromJson, setReasonsFromJson] = useState<DropdownOption[]>([]);
  const [reasons, setReasons] = useState<DropdownOption[]>([]);
  const [showReasonDropdown, setShowReasonDropdown] = useState(false);

  // Error and touched state
  const [errors, setErrors] = useState<Record<keyof LocalState, string>>({
    reason: "",
    occupancyCertificateNumber: "",
    occupancyCertificateDate: "",
    extentOfSite: "",
    landUnderBuilding: "",
    isUnspecifiedShare: "",
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
  const [showNumberWarnings, setShowNumberWarnings] = useState<
    Record<string, boolean>
  >({
    extentOfSite: false,
    landUnderBuilding: false,
  });

  // close other dropdowns helper
  const closeAllDropdowns = () => {
    setShowReasonDropdown(false);
  };

  // unit of measurement MDMS
  const [unitOfMeasurement, setUnitOfMeasurement] = useState<string>("");

  useEffect(() => {
    getUnitOfMeasurementOptions()
      .then((data) => {
        setUnitOfMeasurement(data?.unitOfmeasurement || "");
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
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showReasonDropdown]);

  function validateField(field: string, value: string, isUnspecified?: boolean): string {
    switch (field) {
      case 'reason':
        return validateReason(value, 'Select Reason of creation to proceed');
        
      case 'occupancyCertificateNumber':
        return validateOccupancyCertificate(value);
        
      case 'extentOfSite':
        return validateNumericField(field, value, {
          required: 'Extent of site is mandatory',
          onlyNumbers: onlyNumbersAreAllowedMSG,
          positiveNumber: positiveNumberRequiredError,
        });

      case 'landUnderBuilding': {
        const shouldUseUnspecified = isUnspecified ?? localData.isUnspecifiedShare;
        return validateNumericField(field, value, {
          required: shouldUseUnspecified
            ? 'Unspecified / Undivided Share of Land is mandatory'
            : 'Land underneath the building is mandatory',
          onlyNumbers: onlyNumbersAreAllowedMSG,
          positiveNumber: positiveNumberRequiredError,
        });
      }
        
      default:
        return '';
    }
  }

  // Number keydown block ('-', 'e', '+')
  const handleNumberKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (["-", "e", "+"].includes(e.key)) e.preventDefault();
  };

  const sanitizeNumberInput = (value: string): string => {
    let sanitized = value.replaceAll(/[^0-9.]/g, '');
    const parts = sanitized.split('.');
    if (parts.length > 2) {
      sanitized = parts[0] + '.' + parts.slice(1).join('');
    }
    return sanitized;
  };

  const handleNumberFieldChange = (
    field: keyof LocalState,
    value: string,
    setLocalData: React.Dispatch<React.SetStateAction<LocalState>>,
    setShowNumberWarnings: React.Dispatch<React.SetStateAction<Record<string, boolean>>>,
    showNumberWarnings: Record<string, boolean>,
    touched: Record<keyof LocalState, boolean>,
    setErrors: React.Dispatch<React.SetStateAction<Record<keyof LocalState, string>>>
  ): void => {
    const isValid = /^\d*\.?\d*$/.test(value);
    const sanitized = sanitizeNumberInput(value);

    if (!isValid && value !== '') {
      setShowNumberWarnings((prev) => ({ ...prev, [field]: true }));
      return;
    }

    setLocalData((prev) => ({ ...prev, [field]: sanitized }));

    if (showNumberWarnings[field] && (/^\d*\.?\d*$/.test(sanitized) || sanitized === '')) {
      setShowNumberWarnings((prev) => ({ ...prev, [field]: false }));
    }

    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleOccupancyCertificateChange = (
    field: keyof LocalState,
    value: string,
    setLocalData: React.Dispatch<React.SetStateAction<LocalState>>,
    setErrors: React.Dispatch<React.SetStateAction<Record<keyof LocalState, string>>>,
    setTouched: React.Dispatch<React.SetStateAction<Record<keyof LocalState, boolean>>>
  ): void => {
    const partialOcRegex = /^[A-Z0-9-]*$/;
    const ocRegex = /^OC-\d{4}-\d{3}(-REVISED)?$/;

    if (partialOcRegex.test(value) || value === '') {
      const errorMsg = value && !ocRegex.test(value.trim())
        ? 'Invalid format. Example: OC-0000-000'
        : '';

      setLocalData((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: errorMsg }));
      setTouched((prev) => ({ ...prev, [field]: true }));
    } else {
      setErrors((prev) => ({
        ...prev,
        [field]: 'Only uppercase letters, digits and dash (-) allowed.',
      }));
      setTouched((prev) => ({ ...prev, [field]: true }));
    }
  };

  const handleGenericFieldChange = (
    field: keyof LocalState,
    value: string,
    setLocalData: React.Dispatch<React.SetStateAction<LocalState>>,
    setTouched: React.Dispatch<React.SetStateAction<Record<keyof LocalState, boolean>>>,
    setErrors: React.Dispatch<React.SetStateAction<Record<keyof LocalState, string>>>,
    validateField: (field: string, value: string) => string
  ): void => {
    setLocalData((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validateField(field as string, value) }));
  };

  const handleFieldChange = (field: keyof LocalState) => (value: string) => {
    markModified();
    if (field === 'extentOfSite' || field === 'landUnderBuilding') {
      handleNumberFieldChange(
        field,
        value,
        setLocalData,
        setShowNumberWarnings,
        showNumberWarnings,
        touched,
        setErrors
      );
    } else if (field === 'occupancyCertificateNumber') {
      handleOccupancyCertificateChange(
        field,
        value,
        setLocalData,
        setErrors,
        setTouched
      );
    } else {
      handleGenericFieldChange(
        field,
        value,
        setLocalData,
        setTouched,
        setErrors,
        validateField
      );
    }
  };

  // --- LEADING ZEROES LOGIC ON BLUR ---
  const handleBlur = (field: keyof LocalState) => {
    let newValue = localData[field];

    // Remove leading zeros for positive number fields on blur
    if (
      (field === "extentOfSite" || field === "landUnderBuilding") &&
      typeof newValue === "string" &&
      newValue !== ""
    ) {
      // '006.3' => '6.3', '007' => '7', '000' => '0', '.7' untouched
      if (/^\d+(\.\d*)?$/.test(newValue)) {
        const parts = newValue.split(".");
        parts[0] = String(Number(parts[0]));
        newValue = parts.length > 1 ? parts.join(".") : parts[0];
      }
      setLocalData((prev) => ({ ...prev, [field]: newValue }));
    }
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({
      ...prev,
      [field]: validateField(
        field as string,
        typeof newValue === "string" ? newValue : ""
      ),
    }));
  };

  const handleCheckboxChange = (
    _event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    markModified();
    setLocalData((prev) => ({ ...prev, isUnspecifiedShare: checked }));
  
  if (touched.landUnderBuilding) {
    const errorMsg = validateNumericField('landUnderBuilding', localData.landUnderBuilding, {
      required: checked
        ? 'Unspecified / Undivided Share of Land is mandatory'
        : 'Land underneath the building is mandatory',
      onlyNumbers: onlyNumbersAreAllowedMSG,
      positiveNumber: positiveNumberRequiredError,
    });
    
    setErrors((prev) => ({
      ...prev,
      landUnderBuilding: errorMsg,
    }));
  }
  };

  const [hasModified, setHasModified] = useState(false);

  const markModified = () => {
    if (mode === "verify") setHasModified(true);
  };

  const handleReasonSelect = (label: string) => {
    markModified();
    setLocalData((prev) => ({ ...prev, reason: label }));
    setErrors((prev) => ({ ...prev, reason: "" }));
    setTouched((prev) => ({ ...prev, reason: true }));
    setShowReasonDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = {
      reason: validateField("reason", localData.reason),
      occupancyCertificateNumber: validateField(
        "occupancyCertificateNumber",
        localData.occupancyCertificateNumber
      ),
      occupancyCertificateDate: validateField(
        "occupancyCertificateDate",
        localData.occupancyCertificateDate
      ),
      extentOfSite: validateField("extentOfSite", localData.extentOfSite),
      landUnderBuilding: validateField(
        "landUnderBuilding",
        localData.landUnderBuilding
      ),
      isUnspecifiedShare: "",
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

    const applicationId = localStorage.getItem("applicationId") || localStorage.getItem("applicationLogId") || "";
    const isVerifying = mode === "verify" && hasModified;

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
          applicationId,
          isVerifying,
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
      navigate("/property-form/igrs-details");
    } catch (error) {
      console.log(error);

      showErrorPopup("Failed to save assessment details.");
    }
  };

  useEffect(() => {
    if (formData.assessmentDetails) {
      setLocalData({
        reason: formData.assessmentDetails?.ReasonOfCreation || "",
        occupancyCertificateNumber:
          formData.assessmentDetails?.OccupancyCertificateNumber || "",
        occupancyCertificateDate:
          formData.assessmentDetails?.OccupancyCertificateDate || "",
        extentOfSite: formData.assessmentDetails?.ExtentOfSite || "",
        landUnderBuilding:
          formData.assessmentDetails?.IsLandUnderneathBuilding?.toString() ||
          "",
        isUnspecifiedShare:
          formData.assessmentDetails?.IsUnspecifiedShare || false,
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
    type: "warning",
    open: false,
    title: "",
    message: "",
    duration: 3000,
  });

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

  const handleSaveDraft = () => {
    updateForm({
      assessmentDetails: {
        ReasonOfCreation: localData.reason,
        OccupancyCertificateNumber: localData.occupancyCertificateNumber,
        OccupancyCertificateDate: localData.occupancyCertificateDate,
        ExtentOfSite: localData.extentOfSite.toString(),
        IsLandUnderneathBuilding: localData.landUnderBuilding || "",
        IsUnspecifiedShare: localData.isUnspecifiedShare,
      },
    });
  };

  const getHelperTextColor = (): string => {
  const hasOccupancyNumber = localData.occupancyCertificateNumber.trim();
  const hasOccupancyError = errors.occupancyCertificateNumber;
  
  if (!hasOccupancyNumber || hasOccupancyError) {
    return "transparent";
  }
  
  if (!hasOccupancyNumber) {
    return "#1976d2";
  }
  
  return "#D32F2F";
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
        <StepHeader
          title={mode === "new" ? `New Property Form` : `Property Form`}
          subtitle={`${assessmentDetailsSubtitle}`}
          steps={10}
          activeStep={3}
          onPrevious={handleGoBack}
          onSaveDraft={handleSaveDraft}
          saveDraftText={saveDraftText}
          previousText={previousText}
        />

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
                onBlur={() => handleBlur("reason")}
              />

              <FormTextField
                sx={{ ...uniformInputSx, marginBottom: "30px" }}
                label={occupancyCertificateNumberLabel}
                value={localData.occupancyCertificateNumber}
                onChange={handleFieldChange("occupancyCertificateNumber")}
                onBlur={() => handleBlur("occupancyCertificateNumber")}
                placeholder={occupancyCertificateNumberLabel}
                type="text"
                error={
                  touched.occupancyCertificateNumber
                    ? errors.occupancyCertificateNumber
                    : ""
                }
                touched={touched.occupancyCertificateNumber}
              />

              <Box>
                <Typography sx={labelSx}>
                  {occupancyCertificateDateLabel}
                </Typography>
                <DatePicker
                  value={
                    localData.occupancyCertificateDate
                      ? dayjs(localData.occupancyCertificateDate)
                      : null
                  }
                  onChange={(date) => {
                    const value = date ? dayjs(date).format("YYYY-MM-DD") : "";
                    setLocalData((prev) => ({
                      ...prev,
                      occupancyCertificateDate: value,
                    }));
                    setTouched((prev) => ({
                      ...prev,
                      occupancyCertificateDate: true,
                    }));
                    setErrors((prev) => ({
                      ...prev,
                      occupancyCertificateDate: validateField(
                        "occupancyCertificateDate",
                        value
                      ),
                    }));
                  }}
                  disabled={!localData.occupancyCertificateNumber.trim() || !!errors.occupancyCertificateNumber}
                  disableFuture
                  format="DD/MM/YYYY"
                  slots={{
                    openPickerIcon: CalendarIconComponent,
                  }}
                  slotProps={{
                    textField: {
                      required: false,
                      placeholder: occupancyCertificateDateLabel,
                      disabled: !localData.occupancyCertificateNumber.trim() || !!errors.occupancyCertificateNumber,
                      error:
                        touched.occupancyCertificateDate &&
                        !!errors.occupancyCertificateDate,
                      helperText: (() => {
                        if (errors.occupancyCertificateNumber) {
                          return ''; 
                        }
                        if (!localData.occupancyCertificateNumber.trim()) {
                          return 'Enter Occupancy Certificate Number first';
                        }
                        if (touched.occupancyCertificateDate) {
                          return errors.occupancyCertificateDate;
                        }
                        return '';
                      })(),
                      onBlur: () => {
                        setTouched((prev) => ({
                          ...prev,
                          occupancyCertificateDate: true,
                        }));
                        setErrors((prev) => ({
                          ...prev,
                          occupancyCertificateDate: validateField(
                            "occupancyCertificateDate",
                            localData.occupancyCertificateDate
                          ),
                        }));
                      },
                      inputProps: {
                        style: { marginTop: "-8px" },
                      },
                      sx: {
                        width: "100%",
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderRadius: "12px",
                          },
                        },
                        "& .MuiOutlinedInput-input": {
                          padding: "12px 14px",
                        },
                      },
                      FormHelperTextProps: {
                        sx: {
                          color: getHelperTextColor(),
                          marginTop: "8px",
                          minHeight: "20px",
                          marginLeft: 0, 
                        },
                      },
                    },
                    actionBar: { actions: ["clear", "accept"] },
                  }}
                  maxDate={dayjs()}
                />
              </Box>

              <FormTextField
                sx={{ ...uniformInputSx, marginBottom: "30px" }}
                label={`Extent of Site (${unitOfMeasurement})`}
                value={localData.extentOfSite}
                onChange={handleFieldChange("extentOfSite")}
                onBlur={() => handleBlur("extentOfSite")}
                placeholder={enterExtentSitePlaceholder}
                type="number"
                required
                inputProps={{ onKeyDown: handleNumberKeyDown }}
                error={
                  showNumberWarnings.extentOfSite
                    ? onlyNumbersAreAllowedMSG
                    : errors.extentOfSite
                }
                touched={
                  touched.extentOfSite || showNumberWarnings.extentOfSite
                }
              />

              <FormTextField
                sx={{ ...uniformInputSx, marginBottom: "30px" }}
                label={
                  localData.isUnspecifiedShare
                    ? `Unspecified / Undivided Share of Land (${unitOfMeasurement})`
                    : `Land Underneath the Building (${unitOfMeasurement})`
                }
                value={localData.landUnderBuilding}
                onChange={handleFieldChange("landUnderBuilding")}
                onBlur={() => handleBlur("landUnderBuilding")}
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
                  touched.landUnderBuilding ||
                  showNumberWarnings.landUnderBuilding
                }
              />

              <Box>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={localData.isUnspecifiedShare}
                      sx={{
                        color: "#C84C0E", 
                        "&.Mui-checked": {
                          color: "#C84C0E",
                        },
                      }}
                      onChange={(_e, checked) =>
                        handleCheckboxChange(_e as any, checked)
                      }
                    />
                  }
                  label={unspecifiedShareLabel}
                />
              </Box>

              <Box sx={formSubmitSx}>
                <Button
                  type="submit"
                  sx={{
                    ...verifyButtonSx,
                    display: "block",
                    marginLeft: "auto",
                  }}
                  variant="contained"
                >
                  {mode === "verify" ? "Verify" : nextButtonText}
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
