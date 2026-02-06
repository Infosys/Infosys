// PropertyLocationView.tsx
// This page displays the map location for a citizen's property, with address and navigation controls.
// Features:
//   - Gets property data from route state
//   - Redirects back if no property data is present
//   - Shows address and map location using LocationMapWithDrawing
//   - Back button to return to previous page
// Used in: Citizen workflow for viewing property location on a map

import { useLocation, useNavigate } from 'react-router-dom';
import '../../../styles/PropertyFormVerification.css';

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import LocationMapWithDrawing from '../../../components/LocationMapWithDrawing';
import { useEffect } from 'react';

const PropertyLocationView: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const property = location.state?.property;
  const address = property
    ? [
        property.Address?.Street,
        property.Address?.Locality,
        property.Address?.WardNo,
        property.Address?.ZoneNo,
        property.Address?.BlockNo,
        property.Address?.PinCode,
      ]
        .filter(Boolean)
        .join(', ')
    : '';

  useEffect(() => {
    if (!property) navigate(-1);
  }, [property, navigate]);

  if (!property) return null;

  const coordinates = property.GISData || property.propertyDetails.GISData;
  const lat = coordinates?.Latitude;
  const lng = coordinates?.Longitude;

  if (!lat || !lng) {
    return (
      <div className="property-form-verification-root">
        <div className="verification-top-header">
          <div className="verification-title">Property Location</div>
          <div className="verification-subtitle">
            <em>View Property Location</em>
          </div>
          <div className="verification-back-home" onClick={() => navigate(-1)}>
            <ArrowBackIosNewIcon className="back-arrow" fontSize="small" />
            <span className="back-text">Previous</span>
          </div>
        </div>
        <div className="property-form-container">
          <div className="card address-progress-card">
            <div className="address-progress-main">
              <div className="address-progress-label">Error:</div>
              <div className="address-progress-value">
                No location coordinates available for this property.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleBack = () => navigate(-1);

  return (
    <div className="property-form-verification-root">
      <div className="verification-top-header">
        <div className="verification-title">Property Location</div>
        <div className="verification-subtitle">
          <em>View Property Location</em>
        </div>
        <div className="verification-back-home" onClick={handleBack}>
          <ArrowBackIosNewIcon className="back-arrow" fontSize="small" />
          <span className="back-text">Previous</span>
        </div>
      </div>

      <div className="property-form-container">
        <div className="card address-progress-card">
          <div className="address-progress-main">
            <div className="address-progress-label">Address:</div>
            <div className="address-progress-value">
              {property.locationData?.address || address || 'N/A'}
            </div>
          </div>
        </div>

        <div
          className="map-container"
          style={{
            height: 'calc(100vh - 280px)',
            width: '100%',
            marginTop: '16px',
            backgroundColor: '#f0f0f0',
            border: '1px solid #ccc',
            borderRadius: '8px',
          }}
        >
          <LocationMapWithDrawing
            center={[lat, lng]}
            readOnly={true}
            onLocationUpdate={(lat: number, lng: number, address: string) => {
              console.log('Location updated:', { lat, lng, address });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyLocationView;
