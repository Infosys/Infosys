// PropertyInformationSubmitted: Agent view for displaying submitted property information summary, map, and details
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePropertyForm } from '../../../context/PropertyFormContext';
import { usePropertyApplications } from '../../../context/PropertyApplicationsContext';
import '../../../styles/PropertyInformationSubmitted.css';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import LocationMapWithDrawing from '../PropertyForm/LocationMapWithDrawing';
import appleMaps from '../../assets/Agent/Apple_Maps.svg';
import openStreetMaps from '../../assets/Agent/open_street_maps.svg';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import rectangle100Icon from '../../assets/Agent/Rectangle_100.svg';
import { usePropertyInformationSubmittedLocalization } from '../../../services/AgentLocalisation/localisation-propertyInformationSubmitted';

// Main component for property information submitted summary page
const PropertyInformationSubmitted: React.FC = () => {
  const navigate = useNavigate();
  const { propertyId } = useParams();
  const { formData, updateForm } = usePropertyForm();
  const { fullProperties, properties } = usePropertyApplications();
  const localization = usePropertyInformationSubmittedLocalization();

  // On mount: update form data with property details if available
  useEffect(() => {
    if (propertyId && fullProperties.length > 0) {
      const found = fullProperties.find(p => 
        p.propertyId === propertyId || 
        p.id === propertyId || 
        p.applicationNo === propertyId
      );
      if (found && found.property) {
        updateForm(found.property);
      }
    }
    // eslint-disable-next-line
  }, [propertyId, fullProperties]);

  // Get address from the property data or fallback to form data
  const getPropertyAddress = () => {
    const propertyItem = properties.find(p => 
      p.id === propertyId || 
      p.pId === propertyId
    );
    
    if (propertyItem && propertyItem.address) {
      return propertyItem.address;
    }
    
    const addressParts = [
      formData.propertyAddress?.Street,
      formData.propertyAddress?.Locality,
      formData.propertyAddress?.ZoneNo,
      formData.propertyAddress?.BlockNo,
      formData.propertyAddress?.WardNo,
      formData.propertyAddress?.PinCode
    ].filter(Boolean);
    
    return addressParts.length > 0 ? addressParts.join(', ') : 'Address not available';
  };

  const address = getPropertyAddress();
  
  // Get phone number from property data (for future use)
  // const getPhoneNumber = () => {
  //   const propertyItem = properties.find(p => p.id === propertyId || p.pId === propertyId);
  //   if (propertyItem && propertyItem.phoneNumber) {
  //     return propertyItem.phoneNumber;
  //   }
  //   return formData.owners?.[0]?.mobile || '';
  // };
  
  // const phoneNo = getPhoneNumber();

  // Navigate back to reviewed properties list
  const handleBackHome = () => {
    navigate('/reviewed-properties');
  };

  // Get location data for map display
  const getLocationData = () => {
    if (formData.locationData && formData.locationData.coordinates) {
      return formData.locationData.coordinates;
    }
    return { lat: 12.9716, lng: 77.5946 };
  };

  // Open external map providers in a new tab
  const openGoogleMaps = () => {
    const loc = getLocationData();
    const q = `${loc.lat},${loc.lng}`;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
    window.open(url, '_blank');
  };

    const openAppleMaps = () => {
    const loc = getLocationData();
    const coords = `${loc.lat},${loc.lng}`;
    const label = address && address !== 'Address not available' ? address : coords;
    const url = `https://maps.apple.com/?ll=${encodeURIComponent(coords)}&q=${encodeURIComponent(label)}`;
    window.open(url, '_blank');
  };

  const openOpenStreetMap = () => {
    const loc = getLocationData();
    const url = `https://www.openstreetmap.org/?mlat=${loc.lat}&mlon=${loc.lng}#map=18/${loc.lat}/${loc.lng}`;
    window.open(url, '_blank');
  };

  // Extract property form details from documents (fallback to empty fields)
  const propertyForm = formData.documents?.[0] || {
    documentType: '',
    no: '',
    constructionDate: '',
    mroProceedingNumber: '',
    mroProceedingDate: '',
    courtName: '',
    testatorAndTwoWitnessesSigned: false
  };

  // Extract uploaded document details for display
  const documents =
    formData.documents?.[0]?.files?.map((file, idx) => ({
      id: file.fileStoreId || (idx + 1).toString(),
      name: file.fileName,
      type: file.fileType,
      size: file.fileSize,
      uploadDate: file.dateOfUpload,
      status: 'uploaded'
    })) || [];

  // Extract owner details (first owner)
  const owner = formData.owners?.[0] || {};

  // Extract property address details (with fallback fields)
  const propertyAddress = formData.propertyAddress || {
    Locality: '',
    ZoneNo: '',
    WardNo: '',
    BlockNo: '',
    Street: '',
    ElectionWard: '',
    SecretariatWard: '',
    PinCode: '',
    DifferentCorrespondenceAddress: false,
    PropertyId: '',
    CorrespondenceAddress1: '',
    CorrespondenceAddress2: '',
    CorrespondencePincode: ''
  };

  // Main render: summary cards, map, details, and document list
  return (
    <div className="property-info-submitted-root">
      {/* Property Form Container */}
      <div className="property-form-container2">
        
        {/* Header Section */}
        <div style={{padding: '24px 20px 8px 20px'}}>
          <button
            onClick={handleBackHome}
            aria-label="Back"
            className="previous-button"
          >
            <ArrowBackIosNewIcon style={{ fontSize: '18px', color: '#C84C0E' }} />
            <span>{localization.previousText}</span>
          </button>
          <h1 className="page-title" style={{margin: '8px 0 0 0'}}>
            {localization.propertyInformationSubmittedText}
          </h1>
        </div>

        {/* Property ID just above the map */}
        {propertyId && (
          <div className="property-id-display" style={{padding: '0 20px', marginBottom: '12px'}}>{propertyId}</div>
        )}

        {/* Map and Buttons Section */}
        <div className="map-section">
          {/* Map Container */}
          <div className="map-container-main">
            <LocationMapWithDrawing
              center={[getLocationData().lat!, getLocationData().lng!]}
              onLocationUpdate={() => { /* readOnly */ }}
              readOnly={true}
              addressLabel={address}
            />
          </div>
          
          {/* Map Provider Buttons */}
          <div className="map-provider-buttons">
            <button className="map-provider-btn" onClick={openGoogleMaps}>
              <LocationOnOutlinedIcon className="map-icon" />
              <span style={{fontSize:'11px'}}>{localization.googleMapsText}</span>
            </button>
            <button className="map-provider-btn" onClick={openAppleMaps}>
              <img 
                src={appleMaps} 
                alt="Apple Maps" 
                style={{
                  width: '30px',
                  height: '30px',
                  alignItems: 'center',
                  pointerEvents: 'none'
                }}
              />
              <span style={{fontSize:'11px'}}>{localization.appleMapsText}</span>
            </button>
            <button className="map-provider-btn" onClick={openOpenStreetMap}>
              <img 
                src={openStreetMaps} 
                alt="Open Street Maps" 
                style={{
                  width: '30px',
                  height: '30px',
                  alignItems: 'center',
                  pointerEvents: 'none'
                }}
              />
              <span style={{fontSize:'11px'}}>{localization.openStreetMapsText}</span>
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
                <div className="detail-value">{propertyForm.documentType || localization.propertyTypeText}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">{localization.zoneWardText} :</div>
                <div className="detail-value">{propertyAddress.ZoneNo || localization.zoneWardText}, {propertyAddress.WardNo || localization.zoneWardText}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">{localization.doorNoText} :</div>
                <div className="detail-value">{formData.isgrDetails?.doorNoFrom || localization.doorNoText}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">{localization.plotAreaText} :</div>
                <div className="detail-value">{formData.assessmentDetails?.ExtentOfSite || '1,200'} {localization.plotAreaText}</div>
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
                <div className="detail-value">{formData.isgrDetails?.igrsWard || localization.surveyNumberText}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">{localization.subDivisionText}:</div>
                <div className="detail-value">{formData.isgrDetails?.igrsBlock || localization.subDivisionText}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">{localization.gisReferenceText}:</div>
                <div className="detail-value">{formData.isgrDetails?.igrsLocality || localization.gisReferenceText}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">{localization.cadastralMapText}:</div>
                <div className="detail-value">{formData.isgrDetails?.habitation || localization.cadastralMapText}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">{localization.igrsRegistrationText}:</div>
                <div className="detail-value">{formData.isgrDetails?.doorNoFrom || localization.igrsRegistrationText}</div>
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
                <div className="detail-value">{owner.Name || localization.ownerNameText}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">{localization.mobileNumberText}:</div>
                <div className="detail-value">{owner.ContactNo || localization.mobileNumberText}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">{localization.emailText}:</div>
                <div className="detail-value">{owner.Email || localization.emailText}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">{localization.addressText}:</div>
                <div className="detail-value">{propertyAddress.Locality || localization.addressText}</div>
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
                <div className="detail-value">{formData.assessmentDetails?.ReasonOfCreation || localization.buildingUsageText}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">{localization.constructionYearText}:</div>
                <div className="detail-value">{formData.assessmentDetails?.OccupancyCertificateDate || localization.constructionYearText}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">{localization.floorCountText}:</div>
                <div className="detail-value">{formData.floors?.length || '2'} {localization.floorCountText}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">{localization.builtupAreaText}:</div>
                <div className="detail-value">{formData.floors?.reduce((acc, floor) => acc + (Number(floor.plinthArea) || 0), 0) || 2400} {localization.builtupAreaText}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">{localization.annualRentalValueText}:</div>
                <div className="detail-value">{localization.annualRentalValueText}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">{localization.propertyTaxZoneText}:</div>
                <div className="detail-value property-tax-zone">{localization.propertyTaxZoneText}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">{localization.assessmentStatusText}:</div>
                <div className="detail-value">{localization.assessmentStatusText}</div>
              </div>
              <div className="detail-row notes-section">
                <div className="detail-label">{localization.notesText} :</div>
                <div className="notes-text">{localization.notesText}</div>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="documents-section">
            <div className="documents-title">{localization.documentsUploadedText} :</div>
            <div className="document-icons">
              {documents.map((d) => (
                <div key={d.id} className="document-icon">
                  <div className="doc-icon">
                    <img src={rectangle100Icon} alt="Document" className="edit-icon" />
                  </div>
                  <div className="doc-label" style={{marginTop:'10px'}}>{d.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Back Button */}
          <div className="action-section">
            <button className="back-button orange-btn" 
              onClick={handleBackHome}>
              {localization.backText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


// Export the PropertyInformationSubmitted component as default
export default PropertyInformationSubmitted;
