// Utility to map Application model to PropertyItem type for Agent screens.
// Used to transform API data into frontend-friendly format for property lists.
import type { Application } from '../models/HomePageData.model';
import type { PropertyItem } from '../../../../types';

// Maps an Application object to a PropertyItem for display in property lists.
export const mapApplicationToPropertyItem = (application: Application): PropertyItem => {
  const property = application.Property;


    // Return mapped property item with normalized fields
  return {
    id: application.ID,
    pId: application.ApplicationNo,
    propertyNo: property.PropertyNo || 'N/A',
    type: property.PropertyType || 'RESIDENTIAL',
    description: `${property.PropertyType} - ${property.OwnershipType}`,
    address: property.Address
      ? `${property.Address.Street}, ${property.Address.Locality}`
      : 'Address not available',
    phoneNumber: '', // Not available in Application/Property data
    area: property.AssessmentDetails?.ExtendOfSite || 'N/A',
    propertyType: property.PropertyType || 'RESIDENTIAL',
    status: application.Priority || 'MEDIUM',
    dueDate: application.DueDate || new Date().toISOString(),
    // isNew: application.Status === 'ASSIGNED',
    isNew: (application.Status === 'ASSIGNED'),
    isDraft: application.IsDraft === true,
    isVerified: application.Status === 'VERIFIED' || application.Status === 'APPROVED' || application.Status === 'AUDIT_VERIFIED',
    createdDate: application.CreatedAt,
    gisData: property.GISData ? {
      latitude: property.GISData.Latitude,
      longitude: property.GISData.Longitude,
      coordinates: property.GISData.Coordinates
    } : undefined,
  };
};