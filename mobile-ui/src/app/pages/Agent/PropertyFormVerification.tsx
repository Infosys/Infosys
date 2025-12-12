// PropertyFormVerification: Agent view for verifying property form details, showing map, required fields, and navigation
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePropertyForm } from '../../../context/PropertyFormContext';
import { usePropertyApplications } from '../../../context/PropertyApplicationsContext';
import { usePropertyFormVerificationLocalization } from '../../../services/AgentLocalisation/localisation-propertyFormVerification';
import '../../../styles/PropertyFormVerification.css';
import { useFormMode } from '../../../context/FormModeContext';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
//import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import LocationMapWithDrawing from '../PropertyForm/LocationMapWithDrawing';
import appleMaps from '../../assets/Agent/Apple_Maps.svg';
import openStreetMaps from '../../assets/Agent/open_street_maps.svg';
// Comment/Note Card
import { useNavigate as useNavigateHook } from 'react-router-dom';
import { useLocalization } from '../../../services/AgentLocalisation/formLocalisation';
import type { AlertType } from '../../models/AlertType.model';
import { fetchPropertyDetails } from '../../features/Agent/api/fetchProperty.hooks';
import { NotificationPopup } from '../../components/Popup/NotificationPopup';
import { useLazyGetApplicationByIdQuery } from '../../../redux/apis/applicationApi';
import { useLazyGetOwnersByPropertyIdQuery } from '../../../redux/apis/ownerApi';

// Card component for comment/note actions (application log, send email)
const CommentOrNoteCard = ({ loc, propertyId }: { loc: any; propertyId: string | undefined }) => {
  const navigate = useNavigateHook();
  const appId = localStorage.getItem('applicationId');
  return (
    <div className="card comment-note-card">
      <div className="comment-note-header">
        <ChatBubbleOutlineIcon />
        <span className="comment-note-title">{loc.commentOrAddNoteText}</span>
      </div>
      <div className="comment-note-actions">
        <button
          className="comment-note-btn outlined"
          onClick={() => navigate(`/agent/ApplicationLog/${appId || ''}`)}
          // onClick={() => navigate('/under-construction')}
        >
          {loc.applicationLogText}
        </button>
        <button
          className="comment-note-btn outlined"
          onClick={() => navigate(`/agent/send-email/${propertyId || ''}`)}
        >
          {loc.sendEmailText}
        </button>
      </div>
    </div>
  );
};

// Helper: Case-insensitive path lookup for nested form data (handles arrays and objects)
function getValue(obj: any, path: string) {
  if (!obj || !path) return undefined;
  const segments = path.split('.');
  let cur: any = obj;
  for (const seg of segments) {
    if (cur == null) return undefined;
    // Handle array index segment like "owners.0.name"
    if (Array.isArray(cur)) {
      const idx = Number(seg);
      if (!Number.isNaN(idx)) {
        cur = cur[idx];
        continue;
      }
      // If not a numeric index, use first element as representative
      cur = cur[0];
    }
    if (typeof cur !== 'object') return undefined;
    // Case-insensitive key lookup to match PropertyFormData casing
    const key = Object.keys(cur).find((k) => k.toLowerCase() === seg.toLowerCase());
    if (key === undefined) return undefined;
    cur = cur[key];
  }
  return cur;
}

// Card component showing address, phone, and form completion progress
const AddressProgressSection = ({
  address,
  phoneNo,
  formCompletionPercent,
  texts,
}: {
  address: string;
  phoneNo: string;
  formCompletionPercent: number;
  verificationCount: number;
  missingCount: number;
  texts: any;
}) => (
  <div className="card address-progress-card">
    <div className="address-progress-main">
      <div className="address-progress-label">{texts.addressText}:</div>
      <div className="address-progress-value">{address || 'N/A'}</div>
      <div className="address-progress-label phone-label">{texts.phoneNoText}:</div>
      <div className="address-progress-value phone-value">{phoneNo || 'N/A'}</div>
      <div className="address-progress-label completion-label">
        {texts.formCompletionText}:
      </div>
      <div className="progress-bar-row">
        <div className="progress-bar-outer">
          <div
            className="progress-bar-inner"
            style={{ width: `${formCompletionPercent}%` }}
          />
        </div>
        <div className="progress-bar-percentage">{formCompletionPercent}%</div>
      </div>
    </div>
    <div className="address-progress-row">
      <div className="status-indicators">
        <div className="status-item need-review">
          {/* <span className="status-number">{verificationCount}</span> */}
          {/* <span className="status-text-review">{texts.needReviewText}</span> */}
        </div>
        <div className="status-item missing">
          {/* <span className="status-number">{missingCount}</span> */}
          {/* <span className="status-text-missing">{texts.missingText}</span> */}
        </div>
      </div>
    </div>
  </div>
);

// Main component for property form verification page
const PropertyFormVerification: React.FC = () => {
  const { mode, setMode } = useFormMode();

  const navigate = useNavigate();
  const { propertyId } = useParams();
  const { formData, updateForm, resetForm } = usePropertyForm();
  const { fullProperties, properties } = usePropertyApplications();
  const [getOwnerByPropId] = useLazyGetOwnersByPropertyIdQuery();

  // State for map loading and data loading
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Use localization hook for UI text
  const texts = usePropertyFormVerificationLocalization();

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

  // req
  // const getRequiredFields = () => [
  //   {
  //     key: 'owners',
  //     label: texts.propertyOwnerNameText,
  //     section: texts.ownerInformationText,
  //     desc: texts.fullLegalNameText,
  //     avatar: true,
  //   },
  //   {
  //     key: 'assessmentDetails.ReasonOfCreation',
  //     label: texts.surveyNumberText,
  //     section: texts.propertyDetailsText,
  //     desc: texts.governmentSurveyNumberText,
  //     avatar: true,
  //   },
  //   {
  //     key: 'assessmentDetails.ExtentOfSite',
  //     label: texts.builtUpAreaText,
  //     section: texts.propertyMeasurementsText,
  //     desc: texts.totalBuiltUpAreaText,
  //     avatar: false,
  //   },
  // ];

  // const getRequiredFields = () => [
  //   { key: 'owners', label: texts.propertyOwnerNameText, section: texts.ownerInformationText, desc: texts.fullLegalNameText, avatar: true },
  //   { key: 'assessmentDetails.ReasonOfCreation', label: texts.surveyNumberText, section: texts.propertyDetailsText, desc: texts.governmentSurveyNumberText, avatar: true },
  //   { key: 'assessmentDetails.ExtentOfSite', label: texts.builtUpAreaText, section: texts.propertyMeasurementsText, desc: texts.totalBuiltUpAreaText, avatar: false },
  // ];

  // Build required-fields metadata from fetched formData (source of truth)
  const getRequiredFields = () => {
    const ownerLabel = (() => {
      const owners = formData?.owners;
      if (Array.isArray(owners) && owners.length > 0) {
        const o: any = owners[0];
        return o?.Name ?? o?.ownerName ?? o?.name ?? 'Owner Details';
      }
      return 'Owner Details';
    })();

    const reasonLabel =
      formData?.assessmentDetails?.ReasonOfCreation ?? 'ReasonOfCreation';
    const extentLabel = formData?.assessmentDetails?.ExtentOfSite ?? 'ExtentOfSite';

    return [
      {
        key: 'owners',
        label: ownerLabel,
        section: '',
        desc: '',
        avatar: true,
      },
      {
        key: 'assessmentDetails.ReasonOfCreation',
        label: reasonLabel,
        section: '',
        desc: '',
        avatar: true,
      },
      {
        key: 'assessmentDetails.ExtentOfSite',
        label: extentLabel,
        section: '',
        desc: '',
        avatar: false,
      },
    ];
  };
  // Metadata for fields needing verification
  const getVerificationFields = () => [
    {
      key: 'constructionDetails.floorType',
      label: texts.constructionTypeText,
      section: texts.propertyDetailsText,
      desc: texts.primaryConstructionMaterialText,
    },
    {
      key: 'assessmentDetails.natureOfUsage',
      label: texts.propertyUsageText,
      section: texts.propertyClassificationText,
      desc: texts.primaryUsageText,
    },
    {
      key: 'isgrAdditionalDetails',
      label: texts.amenitiesText,
      section: texts.propertyFeaturesText,
      desc: texts.selectAmenitiesText,
    },
    {
      key: 'floors',
      label: texts.floorDetailsText,
      section: texts.propertyStructureText,
      desc: texts.floorWiseUsageText,
    },
  ];

  // On mount: if propertyId is present, update form with property details
  useEffect(() => {
    if (propertyId && fullProperties.length > 0) {
      const found = fullProperties.find(
        (p) => p.propertyId === propertyId || p.id === propertyId
      );
      if (found && found.property) updateForm(found.property);
    }
    // eslint-disable-next-line
  }, [propertyId, fullProperties]);

  // Get address from the property data (from the list) or fallback to form data
  const getPropertyAddress = () => {
    // First try to get address from the properties list (PropertyItem)
    const propertyItem = properties.find(
      (p) => p.id === propertyId || p.pId === propertyId
    );
    if (propertyItem && propertyItem.address) {
      return propertyItem.address;
    }

    // Fallback to constructing from form data
    const addressParts = [
      formData.propertyAddress?.Street,
      formData.propertyAddress?.Locality,
      formData.propertyAddress?.ZoneNo,
      formData.propertyAddress?.BlockNo,
      formData.propertyAddress?.WardNo,
      formData.propertyAddress?.PinCode,
    ].filter(Boolean);

    return addressParts.length > 0 ? addressParts.join(', ') : 'Address not available';
  };

  const [getApplicationById] = useLazyGetApplicationByIdQuery();
  const address = getPropertyAddress();

  // Required and verification fields for the form
  const REQUIRED_FIELDS = getRequiredFields();
  const VERIFICATION_FIELDS = getVerificationFields();

  // Find missing required fields
  const missingFields = REQUIRED_FIELDS.filter((field) => {
    //if (field.key === 'owners') return !formData.owners || formData.owners.length === 0;
    const value = getValue(formData, field.key);
    return value === undefined || value === '' || value === null;
  });

  // Human readable list of missing field labels
  const missingFieldLabels = missingFields.map((f) => f.label || f.key);
  const missingLabelsStr = missingFieldLabels.join(', ');

  // Find fields that need verification
  const verificationFields = VERIFICATION_FIELDS.filter((field) => {
    const value = getValue(formData, field.key);
    if (field.key === 'isgrAdditionalDetails') {
      if (!formData.isgrAdditionalDetails) return true;
      return Object.values(formData.isgrAdditionalDetails).some((v) => v === undefined);
    }
    if (field.key === 'floors') return !formData.floors || formData.floors.length === 0;
    return value !== undefined && value !== '' && value !== null;
  });

  // Calculate form completion percentage
  const filledRequired = REQUIRED_FIELDS.length - missingFields.length;
  const formCompletionPercent = Math.round(
    (filledRequired / REQUIRED_FIELDS.length) * 100
  );

  // Navigate to property information form
  const handleContinueToForm = () => {
    navigate('/property-form/property-information');
  };

  // On mount: fetch property details if in verify mode
  useEffect(() => {
    let applicationId;
    let propertyId;
    if (mode == 'verify') {
      applicationId = localStorage.getItem('applicationId')!;
      propertyId = localStorage.getItem('propertyId')!;

      if (!propertyId) {
        navigate('/agent');
      }

      setIsMapLoading(true);
      setIsDataLoaded(false);
      fetchPropertyDetails(
        propertyId,
        applicationId,
        getApplicationById,
        getOwnerByPropId,
        updateForm,
        showErrorPopup
      )
        .then(() => {
          setIsDataLoaded(true);
          setTimeout(() => {
            setIsMapLoading(false);
          }, 500);
        })
        .catch(() => {
          setIsMapLoading(false);
          setIsDataLoaded(true);
        });
    }
  }, []);

  // If formData is loaded but not marked as loaded, set as loaded
  useEffect(() => {
    // If we have formData but haven't loaded yet, set as loaded
    if (formData && formData.id && !isDataLoaded) {
      setIsDataLoaded(true);
      setIsMapLoading(false);
    }

    console.log(formData);
  }, [formData, isDataLoaded]);

  // Handle back navigation: reset form and state
  const handleBackHome = () => {
    resetForm();
    setMode('none');
    setIsMapLoading(true);
    setIsDataLoaded(false);
    localStorage.removeItem('propertyId');
    localStorage.removeItem('applicationId');
    navigate(-1);
  };

  // Get location data from form or create default coordinates from address
  const getLocationData = () => {
    const coords = formData.locationData?.coordinates;
    // Ensure coords is an object with numeric lat and lng
    if (
      coords &&
      typeof (coords as any).lat === 'number' &&
      typeof (coords as any).lng === 'number'
    ) {
      return { lat: (coords as any).lat, lng: (coords as any).lng };
    }

    // Default to Bangalore coordinates if no valid location data
    return { lat: 12.9716, lng: 77.5946 };
  };

  // Open external map providers in a new tab
  const openGoogleMaps = () => {
    const loc = getLocationData();
    const q = `${loc.lat},${loc.lng}`;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      q
    )}`;
    window.open(url, '_blank');
  };

  const openAppleMaps = () => {
    const loc = getLocationData();
    const coords = `${loc.lat},${loc.lng}`;
    const label = address && address !== 'Address not available' ? address : coords;
    const url = `https://maps.apple.com/?ll=${encodeURIComponent(
      coords
    )}&q=${encodeURIComponent(label)}`;
    window.open(url, '_blank');
  };

  const openOpenStreetMap = () => {
    const loc = getLocationData();
    const url = `https://www.openstreetmap.org/?mlat=${loc.lat}&mlon=${loc.lng}#map=18/${loc.lat}/${loc.lng}`;
    window.open(url, '_blank');
  };

  // Localized text for map provider buttons
  const { googleMapsText, appleMapsText, openStreetMapsText } = useLocalization();

  // Main render: notification popup, header, map, address/progress, missing fields, and actions
  return (
    <>
      <NotificationPopup
        type={popup.type}
        open={popup.open}
        title={popup.title}
        message={popup.message}
        onClose={() => setPopup((p) => ({ ...p, open: false }))}
      />
      <div
        className="property-form-verification-root"
        style={{ backgroundColor: 'white' }}
      >
        {/* Top Header Block */}
        <div className="verification-top-header">
          <div className="verification-title">{texts.propertyFormVerificationText}</div>
          <div className="verification-subtitle">
            <div className="form-subtitle">{texts.summaryInformationText}</div>
          </div>

          {/* Back to Home Button placed inside header */}
          <div
            className="verification-back-home header-back"
            onClick={handleBackHome}
            style={{ width: '200px' }}
          >
            <ArrowBackIosNewIcon className="back-arrow" fontSize="small" />
            <span className="back-text">{texts.backToHomeText}</span>
          </div>
        </div>
        <div className="property-form-container" style={{ padding: '4%' }}>
          {/* Property ID display */}
          <div className="property-id-header">
            {formData.propertyNo && (
              <span className="property-id-value" style={{ backgroundColor: 'white' }}>
                {formData.propertyNo?.toString()}
              </span>
            )}
          </div>

          {/* Map Container */}

          <div
            className="map-container-main"
            style={{ position: 'relative', minHeight: '400px' }}
          >
            {isMapLoading ? (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '8px',
                  zIndex: 1000,
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      border: '4px solid #f3f3f3',
                      borderTop: '4px solid #c84c03',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      margin: '0 auto 12px',
                    }}
                  />
                  <p style={{ color: '#666', fontSize: '14px' }}>Loading map...</p>
                </div>
              </div>
            ) : (
              isDataLoaded && (
                <LocationMapWithDrawing
                  center={[getLocationData().lat!, getLocationData().lng!]}
                  onLocationUpdate={() => {
                    /* verification map: no-op for readOnly */
                  }}
                  readOnly={true}
                  addressLabel={address}
                  initialShapes={formData.locationData?.drawnShapes}
                />
              )
            )}
          </div>

          {/* Map Provider Buttons */}
          <div className="map-provider-buttons">
            <button className="map-provider-btn" onClick={openGoogleMaps}>
              <LocationOnOutlinedIcon className="map-icon" />
              <span style={{ fontSize: '11px' }}>{googleMapsText}</span>
            </button>
            <button className="map-provider-btn" onClick={openAppleMaps}>
              <img
                src={appleMaps}
                alt="Apple Maps"
                style={{
                  width: '30px',
                  height: '30px',
                  alignItems: 'center',
                  pointerEvents: 'none',
                }}
              />
              {/* <PhoneIphoneIcon className="map-icon" /> */}
              <span style={{ fontSize: '11px' }}>{appleMapsText}</span>
            </button>
            <button className="map-provider-btn" onClick={openOpenStreetMap}>
              <img
                src={openStreetMaps}
                alt="Open Street Maps"
                style={{
                  width: '30px',
                  height: '30px',
                  alignItems: 'center',
                  pointerEvents: 'none',
                }}
              />
              {/* <PublicIcon className="map-icon" /> */}
              <span style={{ fontSize: '11px' }}>{openStreetMapsText}</span>
            </button>
          </div>

          <div className="verification-content">
            {/* Address Card */}
            <AddressProgressSection
              address={address}
              phoneNo={formData.owners?.[0]?.ContactNo}
              formCompletionPercent={formCompletionPercent}
              verificationCount={verificationFields.length}
              missingCount={missingFields.length}
              texts={texts}
            />

            {/* Alerts */}
            {missingFields.length > 0 && (
              <div className="card alert-card warning">
                <span className="alert-icon">
                  <CancelOutlinedIcon style={{ color: 'black', fontSize: '1.3rem' }} />
                </span>
                <span
                  style={{ fontWeight: '300' }}
                  className="alert-text"
                  title={missingLabelsStr}
                >
                  {missingFields.length} {texts.requiredFieldsMissingText}
                  {missingLabelsStr ? `: ${missingLabelsStr}` : ''}
                </span>
              </div>
            )}
            {/* {verificationFields.length > 0 && (
              <div className="card alert-card info">
                <span className="alert-icon">
                  <WarningAmberOutlinedIcon
                    style={{ color: 'black', fontSize: '1.3rem' }}
                  />
                </span>
                <span style={{ fontWeight: '300' }} className="alert-text">
                  {verificationFields.length} {texts.fieldsNeedVerificationText}
                </span>
              </div>
            )} */}

            {/* Missing Required Fields */}
            {missingFields.length > 0 && (
              <div className="card fields-section missing-section">
                <div
                  className="section-header missing-header orange-header"
                  style={{ marginTop: '8px', justifyContent: 'flex-start' }}
                >
                  <span className="section-icon">
                    <CancelOutlinedIcon style={{ color: '#c84c03' }} />
                  </span>
                  <span className="section-title">{texts.missingRequiredFieldsText}</span>
                </div>
                {missingFields.length === 0 && (
                  <div className="field-item" style={{ lineHeight: '1.2' }}>
                    {texts.noRequiredFieldsMissingText}
                  </div>
                )}
                {missingFields.map((field) => (
                  <div
                    className="field-item vertical-line"
                    style={{ marginBottom: '20px', borderRadius: 'none' }}
                    key={field.label}
                  >
                    <div className="field-info">
                      <div className="field-name bold">{field.label}</div>
                      <div className="field-description" style={{ lineHeight: '1.2' }}>
                        {field.section} <br></br> {field.desc}
                      </div>
                      {/* <div className="field-sub-description">{field.desc}</div> */}
                    </div>
                    {/* {field.avatar && <OwnerAvatar />} */}
                    <span className="field-status required-badge">
                      {texts.requiredText}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Fields Needing Verification */}
            {/* <div className="card fields-section verification-section">
              <div
                className="section-header verification-header orange-header"
                style={{ marginTop: '8px', justifyContent: 'flex-start' }}
              >
                <span className="section-icon">&#9888;</span>
                <span className="section-title">
                  {texts.fieldsNeedingVerificationText}
                </span>
              </div>
              {verificationFields.length === 0 && (
                <div className="field-item">{texts.noFieldsNeedVerificationText}</div>
              )}
              {verificationFields.map((field) => (
                <div
                  className="field-item vertical-line"
                  style={{ marginBottom: '20px' }}
                  key={field.label}
                >
                  <div className="field-info">
                    <div className="field-name bold">{field.label}</div>
                    <div className="field-description" style={{ lineHeight: '1.4' }}>
                      {field.section}
                      <br></br>
                      {field.desc}
                    </div>
                  </div>
                  <span className="field-status verification-badge">
                    {texts.needsVerificationText}
                  </span>
                </div>
              ))}
            </div> */}

            {/* Comment/Add Note Card */}
            <CommentOrNoteCard loc={texts} propertyId={propertyId} />

            {/* Continue Button */}
            <div
              className="action-section"
              style={{ display: 'flex', justifyContent: 'end' }}
            >
              <button
                className="continue-button orange-btn"
                style={{
                  display: 'grid',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                }}
                onClick={handleContinueToForm}
              >
                {texts.continueToFormText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Export the PropertyFormVerification component as default
export default PropertyFormVerification;
