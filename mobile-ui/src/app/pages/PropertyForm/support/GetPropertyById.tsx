// GetPropertyById.tsx
// Custom hook to fetch property details by ID and update the property form context.
// Features:
//   - Uses RTK Query lazy fetch for property by ID
//   - Updates form context with fetched property data
//   - Handles errors and returns error message if fetch fails
// Used in: Property form workflow for loading property details by ID

import { useLazyGetPropertyByIdQuery } from '../../../../redux/apis/propertyApi';
import { usePropertyForm } from '../../../../context/PropertyFormContext';

export const useGetPropertyById = () => {
  // RTK Query lazy fetch hook
  const [getPropertyById] = useLazyGetPropertyByIdQuery();
  // Property form context updater
  const { updateForm } = usePropertyForm();

  // Fetch property details and update form context
  const fetchPropertyDetails = async (propID: string) => {
    try {
      const propertyData = await getPropertyById(propID).unwrap();
      updateForm({
        id: propID,
        categoryOfOwnership: propertyData.data.OwnershipType || '',
        propertyType: propertyData.data.PropertyType || '',
        apartmentName: propertyData.data.ComplexName || '',
        propertyNo: propertyData.data.PropertyNo || '',
        propertyAddress: (propertyData.data.Address as any) || undefined,
        locationData: propertyData.data.GISData
          ? {
              gisDataId: propertyData.data.GISData.ID,
              address: propertyData.data.Address?.Locality || '',
              coordinates: {
                lat: propertyData.data.GISData.Coordinates?.[0]?.Latitude || 0,
                lng: propertyData.data.GISData.Coordinates?.[0]?.Longitude || 0,
              },
              drawnShapes:
                propertyData.data.GISData.Coordinates?.length > 0
                  ? [
                      {
                        type: 'polygon',
                        coordinates: propertyData.data.GISData.Coordinates.map(
                          (coord: any) => [coord.Longitude, coord.Latitude]
                        ),
                      },
                    ]
                  : [],
            }
          : undefined,
        isgrDetails: (propertyData.data.IGRS as any) || undefined,
      });
    } catch (error) {
      console.error('Error fetching property details:', error);
      return `${error}` || 'Failed to fetch property details';
    }
  };

  // Return fetch function for use in components
  return { fetchPropertyDetails };
};
