// Tag types for RTK Query cache invalidation
// Add new tag types here for new features/APIs

// Centralized list of tag types for all API slices
export const TAG_TYPES = {
    AUTH: 'Auth',
    USER: 'User',
    ACCOUNT: 'Account',
    APPLICATIONS: 'Applications',
    APPLICATION: 'Application',
    APPLICATION_LOG: 'ApplicationLog',
    PROPERTY: 'Property',
    AMENITIES: 'Amenities',
    FLOOR: 'Floor',
    DOCUMENT_INFO: 'DocumentInfo',
    ADDRESS: 'Address',
    OWNER: 'Owner',
    CONSTRUCTION: 'Construction',
    DOCUMENT: 'Document',
    APPLICATION_LOGS: 'APPLICATION_LOGS',
} as const

// Export as array for use in createApi tagTypes
export const ALL_TAG_TYPES = Object.values(TAG_TYPES)

// Type helper for valid tag types
export type TagType = (typeof TAG_TYPES)[keyof typeof TAG_TYPES]

// Helper to create a single tag (optionally with ID)
export const createTag = (type: TagType, id?: string | number) => (id ? { type, id } : { type, id: 'LIST' })

// Helper to create multiple tags from a list of items
export const createTags = (type: TagType, items?: { id: string | number }[]) =>
    items ? [...items.map((item) => ({ type, id: item.id })), { type, id: 'LIST' }] : [{ type, id: 'LIST' }]
