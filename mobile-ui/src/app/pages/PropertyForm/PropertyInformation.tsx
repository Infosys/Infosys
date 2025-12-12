// PropertyInformation.tsx
// This component renders the property information step in the property registration form.
// Handles ownership, property type, apartment name, location tagging, polygons, and validation.
// Integrates with context, localization, and Redux API hooks.
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/NewPropertyForm.css';
import { FaLocationCrosshairs } from 'react-icons/fa6';
import { MdEdit, MdClose } from 'react-icons/md';
import { usePropertyForm } from '../../../context/PropertyFormContext';
import { useFormMode } from '../../../context/FormModeContext';
import JsonService from '../../../services/jsonServerApiCalls';
import authService from '../../../services/AuthService';
import '../../../styles/LocationSelection.css';
import { usePropertyInformationLocalization } from '../../../services/AgentLocalisation/localisation-propertyInformation';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import StepHeader from '../../features/Agent/components/StepHeader';
import { useLocalization } from '../../../services/AgentLocalisation/formLocalisation';
import { verifyButtonSx } from './styles/sharedStyles';
import Button from '@mui/material/Button';
import type { AlertType } from '../../models/AlertType.model';
import {
  useLazyGetApplicationByIdQuery,
  useSubmitApplicationMutation,
} from '../../../redux/apis/applicationApi';
import {
  useDeleteGISDataMutation,
  useUpdateCoordinatesMutation,
} from '../../../redux/apis/gisApi';
import { usePropertyData } from '../../features/Agent/api/propertyData.hooks';
import { fetchPropertyDetails } from '../../features/Agent/api/fetchProperty.hooks';
import { NotificationPopup } from '../../components/Popup/NotificationPopup';
import { useLazyGetOwnersByPropertyIdQuery } from '../../../redux/apis/ownerApi';

/**
 * PropertyInformation component
 * Renders the property information form step, manages local and global state, handles location and polygon tagging, and validates required fields.
 */
const PropertyInformation: React.FC = () => {
  // Context and navigation hooks
  const { formData, updateForm } = usePropertyForm();
  const { mode, setMode } = useFormMode();
  const navigate = useNavigate();

  // Enum for ownership types
  const ownershipTypeEnum = [
    'VACANT_LAND',
    'PRIVATE',
    'CENTRAL_GOVERNMENT_50',
    'CENTRAL_GOVERNMENT_75',
    'STATE_GOVERNMENT',
  ] as const;

  // RTK Query hooks for property and GIS APIs
  const [getApplicationById] = useLazyGetApplicationByIdQuery();
  const [updateCoordinates] = useUpdateCoordinatesMutation();
  const [deleteGISData] = useDeleteGISDataMutation();
  const [getOwnerByPropId] = useLazyGetOwnersByPropertyIdQuery();

  // Combine the first two useEffects
  // On mount: if in draft mode, fetch property details if needed; if mode is none, clear local storage
  useEffect(() => {
    if (mode === 'draft') {
      const propertyId = localStorage.getItem('propertyId')!;
      const applicationId = localStorage.getItem('applicationId');

      if (!applicationId) {
        navigate('/agent');
      } else if (!formData.id) {
        // Only fetch if formData is empty
        fetchPropertyDetails(
          propertyId,
          applicationId,
          getApplicationById,
          getOwnerByPropId,
          updateForm,
          showErrorPopup
        );
      }
    } else if (mode === 'none') {
      localStorage.removeItem('propertyId');
      localStorage.removeItem('applicationId');
    }
  }, [mode]);

  // Enum for property types
  const propertyTypeEnum = ['MIXED', 'NON_RESIDENTIAL', 'RESIDENTIAL'] as const;

  // Display labels for ownership types
  const ownershipTypeDisplay: Record<string, string> = {
    VACANT_LAND: 'Vacant Land',
    PRIVATE: 'Private',
    CENTRAL_GOVERNMENT_50: 'Central Govt 50%',
    CENTRAL_GOVERNMENT_75: 'Central Govt 75%',
    STATE_GOVERNMENT: 'State Government',
    NULL: 'None',
  };

  // Display labels for property types
  const propertyTypeDisplay: Record<string, string> = {
    MIXED: 'Mixed',
    NON_RESIDENTIAL: 'Non Residential',
    RESIDENTIAL: 'Residential',
  };

  // RTK Query hook for submitting application
  const [submitApplication] = useSubmitApplicationMutation();

  // Localization hook for property information step
  const {
    locale,
    categoryOwnershipLabel,
    propertyTypeLabel,
    apartmentNameLabel,
    apartmentNamePlaceholder,
    // addLocationTagBtn,
    addPolygonBtn,
    addressLabel,
    coordinatesLabel,
    addedAtText,
    onText,
    removeTagBtn,
    editLocationBtn,
    polygonLabel,
    pointText,
    removePolygonBtn,
    editPolygonBtn,
    saveDraftBtn,
    previousBtn,
    propertyFormTitle,
    newPropertyFormTitle,
    propertyInfoSubtitle,
  } = usePropertyInformationLocalization();

  // General localization hook for next button text
  const { nextButtonText } = useLocalization();

  // Context for global property form data

  // Custom hooks for saving property and GIS data
  const { savePropertyBasics, saveGISData, saveCoordinates } = usePropertyData();

  // Local state for this form step (prepopulated from context)
  const [localData, setLocalData] = useState({
    categoryOfOwnership: formData.categoryOfOwnership || '',
    propertyType: formData.propertyType || '',
    apartmentName: formData.apartmentName || '',
  });

  // Dropdown options and open state
  const [ownershipOptions, setOwnershipOptions] = useState<string[]>([]);
  const [propertyTypeOptions, setPropertyTypeOptions] = useState<string[]>([]);
  const [showOwnershipDropdown, setShowOwnershipDropdown] = useState(false);
  const [showPropertyTypeDropdown, setShowPropertyTypeDropdown] = useState(false);

  // Fetch ownership and property type options from JSON service on mount
  useEffect(() => {
    // Fetch ownership options
    console.log(ownershipOptions, propertyTypeOptions);

    JsonService.getOwnershipOptions().then((data) => {
      if (Array.isArray(data)) {
        setOwnershipOptions(data.map((item) => item.name));
      }
    });

    // Fetch property type options
    JsonService.getPropertyTypeOptions().then((data) => {
      if (Array.isArray(data)) {
        setPropertyTypeOptions(data.map((item) => item.name));
      }
    });
  }, []);

  // Sync local state with context data when formData changes
  useEffect(() => {
    setLocalData({
      categoryOfOwnership: formData.categoryOfOwnership || '',
      propertyType: formData.propertyType || '',
      apartmentName: formData.apartmentName || '',
    });
  }, [formData.categoryOfOwnership, formData.propertyType, formData.apartmentName]);

  // Handler for selecting ownership type
  const handleOwnershipSelect = (option: string) => {
    const updatedData = { ...localData, categoryOfOwnership: option };
    setLocalData(updatedData);
    updateForm(updatedData);
    setShowOwnershipDropdown(false);
  };

  // Handler for selecting property type
  const handlePropertyTypeSelect = (option: string) => {
    const updatedData = { ...localData, propertyType: option };
    setLocalData(updatedData);
    updateForm(updatedData);
    setShowPropertyTypeDropdown(false);
  };

  // Handler for apartment name input change
  const handleApartmentNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedData = { ...localData, apartmentName: e.target.value };
    setLocalData(updatedData);
    updateForm(updatedData);
  };

  /**
   * Validates required fields for the property information step.
   * Shows error popup if any required field is missing or location is not tagged.
   */
  const validateForm = () => {
    const missingFields: string[] = [];
    if (!localData.categoryOfOwnership) missingFields.push(categoryOwnershipLabel);
    if (!localData.propertyType) missingFields.push(propertyTypeLabel);
    if (!localData.apartmentName.trim()) missingFields.push(apartmentNameLabel);

    if (missingFields.length > 0) {
      showErrorPopup(`Please fill in: ${missingFields.join(', ')}.`, 3500);
      return false;
    }

    if (
      !formData.locationData ||
      !formData.locationData.coordinates ||
      typeof formData.locationData.coordinates.lat !== 'number' ||
      typeof formData.locationData.coordinates.lng !== 'number'
    ) {
      showErrorPopup('Please add a location tag before proceeding.', 3500);
      return false;
    }

    if (
      authService.isCitizen() === false &&
      (!formData.locationData.drawnShapes ||
        formData.locationData.drawnShapes.length === 0)
    ) {
      showErrorPopup('Please add a polygon before proceeding.', 3500);
      return false;
    }

    return true;
  };

  // Handler for form submission: validates, saves draft, and navigates to next step
  const handleSubmit = async () => {
    if (!validateForm()) return; // Prevent submission if not valid

    try {
      await handleSaveDraft();
      navigate('/property-form/owner-details-two');
    } catch (error) {
      console.log(error);
    }
  };

  // Handler for back navigation
  const handleBack = () => {
    setMode('none');
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

  // Helper to show error notification popup
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

  /**
   * Saves property basics and GIS data as a draft.
   * Updates form context and local storage as needed.
   * Submits application as draft if not already present.
   */
  const handleSaveDraft = async () => {
    try {
      const { propertyID: newPropertyID, propertyNo } = await savePropertyBasics(
        formData.id
      );

      if (!formData.id) {
        localStorage.setItem('propertyId', newPropertyID);
      }

      updateForm({
        id: newPropertyID,
        propertyNo,
      });

      if (formData.locationData) {
        const gisDataId = await saveGISData(
          newPropertyID,
          formData.locationData.gisDataId
        );

        updateForm({
          locationData: {
            ...formData.locationData,
            gisDataId,
          },
        });

        await saveCoordinates(gisDataId, !!formData.locationData.gisDataId);
      }

      const applicationId = localStorage.getItem('applicationId');
      if (!applicationId) {
        const userString = sessionStorage.getItem('user');
        const user = userString ? JSON.parse(userString) : null;

        const result = await submitApplication({
          propertyId: newPropertyID,
          appliedBy: user?.username,
          assesseeId: localStorage.getItem('user_id')!,
          isDraft: true,
          priority: 'LOW',
          dueDate: new Date().toISOString(),
        }).unwrap();

        localStorage.setItem('applicationId', result.data.ID);
      }
    } catch (error) {
      console.error('Failed to submit property data:', error);
      showErrorPopup('Failed to save property details');
      throw error;
    }
  };

  // Handler for navigating to location tag selection
  const handleLocationTagClick = () => {
    navigate('/property-form/location-selection');
  };

  // Handler for navigating to polygon drawing mode
  const handleAddPolygon = () => {
    navigate('/property-form/location-selection?mode=polygon');
  };

  // Handler for removing the location tag (GIS data)
  const handleRemoveLocationTag = async () => {
    try {
      if (formData.locationData?.gisDataId) {
        await deleteGISData(formData.locationData.gisDataId).unwrap();
      }
      updateForm({ locationData: undefined });
    } catch (error) {
      console.error('Failed to remove location:', error);
      showErrorPopup('Failed to remove location');
    }
  };

  // Handler for editing the location tag
  const handleEditLocation = () => {
    navigate('/property-form/location-selection');
  };

  // Handler for removing a polygon shape from drawnShapes
  const handleRemovePolygon = async (polygonIndex: number) => {
    if (!formData.locationData?.drawnShapes) return;
    try {
      const gisDataId = formData.locationData.gisDataId;
      if (gisDataId) {
        await updateCoordinates({
          gisDataId: gisDataId,
          coordinates: [],
        }).unwrap();
      }
      const existing = formData.locationData.drawnShapes;
      let polyCount = -1;
      const newShapes = existing.filter((s) => {
        if (s.type === 'polygon') {
          polyCount += 1;
          if (polyCount === polygonIndex) return false;
          return true;
        }
        return true;
      });
      const newLocationData = {
        ...formData.locationData,
        drawnShapes: newShapes.length > 0 ? newShapes : [],
      };
      updateForm({ locationData: newLocationData });
    } catch (error) {
      console.error('Failed to remove polygon:', error);
      showErrorPopup('Failed to remove polygon');
    }
  };

  // Handler for editing a polygon shape
  const handleEditPolygon = () => {
    navigate('/property-form/location-selection?mode=polygon');
  };

  // Render the property information form UI
  return (
    <>
      <NotificationPopup
        type={popup.type}
        open={popup.open}
        title={popup.title}
        message={popup.message}
        onClose={() => setPopup((p) => ({ ...p, open: false }))}
      />

      <div className="property-form-container" style={{ padding: '0' }}>
        <StepHeader
          title={`${mode === 'new' ? `${newPropertyFormTitle}` : `${propertyFormTitle}`}`}
          subtitle={propertyInfoSubtitle}
          steps={10}
          activeStep={0}
          onPrevious={() => handleBack()}
          onSaveDraft={() => handleSaveDraft()}
          previousText={previousBtn}
          saveDraftText={saveDraftBtn}
        />

        <div className="form-content" key={locale}>
          <div className="form-field">
            <label className="field-label">
              {categoryOwnershipLabel}
              <span style={{ color: 'red' }}> *</span>
            </label>
            <div className="dropdown-container">
              <button
                className="dropdown-button"
                onClick={() => setShowOwnershipDropdown(!showOwnershipDropdown)}
              >
                <span>
                  {ownershipTypeDisplay[localData.categoryOfOwnership] || 'Select'}
                </span>
                <ArrowDropDownOutlinedIcon />
              </button>
              {showOwnershipDropdown && (
                <div className="dropdown-menu">
                  {ownershipTypeEnum.map((option) => (
                    <div
                      key={option}
                      className={`dropdown-option ${
                        option === localData.categoryOfOwnership ? 'selected' : ''
                      }`}
                      onClick={() => handleOwnershipSelect(option)}
                    >
                      {ownershipTypeDisplay[option]}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-field">
            <label className="field-label">
              {propertyTypeLabel}
              <span style={{ color: 'red' }}> *</span>
            </label>
            <div className="dropdown-container">
              <button
                className="dropdown-button"
                onClick={() => setShowPropertyTypeDropdown(!showPropertyTypeDropdown)}
              >
                <span>{propertyTypeDisplay[localData.propertyType] || 'Select'}</span>
                <ArrowDropDownOutlinedIcon />
              </button>
              {showPropertyTypeDropdown && (
                <div className="dropdown-menu">
                  {propertyTypeEnum.map((option) => (
                    <div
                      key={option}
                      className={`dropdown-option ${
                        option === localData.propertyType ? 'selected' : ''
                      }`}
                      onClick={() => handlePropertyTypeSelect(option)}
                    >
                      {propertyTypeDisplay[option]}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-field">
            <label className="field-label">
              {apartmentNameLabel}
              <span style={{ color: 'red' }}> *</span>
            </label>
            <input
              type="text"
              className="text-input"
              placeholder={apartmentNamePlaceholder}
              value={localData.apartmentName}
              onChange={handleApartmentNameChange}
              required
            />
          </div>

          {/* Always show Add Location button */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <button
              className="location-tag-button"
              onClick={handleLocationTagClick}
              // style={{ border: 'none' }}
            >
              <FaLocationCrosshairs size={16} />
              Add Location
            </button>

            {authService.isCitizen() == false && (
              <button className="polygon-tag-button" onClick={handleAddPolygon}>
                <FaLocationCrosshairs size={16} />
                {addPolygonBtn}
              </button>
            )}
          </div>

          {formData.locationData && (
            <div className="property-card-summary orange-border">
              <div className="card-content">
                <div className="card-field">
                  <span className="field-label-bold">{addressLabel}:</span>
                  <span className="field-value">{formData.locationData.address}</span>
                </div>
                {formData.locationData.coordinates?.lat !== undefined &&
                  formData.locationData.coordinates?.lng !== undefined && (
                    <div className="card-field">
                      <span className="field-label-bold">{coordinatesLabel}</span>
                      <span className="field-value-coordinates">
                        {formData.locationData.coordinates.lat.toFixed(6)}°,{' '}
                        {formData.locationData.coordinates.lng.toFixed(6)}°
                      </span>
                    </div>
                  )}
                <div className="card-timestamp orange">
                  {formData.locationData.timestamp ? (
                    <>
                      {addedAtText}{' '}
                      {new Date(formData.locationData.timestamp).toLocaleTimeString(
                        'en-GB',
                        {
                          hour12: false,
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        }
                      )}{' '}
                      {onText}{' '}
                      {new Date(formData.locationData.timestamp).toLocaleDateString(
                        'en-GB',
                        {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        }
                      )}
                    </>
                  ) : (
                    <>
                      {addedAtText}{' '}
                      {new Date().toLocaleTimeString('en-GB', {
                        hour12: false,
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}{' '}
                      {onText}{' '}
                      {new Date().toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </>
                  )}
                </div>
                <div className="card-actions">
                  <button
                    style={{
                      borderRadius: '10px',
                      marginLeft: '-8%',
                      width: '200%',
                      fontSize: '14px',
                    }}
                    className="card-action-btn remove-btn orange"
                    onClick={handleRemoveLocationTag}
                  >
                    <MdClose size={12} />
                    {removeTagBtn}
                  </button>
                  <button
                    style={{
                      borderRadius: '10px',
                      width: '200%',
                      fontSize: '14px',
                      background: 'white',
                    }}
                    className="card-action-btn edit-btn orange"
                    onClick={handleEditLocation}
                  >
                    <MdEdit size={12} />
                    {editLocationBtn}
                  </button>
                </div>
              </div>
            </div>
          )}

          {formData.locationData?.drawnShapes &&
            formData.locationData.drawnShapes.filter((s: any) => s.type === 'polygon')
              .length > 0 && (
              <div style={{ marginTop: 16 }}>
                {formData.locationData.drawnShapes
                  .filter((s: any) => s.type === 'polygon')
                  .map((poly: any, idx: number) => (
                    <div key={idx} className="property-card-polygon green-border">
                      <div className="card-content">
                        <div className="card-field-polygon">
                          <span className="field-label-bold">{polygonLabel}</span>
                        </div>
                        <div className="card-field-coordinate">
                          <div
                            className="field-label-bold"
                            style={{ marginBottom: '4px' }}
                          >
                            {coordinatesLabel}
                          </div>
                          <div className="summary-coordinates-list">
                            {((poly.coordinates as number[][]) || []).map(
                              (c: number[], i: number) => {
                                let lng = c[0];
                                let lat = c[1];
                                if (Math.abs(lat) > 90 || Math.abs(lng) > 180) {
                                  lat = c[0];
                                  lng = c[1];
                                }
                                return (
                                  <div key={i} className="coordinate-line">
                                    {pointText} {i + 1} : {lat.toFixed(6)}°,{' '}
                                    {lng.toFixed(6)}°
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                        <div className="card-timestamp green">
                          {poly.addedAt ? (
                            <>
                              {addedAtText}{' '}
                              {new Date(poly.addedAt).toLocaleTimeString('en-GB', {
                                hour12: false,
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                              })}{' '}
                              {onText}{' '}
                              {new Date(poly.addedAt).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                              })}
                            </>
                          ) : (
                            <>
                              {addedAtText}{' '}
                              {new Date().toLocaleTimeString('en-GB', {
                                hour12: false,
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                              })}{' '}
                              {onText}{' '}
                              {new Date().toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                              })}
                            </>
                          )}
                        </div>
                        <div className="card-actions">
                          <button
                            style={{
                              width: '200%',
                              padding: '2%',
                              marginLeft: '-9%',
                              fontSize: '14px',
                            }}
                            className="card-action-btn remove-btn green"
                            onClick={() => handleRemovePolygon(idx)}
                          >
                            <MdClose size={12} />
                            {removePolygonBtn}
                          </button>
                          <button
                            style={{
                              borderRadius: '10px',
                              fontSize: '14px',
                              width: '200%',
                              marginLeft: '-1%',
                              padding: '2px',
                              background: 'white',
                            }}
                            className="card-action-btn edit-btn green"
                            onClick={() => handleEditPolygon()}
                          >
                            <MdEdit size={12} />
                            {editPolygonBtn}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
        </div>
        <div className="form-submit">
          <Button onClick={handleSubmit} sx={verifyButtonSx} variant="contained">
            {mode === 'verify' ? 'Verify' : nextButtonText}
          </Button>
        </div>
      </div>
    </>
  );
};

// Export the PropertyInformation component as default
export default PropertyInformation;
