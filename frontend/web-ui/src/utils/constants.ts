// Application-wide constants for backend service URLs
// Update these URLs as per your environment or deployment

export const SERVER_URL = import.meta.env.VITE_ENUMERATION_HOST;

// URL for the file storage service
export const FILESTORE_URL = import.meta.env.VITE_FILESTORE_HOST;

// URL for the onboarding service
export const ONBOARDING_URL = import.meta.env.VITE_ONBOARDING_HOST;

// URL for MDMS service
export const MDMS_URL = import.meta.env.VITE_MDMS_HOST;

export const FILTER_TYPES = {
  APPLICATION_NO: 'Application No.',
  WARD: 'Ward',
  ZONE: 'Zone',
  DUE_DATE: 'Due Date',
} as const;

export const DEFAULT_SORT_ORDER = 'New - Old';
export const DEBOUNCE_DELAY = 150; 