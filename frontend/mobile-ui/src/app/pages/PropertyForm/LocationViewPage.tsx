// LocationViewPage: Read-only view for displaying saved property location, map, and drawn shapes
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { usePropertyForm } from '../../../context/PropertyFormContext';
import LocationMapWithDrawing from './LocationMapWithDrawing';
import '../../../styles/LocationSelection.css';
import { useLocationViewLocalization } from '../../../services/AgentLocalisation/localisation-locationview';


// Main component for viewing property location and drawn shapes in read-only mode
const LocationViewPage: React.FC = () => {
  const navigate = useNavigate();
  const { formData } = usePropertyForm();
  
  // Localization
  const {
    previousText,
    newPropertyFormText,
    addLocationText,
    searchPlaceholderText,
    mapInstructionText,
    noShapesMessageText,
    selectedLocationText,
    mainLocationText,
    additionalMarkedAreasText,
    pinText,
    rectangleText,
    polygonText,
    verticesText,
    noAdditionalAreasText,
    locationSavedOnText,
    atText,
    confirmLocationText
  } = useLocationViewLocalization();


  // Handle back navigation
  const handleBack = () => {
    navigate(-1);
  };

  // If no location data, redirect back
  // If no location data, redirect back
  if (!formData.locationData) {
    navigate(-1);
    return null;
  }

  // Extract location data from form
  const { locationData } = formData;

  // Main render: header, map, address, drawn shapes summary, and confirm button
  return (
    <div className="location-selection-container">
      {/* Header */}
      <div className="location-header">
        <div className="header-content">
          <button className="back-button" onClick={handleBack}>
            <ArrowBackIosNewIcon style={{ fontSize: '16px', color: '#C84C0E' }} />
            <span className="back-text">{previousText}</span>
          </button>
          <h1 className="form-title">{newPropertyFormText}</h1>
          <p className="form-subtitle">{addLocationText}</p>
        </div>
      </div>

      {/* Map Container */}
      <div className="map-wrapper">
        {/* Search Bar */}
        <div className="search-bar-container">
          <div className="search-bar">
            <input 
              type="text" 
              placeholder={searchPlaceholderText}
              className="search-input"
            />
            <div className="search-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Map Instruction */}
        <div className="map-instruction">
          <p>{mapInstructionText}</p>
        </div>

        <div className="location-map-container">
          <LocationMapWithDrawing
            center={[locationData.coordinates?.lat!, locationData.coordinates?.lng!]}
            onLocationUpdate={() => {}} // Read-only mode - no updates
            initialShapes={locationData.drawnShapes || []}
            readOnly={true}
          />
        </div>
        
        {/* No shapes message */}
        {(!locationData.drawnShapes || locationData.drawnShapes.length === 0) && (
          <div className="no-shapes-message" style={{
            position: 'absolute',
            top: '140px',
            left: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.95)',
            padding: '12px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            fontSize: '14px',
            color: '#666',
            textAlign: 'center',
            zIndex: 1000
          }}>
            {noShapesMessageText}
          </div>
        )}
      </div>

      {/* Bottom Panel */}
      <div className="location-bottom-panel">
        <div className="selected-location-section">
          <h3>{selectedLocationText}</h3>
          <div className="location-address">
            <p>{locationData.address}</p>
          </div>
          <div className="location-coordinates">
            <p style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
              {mainLocationText}: {locationData.coordinates?.lat!.toFixed(6)}°, {locationData.coordinates?.lng!.toFixed(6)}°
            </p>
          </div>
          
          {/* Drawn Shapes Summary */}
          {locationData.drawnShapes && locationData.drawnShapes.length > 0 ? (
            <div className="drawn-shapes-summary">
              <h4 style={{ fontSize: '14px', color: '#C84C0E', margin: '12px 0 8px 0' }}>
                {additionalMarkedAreasText} ({locationData.drawnShapes.length})
              </h4>
              {locationData.drawnShapes.map((shape, index) => (
                <div key={index} style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>
                  <div style={{ fontWeight: '500' }}>
                    {shape.type === 'point' ? (
                      `${pinText} ${index + 1}`
                    ) : shape.type === 'rectangle' ? (
                      `${rectangleText} ${index + 1}${shape.area ? ` (${(shape.area / 1000000).toFixed(3)} km²)` : ''}`
                    ) : (
                      `${polygonText} ${index + 1}${shape.area ? ` (${(shape.area / 1000000).toFixed(3)} km²)` : ''}`
                    )}
                  </div>
                  {shape.address && (
                    <div style={{ fontSize: '12px', color: '#888', marginTop: '2px', marginLeft: '12px' }}>
                      📍 {shape.address}
                    </div>
                  )}
                  {shape.coordinates && (
                    <div style={{ fontSize: '11px', color: '#999', marginTop: '2px', marginLeft: '12px' }}>
                      🌐 {
                        shape.type === 'point' 
                          ? `${(shape.coordinates as number[])[1].toFixed(6)}°, ${(shape.coordinates as number[])[0].toFixed(6)}°`
                          : `${(shape.coordinates as number[][]).length} ${verticesText}`
                      }
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: '13px', color: '#888', marginTop: '12px', fontStyle: 'italic' }}>
              {noAdditionalAreasText}
            </div>
          )}

          {locationData.timestamp && (
            <div style={{ fontSize: '12px', color: '#C8504B', marginTop: '12px', fontStyle: 'italic' }}>
              {locationSavedOnText} {new Date(locationData.timestamp).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit', 
                year: 'numeric'
              })} {atText} {new Date(locationData.timestamp).toLocaleTimeString('en-GB', { 
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit'
              })}
            </div>
          )}
        </div>

        <button 
          className="confirm-location-btn"
          onClick={handleBack}
        >
          {confirmLocationText}
        </button>
      </div>
    </div>
  );
};

export default LocationViewPage;