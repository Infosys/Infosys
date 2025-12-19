// ConstructionDetailsPage.tsx
// Property Form Construction Details page
// Collects and manages construction details for a property (floor, roof, wall, wood types)
// Features:
//   - Form for entering construction details using dropdowns
//   - Fetches and updates construction details via RTK Query
//   - Uses localization for labels and dropdown options
//   - Handles form validation, error popups, and draft saving
//   - Responsive UI with MUI components and custom dropdowns
// Used in: Property form workflow for construction details step
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { useFormMode } from '../../../context/FormModeContext';
import JsonService from '../../../services/jsonServerApiCalls';
import { usePropertyForm } from '../../../context/PropertyFormContext';
import { useLocalization } from '../../../services/AgentLocalisation/formLocalisation';
import StepHeader from '../../features/Agent/components/StepHeader';
import { useAssessmentDetailsLocalization } from '../../../services/AgentLocalisation/localisation-AssessmentDetails';
import CustomDropdown from '../../features/PropertyForm/components/ConstructionDetail/ConstructionDropdown';
import type { DropdownOption } from '../../features/PropertyForm/components/ConstructionDetail/ConstructionDropdown';
import { verifyButtonSx } from './styles/sharedStyles';
import type { AlertType } from '../../models/AlertType.model';
import {
  useCreateConstructionDetailsMutation,
  useUpdateConstructionDetailsMutation,
  useLazyGetConstructionDetailsByPropertyIdQuery,
  type ConstructionDetailsRequest,
} from '../../../redux/apis/contructionAPI';
import { NotificationPopup } from '../../components/Popup/NotificationPopup';

// Inline styles for layout and UI
const containerStyle = {
  width: '100%',
  margin: '0',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column' as const,
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  bgcolor: '#fff',
};

const headerStyle = { backgroundColor: '#F9E6E0' };
const formContentStyle = { flex: 1, padding: '24px', backgroundColor: '#FFFFFF' };
const formFieldWrapper = { marginBottom: -1.5 };
const formSubmitStyle = { padding: '16px 0', backgroundColor: '#FFFFFF' };

type LocalData = {
  floorType: string;
  roofType: string;
  wallType: string;
  woodType: string;
  constructionId: string;
};

const ConstructionDetailsPage: React.FC = () => {
  // Contexts and hooks for form mode, navigation, and property form data
  const { mode } = useFormMode();
  const navigate = useNavigate();
  const { formData, updateForm } = usePropertyForm();
  const {
    newPropertyForm,
    constructionDetails,
    floorTypeText,
    roofTypeText,
    wallTypeText,
    woodTypeText,
    selectText,
    translateDropdownOptions,
    nextButtonText,
  } = useLocalization();

  // RTK Query hooks for fetching and mutating construction details
  const [createConstructionDetails, { isLoading: isCreating }] =
    useCreateConstructionDetailsMutation();
  const [updateConstructionDetails, { isLoading: isUpdating }] =
    useUpdateConstructionDetailsMutation();
  const [triggerGetByPropertyId, { isLoading: isFetching }] =
    useLazyGetConstructionDetailsByPropertyIdQuery();

  // Localization hooks for labels, dropdowns, and UI text
  // Local state for form fields, dropdowns, and popup
  const [localData, setLocalData] = useState<LocalData>({
    floorType: formData.constructionDetails?.floorType || '',
    roofType: formData.constructionDetails?.roofType || '',
    wallType: formData.constructionDetails?.wallType || '',
    woodType: formData.constructionDetails?.woodType || '',
    constructionId: formData.constructionDetails?.id?.toString() || '',
  });

  const [floorTypes, setFloorTypes] = useState<DropdownOption[]>([]);
  const [roofTypes, setRoofTypes] = useState<DropdownOption[]>([]);
  const [wallTypes, setWallTypes] = useState<DropdownOption[]>([]);
  const [woodTypes, setWoodTypes] = useState<DropdownOption[]>([]);

  const [rawFloorTypes, setRawFloorTypes] = useState<DropdownOption[]>([]);
  const [rawRoofTypes, setRawRoofTypes] = useState<DropdownOption[]>([]);
  const [rawWallTypes, setRawWallTypes] = useState<DropdownOption[]>([]);
  const [rawWoodTypes, setRawWoodTypes] = useState<DropdownOption[]>([]);

  // dropdown open states (pass to CustomDropdown so parent can enforce exclusive open)
  const [showFloorTypeDropdown, setShowFloorTypeDropdown] = useState(false);
  const [showRoofTypeDropdown, setShowRoofTypeDropdown] = useState(false);
  const [showWallTypeDropdown, setShowWallTypeDropdown] = useState(false);
  const [showWoodTypeDropdown, setShowWoodTypeDropdown] = useState(false);

  const [popup, setPopup] = useState<{
    type: AlertType;
    open: boolean;
    title: string;
    message: string;
    duration: number;
  }>(
    {
      type: 'warning',
      open: false,
      title: '',
      message: '',
      duration: 3000,
    }
  );
  const propertyId = formData.id;
  // Effect: Fetch existing construction details if propertyId is present
  useEffect(() => {
    const fetchExistingData = async () => {
      if (propertyId) {
        try {
          const result = await triggerGetByPropertyId(propertyId).unwrap();
          if (result.data && result.data.length > 0) {
            const existingData = result.data[0];
            // Map PascalCase to camelCase
            const mappedData = {
              floorType: existingData.FloorType || '',
              roofType: existingData.RoofType || '',
              wallType: existingData.WallType || '',
              woodType: existingData.WoodType || '',
              constructionId: existingData.ID || '',
            };

            setLocalData(mappedData);
            updateForm({
              constructionDetails: {
                ...mappedData,
                id: mappedData.constructionId,
              },
            });
          }
        } catch (error) {
          console.error('Failed to fetch construction details:', error);
        }
      }
    };

    fetchExistingData();
  }, [propertyId]);

  // Effect: Fetch raw dropdown lists from JSON service
  useEffect(() => {
    JsonService.getFloorTypes().then(setRawFloorTypes);
    JsonService.getRoofTypes().then(setRawRoofTypes);
    JsonService.getWallTypes().then(setRawWallTypes);
    JsonService.getWoodTypes().then(setRawWoodTypes);
  }, []);

  // Effect: Translate dropdown options on language change
  useEffect(() => {
    setFloorTypes(translateDropdownOptions(rawFloorTypes));
    setRoofTypes(translateDropdownOptions(rawRoofTypes));
    setWallTypes(translateDropdownOptions(rawWallTypes));
    setWoodTypes(translateDropdownOptions(rawWoodTypes));
  }, [rawFloorTypes, rawRoofTypes, rawWallTypes, rawWoodTypes, translateDropdownOptions]);

  // Effect: Sync local state with context data
  useEffect(() => {
    if (formData.constructionDetails) {
      setLocalData({
        floorType: formData.constructionDetails.floorType || '',
        roofType: formData.constructionDetails.roofType || '',
        wallType: formData.constructionDetails.wallType || '',
        woodType: formData.constructionDetails.woodType || '',
        constructionId: formData.constructionDetails.id?.toString() || '',
      });
    }
  }, [formData.constructionDetails]);

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

  // showErrorPopup: Displays warning popup for errors
  // helper to close others before opening
  const closeAllDropdowns = () => {
    setShowFloorTypeDropdown(false);
    setShowRoofTypeDropdown(false);
    setShowWallTypeDropdown(false);
    setShowWoodTypeDropdown(false);
  };

  // --- NEW: touched and field error state for dropdowns ---
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({
    floorType: '',
    roofType: '',
    wallType: '',
    woodType: '',
  });
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({
    floorType: false,
    roofType: false,
    wallType: false,
    woodType: false,
  });
  const markTouched = (name: string) =>
    setTouchedFields((prev) => ({ ...prev, [name]: true }));

  const clearError = (name: string) =>
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));

  // Called when a dropdown option is selected
  const handleDropdownSelect = (field: string, value: string) => {
    setLocalData((prev) => ({ ...prev, [field]: value }));
    clearError(field);
    markTouched(field);
  };

  // Called when a dropdown is closed (user clicked away) — if value is empty we show required error
  const handleBlurDropdown = (field: string) => {
    markTouched(field);
    const currentValue = (localData as any)[field] as string;
    if (!currentValue || currentValue === '') {
      const labelMap: Record<string, string> = {
        floorType: floorTypeText,
        roofType: roofTypeText,
        wallType: wallTypeText,
        woodType: woodTypeText,
      };
      setFieldErrors((prev) => ({
        ...prev,
        [field]: `${labelMap[field]} is required`,
      }));
    } else {
      clearError(field);
    }
  };
  // --- END NEW ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation (also set field errors for UI)
    const missing = [
      { key: 'floorType', label: floorTypeText },
      { key: 'roofType', label: roofTypeText },
      { key: 'wallType', label: wallTypeText },
      { key: 'woodType', label: woodTypeText },
    ].filter((f) => !(localData as any)[f.key]);

    if (missing.length > 0) {
      // mark touched and set errors for missing fields
      const newFieldErrors: Record<string, string> = { ...fieldErrors };
      const newTouched = { ...touchedFields };
      missing.forEach((m) => {
        newTouched[m.key] = true;
        newFieldErrors[m.key] = `${m.label} is required`;
      });
      setTouchedFields(newTouched);
      setFieldErrors(newFieldErrors);

      showErrorPopup('Please fill in all construction details');
      return;
    }

    if (!propertyId) {
      showErrorPopup('Property ID is missing. Please complete previous steps.');
      return;
    }

    try {
      const constructionPayload: ConstructionDetailsRequest = {
        floorType: localData.floorType,
        wallType: localData.wallType,
        roofType: localData.roofType,
        woodType: localData.woodType,
        propertyId: propertyId,
      };

      let result;
      if (localData.constructionId) {
        // UPDATE existing construction details
        result = await updateConstructionDetails({
          id: localData.constructionId,
          data: constructionPayload,
        }).unwrap();
      } else {
        // CREATE new construction details
        result = await createConstructionDetails(constructionPayload).unwrap();
      }

      // Update context with the saved data
      updateForm({
        constructionDetails: {
          ...result.data,
          id: result.data.ID,
        },
      });

      // Navigate to next page after a short delay
      setTimeout(() => {
        navigate('/property-form/floor-details-cards');
      }, 1500);
    } catch (error: any) {
      console.error('Failed to save construction details:', error);
      const errorMessage =
        error?.data?.message || 'Failed to save construction details. Please try again.';
      showErrorPopup(errorMessage);
    }
  };

  // handleSubmit: Validates and submits form, creates/updates construction details via API
  const handleGoBack = () => navigate(-1);

  // handleGoBack: Navigates to previous page
  const handleSaveDraft = () => {
    updateForm({
      constructionDetails: {
        floorType: localData.floorType,
        roofType: localData.roofType,
        wallType: localData.wallType,
        woodType: localData.woodType,
        id: localData.constructionId,
      },
    });
  };

  // handleSaveDraft: Saves current form data as draft in context
  const { previousText, saveDraftText } = useAssessmentDetailsLocalization();

  const isSubmitting = isCreating || isUpdating;

  // UI rendering: WarningPopup, header, form with dropdowns and submit button
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
            title={`${mode === 'new' ? `${newPropertyForm}` : 'Property Form'}`}
            subtitle={`${constructionDetails}`}
            steps={10}
            activeStep={6}
            onPrevious={handleGoBack}
            onSaveDraft={handleSaveDraft}
            previousText={previousText}
            saveDraftText={saveDraftText}
          />
        </Box>

        <Box sx={formContentStyle}>
          <form onSubmit={handleSubmit}>
            <Stack>
              <Box sx={{ ...formFieldWrapper, width: '75%' }}>
                <CustomDropdown
                  label={floorTypeText}
                  name="floorType"
                  value={localData.floorType}
                  options={floorTypes}
                  showDropdown={showFloorTypeDropdown}
                  setShowDropdown={setShowFloorTypeDropdown}
                  onSelect={handleDropdownSelect}
                  closeOtherDropdowns={closeAllDropdowns}
                  selectText={selectText}
                  required
                  error={fieldErrors.floorType}
                  touched={touchedFields.floorType}
                  onBlur={() => handleBlurDropdown('floorType')}
                />
              </Box>

              <Box sx={formFieldWrapper}>
                <CustomDropdown
                  label={roofTypeText}
                  name="roofType"
                  value={localData.roofType}
                  options={roofTypes}
                  showDropdown={showRoofTypeDropdown}
                  setShowDropdown={setShowRoofTypeDropdown}
                  onSelect={handleDropdownSelect}
                  closeOtherDropdowns={closeAllDropdowns}
                  selectText={selectText}
                  required
                  error={fieldErrors.roofType}
                  touched={touchedFields.roofType}
                  onBlur={() => handleBlurDropdown('roofType')}
                />
              </Box>

              <Box sx={{ ...formFieldWrapper, width: '75%' }}>
                <CustomDropdown
                  label={wallTypeText}
                  name="wallType"
                  value={localData.wallType}
                  options={wallTypes}
                  showDropdown={showWallTypeDropdown}
                  setShowDropdown={setShowWallTypeDropdown}
                  onSelect={handleDropdownSelect}
                  closeOtherDropdowns={closeAllDropdowns}
                  selectText={selectText}
                  required
                  error={fieldErrors.wallType}
                  touched={touchedFields.wallType}
                  onBlur={() => handleBlurDropdown('wallType')}
                />
              </Box>

              <Box sx={{ ...formFieldWrapper, width: '75%' }}>
                <CustomDropdown
                  label={woodTypeText}
                  name="woodType"
                  value={localData.woodType}
                  options={woodTypes}
                  showDropdown={showWoodTypeDropdown}
                  setShowDropdown={setShowWoodTypeDropdown}
                  onSelect={handleDropdownSelect}
                  closeOtherDropdowns={closeAllDropdowns}
                  selectText={selectText}
                  required
                  error={fieldErrors.woodType}
                  touched={touchedFields.woodType}
                  onBlur={() => handleBlurDropdown('woodType')}
                />
              </Box>

              <Box sx={formSubmitStyle}>
                <Button
                  type="submit"
                  disabled={isSubmitting || isFetching}
                  sx={{
                    ...verifyButtonSx,
                    display: 'block',
                    marginLeft: 'auto',
                    marginTop: '100px',
                  }}
                  variant="contained"
                >
                  {isSubmitting ? 'Submitting...' : mode === 'verify' ? 'Verify' : nextButtonText}
                </Button>
              </Box>
            </Stack>
          </form>
        </Box>
      </Box>
    </>
  );
};

export default ConstructionDetailsPage;