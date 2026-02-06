// FloorDetailsCards.tsx
// Property Form Floor Details page
// Displays and manages a list of floor details for a property
// Features:
//   - Loads floor details from backend and updates context
//   - Allows adding, editing, and deleting floor entries
//   - Shows error and loading states
//   - Uses custom FloorCard component for each floor
//   - Responsive UI with MUI components and localization
// Used in: Property form workflow for floor details step
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import { useFormMode } from '../../../context/FormModeContext';
import { usePropertyForm } from '../../../context/PropertyFormContext';
import type { FloorDetails } from '../../../context/PropertyFormContext';
import { useFloorDetailsLocalization } from '../../../services/AgentLocalisation/localisation-floor-details';
import StepHeader from '../../features/Agent/components/StepHeader';
import { useLocalization } from '../../../services/AgentLocalisation/formLocalisation';
import FloorCard from '../../features/PropertyForm/components/FloorDetail/FloorCard';
import { verifyButtonSx } from './styles/sharedStyles';
import type { AlertType } from '../../models/AlertType.model';

import {
  useGetFloorDetailsByConstructionIdQuery,
  useDeleteFloorDetailsMutation,
} from '../../../redux/apis/floorApi';
import CircularProgress from '@mui/material/CircularProgress';
import { NotificationPopup } from '../../components/Popup/NotificationPopup';

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

const headerSx = {
  backgroundColor: '#F9E6E0',
  padding: '16px',
};

const contentSx = {
  flex: 1,
  px: '8%',
  py: 3,
  backgroundColor: '#FFFFFF',
  display: 'flex',
  flexDirection: 'column' as const,
};

const addButtonSx = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  backgroundColor: '#F7E4DB',
  color: '#6D4531',
  borderRadius: 2,
  padding: '8px 16px',
  fontSize: 16,
  fontWeight: 500,
  textTransform: 'none',
  boxShadow: 'none',
  width: '46%',
};

const cardListSx = {
  mt: 2.5,
  mb: 1.5,
  display: 'flex',
  flexDirection: 'column' as const,
  gap: 2,
};

const errorSx = {
  color: 'red',
  mt: 2,
  fontSize: '1rem',
};

const FloorDetailsCards: React.FC = () => {
  // Contexts and hooks for form mode, navigation, and property form data
  const { mode } = useFormMode();
  const navigate = useNavigate();
  const { formData, updateForm } = usePropertyForm();
  
  const applicationId = localStorage.getItem('applicationLogId') || localStorage.getItem('applicationId') || '';

  const {
    saveDraftText,
    atLeastOneFloorMsg,
    previousText,
    propertyFormTitle,
    newPropertyFormTitle,
    floorDetailsSubtitle,
  } = useFloorDetailsLocalization();

  const { addFloorText, nextButtonText, NoFloorDetailsFoundMSG } = useLocalization();

  const [error, setError] = useState<string | null>(null);

  const constructionDetailsId = formData.constructionDetails!.id?.toString();
  const {
    data: floorDetailsData,
    isLoading,
    error: apiError,
    refetch,
  } = useGetFloorDetailsByConstructionIdQuery(constructionDetailsId!);

  const [deleteFloor, { isLoading: isDeleting }] = useDeleteFloorDetailsMutation();

  // Updated convert function to handle the actual API response structure
  const convertApiToLocal = (apiData: any) => {
    return {
      floorNumber: (apiData.FloorNo || apiData.floorNo || '').toString(),
      buildingClassification: apiData.Classification || apiData.classification || '',
      igrsClassification: 'A', // Default or map from API
      natureOfUsage: apiData.NatureOfUsage || apiData.natureOfUsage || '',
      firmName: apiData.FirmName || apiData.firmName || '',
      occupancy: apiData.OccupancyType || apiData.occupancyType || '',
      constructionDate: apiData.ConstructionDate || apiData.constructionDate || '',
      effectiveFromDate: apiData.EffectiveFromDate || apiData.effectiveFromDate || '',
      unstructuredLand: apiData.UnstructuredLand || apiData.unstructuredLand || '',
      length: (apiData.LengthFt || apiData.lengthFt || 0).toString(),
      breadth: (apiData.BreadthFt || apiData.breadthFt || 0).toString(),
      plinthArea: (apiData.PlinthAreaSqFt || apiData.plinthAreaSqFt || 0).toString(),
      mezzanineArea: (
        apiData.MezzanineAreaSqFt ||
        apiData.mezzanineAreaSqFt ||
        0
      ).toString(),
      buildingPermissionNo:
        apiData.BuildingPermissionNo || apiData.buildingPermissionNo || '',
      floorsDetailsEntered:
        apiData.FloorDetailsEntered || apiData.floorDetailsEntered || true,
      occupantName: apiData.OccupancyName || apiData.occupancyName || '',
    };
  };

  // Update local context when API data changes
  useEffect(() => {
    // Check different possible data structures
    let floors: any[] = [];

    if (floorDetailsData?.data && Array.isArray(floorDetailsData.data)) {
      floors = floorDetailsData.data;
    } else if (Array.isArray(floorDetailsData)) {
      floors = floorDetailsData;
    } else if (floorDetailsData && typeof floorDetailsData === 'object') {
      // Check if the data is directly an array or has floors property
      const dataKeys = Object.keys(floorDetailsData);
      console.log(dataKeys);
    }

    if (floors.length > 0) {
      const convertedFloors = floors.map(convertApiToLocal);
      updateForm({ floors: convertedFloors });
    } else {
      updateForm({ floors: [] });
    }
  }, [floorDetailsData]);

  const handleAddFloor = () => {
    // Navigate without any state - this creates a new empty floor
    navigate('/property-form/floor-details');
  };

  const handleDeleteFloor = async (idx: number) => {
    try {
      // Get the floor ID from API data
      let floors: any[] = [];

      if (floorDetailsData?.data && Array.isArray(floorDetailsData.data)) {
        floors = floorDetailsData.data;
      } else if (Array.isArray(floorDetailsData)) {
        floors = floorDetailsData;
      }

      const floorToDelete = floors[idx];
      const floorId = floorToDelete?.ID || floorToDelete?.id;

      if (floorId) {
        await deleteFloor({
          id: floorId,
          applicationId,
          isVerifying: mode === 'verify',
        }).unwrap();
        refetch(); // Refresh the data
      } else {
        // Fallback to local deletion if no API ID
        const newFloors = (formData.floors ?? []).filter((_, i) => i !== idx);
        updateForm({ floors: newFloors });
      }
    } catch (error: any) {
      console.error('Failed to delete floor:', error);
      const errorMessage =
        error?.data?.message || 'Failed to delete floor. Please try again.';
      showErrorPopup(errorMessage);
    }
  };

  const handleEditFloor = (floor: FloorDetails) => {
    // Find the corresponding API floor data to get the ID
    const floorIndex =
      formData.floors?.findIndex(
        (f) => f.floorNumber === floor.floorNumber && f.plinthArea === floor.plinthArea
      ) ?? -1;

    let floors: any[] = [];
    if (floorDetailsData?.data && Array.isArray(floorDetailsData.data)) {
      floors = floorDetailsData.data;
    } else if (Array.isArray(floorDetailsData)) {
      floors = floorDetailsData;
    }

    const apiFloor = floors[floorIndex];
    const floorId = apiFloor?.ID || apiFloor?.id;

    // Navigate with floorId - this will trigger edit mode and prefill data
    navigate('/property-form/floor-details', {
      state: {
        floorId: floorId,
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.floors || formData.floors.length === 0) {
      setError(atLeastOneFloorMsg);
      return;
    }
    setError(null);
    navigate('/property-form/documents');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

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
    updateForm({
      floors: formData.floors,
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <Box sx={{ ...containerSx, justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading floor details...</Typography>
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
            subtitle={`${floorDetailsSubtitle}`}
            steps={10}
            activeStep={7}
            onPrevious={handleGoBack}
            onSaveDraft={handleSaveDraft}
            saveDraftText={saveDraftText}
            previousText={previousText}
          />
        </Box>

        <Box component="main" sx={contentSx}>
          <form
            onSubmit={handleSubmit}
            style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
          >
            <Stack spacing={2} sx={{ flex: 1 }}>
              {formData.floors && formData.floors.length > 0 ? (
                <Box sx={cardListSx}>
                  {formData.floors.map((floor, idx) => (
                    <FloorCard
                      key={`${floor.floorNumber}-${idx}`}
                      floor={floor}
                      index={idx}
                      onEdit={handleEditFloor}
                      onDelete={handleDeleteFloor}
                      // disabled={isDeleting}
                    />
                  ))}
                </Box>
              ) : (
                <Typography sx={{ ml: 1 }}>
                  {apiError
                    ? 'Error loading floor details from server'
                    : NoFloorDetailsFoundMSG || 'No floor details found'}
                </Typography>
              )}

              {error && <Typography sx={errorSx}>{error}</Typography>}

              {/* Show API error if exists */}
              {apiError && (
                <Typography sx={{ ...errorSx, fontSize: '0.875rem' }}>
                  API Error:{' '}
                  {(apiError as any)?.data?.message || 'Failed to load floor details'}
                </Typography>
              )}
            </Stack>

            <Box
              sx={{
                pt: 2,
                mt: 'auto',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Button
                type="button"
                variant="contained"
                startIcon={<FaPlus />}
                onClick={handleAddFloor}
                sx={addButtonSx}
                disabled={isLoading}
              >
                {addFloorText}
              </Button>

              <Button
                type="submit"
                sx={verifyButtonSx}
                variant="contained"
                disabled={isLoading || isDeleting}
                onClick={handleSubmit}
              >
                {mode === 'verify' ? 'Verify' : nextButtonText}
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </>
  );
};

export default FloorDetailsCards;
