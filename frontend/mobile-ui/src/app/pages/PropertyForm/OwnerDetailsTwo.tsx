import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import OwnerCardDetail from '../../features/PropertyForm/components/OwnerDetail/OwnerCardDetail';
import { useFormMode } from '../../../context/FormModeContext';
import { usePropertyForm } from '../../../context/PropertyFormContext';
import { useOwnerDetailsLocalization } from '../../../services/AgentLocalisation/localisation-OwnerDetailsTwo';
import StepHeader from '../../features/Agent/components/StepHeader';
import { useLocalization } from '../../../services/AgentLocalisation/formLocalisation';
import { verifyButtonSx } from './styles/sharedStyles';
import Button from '@mui/material/Button';
import type { AlertType } from '../../models/AlertType.model';
import {
  useDeleteOwnerMutation,
  useGetOwnersByPropertyIdQuery,
  type Owner,
} from '../../../redux/apis/ownerApi';
import { NotificationPopup } from '../../components/Popup/NotificationPopup';

// Main component for displaying, adding, and editing multiple property owners
const OwnerDetailsTwo: React.FC = () => {
  const { mode } = useFormMode();
  const navigate = useNavigate();

  const { formData, updateForm } = usePropertyForm();
  const [deleteOwner] = useDeleteOwnerMutation();

  const propertyId = formData.id;
  const applicationId = localStorage.getItem('applicationLogId') || localStorage.getItem('applicationId') || '';

  const {
    data: ownersData,
    isLoading,
    refetch,
  } = useGetOwnersByPropertyIdQuery(propertyId, {
    skip: !propertyId,
  });

  // List of owners fetched from API
  const owners = ownersData?.data ?? [];
  // Calculate total ownership percentage
  const totalOwnership = owners.reduce(
    (sum, owner) => sum + (owner.OwnershipShare || 0),
    0
  );
  const remainingOwnership = 100 - totalOwnership;
  const {
    noOwnersFoundText,
    addOwnerText,
    addOwnerRequiredAlert,
    // draftSavedAlert,
    guardianLabel,
    // guardianRelationshipLabel,
    primaryOwnerText,
    propertyFormTitle,
    newPropertyFormTitle,
    ownerDetailsSubtitle,
    previousText,
    saveDraftText,
  } = useOwnerDetailsLocalization();

  const { nextButtonText } = useLocalization();

  // Inline styles derived from property-form.css (attached)
  // Inline styles for layout and buttons
  const styles = {
    container: {
      width: '100%',
      // maxWidth: '100%',
      margin: 0,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column' as const,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      padding: 0,
      backgroundColor: '#FFFFFF',
    },
    headerWrapper: {
      backgroundColor: '#F9E6E0',
      padding: '4%',
      // display: 'flex',
      // alignItems: 'flex-start',
      // justifyContent: 'flex-start',
    },
    addOwnerButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      backgroundColor: '#f7e4db',
      borderRadius: 12,
      color: '#333333',
      fontSize: 16,
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      width: 'fit-content',
      border: 'none',
      padding: '10px 16px',
      marginLeft: '7%',
      marginTop: '4%',
    },
    formContent: {
      width: '100%',
      flex: 1,
      padding: '24px 16px',
      backgroundColor: '#FFFFFF',
      alignItems: 'center',
    },
    noOwnersText: {
      marginLeft: '4%',
      color: '#333333',
    },
    formSubmitWrapper: {
      backgroundColor: '#FFFFFF',
      marginBottom: '8%',
      minWidth: '40vw',
      display: 'flex',
      justifyContent: 'flex-end',
      paddingRight: '4%',
    },
    primaryOwnerBadge: {
      backgroundColor: '#C8504B',
      color: '#FFFFFF',
      padding: '4px 8px',
      borderRadius: 8,
      fontSize: 12,
      fontWeight: 600,
    },
  };

  // Handle edit owner action (navigate to owner details form)
  const handleEditOwner = (owner: Owner) => {
    navigate('/property-form/owner-details', { 
      state: { editOwner: owner, editMode: true }, 
    });
  };

  // Handle delete owner action (remove from form context)
  const handleDeleteOwner = async (id: string) => {
    try {
      await deleteOwner({
        id,
        applicationId,
        isVerifying: mode === 'verify',
      }).unwrap();

      // Wait for refetch to get fresh data
      const { data: freshOwnersData } = await refetch();
      const freshOwners = freshOwnersData?.data ?? [];

      // Update form with fresh data from server
      updateForm({ owners: freshOwners });
    } catch (error) {
      showErrorPopup('Failed to delete owner');
      console.error('Delete owner error:', error);
    }
  };

  // Handle add owner button click (navigate to owner details form)
  const handleAddOwner = () => {
    navigate('/property-form/owner-details');
  };

  // Handle back navigation to property information
  const handleGoBack = () => {
    navigate(-1);
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

  // Save current owners as draft in form context
  const handleSaveDraft = () => {
    updateForm({ owners });
  };

  // Helper function to render owner list or empty state
  const renderOwnerList = () => {
    if (isLoading) {
      return (
        <Typography variant="body1" sx={styles.noOwnersText}>
          Loading owners...
        </Typography>
      );
    }

    if (owners.length === 0) {
      return (
        <Typography variant="body1" sx={styles.noOwnersText}>
          {noOwnersFoundText}
        </Typography>
      );
    }

    return owners.map((owner, idx) => (
      <OwnerCardDetail
        key={owner.ID}
        name={owner.Name}
        isPrimary={idx === 0}
        onDelete={() => handleDeleteOwner(owner.ID)}
        isDetailed={true}
        aadhar={owner.AdhaarNo.toString()}
        mobile={owner.ContactNo}
        email={owner.Email}
        guardian={owner.Guardian}
        guardianRelationship={owner.GuardianType}
        guardianLabel={guardianLabel}
        primaryOwnerText={primaryOwnerText}
        onEdit={() => handleEditOwner(owner)}
      />
    ));
  };

  // Handle submit button click (validate and go to next step)
  const handleSubmit = () => {
    if (owners.length === 0) {
      showErrorPopup(addOwnerRequiredAlert);
      return;
    }

    if (totalOwnership !== 100) {
      showErrorPopup('Total ownership percentage must be exactly 100%');
      return;
    }
    navigate('/property-form/property-address');
  };

  // Main render: notification popup, step header, owner cards, add/next buttons
  return (
    <>
      <NotificationPopup
        type={popup.type}
        open={popup.open}
        title={popup.title}
        message={popup.message}
        onClose={() => setPopup((p) => ({ ...p, open: false }))}
      />
      <Box sx={styles.container}>
        {/* Header area (StepHeader receives props exactly as before) */}
          <StepHeader
            title={`${
              mode === `${newPropertyFormTitle}`
                ? newPropertyFormTitle
                : propertyFormTitle
            }`}
            subtitle={ownerDetailsSubtitle}
            steps={10}
            activeStep={1}
            onPrevious={handleGoBack}
            onSaveDraft={handleSaveDraft}
            previousText={previousText}
            saveDraftText={saveDraftText}
          />

        <Box sx={styles.formContent}>
          {renderOwnerList()}
        </Box>

        <Box
          sx={{
            ...styles.formSubmitWrapper,
            justifyContent: 'space-between',
            paddingLeft: '4%',
          }}
        >
          <Button
            onClick={handleAddOwner}
            startIcon={<AddIcon />}
            variant="contained"
            disableElevation
            disabled={remainingOwnership <= 0}
            sx={{
              textTransform: 'none',
              backgroundColor: remainingOwnership <= 0 ? '#d3d3d3' : '#f7e4db',
              color: remainingOwnership <= 0 ? '#888' : '#333333',
              fontWeight: 600,
              borderRadius: '12px',
              padding: '10px 16px',
              width: '46%',
              '&:hover': {
                backgroundColor: remainingOwnership <= 0 ? '#d3d3d3' : '#f0dacd',
              },
              '&:disabled': {
                backgroundColor: '#d3d3d3',
                color: '#888',
              },
            }}
          >
            {addOwnerText}
          </Button>
          <Button onClick={handleSubmit} sx={verifyButtonSx} variant="contained">
            {mode === 'verify' ? 'Verify' : nextButtonText}
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default OwnerDetailsTwo;
