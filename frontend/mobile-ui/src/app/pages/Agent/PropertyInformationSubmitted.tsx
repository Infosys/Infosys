// PropertyInformationSubmitted: Agent view for displaying submitted property information summary, map, and details
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePropertyForm } from '../../../context/PropertyFormContext';
import { usePropertyApplications } from '../../../context/PropertyApplicationsContext';
import '../../../styles/PropertyInformationSubmitted.css';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import LocationMapWithDrawing from '../PropertyForm/LocationMapWithDrawing';
import appleMaps from '../../assets/Agent/Apple_Maps.svg';
import openStreetMaps from '../../assets/Agent/open_street_maps.svg';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { usePropertyInformationSubmittedLocalization } from '../../../services/AgentLocalisation/localisation-propertyInformationSubmitted';
import { fetchPropertyDetails } from '../../features/Agent/api/fetchProperty.hooks';
import { useLazyGetApplicationByIdQuery } from '../../../redux/apis/applicationApi';
import { useLazyGetOwnersByPropertyIdQuery } from '../../../redux/apis/ownerApi';
import type { AlertType } from '../../models/AlertType.model';
import { NotificationPopup } from '../../components/Popup/NotificationPopup';
import LoadingPage from '../../components/Loader';
import rectangle100Icon from '../../assets/Agent/Rectangle_100.svg';
import { useLazyGetFileFromFilestoreQuery } from '../../../redux/apis/fileStoreApi';

// Main component for property information submitted summary page
const PropertyInformationSubmitted: React.FC = () => {
  const navigate = useNavigate();
  const { propertyId } = useParams();
  const { formData, updateForm } = usePropertyForm();
  const { fullProperties, properties } = usePropertyApplications();
  const localization = usePropertyInformationSubmittedLocalization();
  // State for map loading and data loading
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [getApplicationById] = useLazyGetApplicationByIdQuery();
  const [getOwnerByPropId] = useLazyGetOwnersByPropertyIdQuery();
  const [getFileFromFilestore] = useLazyGetFileFromFilestoreQuery();

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

  const handleDocumentClick = async (doc: any) => {
    if (!doc.fileStoreId) {
      showErrorPopup('File not found');
      return;
    }

    try {
      const result = await getFileFromFilestore({
        fileStoreId: doc.fileStoreId,
        tenantId: 'pg',
      }).unwrap();

      const blob = result;
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
      
      // Clean up the URL after a delay
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error('Error opening document:', error);
      showErrorPopup('Unable to open file. Please try again.');
    }
  };

  // On mount: update form data with property details if available
  useEffect(() => {
    if (propertyId && fullProperties.length > 0) {
      const found = fullProperties.find(
        (p) =>
          p.propertyId === propertyId ||
          p.id === propertyId ||
          p.applicationNo === propertyId
      );
      if (found?.property) {
        updateForm(found.property);
      }
    }
    // eslint-disable-next-line
  }, [propertyId, fullProperties]);

  useEffect(() => {
    let applicationId;
    let propertyId;

    applicationId = localStorage.getItem('applicationId')!;
    propertyId = localStorage.getItem('propertyId')!;

    if (!propertyId) {
      navigate('/agent');
      return;
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
  }, []);

  // Get address from the property data or fallback to form data - NOW REACTIVE
  const address = useMemo(() => {
    const propertyItem = properties.find(
      (p) => p.id === propertyId || p.pId === propertyId
    );

    if (propertyItem?.address) {
      return propertyItem.address;
    }

    const addressParts = [
      formData.propertyAddress?.Street,
      formData.propertyAddress?.Locality,
      formData.propertyAddress?.ZoneNo,
      formData.propertyAddress?.BlockNo,
      formData.propertyAddress?.WardNo,
      formData.propertyAddress?.PinCode,
    ].filter(Boolean);

    return addressParts.length > 0 ? addressParts.join(', ') : 'Address not available';
  }, [formData.propertyAddress, properties, propertyId]);

  // Calculate total built-up area from all floors - NOW REACTIVE
  const totalBuiltUpArea = useMemo(() => {
    if (!formData.floors || formData.floors.length === 0) {
      return formData.isgrDetails?.builtUpAreaPct || 0;
    }
    const total = formData.floors.reduce(
      (sum, floor) => sum + (floor.plinthArea || 0),
      0
    );
    return total;
  }, [formData.floors, formData.isgrDetails?.builtUpAreaPct]);

  // Calculate annual rental value (if applicable) - NOW REACTIVE
  const annualRentalValue = useMemo(() => {
    return 'N/A';
  }, []);

  // Get property tax zone - NOW REACTIVE
  const propertyTaxZone = useMemo(() => {
    return formData.propertyAddress?.ZoneNo || 'N/A';
  }, [formData.propertyAddress?.ZoneNo]);

  // Navigate back to reviewed properties list
  const handleBackHome = () => {
    navigate(-1);
  };

  // Get location data for map display - NOW REACTIVE
  const locationData = useMemo(() => {
    if (formData.locationData?.coordinates) {
      return formData.locationData.coordinates;
    }
    return { lat: 12.9716, lng: 77.5946 };
  }, [formData.locationData]);

  // Open external map providers in a new tab
  const openGoogleMaps = () => {
    const loc = locationData;
    const q = `${loc.lat},${loc.lng}`;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      q
    )}`;
    window.open(url, '_blank');
  };

  const openAppleMaps = () => {
    const loc = locationData;
    const coords = `${loc.lat},${loc.lng}`;
    const label = address && address !== 'Address not available' ? address : coords;
    const url = `https://maps.apple.com/?ll=${encodeURIComponent(
      coords
    )}&q=${encodeURIComponent(label)}`;
    window.open(url, '_blank');
  };

  const openOpenStreetMap = () => {
    const loc = locationData;
    const url = `https://www.openstreetmap.org/?mlat=${loc.lat}&mlon=${loc.lng}#map=18/${loc.lat}/${loc.lng}`;
    window.open(url, '_blank');
  };

  // Extract owner details (first owner) - NOW REACTIVE
  const owner = useMemo(() => {
    return formData.owners?.[0] || {};
  }, [formData.owners]);

  // Extract property address details (with fallback fields) - NOW REACTIVE
  const propertyAddress = useMemo(() => {
    return formData.propertyAddress || {
      Locality: '',
      ZoneNo: '',
      WardNo: '',
      BlockNo: '',
      Street: '',
      ElectionWard: '',
      SecretariatWard: '',
      PinCode: '',
      DifferentCorrespondenceAddress: false,
      CorrespondenceAddress1: '',
      CorrespondenceAddress2: '',
      CorrespondencePincode: '',
    };
  }, [formData.propertyAddress]);

  if(isMapLoading || isDataLoaded === false){
    return <LoadingPage />;
  }

  // Main render: summary cards, map, details, and document list
  return (
    <>
      <NotificationPopup
        type={popup.type}
        open={popup.open}
        title={popup.title}
        message={popup.message}
        onClose={() => setPopup((p) => ({ ...p, open: false }))}
      />
      <div className="property-info-submitted-root">
        {/* Property Form Container */}
        <div className="property-form-container2">
          {/* Header Section */}
          <div style={{ padding: '24px 20px 8px 20px' }}>
            <button
              onClick={handleBackHome}
              aria-label="Back"
              className="previous-button"
            >
              <ArrowBackIosNewIcon style={{ fontSize: '18px', color: '#C84C0E' }} />
              <span>{localization.previousText}</span>
            </button>
            <h1 className="page-title" style={{ margin: '8px 0 0 0' }}>
              {localization.propertyInformationSubmittedText}
            </h1>
          </div>

          {/* Property ID just above the map */}
          {(propertyId || formData.propertyNo) && (
            <div
              className="property-id-display"
              style={{ padding: '0 20px', marginBottom: '12px' }}
            >
              {propertyId || formData.propertyNo}
            </div>
          )}

          {/* Map and Buttons Section */}
          <div className="map-section">
            {/* Map Container */}
            <div className="map-container-main">
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
                        borderTop: '4px solid #C84C0E',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 10px',
                      }}
                    />
                    <p style={{ color: '#666', fontSize: '14px' }}>Loading map...</p>
                  </div>
                </div>
              ) : (
                isDataLoaded && (
                  <LocationMapWithDrawing
                    center={[locationData.lat!, locationData.lng!]}
                    onLocationUpdate={() => {
                      /* readOnly */
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
                <span style={{ fontSize: '11px' }}>{localization.googleMapsText}</span>
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
                <span style={{ fontSize: '11px' }}>{localization.appleMapsText}</span>
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
                <span style={{ fontSize: '11px' }}>
                  {localization.openStreetMapsText}
                </span>
              </button>
            </div>
          </div>

          {/* Lower part - from PropertySummary */}
          <div className="summary-content">
            {/* Property Details Card */}
            <div className="summary-section">
              <div className="section-header">
                <div className="section-title">{localization.propertyDetailsText}</div>
              </div>
              <div className="section-content">
                <div className="detail-row">
                  <div className="detail-label">{localization.propertyTypeText} :</div>
                  <div className="detail-value">{formData.propertyType || 'N/A'}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">{localization.zoneWardText} :</div>
                  <div className="detail-value">
                    Zone {propertyAddress.ZoneNo || 'N/A'}, Ward{' '}
                    {propertyAddress.WardNo || 'N/A'}
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">{localization.doorNoText} :</div>
                  <div className="detail-value">
                    {formData.isgrDetails?.doorNoFrom || 'N/A'}
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">{localization.plotAreaText} :</div>
                  <div className="detail-value">
                    {formData.assessmentDetails?.ExtentOfSite || 'N/A'} sq.ft
                  </div>
                </div>
              </div>
            </div>

            {/* IGSR Details Card */}
            <div className="summary-section">
              <div className="section-header">
                <div className="section-title">{localization.igsrDetailsText}</div>
              </div>
              <div className="section-content">
                <div className="detail-row">
                  <div className="detail-label">{localization.surveyNumberText}:</div>
                  <div className="detail-value">
                    {formData.isgrDetails?.igrsWard || 'N/A'}
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">{localization.subDivisionText}:</div>
                  <div className="detail-value">
                    {formData.isgrDetails?.igrsBlock || 'N/A'}
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">{localization.gisReferenceText}:</div>
                  <div className="detail-value">
                    {formData.isgrDetails?.igrsLocality || 'N/A'}
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">{localization.cadastralMapText}:</div>
                  <div className="detail-value">
                    {formData.isgrDetails?.habitation || 'N/A'}
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">{localization.igrsRegistrationText}:</div>
                  <div className="detail-value">
                    {formData.isgrDetails?.doorNoFrom || 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            {/* Owner Information Card */}
            <div className="summary-section">
              <div className="section-header">
                <div className="section-title">{localization.ownerInformationText}</div>
              </div>
              <div className="section-content">
                <div className="detail-row">
                  <div className="detail-label">{localization.ownerNameText}:</div>
                  <div className="detail-value">{owner.Name || 'N/A'}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">{localization.mobileNumberText}:</div>
                  <div className="detail-value">{owner.ContactNo || 'N/A'}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">{localization.emailText}:</div>
                  <div className="detail-value">{owner.Email || 'N/A'}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">{localization.addressText}:</div>
                  <div className="detail-value">{propertyAddress.Locality || 'N/A'}</div>
                </div>
              </div>
            </div>

            {/* Assessment Details Card */}
            <div className="summary-section">
              <div className="section-header">
                <div className="section-title">{localization.assessmentDetailsText}</div>
              </div>
              <div className="section-content">
                <div className="detail-row">
                  <div className="detail-label">{localization.buildingUsageText}:</div>
                  <div className="detail-value">
                    {formData.assessmentDetails?.ReasonOfCreation || 'N/A'}
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">{localization.constructionYearText}:</div>
                  <div className="detail-value">
                    {formData.assessmentDetails?.OccupancyCertificateDate || 'N/A'}
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">{localization.floorCountText}:</div>
                  <div className="detail-value">
                    {formData.noOfFloors ?? 'N/A'}
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">{localization.builtupAreaText}:</div>
                  <div className="detail-value">{totalBuiltUpArea} sq.ft</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">
                    {localization.annualRentalValueText}:
                  </div>
                  <div className="detail-value">{annualRentalValue}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">{localization.propertyTaxZoneText}:</div>
                  <div className="detail-value property-tax-zone">
                    {propertyTaxZone}
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Extent Of Site: </div>
                  <div className="detail-value">
                    {formData.assessmentDetails?.ExtentOfSite || 'N/A'}
                  </div>
                </div>
                <div className="detail-row notes-section">
                  <div className="detail-label">{localization.notesText} :</div>
                  <div className="notes-text">
                    {formData.importantNotes || 'No notes available'}
                  </div>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="documents-section">
              <div className="documents-title">
                {localization.documentsUploadedText} :
              </div>
              <div className="document-icons-list">
                {formData.documents && formData.documents.length > 0 ? (
                  (formData.documents as any[]).map((doc) => (
                    <div key={doc.id} className="document-icon" onClick={() => handleDocumentClick(doc)}>
                      <div className="">
                        <img
                          src={rectangle100Icon}
                          alt="Document"
                          className="edit-icon"
                        />
                      </div>
                      <div className="doc-label" style={{ marginTop: '10px' }}>
                        {doc.name}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ color: '#666', fontSize: '14px' }}>
                    No documents uploaded
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Export the PropertyInformationSubmitted component as default
export default PropertyInformationSubmitted;