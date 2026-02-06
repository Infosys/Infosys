// PreliminaryInfo page for collecting initial property details in the form flow
import { type FC, Fragment, useState, useEffect } from "react";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Radio,
  Button,
  Stack,
  FormControl,
  FormControlLabel,
  RadioGroup,
  TextField,
} from "@mui/material";
import CottageOutlinedIcon from "@mui/icons-material/CottageOutlined";
import DomainAddOutlinedIcon from "@mui/icons-material/DomainAddOutlined";
import CasinoOutlinedIcon from "@mui/icons-material/CasinoOutlined";
import WeekendOutlinedIcon from "@mui/icons-material/WeekendOutlined";
import StepHeader from "../../features/Agent/components/StepHeader";
import CountIncrementor from "../../features/PropertyForm/components/CountIncrementors";
import { useNavigate } from "react-router-dom";
import { usePropertyForm } from "../../../context/PropertyFormContext";
import { useLazyGetApplicationByIdQuery } from "../../../redux/apis/applicationApi";
import { useLazyGetOwnersByPropertyIdQuery } from "../../../redux/apis/ownerApi";
import { useFormMode } from "../../../context/FormModeContext";
import { fetchPropertyDetails } from "../../features/Agent/api/fetchProperty.hooks";
import type { AlertType } from "../../models/AlertType.model";
import { NotificationPopup } from "../../components/Popup/NotificationPopup";
import LoadingPage from "../../components/Loader";

// Types for property card options
type CardType = "vacant" | "structure" | "multi" | "unit";

// Icons for each property card type
const cardIcons: Record<CardType, React.ReactNode> = {
  vacant: <CasinoOutlinedIcon sx={{ fontSize: "32px", color: "#000000bf" }} />,
  structure: (
    <CottageOutlinedIcon sx={{ fontSize: "32px", color: "#000000bf" }} />
  ),
  multi: (
    <DomainAddOutlinedIcon sx={{ fontSize: "32px", color: "#000000bf" }} />
  ),
  unit: <WeekendOutlinedIcon sx={{ fontSize: "32px", color: "#000000bf" }} />,
};

// Labels for each property card type
const cardLabels: Record<CardType, string> = {
  vacant: "Vacant land",
  structure: "Land with structure",
  multi: "Land with multiple structures",
  unit: "Building unit",
};

// Main component for preliminary property info step
export const PreliminaryInfo: FC = () => {
  const navigate = useNavigate();
  const { formData, updateForm } = usePropertyForm();

  // State for selected card, floor/basement counts, and mezzanine option
  // Initialize from formData if available
  const [active, setActive] = useState<CardType | null>(
    (formData.typeOfLand as CardType) || null
  );
  const [structureFloors, setStructureFloors] = useState(
    formData.noOfFloors || 0
  );
  const [multiFloors, setMultiFloors] = useState(formData.noOfFloors || 0);
  const [structureBasements, setStructureBasements] = useState(
    formData.noOfBasements || 0
  );
  const [multiBasements, setMultiBasements] = useState(
    formData.noOfBasements || 0
  );

  const [mezzanine, setMezzanine] = useState(formData.hasMezzanine);
  const [multiBuildings, setMultiBuildings] = useState(
    Number(formData.noOfBuildings) || 0
  );

  const [buildingName, setBuildingName] = useState(formData.buildingName || "");
  const [buildingNameError, setBuildingNameError] = useState("");

  const [getApplicationById] = useLazyGetApplicationByIdQuery();
  const [getOwnerByPropId] = useLazyGetOwnersByPropertyIdQuery();
  const [isLoading, setIsLoading] = useState(false);

  const { mode, setMode } = useFormMode();

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

  // Helper to show error notification popup
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

  const validateBuildingName = (value: string): string => {
    if (!value.trim()) {
      return "Building name/number is mandatory";
    }
    if (value.trim().length < 2) {
      return "Building name/number must be at least 2 characters";
    }
    if (value.trim().length > 50) {
      return "Building name/number must not exceed 50 characters";
    }
    // Allow alphanumeric, spaces, hyphens, and common punctuation
    const validPattern = /^[a-zA-Z0-9\s\-/.,#()]+$/;
    if (!validPattern.test(value)) {
      return "Only letters, numbers, spaces and basic punctuation allowed";
    }
    return "";
  };

  // Helper function to update floors and basements based on type
  const updateFloorsAndBasements = (
    typeOfLand: string,
    noOfFloors: number | undefined,
    noOfBasements: number | undefined
  ) => {
    if (typeOfLand === "multi") {
      if (noOfFloors !== undefined) setMultiFloors(noOfFloors);
      if (noOfBasements !== undefined) setMultiBasements(noOfBasements);
    } else if (typeOfLand === "structure") {
      if (noOfFloors !== undefined) setStructureFloors(noOfFloors);
      if (noOfBasements !== undefined) setStructureBasements(noOfBasements);
    }
  };

  // Effect to sync state with formData when it changes
  useEffect(() => {
    if (formData.typeOfLand) {
      setActive(formData.typeOfLand as CardType);
      updateFloorsAndBasements(
        formData.typeOfLand,
        formData.noOfFloors,
        formData.noOfBasements
      );
    }
    if (formData.hasMezzanine) {
      setMezzanine(formData.hasMezzanine);
    }
    if (formData.noOfBuildings !== undefined) {
      setMultiBuildings(Number(formData.noOfBuildings));
    }
    if (formData.buildingName) {
      setBuildingName(formData.buildingName);
    }
  }, [formData]);

  useEffect(() => {
    if (mode === "draft") {
      const propertyId = localStorage.getItem("propertyId")!;
      const applicationId = localStorage.getItem("applicationId");

      if (!applicationId) {
        navigate("/agent");
      } else if (!formData.id) {
        setIsLoading(true);
        // Only fetch if formData is empty
        fetchPropertyDetails(
          propertyId,
          applicationId,
          getApplicationById,
          getOwnerByPropId,
          updateForm,
          showErrorPopup
        ).finally(() => {
          setIsLoading(false);
        });
      }
    } else if (mode === "none") {
      localStorage.removeItem("propertyId");
      localStorage.removeItem("applicationId");
    }
  }, [mode]);

  // List of selectable property cards (order of display)
  const cardOrder: CardType[] = ["vacant", "structure", "multi", "unit"];

  // Helper function for rendering extra form fields for certain card types
  const renderFormByType = (type: CardType) => {
    if (type === "structure" && active === "structure") {
      return (
        <Box px={2} pb={2}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={2}>
              <CountIncrementor
                label="No. of Floors"
                value={structureFloors}
                setValue={setStructureFloors}
                min={0}
                max={999999}
              />
              <CountIncrementor
                label="No. of Basements"
                value={structureBasements}
                setValue={setStructureBasements}
                min={0}
                max={20}
              />
            </Stack>
            <FormControl
              fullWidth
              size="small"
              sx={{
                mb: 0,
                mt: 0,
              }}
            >
              <Typography sx={{ fontWeight: 400, fontSize: 14 }}>
                Does this structure have a Mezzanine Floor?
              </Typography>
              <RadioGroup
                row
                value={mezzanine === true ? "yes" : "no"}
                onChange={(e) => setMezzanine(e.target.value === "yes")}
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
          </Stack>
        </Box>
      );
    }
    if (type === "multi" && active === "multi") {
      return (
        <Box px={2} pb={2}>
          <CountIncrementor
            label="No. of Buildings"
            value={multiBuildings}
            setValue={setMultiBuildings}
            min={0}
            max={100}
          />
          <Typography
            sx={{ fontSize: 14, fontWeight: 400, mt: 1 }}
          >
            Building Name/Number :
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="e.g., Building A, Block 1, Tower 101"
            value={buildingName}
            onChange={(e) => {
              const newValue = e.target.value;
              setBuildingName(newValue);
              // Clear error when user starts typing
              if (buildingNameError) {
                setBuildingNameError("");
              }
            }}
            onBlur={(e) => {
              const error = validateBuildingName(e.target.value);
              setBuildingNameError(error);
            }}
            error={!!buildingNameError}
            helperText={buildingNameError}
            sx={{
              mt: 0.6,
              "& .MuiInputBase-root": {
                height: "52px",
              },
            }}
            slotProps={{
              input: {
                inputProps: {
                  maxLength: 50,
                },
              },
            }}
          />
          <Stack direction="row" spacing={2} paddingY={2}>
            <CountIncrementor
              label="No. of Floors"
              value={multiFloors}
              setValue={setMultiFloors}
              min={0}
              max={99999}
            />
            <CountIncrementor
              label="No. of Basements"
              value={multiBasements}
              setValue={setMultiBasements}
              min={0}
              max={20}
            />
          </Stack>
        </Box>
      );
    }
    return null;
  };

  // Helper to get the appropriate floor count based on active card type
  const getFloorCount = (): number | undefined => {
    if (active === "structure") return structureFloors;
    if (active === "multi") return multiFloors;
    return undefined;
  };

  // Helper to get the appropriate basement count based on active card type
  const getBasementCount = (): number | undefined => {
    if (active === "structure") return structureBasements;
    if (active === "multi") return multiBasements;
    return undefined;
  };

  // Helper to get mezzanine value only for structure type
  const getMezzanineValue = (): boolean | undefined => {
    if (active === "structure") return mezzanine;
  };

  const handleGoBack = () => {
    setMode("none");
    navigate(-1);
  };

  // Handler for Continue button: saves form data and navigates to next step
  const handleContinue = () => {
    try {
      if (active === "multi") {
        const error = validateBuildingName(buildingName);
        if (error) {
          setBuildingNameError(error);
          showErrorPopup("Please fill in the building name/number correctly.");
          return;
        }
      }

      if (!active && !formData.typeOfLand) {
        showErrorPopup("Please select a property-land type to continue.");
        return;
      }

      const selectedType = active || formData.typeOfLand;
      if (mode === "verify" && selectedType && selectedType !== formData.typeOfLand) {
        localStorage.setItem("hasFieldModified", "true");
      }

      updateForm({
        typeOfLand: selectedType,
        noOfFloors: getFloorCount(),
        noOfBasements: getBasementCount(),
        hasMezzanine: getMezzanineValue(),
        noOfBuildings: active === "multi" ? multiBuildings : undefined,
        buildingName: active === "multi" ? buildingName.trim() : undefined,
      });

      if (active || formData.typeOfLand) {
        navigate("/property-form/property-information");
      } else {
        showErrorPopup("Please select a property-land type to continue.");
      }
    } catch (e) {
      console.log(e);
    }
  };

  if (isLoading) {
    return <LoadingPage message="Loading your form..." />;
  }

  // Main UI rendering
  return (
    <>
      <NotificationPopup
        type={popup.type}
        open={popup.open}
        title={popup.title}
        message={popup.message}
        onClose={() => setPopup((p) => ({ ...p, open: false }))}
      />
      <Box
        maxWidth={420}
        width="100%"
        mx="auto"
        bgcolor="#fff"
        display="flex"
        flexDirection="column"
        minHeight="100vh"
      >
        {/* Step header for navigation and progress */}
        <StepHeader
          title={"Property Details"}
          subtitle={"Property Preliminary Information"}
          steps={10}
          activeStep={0}
          onPrevious={handleGoBack}
          onSaveDraft={() => {}}
          previousText={"Previous"}
          saveDraftText={"Save Draft"}
        />

        {/* Property type cards and dynamic form fields */}
        <RadioGroup value={active ?? ""}>
          <Stack spacing={2} mb={2} mt={4} px={"6%"}>
            {cardOrder.map((key) => (
              <Fragment key={key}>
                <Card
                  sx={{
                    mt: 1,
                    border:
                      active === key
                        ? "2px solid #c84c0ecb"
                        : "1px solid #00000052",
                    bgcolor: active === key ? "#fbeee5a6" : "#fff",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                    maxWidth: "100%",
                    height: "104px",
                    borderRadius: "10px",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CardActionArea
                    sx={{
                      height: "100%",
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      gap: 1.5,
                      px: 2,
                    }}
                    onClick={() => setActive(key)}
                  >
                    <Radio
                      checked={active === key}
                      value={key}
                      sx={{
                        color: "#00000080",
                        "&.Mui-checked": { color: "#c84c0e" },
                      }}
                      tabIndex={-1}
                    />
                    <Box
                      sx={{
                        color: "#000000ad",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {cardIcons[key]}
                    </Box>
                    <CardContent sx={{ p: 0 }}>
                      <Typography sx={{ fontSize: 16, fontWeight: "light" }}>
                        {cardLabels[key]}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>

                {/* Renders the dynamic field for card ONLY directly after this card */}
                {renderFormByType(key)}
              </Fragment>
            ))}
          </Stack>
        </RadioGroup>

        {/* Footer with Continue button */}
        <Box
          sx={{
            mt: "auto",
            pb: "4%",
            px: "6%",
            display: "flex",
            justifyContent: "end",
          }}
        >
          <Button
            variant="contained"
            sx={{
              bgcolor: "#c84c0e",
              color: "#fff",
              fontWeight: 700,
              maxWidth: "50%",
              borderRadius: 2,
              py: 1.2,
              width: "100%",
              textTransform: "none",
              fontSize: 16,
              boxShadow: "none",
              "&:hover": {
                bgcolor: "#c84c0e",
                color: "#fff",
              },
            }}
            onClick={handleContinue}
          >
            Continue
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default PreliminaryInfo;
