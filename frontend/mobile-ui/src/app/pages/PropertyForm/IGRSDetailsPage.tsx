// ISGRDetailsPage.tsx
// Property Form ISGR Details page
// Collects and manages IGRS and building details for a property (habitation, ward, locality, classification, area, setbacks, etc.)
// Features:
//   - Form for entering IGRS details using dropdowns and text fields
//   - Fetches and updates IGRS details via RTK Query
//   - Handles form validation, error popups, and draft saving
//   - Responsive UI with MUI components and localization
//   - Dynamic dropdowns populated from backend services
// Used in: Property form workflow for IGRS details step
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useFormMode } from "../../../context/FormModeContext";
import { usePropertyForm } from "../../../context/PropertyFormContext";
import JsonService, {
  getUnitOfMeasurementOptions,
} from "../../../services/jsonServerApiCalls";
import { useLocalization } from "../../../services/AgentLocalisation/formLocalisation";
import StepHeader from "../../features/Agent/components/StepHeader";
import { useAssessmentDetailsLocalization } from "../../../services/AgentLocalisation/localisation-AssessmentDetails";
import CustomDropdown from "../../features/PropertyForm/components/IGRSDetail/IGRSdropdown";
import type { DropdownOption } from "../../features/PropertyForm/components/IGRSDetail/IGRSdropdown";
import FormTextField from "../../features/PropertyForm/components/IGRSDetail/IGRSFormTextFiled";
import { uniformInputSx, verifyButtonSx } from "./styles/sharedStyles";
import type { AlertType } from "../../models/AlertType.model";
import {
  useGetIgrsDetailsByIdQuery,
  useCreateIgrsDetailsMutation,
  useUpdateIgrsDetailsMutation,
} from "../../../redux/apis/IgrsDetails.api";
import { NotificationPopup } from "../../components/Popup/NotificationPopup";
import CountIncrementor from "../../features/PropertyForm/components/CountIncrementors";
import { Typography } from "@mui/material";

// Inline styles for layout and UI
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

const formContentSx = { flex: 1, px: "8%", py: 3, backgroundColor: "#FFFFFF" };
const formSubmitSx = { padding: "16px 0", backgroundColor: "#FFFFFF" };

const ISGRDetailsPage: React.FC = () => {
  // Contexts and hooks for form mode, navigation, and property form data
  const { mode } = useFormMode();
  const navigate = useNavigate();
  const { formData, updateForm } = usePropertyForm();
  const propertyId = formData.id;
  const igrsId = formData.isgrDetails?.id;
  const [hasModified, setHasModified] = useState(false);

  const markModified = () => {
    if (mode === "verify") setHasModified(true);
  };

  const getEmptyFieldError = (field: string): string => {
  switch (field) {
    case 'habitation':
      return 'Select Habitation to proceed';
    case 'igrsWard':
      return 'Select IGRS Ward to proceed';
    case 'igrsLocality':
      return 'Select IGRS Locality to proceed';
    case 'igrsBlock':
      return 'Select IGRS Block to proceed';
    case 'doorNoFrom':
      return 'IGRS Door No. From is mandatory';
    case 'doorNoTo':
      return 'IGRS Door No. To is mandatory';
    case 'igrsClassification':
      return 'Select IGRS Classification to proceed';
    case 'builtUpAreaPct':
      return 'Built Up Area is mandatory';
    case 'frontSetback':
      return 'FrontSetback is mandatory';
    case 'rearSetback':
      return 'Rear Setback is mandatory';
    case 'sideSetback':
      return 'Side Setback is mandatory';
    case 'totalPlinthArea':
      return 'Total Plinth Area is mandatory';
    default:
      return '';
  }
};

  // RTK Query hooks for fetching and mutating IGRS details
  const { data: igrsDetailsData } = useGetIgrsDetailsByIdQuery(igrsId!, {
    skip: !propertyId || !igrsId,
  });

  const [createIgrsDetails] = useCreateIgrsDetailsMutation();
  const [updateIgrsDetails] = useUpdateIgrsDetailsMutation();

  // Localization hooks for labels, dropdowns, and UI text
  const {
    habitationText,
    IGRSwardText,
    IGRSLocalityText,
    IGRSBlockText,
    IGRSDoorNoFromText,
    IGRSDoorNoToText,
    nextButtonText,
    selectText,
    IGRSClassification,
    builtUpArea,
    frontSetBack,
    rearSetBack,
    sideSetBack,
    totalPlintArea,
    //IGRSAndBuildingDetailsText,
    newPropertyForm,
    previousText,
    onlyNumbersAreAllowedMSG,
    PercentagePlaceholder,
  } = useLocalization();

  const { saveDraftText, propertyFormTitle } =
    useAssessmentDetailsLocalization();

  const [habitations, setHabitations] = useState<DropdownOption[]>([]);
  const [wards, setWards] = useState<DropdownOption[]>([]);
  const [localities, setLocalities] = useState<DropdownOption[]>([]);
  const [blocks, setBlocks] = useState<DropdownOption[]>([]);
  const [igrsClassification, setIgrsClassification] = useState<
    DropdownOption[]
  >([]);

  const [showHabitationDropdown, setShowHabitationDropdown] = useState(false);
  const [showIgrsWardDropdown, setShowIgrsWardDropdown] = useState(false);
  const [showIgrsLocalityDropdown, setShowIgrsLocalityDropdown] =
    useState(false);
  const [showIgrsBlockDropdown, setShowIgrsBlockDropdown] = useState(false);
  const [showIgrsClassificationDropdown, setShowIgrsClassificationDropdown] =
    useState(false);

  const [unitOfMeasurement, setUnitOfMeasurement] = useState<string>("");
  // Effect: Fetch unit of measurement from MDMS
  useEffect(() => {
    getUnitOfMeasurementOptions()
      .then((data) => {
        setUnitOfMeasurement(data?.unitOfmeasurement || "");
      })
      .catch(() => {
        console.log("Failed to fetch Unit of Measurement Options");
      });
  }, []);

  useEffect(() => {
    if (formData.isgrDetails && propertyId) {
      updateForm({
        isgrDetails: {
          id: formData.isgrDetails?.id,
          habitation: formData.isgrDetails?.habitation ?? "",
          igrsWard: formData.isgrDetails?.igrsWard ?? "",
          igrsLocality: formData.isgrDetails?.igrsLocality ?? "",
          igrsBlock: formData.isgrDetails?.igrsBlock ?? "",
          doorNoFrom: formData.isgrDetails?.doorNoFrom ?? "",
          doorNoTo: formData.isgrDetails?.doorNoTo ?? "",
          igrsClassification: formData.isgrDetails?.igrsClassification ?? "",
          builtUpAreaPct: formData.isgrDetails?.builtUpAreaPct ?? "",
          frontSetback: formData.isgrDetails?.frontSetback ?? "",
          rearSetback: formData.isgrDetails?.rearSetback ?? "",
          sideSetback: formData.isgrDetails?.sideSetback ?? "",
          totalPlinthArea: formData.isgrDetails?.totalPlinthArea ?? "",
        },
      });
    }
  }, [igrsDetailsData]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showNumberWarnings, setShowNumberWarnings] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    JsonService.getHabitations().then((data) => {
      if (Array.isArray(data)) {
        setHabitations(
          data
            .filter((item) => item.label !== "select")
            .map((item, index) => ({ id: index, label: item.label }))
        );
      }
    });

    JsonService.getIgrsWards().then((data) => {
      if (Array.isArray(data)) {
        setWards(
          data
            .filter((item) => item.label !== "select")
            .map((item, index) => ({ id: index, label: item.label }))
        );
      }
    });

    JsonService.getIgrsLocalities().then((data) => {
      if (Array.isArray(data)) {
        setLocalities(
          data
            .filter((item) => item.label !== "select")
            .map((item, index) => ({ id: index, label: item.label }))
        );
      }
    });

    JsonService.getIgrsBlocks().then((data) => {
      if (Array.isArray(data)) {
        setBlocks(
          data
            .filter((item) => item.label !== "select")
            .map((item, index) => ({ id: index, label: item.label }))
        );
      }
    });

    JsonService.getIgrsClassifications().then((data) => {
      if (Array.isArray(data)) {
        setIgrsClassification(
          data
            .filter((item) => item.label !== "select")
            .map((item, index) => ({ id: index, label: item.label }))
        );
      }
    });
  }, []);

  // === Validation helper
  const validateField = (name: string, value: string): string => {
    if (!value || value.trim() === '') {
    return getEmptyFieldError(name);
  }

    if (
      [
        "builtUpAreaPct",
        "frontSetback",
        "rearSetback",
        "sideSetback",
        "totalPlinthArea",
        "doorNoFrom",
        "doorNoTo",
      ].includes(name)
    ) {
      if (!/^\d*\.?\d*$/.test(value)) return "Must be a valid number";
      if (value === ".") return "Must contain at least one digit";
      const num = Number(value);
      if (Number.isNaN(num) || num <= 0) return getEmptyFieldError(name);
    }
    return "";
  };

  const handleCountChange = (field: string) => (val: number) => {
    markModified();
    updateForm({
      isgrDetails: {
        ...formData.isgrDetails,
        [field]: String(val),
      },
    });
    if (touched[field]) setErrors((prev) => ({ ...prev, [field]: '' }));

    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // === ENHANCED: strip leading zeros from number fields on blur!
  const handleBlur = (name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    let value = String(
      formData.isgrDetails?.[name as keyof typeof formData.isgrDetails] ?? ""
    );

    // Strip leading zeros for numeric fields on blur
    if (
      [
        "builtUpAreaPct",
        "frontSetback",
        "rearSetback",
        "sideSetback",
        "totalPlinthArea",
      ].includes(name) &&
      value !== ""
    ) {
      if (/^\d+(\.\d*)?$/.test(value)) {
        const parts = value.split(".");
        parts[0] = String(Number(parts[0]));
        value = parts.length > 1 ? parts.join(".") : parts[0];
        // Update in formData via updateForm!
        updateForm({
          isgrDetails: {
            ...formData.isgrDetails,
            [name]: value,
          },
        });
      }
    }

    const error: string = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleNumberKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const forbidden = ["-", "e", "+"];
    if (forbidden.includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleInputChange = (field: string) => (value: string) => {
    markModified();
    const isValid = /^\d*\.?\d*$/.test(value);
    if (!isValid && value !== "") {
      setShowNumberWarnings((prev) => ({ ...prev, [field]: true }));
      return;
    }

    updateForm({
      isgrDetails: {
        ...formData.isgrDetails,
        [field]: value,
      },
    });

    if (showNumberWarnings[field]) {
      if (isValid)
        setShowNumberWarnings((prev) => ({ ...prev, [field]: false }));
    }
    if (touched[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // closeAllDropdowns: Helper to close all dropdowns before opening one
  const closeAllDropdowns = () => {
    setShowHabitationDropdown(false);
    setShowIgrsWardDropdown(false);
    setShowIgrsLocalityDropdown(false);
    setShowIgrsBlockDropdown(false);
    setShowIgrsClassificationDropdown(false);
  };

  // handleDropdownSelect: Handles selection from dropdowns
  const handleDropdownSelect = (field: string) => (val: string) => {
    markModified();
    updateForm({
      isgrDetails: {
        ...formData.isgrDetails,
        [field]: val,
      },
    });
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // handleSubmit: Validates and submits IGRS details, creates/updates via API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fieldsToValidate = [
      "habitation",
      "igrsWard",
      "igrsLocality",
      "igrsBlock",
      "doorNoFrom",
      "doorNoTo",
      "igrsClassification",
      "builtUpAreaPct",
      "frontSetback",
      "rearSetback",
      "sideSetback",
      "totalPlinthArea",
    ];

    const touchedState = fieldsToValidate.reduce(
    (acc, field) => ({ ...acc, [field]: true }),
    {}
    );
    setTouched(touchedState);

    const submitErrors: Record<string, string> = {};
    fieldsToValidate.forEach((field) => {
      const value = String(
        formData.isgrDetails?.[field as keyof typeof formData.isgrDetails] ?? ""
      );
      const error = validateField(field, value);
      submitErrors[field] = error;
    });

    setErrors(submitErrors);
    setTouched(
      fieldsToValidate.reduce((acc, k) => ({ ...acc, [k]: true }), {})
    );

    if (Object.values(submitErrors).some(Boolean)) return;

    if (!propertyId) {
      showErrorPopup("Property ID is required.");
      return;
    }

    const applicationId = localStorage.getItem("applicationLogId") || "";
    const isVerifying = hasModified;

    const requestBody = {
      propertyId: propertyId,
      habitation: formData.isgrDetails?.habitation ?? "",
      igrsWard: formData.isgrDetails?.igrsWard ?? "",
      igrsLocality: formData.isgrDetails?.igrsLocality ?? "",
      igrsBlock: formData.isgrDetails?.igrsBlock ?? "",
      doorNoFrom: formData.isgrDetails?.doorNoFrom ?? "",
      doorNoTo: formData.isgrDetails?.doorNoTo ?? "",
      igrsClassification: formData.isgrDetails?.igrsClassification ?? "",
      builtUpAreaPct: Number(formData.isgrDetails?.builtUpAreaPct || 0),
      frontSetback: Number(formData.isgrDetails?.frontSetback || 0),
      rearSetback: Number(formData.isgrDetails?.rearSetback || 0),
      sideSetback: Number(formData.isgrDetails?.sideSetback || 0),
      totalPlinthArea: Number(formData.isgrDetails?.totalPlinthArea || 0),
    };

    try {
      let resp;
      if (igrsId) {
        resp = await updateIgrsDetails({
          id: igrsId,
          body: requestBody,
          applicationId,
          isVerifying,
        }).unwrap();
      } else {
        resp = await createIgrsDetails(requestBody).unwrap();
      }

      if (resp?.data) {
        updateForm({
          isgrDetails: {
            id: resp.data.id || "",
            habitation: resp.data.habitation || "",
            igrsWard: resp.data.igrsWard || "",
            igrsLocality: resp.data.igrsLocality || "",
            igrsBlock: resp.data.igrsBlock || "",
            doorNoFrom: resp.data.doorNoFrom || "",
            doorNoTo: resp.data.doorNoTo || "",
            igrsClassification: resp.data.igrsClassification || "",
            builtUpAreaPct: resp.data.builtUpAreaPct ?? 0,
            frontSetback: resp.data.frontSetback ?? 0,
            rearSetback: resp.data.rearSetback ?? 0,
            sideSetback: resp.data.sideSetback ?? 0,
            totalPlinthArea: resp.data.totalPlinthArea ?? 0,
          },
        });
      }

      navigate("/property-form/igrs-additional-details");
    } catch (error) {
      console.error("Error saving IGRS details:", error);
      showErrorPopup("Failed to save IGRS details.");
    }
  };

  // Popup state and showErrorPopup: Manages warning popup for errors
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

  // handleGoBack: Navigates to previous page
  const handleGoBack = () => navigate(-1);
  // handleSaveDraft: Saves current IGRS details as draft in context
  const handleSaveDraft = () => {
    //save draft function
  };

  const getFieldValue = (field: string) => {
    const v =
      formData.isgrDetails?.[field as keyof typeof formData.isgrDetails];
    return v ?? "";
  };

  // UI rendering: WarningPopup, header, form with dropdowns, text fields, and submit button
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
          title={mode === "new" ? newPropertyForm : propertyFormTitle}
          // subtitle={IGRSAndBuildingDetailsText}
          subtitle={"IGRS and Building setback Details"}
          steps={10}
          activeStep={4}
          onPrevious={handleGoBack}
          onSaveDraft={handleSaveDraft}
          previousText={previousText}
          saveDraftText={saveDraftText}
        />

        <Box component="main" sx={formContentSx}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={1}>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Box sx={{ flex: 1 }}>
                  <CustomDropdown
                    label={habitationText}
                    name="habitation"
                    value={String(getFieldValue("habitation"))}
                    options={habitations}
                    showDropdown={showHabitationDropdown}
                    setShowDropdown={setShowHabitationDropdown}
                    onSelect={(_n, val) =>
                      handleDropdownSelect("habitation")(val)
                    }
                    closeOtherDropdowns={closeAllDropdowns}
                    selectText={selectText}
                    required
                    error={errors.habitation}
                    touched={touched.habitation}
                    onBlur={() => handleBlur("habitation")}
                  />
                </Box>

                <Box sx={{ flex: 1 }}>
                  <CustomDropdown
                    label={IGRSwardText}
                    name="igrsWard"
                    value={String(getFieldValue("igrsWard"))}
                    options={wards}
                    showDropdown={showIgrsWardDropdown}
                    setShowDropdown={setShowIgrsWardDropdown}
                    onSelect={(_n, val) =>
                      handleDropdownSelect("igrsWard")(val)
                    }
                    closeOtherDropdowns={closeAllDropdowns}
                    selectText={selectText}
                    required
                    error={errors.igrsWard}
                    touched={touched.igrsWard}
                    onBlur={() => handleBlur("igrsWard")}
                  />
                </Box>
              </Box>

              <CustomDropdown
                label={IGRSLocalityText}
                name="igrsLocality"
                value={String(getFieldValue("igrsLocality"))}
                options={localities}
                showDropdown={showIgrsLocalityDropdown}
                setShowDropdown={setShowIgrsLocalityDropdown}
                onSelect={(_n, val) =>
                  handleDropdownSelect("igrsLocality")(val)
                }
                closeOtherDropdowns={closeAllDropdowns}
                selectText={selectText}
                required
                error={errors.igrsLocality}
                touched={touched.igrsLocality}
                onBlur={() => handleBlur("igrsLocality")}
              />

              <CustomDropdown
                label={IGRSBlockText}
                name="igrsBlock"
                value={String(getFieldValue("igrsBlock"))}
                options={blocks}
                showDropdown={showIgrsBlockDropdown}
                setShowDropdown={setShowIgrsBlockDropdown}
                onSelect={(_n, val) => handleDropdownSelect("igrsBlock")(val)}
                closeOtherDropdowns={closeAllDropdowns}
                selectText={selectText}
                required
                error={errors.igrsBlock}
                touched={touched.igrsBlock}
                onBlur={() => handleBlur("igrsBlock")}
              />

              <Box sx={{ display: "flex", gap: 1 }}>
                <Box sx={{ flex: 1 }}>
                  <CountIncrementor
                    label={IGRSDoorNoFromText}
                    value={Number(getFieldValue("doorNoFrom")) || 0}
                    setValue={handleCountChange("doorNoFrom")}
                    required
                    min={0}
                    max={9999}
                  />
                  {touched.doorNoFrom && errors.doorNoFrom && (
                    <Typography
                      sx={{ color: "error.main", fontSize: 12, mt: 0.5, ml: 1 }}
                    >
                      {errors.doorNoFrom}
                    </Typography>
                  )}
                </Box>

                <Box sx={{ flex: 1 }}>
                  <CountIncrementor
                    label={IGRSDoorNoToText}
                    value={Number(getFieldValue("doorNoTo")) || 0}
                    setValue={handleCountChange("doorNoTo")}
                    required
                    min={0}
                    max={9999}
                  />
                  {touched.doorNoTo && errors.doorNoTo && (
                    <Typography
                      sx={{ color: "error.main", fontSize: 12, mt: 0.5, ml: 1 }}
                    >
                      {errors.doorNoTo}
                    </Typography>
                  )}
                </Box>
              </Box>
              <CustomDropdown
                label={IGRSClassification}
                name="igrsClassification"
                value={String(getFieldValue("igrsClassification"))}
                options={igrsClassification}
                showDropdown={showIgrsClassificationDropdown}
                setShowDropdown={setShowIgrsClassificationDropdown}
                onSelect={(_n, val) =>
                  handleDropdownSelect("igrsClassification")(val)
                }
                closeOtherDropdowns={closeAllDropdowns}
                selectText={selectText}
                required
                error={errors.igrsClassification}
                touched={touched.igrsClassification}
                onBlur={() => handleBlur("igrsClassification")}
              />

              <FormTextField
                sx={{ ...uniformInputSx }}
                label={builtUpArea}
                value={String(getFieldValue("builtUpAreaPct"))}
                onChange={handleInputChange("builtUpAreaPct")}
                onBlur={() => handleBlur("builtUpAreaPct")}
                placeholder={PercentagePlaceholder}
                type="number"
                required
                inputProps={{
                  min: 0,
                  max: 100,
                  onKeyDown: handleNumberKeyDown,
                }}
                error={
                  showNumberWarnings.builtUpAreaPct
                    ? onlyNumbersAreAllowedMSG
                    : errors.builtUpAreaPct
                }
                touched={
                  touched.builtUpAreaPct || showNumberWarnings.builtUpAreaPct
                }
              />

              <Box sx={{ display: "flex", gap: 1 }}>
                <FormTextField
                  sx={uniformInputSx}
                  label={`${frontSetBack} (${unitOfMeasurement})`}
                  value={String(getFieldValue("frontSetback"))}
                  onChange={handleInputChange("frontSetback")}
                  onBlur={() => handleBlur("frontSetback")}
                  type="number"
                  required
                  inputProps={{ onKeyDown: handleNumberKeyDown }}
                  error={
                    showNumberWarnings.frontSetback
                      ? onlyNumbersAreAllowedMSG
                      : errors.frontSetback
                  }
                  touched={
                    touched.frontSetback || showNumberWarnings.frontSetback
                  }
                />
                <FormTextField
                  sx={uniformInputSx}
                  label={`${rearSetBack} (${unitOfMeasurement})`}
                  value={String(getFieldValue("rearSetback"))}
                  onChange={handleInputChange("rearSetback")}
                  onBlur={() => handleBlur("rearSetback")}
                  type="number"
                  required
                  inputProps={{ onKeyDown: handleNumberKeyDown }}
                  error={
                    showNumberWarnings.rearSetback
                      ? onlyNumbersAreAllowedMSG
                      : errors.rearSetback
                  }
                  touched={
                    touched.rearSetback || showNumberWarnings.rearSetback
                  }
                />
              </Box>

              <FormTextField
                sx={uniformInputSx}
                label={`${sideSetBack} (${unitOfMeasurement})`}
                value={String(getFieldValue("sideSetback"))}
                onChange={handleInputChange("sideSetback")}
                onBlur={() => handleBlur("sideSetback")}
                type="number"
                required
                inputProps={{ onKeyDown: handleNumberKeyDown }}
                error={
                  showNumberWarnings.sideSetback
                    ? onlyNumbersAreAllowedMSG
                    : errors.sideSetback
                }
                touched={touched.sideSetback || showNumberWarnings.sideSetback}
              />

              <FormTextField
                sx={uniformInputSx}
                label={`${totalPlintArea} (Sq.${unitOfMeasurement})`}
                value={String(getFieldValue("totalPlinthArea"))}
                onChange={handleInputChange("totalPlinthArea")}
                onBlur={() => handleBlur("totalPlinthArea")}
                type="number"
                required
                inputProps={{ onKeyDown: handleNumberKeyDown }}
                error={
                  showNumberWarnings.totalPlinthArea
                    ? onlyNumbersAreAllowedMSG
                    : errors.totalPlinthArea
                }
                touched={
                  touched.totalPlinthArea || showNumberWarnings.totalPlinthArea
                }
              />

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

export default ISGRDetailsPage;
