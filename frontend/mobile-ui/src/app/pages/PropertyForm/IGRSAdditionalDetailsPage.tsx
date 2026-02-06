import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useFormMode } from "../../../context/FormModeContext";
import { usePropertyForm } from "../../../context/PropertyFormContext";
// JsonService & getIsgrAdditionalOptions removed if amenity options are static!
import { useLocalization } from "../../../services/AgentLocalisation/formLocalisation";
import StepHeader from "../../features/Agent/components/StepHeader";
import { useAssessmentDetailsLocalization } from "../../../services/AgentLocalisation/localisation-AssessmentDetails";
import { verifyButtonSx } from "./styles/sharedStyles";
import type { AlertType } from "../../models/AlertType.model";
import {
  useCreateAmenityMutation,
  useUpdateAmenityMutation,
} from "../../../redux/apis/amenitiesApi";
import { NotificationPopup } from "../../components/Popup/NotificationPopup";

type IsgrOption = {
  key: string;
  label: string;
};

type LocalData = {
  lifts: boolean;
  toilet: boolean;
  watertap: boolean;
  cableConnection: boolean;
  electricity: boolean;
  attachedBathroom: boolean;
  waterHarvesting: boolean;
};

// Amenity options - static mapping. If you need to fetch options, uncomment fetch block below.
const OPTIONS: IsgrOption[] = [
  { key: "lifts", label: "Lift" },
  { key: "toilet", label: "Toilets" },
  { key: "watertap", label: "Water Tap" },
  { key: "cableConnection", label: "Cable Connection" },
  { key: "electricity", label: "Electricity" },
  { key: "attachedBathroom", label: "Attached Bathroom" },
  { key: "waterHarvesting", label: "Water Harvesting" },
];

const AMENITY_TYPE_MAPPING: Record<keyof LocalData, string> = {
  lifts: "Lift",
  toilet: "Toilets",
  watertap: "Water Tap",
  cableConnection: "Cable Connection",
  electricity: "Electricity",
  attachedBathroom: "Attached Bathroom",
  waterHarvesting: "Water Harvesting",
};

const containerSx = {
  width: "100%",
  margin: "0 auto",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  bgcolor: "#fff",
};

const formContentSx = { flex: 1, px: "8%", py: 3, backgroundColor: "#FFFFFF" };
const checkboxWrapperSx = { display: "flex", flexDirection: "column", gap: 1 };
const checkboxLabelSx = {
  fontSize: 16,
  color: "#000",
  fontWeight: 300,
  textAlign: "left",
};
const formSubmitSx = { padding: "16px 0", backgroundColor: "#FFFFFF" };

const ISGRAdditionalDetailsPage: React.FC = () => {
  const { mode } = useFormMode();
  const navigate = useNavigate();
  const { formData, updateForm } = usePropertyForm();
  const [hasModified, setHasModified] = useState(false);

  const markModified = () => {
    if (mode === "verify") setHasModified(true);
  };
  const {
    nextButtonText,
    translateDropdown,
    // IGRSDetailsText,
    newPropertyForm,
    previousText,
  } = useLocalization();
  const { propertyFormTitle, saveDraftText } =
    useAssessmentDetailsLocalization();

  const [localData, setLocalData] = useState<LocalData>({
    lifts: formData.isgrAdditionalDetails?.lifts || false,
    toilet: formData.isgrAdditionalDetails?.toilet || false,
    watertap: formData.isgrAdditionalDetails?.watertap || false,
    cableConnection: formData.isgrAdditionalDetails?.cableConnection || false,
    electricity: formData.isgrAdditionalDetails?.electricity || false,
    attachedBathroom: formData.isgrAdditionalDetails?.attachedBathroom || false,
    waterHarvesting: formData.isgrAdditionalDetails?.waterHarvesting || false,
  });

  // API hooks - only mutations needed
  const [createAmenity] = useCreateAmenityMutation();
  const [updateAmenity] = useUpdateAmenityMutation();

  // Use static amenity options (or fetch if dynamic)
  const options = OPTIONS;

  // Convert local form data to array of API amenity types
  const getSelectedAmenityTypes = (data: LocalData): string[] =>
    Object.entries(data)
      .filter(([_, isSelected]) => isSelected)
      .map(([fieldName]) => AMENITY_TYPE_MAPPING[fieldName as keyof LocalData]);

  // Centralized handler for all checkboxes
  const handleCheckboxChange =
    (name: keyof LocalData) =>
    (_event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      markModified();
      setLocalData((prev) => ({ ...prev, [name]: checked }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id) {
      showErrorPopup("Property ID is missing");
      return;
    }

    const selectedTypes = getSelectedAmenityTypes(localData);
    const applicationId = localStorage.getItem("applicationLogId") || "";
    const isVerifying = hasModified;

    try {
      // Check context for amenity ID
      if (formData.isgrAdditionalDetails?.amenityId) {
        // UPDATE - amenity already exists
        await updateAmenity({
          amenityId: formData.isgrAdditionalDetails.amenityId,
          property_id: formData.id,
          type: selectedTypes,
          applicationId,
          isVerifying,
        }).unwrap();

        updateForm({
          isgrAdditionalDetails: {
            ...localData,
            amenityId: formData.isgrAdditionalDetails.amenityId,
          },
        });
      } else {
        // CREATE - new amenity
        const result = await createAmenity({
          property_id: formData.id,
          type: selectedTypes,
        }).unwrap();

        // Store the amenity ID in context for future updates
        updateForm({
          isgrAdditionalDetails: {
            ...localData,
            amenityId: result.data.ID,
          },
        });
      }

      navigate("/property-form/construction-details");
    } catch (err: any) {
      showErrorPopup(err?.data?.message || "Failed to save amenities");
    }
  };

  const handleGoBack = () => navigate(-1);

  // Popup state
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
    setTimeout(
      () =>
        setPopup({
          type: "warning",
          open: true,
          title: "Warning!",
          message,
          duration,
        }),
      10
    );
  }

  // Load data from formData context on mount
  useEffect(() => {
    if (formData.isgrAdditionalDetails) {
      setLocalData({
        lifts: formData.isgrAdditionalDetails.lifts || false,
        toilet: formData.isgrAdditionalDetails.toilet || false,
        watertap: formData.isgrAdditionalDetails.watertap || false,
        cableConnection:
          formData.isgrAdditionalDetails.cableConnection || false,
        electricity: formData.isgrAdditionalDetails.electricity || false,
        attachedBathroom:
          formData.isgrAdditionalDetails.attachedBathroom || false,
        waterHarvesting:
          formData.isgrAdditionalDetails.waterHarvesting || false,
      });
    }
  }, [formData.isgrAdditionalDetails]);

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
          subtitle={"IGRS Details"}
          steps={10}
          activeStep={5}
          onPrevious={handleGoBack}
          // Removed unused SaveDraft handler
          previousText={previousText}
          saveDraftText={saveDraftText}
        />
        <Box component="main" sx={formContentSx}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={2} sx={checkboxWrapperSx}>
              {options.map((option) => (
                <FormControlLabel
                  key={option.key}
                  control={
                    <Checkbox
                      checked={localData[option.key as keyof LocalData]}
                      onChange={handleCheckboxChange(
                        option.key as keyof LocalData
                      )}
                      name={option.key}
                      sx={{ padding: 0, marginRight: 1, color: "#C84C0E" }}
                      color="default"
                    />
                  }
                  label={
                    <Typography sx={checkboxLabelSx}>
                      {translateDropdown(option.label)}
                    </Typography>
                  }
                  sx={{ alignItems: "center", gap: 1 }}
                />
              ))}
            </Stack>
            <Box sx={formSubmitSx}>
              <Button
                type="submit"
                sx={{
                  ...verifyButtonSx,
                  display: "block",
                  marginLeft: "auto",
                  marginTop: "200px",
                }}
                variant="contained"
              >
                {mode === "verify" ? "Verify" : nextButtonText}
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </>
  );
};

export default ISGRAdditionalDetailsPage;
