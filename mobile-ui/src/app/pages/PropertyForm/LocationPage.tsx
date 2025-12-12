import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import '../../../styles/Agent/LocationPage.css';
import '../../../styles/LocationPage.css';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import { SiOpenstreetmap } from 'react-icons/si';
import { BsPinMap } from 'react-icons/bs';
import Layout from '../../features/Agent/components/Layout';
import { fetchData } from '../../../services/dataService';
import { useAppLocalization } from '../../../services/AgentLocalisation/localisation-search-property';
import type { DatabaseData } from '../../../services/dataService';

// Type for location data
interface Location {
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// Props for LocationPage component
interface LocationPageProps {
  location?: Location;
  phoneNumber?: string;
  onBack?: () => void;
}

// Main component for displaying property location details
const LocationPage: React.FC<LocationPageProps> = ({
  location: propLocation,
  phoneNumber = '+91 39243 22342',
  onBack,
}) => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();
  const localization = useAppLocalization();
  const [, setData] = useState<DatabaseData | null>(null);
  const [location, setLocation] = useState<Location>(
    propLocation || { address: 'Loading...', coordinates: { lat: 0, lng: 0 } }
  );

  // Fetch property data if propertyId is provided
  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedData = await fetchData();
        setData(fetchedData);

        if (propertyId && fetchedData?.properties) {
          const selectedProperty = fetchedData.properties.find(
            (p) => p.id === propertyId
          );
          if (selectedProperty) {
            setLocation({
              address: selectedProperty.address,
              coordinates: { lat: 16.2973, lng: 80.4364 }, // Default coordinates
            });
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    if (!propLocation || propertyId) {
      loadData();
    }
  }, [propertyId, propLocation]);

  // Handle back navigation
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1); // Go back to previous page
    }
  };
  // Handle map action button clicks (Google, Apple, OpenStreetMap)
  const handleMapAction = (type: 'google' | 'apple' | 'street') => {
    // Handle different map actions
    console.log(`Opening ${type} maps for:`, location.address);
  };

  // Handle phone call button click
  const handleCall = () => {
    window.open(`tel:${phoneNumber}`);
  };

  // Main render: layout, map, address, map actions, and phone info
  return (
    <Layout
      activeTab="home"
      onTabChange={() => {}} // No tab change needed on location page
      showHeader={false}
      showNavigation={false}
      headerProps={{
        title: localization.locationPageTitle,
        showBackButton: true,
        onBack: handleBack,
        showHome: true,
        onHome: () => navigate('/'),
        showLanguage: false,
        showProfile: false,
      }}
    >
      <div className="location-page">
        {/* Map Container */}
        <div className="map-container">
          <div className="map-placeholder">
            {/* Map background with location pin */}
            <div className="map-background">
              <div className="location-pin">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
              </div>
            </div>

            {/* Location Info Tooltip */}
            <div className="location-tooltip">
              <div className="tooltip-content">
                <p className="location-name">Veroja QLD 4105, Australia</p>
                <p className="phone-info">
                  {localization.phonePrefixText}: 0540 792 235 756
                </p>
                <button className="directions-btn">{localization.directionsText}</button>
              </div>
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="address-section">
          <div className="address-header">
            <h2>{localization.addressText}</h2>
            <button
              className="location-action-btn"
              style={{ borderRadius: '10' }}
              aria-label="Location actions"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.49979 8.49998H10.9998V9.43448C10.9998 9.59098 11.071 9.70131 11.2133 9.76548C11.3556 9.82948 11.4845 9.80381 11.5998 9.68848L12.8575 8.43073C12.9805 8.30423 13.042 8.15656 13.042 7.98773C13.042 7.81889 12.978 7.67123 12.8498 7.54473L11.5998 6.31148C11.4845 6.19614 11.3556 6.16681 11.2133 6.22348C11.071 6.27998 10.9998 6.38756 10.9998 6.54623V7.49998H6.30754C6.07871 7.49998 5.88688 7.57739 5.73204 7.73223C5.57721 7.88706 5.49979 8.07889 5.49979 8.30773V11C5.49979 11.1416 5.54779 11.2604 5.64379 11.3562C5.73979 11.4521 5.85871 11.5 6.00054 11.5C6.14238 11.5 6.26104 11.4521 6.35654 11.3562C6.45204 11.2604 6.49979 11.1416 6.49979 11V8.49998ZM9.00354 17.7307C8.80238 17.7307 8.60363 17.6903 8.40729 17.6095C8.21096 17.5288 8.03154 17.4077 7.86904 17.2462L0.753543 10.1307C0.592043 9.96973 0.470959 9.79198 0.390293 9.59748C0.309459 9.40298 0.269043 9.20506 0.269043 9.00373C0.269043 8.80256 0.309459 8.60381 0.390293 8.40748C0.470959 8.21114 0.592043 8.03173 0.753543 7.86923L7.86904 0.753726C8.03004 0.592226 8.20779 0.471142 8.40229 0.390475C8.59679 0.309642 8.79471 0.269226 8.99604 0.269226C9.19721 0.269226 9.39596 0.309642 9.59229 0.390475C9.78863 0.471142 9.96804 0.592226 10.1305 0.753726L17.246 7.86923C17.4075 8.03023 17.5286 8.20798 17.6093 8.40248C17.6901 8.59698 17.7305 8.79489 17.7305 8.99623C17.7305 9.19739 17.6901 9.39614 17.6093 9.59248C17.5286 9.78881 17.4075 9.96823 17.246 10.1307L10.1305 17.2462C9.96954 17.4077 9.79179 17.5288 9.59729 17.6095C9.40279 17.6903 9.20488 17.7307 9.00354 17.7307ZM8.57679 16.577C8.69213 16.6923 8.83313 16.75 8.99979 16.75C9.16646 16.75 9.30746 16.6923 9.42279 16.577L16.5768 9.42298C16.6921 9.30764 16.7498 9.16664 16.7498 8.99998C16.7498 8.83331 16.6921 8.69231 16.5768 8.57698L9.42279 1.42298C9.30746 1.30764 9.16646 1.24998 8.99979 1.24998C8.83313 1.24998 8.69213 1.30764 8.57679 1.42298L1.42279 8.57698C1.30746 8.69231 1.24979 8.83331 1.24979 8.99998C1.24979 9.16664 1.30746 9.30764 1.42279 9.42298L8.57679 16.577Z"
                  fill="#1C1B1F"
                />
              </svg>
            </button>
          </div>

          <p className="address-text">{location.address}</p>

          {/* Map Action Buttons */}
          <div className="map-actions">
            <button className="map-action-btn" onClick={() => handleMapAction('google')}>
              <div className="action-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
              </div>
              <span>{localization.googleMapsText}</span>
            </button>

            <button className="map-action-btn" onClick={() => handleMapAction('apple')}>
              <div className="action-icon">
                <BsPinMap />
              </div>
              <span>{localization.appleMapsText}</span>
            </button>

            <button className="map-action-btn" onClick={() => handleMapAction('street')}>
              <div className="action-icon">
                <SiOpenstreetmap />
              </div>
              <span>{localization.openStreetMapsText}</span>
            </button>
          </div>

          {/* Phone Section */}
          <div className="phone-section">
            <div className="phone-header">
              <h3>{localization.phoneNumberText}</h3>
            </div>

            <div className="phone-item">
              <span className="phone-number">{phoneNumber}</span>
              <button
                className="call-btn"
                onClick={handleCall}
                aria-label={localization.callButtonText}
              >
                <LocalPhoneOutlinedIcon style={{ tabSize: '12px' }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LocationPage;
