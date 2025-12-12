
// Custom hook for managing property data submission and updates for Agent workflows.
// Integrates form context and RTK Query mutations for property basics, GIS data, and coordinates.
// Used in Agent property creation/edit screens to handle async data operations.

import { usePropertyForm } from "../../../../context/PropertyFormContext";
import { useSubmitCoordinateBatchMutation, useSubmitGISDataMutation, useUpdateCoordinatesMutation, useUpdateGISDataMutation } from "../../../../redux/apis/gisApi";
import { useSubmitPropertyBasicsMutation, useUpdatePropertyMutation } from "../../../../redux/apis/propertyApi";


// usePropertyData provides async functions to save property basics, GIS data, and coordinates.
// It uses form data from context and exposes three main operations:
//   - savePropertyBasics: create or update property basic info
//   - saveGISData: create or update GIS data for a property
//   - saveCoordinates: create or update coordinate batch for drawn shapes
export const usePropertyData = () => {
  const { formData } = usePropertyForm();
  // RTK Query mutations for property and GIS operations
  const [submitPropertyBasics] = useSubmitPropertyBasicsMutation();
  const [submitGISData] = useSubmitGISDataMutation();
  const [submitCoordinateBatch] = useSubmitCoordinateBatchMutation();
  const [updateProperty] = useUpdatePropertyMutation();
  const [updateGISData] = useUpdateGISDataMutation();
  const [updateCoordinates] = useUpdateCoordinatesMutation();


  // Save or update property basic information
  // If propertyID is provided, updates existing property; otherwise, creates new property
  const savePropertyBasics = async (propertyID?: string) => {
    if (propertyID) {
      const result = await updateProperty({
        propertyId: propertyID,
        ownershipType: formData.categoryOfOwnership,
        propertyType: formData.propertyType,
        complexName: formData.apartmentName,
        address: formData.propertyAddress!,
        propertyNo: formData.propertyNo || '',
      }).unwrap();
      // Return updated property ID and number

      return { propertyID, propertyNo: result.data?.PropertyNo };
    } else {
      const result = await submitPropertyBasics({
        ownershipType: formData.categoryOfOwnership,
        propertyType: formData.propertyType,
        complexName: formData.apartmentName,
      }).unwrap();
      // Return new property ID and number

      return { propertyID: result.data.ID, propertyNo: result.data.PropertyNo };
    }
  };


  // Save or update GIS data for a property
  // If gisDataId is provided, updates existing GIS data; otherwise, creates new GIS data
  const saveGISData = async (propertyID: string, gisDataId?: string) => {
    const { coordinates } = formData.locationData!;

    if (gisDataId) {
      await updateGISData({
        gisDataId,
        propertyId: propertyID,
        source: 'GPS',
        type: 'POLYGON',
      }).unwrap();
      return gisDataId;
    } else {
      const result = await submitGISData({
        propertyId: propertyID,
        latitude: coordinates?.lat!,
        longitude: coordinates?.lng!,
        source: 'GPS',
        type: 'POLYGON',
      }).unwrap();
      return result.data.ID;
    }
  };


  // Save or update coordinates for drawn polygon shapes
  // If isUpdate is true, updates existing coordinates; otherwise, creates new batch
  const saveCoordinates = async (gisDataId: string, isUpdate: boolean) => {
    // Filter drawn shapes to get polygons only
    const polygonShapes = formData.locationData?.drawnShapes?.filter(
      (shape) => shape.type === 'polygon'
    ) || [];

    if (polygonShapes.length === 0) return;
    // Map polygon coordinates to batch format for API
    const coordinateBatch = polygonShapes.flatMap((shape) => {
      if (!shape.coordinates || !Array.isArray(shape.coordinates)) return [];
      return (shape.coordinates as number[][]).map((coord) => {
        // Coordinates are stored as [lng, lat] in drawnShapes (see LocationMapWithDrawing.finishShape)
        const [initialLng, initialLat] = coord;
        let lat = initialLat;
        let lng = initialLng;
        if (typeof lat !== 'number' || typeof lng !== 'number') {
          // If shape coordinate format is unexpected, try to salvage by swapping
          const [a, b] = coord as any[];
          if (typeof a === 'number' && typeof b === 'number') {
            if (Math.abs(a) > 90 && Math.abs(b) <= 90) {
              lat = b;
              lng = a;
            } else {
              lat = b;
              lng = a;
            }
          }
        }
        return { latitude: lat, longitude: lng, gisDataId };
      });
    });

    if (coordinateBatch.length > 0) {
      if (isUpdate) {
        await updateCoordinates({ gisDataId, coordinates: coordinateBatch }).unwrap();
      } else {
        await submitCoordinateBatch(coordinateBatch).unwrap();
      }
    }
  };


  // Expose async save functions for use in Agent property screens
  return { savePropertyBasics, saveGISData, saveCoordinates };
};