
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
    
    updateForm({
      id: propID,
      categoryOfOwnership: applicationData.data.Property.OwnershipType || '',
      propertyType: applicationData.data.Property.PropertyType || '',
      apartmentName: applicationData.data.Property.ComplexName || '',
      propertyNo: applicationData.data.Property.PropertyNo || '',
      propertyAddress: (applicationData.data.Property.Address) || undefined,
      typeOfLand: applicationData.data.Property.typeOfLand || '',
      noOfFloors: applicationData.data.Property.noOfFloors || undefined,
      noOfBasements: applicationData.data.Property.noOfBasements || undefined,
      noOfBuildings: applicationData.data.Property.noOfBuildings || undefined,
      buildingName: applicationData.data.Property.buildingName || undefined,
      hasMezzanine: applicationData.data.Property.hasMezzanine || undefined,
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
      isgrDetails: (applicationData.data.Property.IGRS) || undefined,
      assessmentDetails: (applicationData.data.Property.AssessmentDetails) || undefined,
      isgrAdditionalDetails: applicationData.data.Property.Amenities
        ? {
            lifts: applicationData.data.Property.Amenities.type?.includes('Lift') || false,
            toilet: applicationData.data.Property.Amenities.type?.includes('Toilets') || false,
            watertap: applicationData.data.Property.Amenities.type?.includes('Water Tap') || false,
            cableConnection: applicationData.data.Property.Amenities.type?.includes('Cable Connection') || false,
            electricity: applicationData.data.Property.Amenities.type?.includes('Electricity') || false,
            attachedBathroom: applicationData.data.Property.Amenities.type?.includes('Attached Bathroom') || false,
            waterHarvesting: applicationData.data.Property.Amenities.type?.includes('Water Harvesting') || false,
            amenityId: applicationData.data.Property.Amenities.ID,
          }
        : undefined,
      importantNotes: applicationData.data.ImportantNote || '',
      documents: applicationData.data.Property.Documents?.map((doc: any) => ({
        id: doc.ID,
        name: doc.DocumentName,
        type: doc.DocumentType,
        fileStoreId: doc.FileStoreID,
        uploadDate: doc.UploadDate,
        action: doc.action,
        uploadedBy: doc.uploadedBy,
        size: doc.size,
      })) || [],
    });

  } catch (error) {
    // Handle errors and show error popup
    console.error('Error fetching property details:', error);
    showErrorPopup('Failed to load property details');
  }
};