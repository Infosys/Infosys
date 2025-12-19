
/**
 * fetchPropertyDetails is an async utility for fetching and mapping property details for Agent screens.
 * It retrieves property data by ID, transforms the response into the required form structure,
 * and updates the form state. Handles errors by showing a popup.
 *
 * @param propID - Property ID to fetch
 * @param getPropertyById - API function to fetch property by ID
 * @param updateForm - Callback to update form state with mapped data
 * @param showErrorPopup - Callback to show error popup on failure
 */
export const fetchPropertyDetails = async (
  propID: string,
  applicationId: string,
  getApplicationById: any,
  getOwnerByPropertyId: any,
  updateForm: (data: any) => void,
  showErrorPopup: (message: string) => void
) => {
  try {
    const applicationData = await getApplicationById(applicationId).unwrap();
    const ownersData = await getOwnerByPropertyId(propID).unwrap();
    console.log(ownersData);
    
    updateForm({
      id: propID,
      categoryOfOwnership: applicationData.data.Property.OwnershipType || '',
      propertyType: applicationData.data.Property.PropertyType || '',
      apartmentName: applicationData.data.Property.ComplexName || '',
      propertyNo: applicationData.data.Property.PropertyNo || '',
      propertyAddress: (applicationData.data.Property.Address as any) || undefined,
      locationData: applicationData.data.Property.GISData
        ? {
          gisDataId: applicationData.data.Property.GISData.ID,
          address: applicationData.data.Property.Address?.Locality || '',
          coordinates: {
            lat: applicationData.data.Property.GISData.Latitude || 0,
            lng: applicationData.data.Property.GISData.Longitude || 0,
          },
          drawnShapes:
            applicationData.data.Property.GISData.Coordinates?.length > 0
              ? [
                {
                  type: 'polygon',
                  coordinates: applicationData.data.Property.GISData?.Coordinates.map(
                    (coord: any) => [coord.Longitude, coord.Latitude]
                  ),
                },
              ]
              : [],
        }
        : undefined,
      owners: ownersData.data || [],
      isgrDetails: (applicationData.data.Property.IGRS as any) || undefined,
      assessmentDetails: (applicationData.data.Property.AssessmentDetails as any) || undefined,
      importantNotes: applicationData.data.ImportantNote || '',
    });

  } catch (error) {
    // Handle errors and show error popup
    console.error('Error fetching property details:', error);
    showErrorPopup('Failed to load property details');
  }
};