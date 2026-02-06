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
import React, { useEffect, useState } from "react";
import {
  Box,
  Stack,
  Button,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  CircularProgress,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useNavigate, useLocation } from "react-router-dom";

import { useFormMode } from "../../../context/FormModeContext";
import {
  usePropertyForm,
  type FloorDetails,
} from "../../../context/PropertyFormContext";
import { useFloorDetailsLocalization } from "../../../services/AgentLocalisation/localisation-floor-details";
import StepHeader from "../../features/Agent/components/StepHeader";
import { useLocalization } from "../../../services/AgentLocalisation/formLocalisation";
import CustomDropdown, {
  type DropdownOption,
} from "../../features/PropertyForm/components/IGRSDetail/IGRSdropdown";
import FormTextField from "../../features/PropertyForm/components/IGRSDetail/IGRSFormTextFiled";
import { uniformInputSx, verifyButtonSx } from "./styles/sharedStyles";
import type { AlertType } from "../../models/AlertType.model";
import CalendarIcon from "../../assets/Agent/date_range.svg";
import {
  useCreateFloorDetailsMutation,
  useGetFloorDetailsByIdQuery,
  useUpdateFloorDetailsMutation,
  type FloorDetailsRequest,
} from "../../../redux/apis/floorApi";
import JsonService, {
  getUnitOfMeasurementOptions,
} from "../../../services/jsonServerApiCalls";
import { NotificationPopup } from "../../components/Popup/NotificationPopup";
import CountIncrementor from "../../features/PropertyForm/components/CountIncrementors";

const getEmptyFieldError = (field: string): string => {
  switch (field) {
    case 'floorNumber':
      return 'Floor number is mandatory';
    case 'buildingClassification':
      return 'Select Building Classification to proceed';
    case 'igrsClassification':
      return 'Select IGRS Classification to proceed';
    case 'natureOfUsage':
      return 'Select Nature of Usage to proceed';
    case 'firmName':
      return 'Firm name is mandatory';
    case 'occupancy':
      return 'Select Occupancy to proceed';
    case 'occupantName':
      return 'Occupant name is mandatory';
    case 'constructionDate':
      return 'Construction date is mandatory';
    case 'effectiveFromDate':
      return 'Effective from date is mandatory';
    case 'unstructuredLand':
      return 'Select Unstructured Land to proceed';
    case 'length':
      return 'Length is mandatory';
    case 'breadth':
      return 'Breadth is mandatory';
    case 'plinthArea':
      return 'Plinth Area is mandatory';
    case 'buildingPermissionNo':
      return 'Building Permission No. is mandatory';
    case 'mezzanineArea':
      return 'Mezzanine Area is mandatory';
    default:
      return '';
  }
};

const numericCheck = (val: string, fieldName: string, label: string, required = true) => {
  if (!val || val === "") {
    return required ? getEmptyFieldError(fieldName) : "";
  }
  if (!/^\d*\.?\d*$/.test(val)) return `${label} must be a valid number`;
  if (val === ".") return `${label} must contain at least one digit`;
  const num = Number(val);
  if (Number.isNaN(num) || num <= 0)
    return `${label} must be a positive number`;
  return "";
};

const validateAlphaOnly = (value: string, label: string) => {
  if (value && /[^a-zA-Z\s]/.test(value)) {
    return `${label} - Only alphabets allowed`;
  }
  return "";
};

const validateDate = (dateVal: string, fieldName: string) => {
  if (!dateVal || dateVal === "") {
    return getEmptyFieldError(fieldName);
  }
  if (dayjs(dateVal).isAfter(dayjs().endOf("day"))) {
    return "Date cannot be in the future";
  }
  return "";
};

const validateFloor = (data: any, texts: any) => {
  const errors: Partial<Record<keyof FloorDetails, string>> = {};

  const requiredFields = [
    'floorNumber',
    'buildingClassification',
    'igrsClassification',
    'natureOfUsage',
    'occupancy',
    'unstructuredLand'
  ];

  requiredFields.forEach((field) => {
    if (!data[field] || data[field] === "") {
      errors[field as keyof FloorDetails] = getEmptyFieldError(field);
    }
  });

  // Alphabets only validations
  errors.firmName = validateAlphaOnly(data.firmName, texts.firmNameLabel);
  errors.occupantName = validateAlphaOnly(data.occupantName, texts.occupantNameLabel);

  // numeric validations
  errors.length = numericCheck(data.length, 'length', texts.lengthLabel, true);
  errors.breadth = numericCheck(data.breadth, 'breadth', texts.breadthLabel, true);
  errors.plinthArea = numericCheck(
    data.plinthArea,
    'plinthArea',
    texts.plinthAreaLabel,
    true
  );
  errors.buildingPermissionNo = numericCheck(
    data.buildingPermissionNo,
    'buildingPermissionNo',
    texts.buildingPermissionNoLabel,
    false
  );

  // Validate mezzanine area if mezzanine exists
  if (data.hasMezzanine === "yes") {
    errors.mezzanineArea = numericCheck(
      data.mezzanineArea,
      'mezzanineArea',
      "Mezzanine Area",
      true
    );
  }

  // Date validations
  errors.constructionDate = validateDate(data.constructionDate, 'constructionDate');
  errors.effectiveFromDate = validateDate(data.effectiveFromDate, 'effectiveFromDate');

  // Check if construction date is before effective date
  if (
    !errors.constructionDate &&
    !errors.effectiveFromDate &&
    data.constructionDate &&
    data.effectiveFromDate &&
    dayjs(data.constructionDate).isAfter(dayjs(data.effectiveFromDate))
  ) {
    errors.constructionDate = "Construction date must be before effective date";
  }

  Object.keys(errors).forEach((k) => {
    if (!errors[k as keyof typeof errors])
      delete errors[k as keyof typeof errors];
  });

  return errors;
};


const containerSx = {
  width: "100%",
  // maxWidth: 480,
  margin: "0 auto",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column" as const,
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  bgcolor: "#fff",
};

const headerSx = {
  backgroundColor: "#F9E6E0",
  padding: "16px",
};
const formContentSx = { flex: 1, px: "8%", py: 3, backgroundColor: "#FFFFFF" };
const formSubmitSx = { padding: "16px 0", backgroundColor: "#FFFFFF" };

// Calendar icon component for DatePicker
const CalendarIconComponent = () => (
  <img
    src={CalendarIcon}
    alt="calendar"
    style={{ width: 24, height: 24, marginTop: "-2px" }}
  />
);

const FloorDetailsPage: React.FC = () => {
  // Contexts and hooks for form mode, navigation, location, and property form data
  const { mode } = useFormMode();
  const navigate = useNavigate();
  const location = useLocation();
  const { formData, updateForm } = usePropertyForm();

  const floorId = location.state?.floorId as string | undefined;
  const isEditMode = Boolean(floorId);
  const [hasModified, setHasModified] = useState(false);

  const markModified = () => {
    if (mode === "verify") setHasModified(true);
  };

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
    selectPlaceholder,
    occupantNameLabel,
    previousText,
    propertyFormTitle,
    newPropertyFormTitle,
    floorDetailsSubtitle,
  } = floorLoc;

  const {
    nextButtonText,
    onlyNumbersAllowedInText,
    OnlyalphabetsareallowedMSG,
  } = loc;

  const convertApiToLocal = (apiData: any) => {
    const data = apiData?.data || apiData;
    return {
      floorNumber: (data.FloorNo || data.floorNo || "").toString(),
      buildingClassification: data.Classification || data.classification || "",
      igrsClassification: "A",
      natureOfUsage: data.NatureOfUsage || data.natureOfUsage || "",
      firmName: data.FirmName || data.firmName || "",
      occupancy: data.OccupancyType || data.occupancyType || "",
      constructionDate: data.ConstructionDate || data.constructionDate || "",
      effectiveFromDate: data.EffectiveFromDate || data.effectiveFromDate || "",
      unstructuredLand: data.UnstructuredLand || data.unstructuredLand || "",
      length: (data.LengthFt || data.lengthFt || "").toString(),
      breadth: (data.BreadthFt || data.breadthFt || "").toString(),
      plinthArea: (data.PlinthAreaSqFt || data.plinthAreaSqFt || "").toString(),
      buildingPermissionNo:
        data.BuildingPermissionNo || data.buildingPermissionNo || "",
      floorsDetailsEntered:
        data.FloorDetailsEntered || data.floorDetailsEntered || true,
      occupantName: data.OccupancyName || data.occupancyName || "",
      hasMezzanine: data.HasMezzanine || data.hasMezzanine || "no",
      mezzanineArea: (
        data.MezzanineArea ||
        data.mezzanineArea ||
        ""
      ).toString(),
    };
  };
  const getInitialLocalData = () => ({
    floorNumber: "",
    buildingClassification: "",
    igrsClassification: "A",
    natureOfUsage: "",
    firmName: "",
    occupancy: "",
    constructionDate: "",
    effectiveFromDate: "",
    unstructuredLand: "",
    length: "",
    breadth: "",
    plinthArea: "",
    buildingPermissionNo: "",
    floorsDetailsEntered: true,
    occupantName: "",
    hasMezzanine: "no",
    mezzanineArea: "",
  });

  const [localData, setLocalData] = useState(getInitialLocalData());
  const [unitOfMeasurement, setUnitOfMeasurement] = useState<string>("");
  useEffect(() => {
    getUnitOfMeasurementOptions()
      .then((data) => {
        setUnitOfMeasurement(data?.unitOfmeasurement || "");
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
  }, [existingFloorData, isEditMode]);

  const [buildingClassificationOpts, setBuildingClassificationOpts] = useState<
    DropdownOption[]
  >([]);
  const [natureOfUsageOpts, setNatureOfUsageOpts] = useState<DropdownOption[]>(
    []
  );
  const [occupancyOpts, setOccupancyOpts] = useState<DropdownOption[]>([]);
  const [unstructuredLandOpts, setUnstructuredLandOpts] = useState<
    DropdownOption[]
  >([]);

  const [
    showBuildingClassificationDropdown,
    setShowBuildingClassificationDropdown,
  ] = useState(false);
  const [showNatureOfUsageDropdown, setShowNatureOfUsageDropdown] =
    useState(false);
  const [showOccupancyDropdown, setShowOccupancyDropdown] = useState(false);
  const [showUnstructuredLandDropdown, setShowUnstructuredLandDropdown] =
    useState(false);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {}
  );
  const [showNumberWarnings, setShowNumberWarnings] = useState<
    Record<string, boolean>
  >({
    length: false,
    breadth: false,
    plinthArea: false,
    buildingPermissionNo: false,
    mezzanineArea: false,
  });

  const closeAllDropdowns = () => {
    setShowBuildingClassificationDropdown(false);
    setShowNatureOfUsageDropdown(false);
    setShowOccupancyDropdown(false);
    setShowUnstructuredLandDropdown(false);
  };

  const markTouched = (name: string) =>
    setTouchedFields((prev) => ({ ...prev, [name]: true }));

  const handleDropdownSelect =
    (field: keyof typeof localData) => (val: string) => {
      markModified();
      setLocalData((prev) => ({ ...prev, [field]: val }));
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
      markTouched(field as string);
      closeAllDropdowns();
    };

  const sanitizeNumberValue = (raw: string) => {
    let v = raw.replaceAll(/[^0-9.]/g, "");
    if ((v.match(/\./g) || []).length > 1) {
      const parts = v.split(".");
      v = parts[0] + "." + parts.slice(1).join("");
    }
    return v;
  };

  const handleNumberKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const forbidden = ["-", "e", "E", "+"];
    if (forbidden.includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleFieldChange =
    (field: keyof typeof localData) => (value: string) => {
      markModified();
      let newValue = value;

      if (field === "firmName" || field === "occupantName") {
        if (/[^a-zA-Z\s]/.test(value)) {
          setFieldErrors((prev) => ({
            ...prev,
            [field]: OnlyalphabetsareallowedMSG,
          }));
        }
        newValue = value.replaceAll(/[^a-zA-Z\s]/g, "");
      }

      if (
        [
          "length",
          "breadth",
          "plinthArea",
          "buildingPermissionNo",
          "mezzanineArea",
        ].includes(field as string)
      ) {
        newValue = sanitizeNumberValue(value);
        if (/^\d*\.?\d*$/.test(newValue)) {
          setShowNumberWarnings((prev) => ({
            ...prev,
            [field as string]: false,
          }));
        } else {
          setShowNumberWarnings((prev) => ({
            ...prev,
            [field as string]: true,
          }));
        }

        const isRequired = field !== 'buildingPermissionNo' && 
                      !(field === 'mezzanineArea' && localData.hasMezzanine !== 'yes');

        if (
          newValue === "" &&
          touchedFields[field as string] &&
          isRequired
        ) {
          setFieldErrors((prev) => ({
            ...prev,
            [field]: getEmptyFieldError(field as string),
          }));
        }
      }

      setLocalData((prev) => ({ ...prev, [field]: newValue }));
      if (touchedFields[field as string])
        setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    };

  const handleDateChange =
    (field: "constructionDate" | "effectiveFromDate") => (date: any) => {
      const value = date ? dayjs(date).format("YYYY-MM-DD") : "";
      setLocalData((prev) => ({ ...prev, [field]: value }));
      markTouched(field);
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    };

  // ---- LEADING ZERO REMOVAL ON BLUR ----
  const handleBlurField = (field: keyof typeof localData) => {
    markTouched(field as string);

    let value = localData[field];

    // Remove leading zeros for numeric fields on blur
    if (
      [
        "length",
        "breadth",
        "plinthArea",
        "buildingPermissionNo",
        "mezzanineArea",
      ].includes(field as string) &&
      typeof value === "string" &&
      value !== ""
    ) {
      if (/^\d+(\.\d*)?$/.test(value)) {
        const parts = value.split(".");
        parts[0] = String(Number(parts[0]));
        value = parts.length > 1 ? parts.join(".") : parts[0];
        setLocalData((prev) => ({ ...prev, [field]: value }));
      }
    }

    // Retain the rest of your validation logic
    // Use switch for required field checks
    switch (field) {
      case "floorNumber":
      case "buildingClassification":
      case "natureOfUsage":
      case "occupancy":
      case "unstructuredLand":
        if (!value || value === "") {
          setFieldErrors((prev) => ({
            ...prev,
            [field]: getEmptyFieldError(field as string),
          }));
          return;
        }
        break;
      case "length":
      case "breadth":
      case "plinthArea":
        if (!value) {
          setFieldErrors((prev) => ({
            ...prev,
            [field]: getEmptyFieldError(field as string),
          }));
        }
        break;
      case "mezzanineArea":
        if (localData.hasMezzanine === "yes" && !value) {
          setFieldErrors((prev) => ({
            ...prev,
            [field]: getEmptyFieldError('mezzanineArea'),
          }));
        }
        break;
      default:
        break;
    }
  };

  const convertLocalToApi = (localData: any, appId: string, isVerify: boolean): FloorDetailsRequest => ({
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
    applicationId: appId,
    isVerifying: isVerify
  });

  // handleAddFloor: Validates and submits form, creates/updates floor details via API
  const handleAddFloor = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Mark all fields as touched to show all errors
    const allFields = [
      "floorNumber",
      "buildingClassification",
      "igrsClassification",
      "natureOfUsage",
      "firmName",
      "occupancy",
      "occupantName",
      "constructionDate",
      "effectiveFromDate",
      "unstructuredLand",
      "length",
      "breadth",
      "plinthArea",
      "buildingPermissionNo",
      "mezzanineArea",
    ];

    const newTouchedFields: Record<string, boolean> = {};
    allFields.forEach((field) => {
      newTouchedFields[field] = true;
    });
    setTouchedFields(newTouchedFields);

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
    };

    const validation = validateFloor(
      localData,
      textsForValidation,
    );
    setFieldErrors(validation);

    if (Object.keys(validation).length > 0) {
      // Scroll to the first error field
      const firstErrorField = Object.keys(validation)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    const newFloor: FloorDetails = {
      ...localData,
      length: Number(localData.length),
      breadth: Number(localData.breadth),
      plinthArea: Number(localData.plinthArea),
      mezzanineArea: Number(localData.mezzanineArea),
      buildingPermissionNo: localData.buildingPermissionNo,
      occupantName: localData.occupantName,
    };

    const applicationId = localStorage.getItem("applicationId") || localStorage.getItem("applicationLogId") || "";
    const isVerifying = mode === "verify" && hasModified;

    try {
      const apiData = convertLocalToApi(localData, applicationId, isVerifying);
      if (isEditMode && floorId) {
        const result = await updateFloorDetails({
          id: floorId,
          data: apiData,
          applicationId,
          isVerifying,
        }).unwrap();
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
      setTouchedFields({});
      navigate(-1);
    } catch (error: any) {
      console.error("Failed to save floor details:", error);
      const errorMessage =
        error?.data?.message ||
        "Failed to save floor details. Please try again.";
      showErrorPopup(errorMessage);

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
    updateForm({ floors: formData.floors });
  };

  useEffect(() => {
    JsonService.getBuildingClassifications().then((data) => {
      if (Array.isArray(data)) {
        setBuildingClassificationOpts(
          data
            .filter((item) => item.label !== "select")
            .map((item, index) => ({ id: index, label: item.label }))
        );
      }
    });
    JsonService.getNatureOfUsages().then((data) => {
      if (Array.isArray(data)) {
        setNatureOfUsageOpts(
          data.map((item, index) => ({ id: index, label: item.label }))
        );
      }
    });
    JsonService.getUnstructuredLands().then((data) => {
      if (Array.isArray(data)) {
        setUnstructuredLandOpts(
          data.map((item, index) => ({ id: index, label: item.label }))
        );
      }
    });
    JsonService.getOccupancies().then((data) => {
      if (Array.isArray(data)) {
        setOccupancyOpts(
          data.map((item, index) => ({ id: index, label: item.label }))
        );
      }
    });
  }, []);

  if (isEditMode && isLoadingFloorData) {
    return (
      <Box
        sx={{ ...containerSx, justifyContent: "center", alignItems: "center" }}
      >
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading floor details...</Typography>
      </Box>
    );
  }

  if (isEditMode && loadError) {
    return (
      <Box
        sx={{ ...containerSx, justifyContent: "center", alignItems: "center" }}
      >
        <Typography color="error" sx={{ mt: 2 }}>
          Failed to load floor details. Please try again.
        </Typography>
        <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Box>
    );
  }

  const getLengthError = () => {
    if (touchedFields.length) return fieldErrors.length;
    if (showNumberWarnings.length)
      return `${onlyNumbersAllowedInText} ${lengthLabel}.`;
    return "";
  };

  const getBreadthError = () => {
    if (touchedFields.breadth) return fieldErrors.breadth;
    if (showNumberWarnings.breadth)
      return `${onlyNumbersAllowedInText} ${breadthLabel}.`;
    return "";
  };

  const getPlinthAreaError = () => {
    if (touchedFields.plinthArea) return fieldErrors.plinthArea;
    if (showNumberWarnings.plinthArea)
      return `${onlyNumbersAllowedInText} ${plinthAreaLabel}.`;
    return "";
  };

  const getBuildingPermissionNoError = () => {
    if (touchedFields.buildingPermissionNo)
      return fieldErrors.buildingPermissionNo;
    if (showNumberWarnings.buildingPermissionNo)
      return `${onlyNumbersAllowedInText} ${buildingPermissionNoLabel}.`;
    return "";
  };

  const getMezzanineAreaError = () => {
    if (touchedFields.mezzanineArea) return fieldErrors.mezzanineArea;
    if (showNumberWarnings.mezzanineArea)
      return `${onlyNumbersAllowedInText} Mezzanine Area.`;
    return "";
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
      <Box sx={containerSx}>
        <Box sx={headerSx}>
          <StepHeader
            title={`${
              mode === "new"
                ? `${newPropertyFormTitle}`
                : `${propertyFormTitle}`
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
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Box sx={{ flex: 1, width: "60%" }}>
                  <CountIncrementor
                    label={floorNumberLabel}
                    value={
                      localData.floorNumber ? Number(localData.floorNumber) : 0
                    }
                    setValue={(val) => {
                      markModified();
                      setLocalData((prev) => ({
                        ...prev,
                        floorNumber: val.toString(),
                      }));
                      setFieldErrors((prev) => ({ ...prev, floorNumber: "" }));
                      markTouched("floorNumber");
                    }}
                    min={-formData.noOfBasements! || -10}
                    max={formData.noOfFloors || 100}
                  />
                  {fieldErrors.floorNumber && touchedFields.floorNumber && (
                    <div
                      className="error-message"
                      style={{ marginTop: 4, color: "#D32F2F", fontSize: 12 }}
                    >
                      {fieldErrors.floorNumber}
                    </div>
                  )}
                </Box>

                <Box sx={{ mt: 2, mb: 2 }}>
                  <FormControl component="fieldset">
                    <Typography sx={{ mb: 1, fontWeight: 400, fontSize: 14 }}>
                      Does this floor have a Mezzanine Floor?{" "}
                      <span style={{ color: "#D32F2F", marginLeft: 4 }}>*</span>{" "}
                    </Typography>
                    <RadioGroup
                      row
                      value={localData.hasMezzanine}
                      onChange={(e) => {
                        markModified();
                        setLocalData((prev) => ({
                          ...prev,
                          hasMezzanine: e.target.value,
                          // Clear mezzanine area if switching to 'no'
                          mezzanineArea:
                            e.target.value === "no" ? "" : prev.mezzanineArea,
                        }));
                        setFieldErrors((prev) => ({
                          ...prev,
                          hasMezzanine: "",
                          mezzanineArea: "",
                        }));
                        markTouched("hasMezzanine");
                      }}
                      sx={{ gap: 2 }}
                    >
                      <FormControlLabel
                        value="no"
                        control={
                          <Radio
                            sx={{
                              color: "#00000080",
                              "&.Mui-checked": { color: "#c84c0e" },
                            }}
                          />
                        }
                        label="No"
                      />
                      <FormControlLabel
                        value="yes"
                        control={
                          <Radio
                            sx={{
                              color: "#00000080",
                              "&.Mui-checked": { color: "#c84c0e" },
                            }}
                          />
                        }
                        label="Yes"
                      />
                    </RadioGroup>
                  </FormControl>
                </Box>

                {localData.hasMezzanine === "yes" && (
                  <FormTextField
                    label={`Mezzanine Area (Sq.${unitOfMeasurement})`}
                    value={localData.mezzanineArea}
                    onChange={handleFieldChange("mezzanineArea")}
                    onBlur={() => handleBlurField("mezzanineArea")}
                    placeholder=""
                    type="number"
                    required
                    inputProps={{
                      onKeyDown: handleNumberKeyDown,
                      onFocus: () => markTouched("mezzanineArea"),
                    }}
                    error={getMezzanineAreaError()}
                    touched={
                      !!touchedFields.mezzanineArea ||
                      !!showNumberWarnings.mezzanineArea
                    }
                    sx={{ ...uniformInputSx }}
                  />
                )}

                <Box sx={{ flex: 1, width: "100%" }}>
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
                      handleDropdownSelect("buildingClassification")(v)
                    }
                    closeOtherDropdowns={closeAllDropdowns}
                    selectText={selectPlaceholder}
                    required
                    error={fieldErrors.buildingClassification}
                    touched={!!touchedFields.buildingClassification}
                    onBlur={() => handleBlurField("buildingClassification")}
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
                onSelect={(_n, v) => handleDropdownSelect("natureOfUsage")(v)}
                closeOtherDropdowns={closeAllDropdowns}
                selectText={selectPlaceholder}
                required
                error={fieldErrors.natureOfUsage}
                touched={!!touchedFields.natureOfUsage}
                onBlur={() => handleBlurField("natureOfUsage")}
              />
              <Box>
                <FormTextField
                  label={firmNameLabel}
                  value={localData.firmName}
                  onChange={handleFieldChange("firmName")}
                  onBlur={() => handleBlurField("firmName")}
                  placeholder={firmNameLabel}
                  type="text"
                  required={false}
                  error={
                    fieldErrors.firmName ||
                    (touchedFields.firmName ? fieldErrors.firmName : "")
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
                onSelect={(_n, v) => handleDropdownSelect("occupancy")(v)}
                closeOtherDropdowns={closeAllDropdowns}
                selectText={selectPlaceholder}
                required
                error={fieldErrors.occupancy}
                touched={!!touchedFields.occupancy}
                onBlur={() => handleBlurField("occupancy")}
              />
              <FormTextField
                label={occupantNameLabel}
                value={localData.occupantName}
                onChange={handleFieldChange("occupantName")}
                onBlur={() => handleBlurField("occupantName")}
                placeholder=""
                type="text"
                required={false}
                error={fieldErrors.occupantName}
                touched={!!touchedFields.occupantName}
                sx={{ ...uniformInputSx }}
              />
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <Box>
                  <Typography sx={{ fontSize: 14, fontWeight: 400 }}>
                    {constructionDateLabel}
                    <span style={{ color: "#D32F2F", marginLeft: 4 }}>*</span>
                    <span style={{ marginLeft: 6 }}>:</span>
                  </Typography>
                  <DatePicker
                    value={
                      localData.constructionDate
                        ? dayjs(localData.constructionDate)
                        : null
                    }
                    onChange={handleDateChange("constructionDate")}
                    disableFuture
                    format="DD/MM/YYYY"
                    slots={{
                      openPickerIcon: CalendarIconComponent,
                    }}
                    slotProps={{
                      textField: {
                        placeholder: " ",
                        onBlur: () => handleBlurField("constructionDate"),
                        inputProps: {
                          style: { marginTop: "-8px" },
                        },
                        sx: {
                          width: "60%",
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
                      },
                      actionBar: { actions: ["clear", "accept"] },
                    }}
                    maxDate={dayjs()}
                  />
                  {fieldErrors.constructionDate && (
                    <div
                      className="error-message"
                      style={{ marginTop: 8, color: "#D32F2F" }}
                    >
                      {fieldErrors.constructionDate}
                    </div>
                  )}
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 14, fontWeight: 400 }}>
                    {effectiveFromDateLabel}
                    <span style={{ color: "#D32F2F", marginLeft: 4 }}>*</span>
                    <span style={{ marginLeft: 6 }}>:</span>
                  </Typography>
                  <DatePicker
                    value={
                      localData.effectiveFromDate
                        ? dayjs(localData.effectiveFromDate)
                        : null
                    }
                    onChange={handleDateChange("effectiveFromDate")}
                    disableFuture
                    format="DD/MM/YYYY"
                    slots={{
                      openPickerIcon: CalendarIconComponent,
                    }}
                    slotProps={{
                      textField: {
                        placeholder: " ",

                        onBlur: () => handleBlurField("effectiveFromDate"),
                        inputProps: {
                          style: { marginTop: "-8px" },
                        },
                        sx: {
                          width: "60%",
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
                      },
                      actionBar: { actions: ["clear", "accept"] },
                    }}
                    maxDate={dayjs()}
                  />
                  {fieldErrors.effectiveFromDate && (
                    <div
                      className="error-message"
                      style={{ marginTop: 8, color: "#D32F2F" }}
                    >
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
                  onSelect={(_n, v) =>
                    handleDropdownSelect("unstructuredLand")(v)
                  }
                  closeOtherDropdowns={closeAllDropdowns}
                  selectText={selectPlaceholder}
                  required
                  error={fieldErrors.unstructuredLand}
                  touched={!!touchedFields.unstructuredLand}
                  onBlur={() => handleBlurField("unstructuredLand")}
                />
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <FormTextField
                  label={`${lengthLabel} (${unitOfMeasurement})`}
                  value={localData.length}
                  onChange={handleFieldChange("length")}
                  onBlur={() => handleBlurField("length")}
                  placeholder=""
                  type="number"
                  required
                  inputProps={{ onKeyDown: handleNumberKeyDown }}
                  error={getLengthError()}
                  touched={
                    !!touchedFields.length || !!showNumberWarnings.length
                  }
                  sx={{ ...uniformInputSx }}
                />

                <FormTextField
                  label={`${breadthLabel} (${unitOfMeasurement})`}
                  value={localData.breadth}
                  onChange={handleFieldChange("breadth")}
                  onBlur={() => handleBlurField("breadth")}
                  placeholder=""
                  type="number"
                  required
                  inputProps={{ onKeyDown: handleNumberKeyDown }}
                  error={getBreadthError()}
                  touched={
                    !!touchedFields.breadth || !!showNumberWarnings.breadth
                  }
                  sx={{ ...uniformInputSx }}
                />
              </Box>
              <FormTextField
                label={`${plinthAreaLabel} (Sq.${unitOfMeasurement})`}
                value={localData.plinthArea}
                onChange={handleFieldChange("plinthArea")}
                onBlur={() => handleBlurField("plinthArea")}
                placeholder=""
                type="number"
                required
                inputProps={{
                  onKeyDown: handleNumberKeyDown,
                  onFocus: () => markTouched("plinthArea"),
                }}
                error={getPlinthAreaError()}
                touched={
                  !!touchedFields.plinthArea || !!showNumberWarnings.plinthArea
                }
                sx={{ ...uniformInputSx }}
              />
              <FormTextField
                label={buildingPermissionNoLabel}
                value={localData.buildingPermissionNo}
                onChange={handleFieldChange("buildingPermissionNo")}
                onBlur={() => handleBlurField("buildingPermissionNo")}
                placeholder=""
                type="number"
                required={false}
                inputProps={{
                  onKeyDown: handleNumberKeyDown,
                  onFocus: () => markTouched("buildingPermissionNo"),
                }}
                error={getBuildingPermissionNoError()}
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
              <Box sx={formSubmitSx}>
                <Button
                  onClick={handleAddFloor}
                  type="button"
                  sx={{
                    ...verifyButtonSx,
                    display: "block",
                    marginLeft: "auto",
                    marginTop: "70px",
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

export default FloorDetailsPage;