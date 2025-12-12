// Tag types and helpers for RTK Query cache invalidation
// Used to manage cache and refetch logic for different data entities in the app

/**
 * RTK Query Tag Types for Cache Invalidation
 *
 * These tag types are used across all API slices for intelligent cache invalidation.
 * Add new tag types here when creating new features.
 */
export const TAG_TYPES = {
    AUTH: 'Auth',
    USER: 'User',
    ACCOUNT: 'Account',
    APPLICATION_LOGS: 'APPLICATION_LOGS',
    APPLICATIONS: 'Applications',
    APPLICATION: 'Application',
    PROPERTY: 'Property',
    AMENITIES: 'Amenities',                
    ADDITIONAL_DETAILS: 'AdditionalDetails',
    AGENTS: 'Agents',
    ASSIGNMENTS: 'Assignments',
    COMMISSIONERS: 'Commissioners',
    SERVICE_MANAGERS: 'ServiceManagers',
    PRIORITIES: 'Priorities',
    APPROVALS: 'Approvals',
    INBOX: 'Inbox',
    ZONES: 'Zones',
    WARDS: 'Wards',
    JURISDICTION: 'Jurisdiction',
    DOCUMENTS: 'Documents',
    FILESTORE: 'FileStore',
    NOTIFICATIONS: 'Notifications',
    DASHBOARD: 'Dashboard',
    FILTERS: 'Filters',
    PROPERTY_DETAILS: 'PropertyDetails',
    SEARCH: 'Search',
    GIS_DATA: 'GisData',
    OWNERSHIP: 'Ownership',
} as const;

// Export as array for use in createApi tagTypes
export const ALL_TAG_TYPES = Object.values(TAG_TYPES);

// Type helper for TypeScript to get all tag types
export type TagType = (typeof TAG_TYPES)[keyof typeof TAG_TYPES];

// Helper function to create a tag object for a single entity or a list
export const createTag = (type: TagType, id?: string | number) =>
    id ? { type, id } : { type, id: 'LIST' };

// Helper function to create tag objects for multiple entities
export const createTags = (type: TagType, items?: { id: string | number }[]) =>
    items ? [...items.map((item) => ({ type, id: item.id })), { type, id: 'LIST' }] : [{ type, id: 'LIST' }];