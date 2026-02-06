
// PropertyList displays a list of properties for the citizen user, mapping application summaries to property cards.
import React from 'react';
import type { CitizenApplicationSummary } from '../../Citizen/api/CitizenHomePageApi/CitizenHomePageModel';
import PropertyCard from './PropertyComponent';



// Helper function to map application summaries to property card data structure
function mapApplicationsToProperties(applications: CitizenApplicationSummary[]) {
  return applications.map(app => {
    const property = app.Property || {};
    // Extract coordinates from GISData if available
    const coordsArr = property.GISData?.Coordinates || [];
    const coordinates = (Array.isArray(coordsArr) && coordsArr.length > 0)
      ? {
          lat: coordsArr[0]?.Latitude ?? 0,
          lng: coordsArr[0]?.Longitude ?? 0,
        }
      : { lat: 0, lng: 0 };

    // Compose address string from address fields
    const addressObj = property.Address || {};

    return {
      applicationId: app.ID, // Application ID
      id: property.ID, // Property ID
      status: app.Status || '', // Application status
      locationData: {
        address: [
          addressObj.BlockNo,
          addressObj.Locality,
          addressObj.Street,
          addressObj.WardNo,
          addressObj.ZoneNo,
          addressObj.PinCode
        ].filter(Boolean).join(', ') || property.ComplexName || '',
        coordinates,
        BlockNo: addressObj.BlockNo || '',
        Locality: addressObj.Locality || '',
        PinCode: addressObj.PinCode || '',
        Street: addressObj.Street || '',
        WardNo: addressObj.WardNo || '',
        ZoneNo: addressObj.ZoneNo || '',
      },
      propertyDetails: property, // Full property details
    };
  });
}


// PropertyList: Maps CitizenApplicationSummary[] to PropertyCard shape,
// passing the mapped property object to each PropertyCard.
const PropertyList: React.FC<{ properties: CitizenApplicationSummary[] }> = ({ properties }) => {
  // Map incoming application summaries to property card data
  const mappedProperties = mapApplicationsToProperties(properties);

  return (
    <div>
      {mappedProperties.length === 0 ? (
        // Show message if no properties are found
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>No properties found.</div>
      ) : (
        mappedProperties.map(property => {
          const bgcolor = '#F7E4DB';
          
          return (
            // Render a PropertyCard for each mapped property
            <PropertyCard
              key={property.id}
              applicationId={property.applicationId}
              property={property}
              bgcolor={property.status === "APPROVED" ? "#f5f5f5" : bgcolor }
              // propertyDetails={property.propertyDetails}
            />
          );
        })
      )}
    </div>
  );
};

export default PropertyList;