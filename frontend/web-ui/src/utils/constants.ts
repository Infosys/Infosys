// Application-wide constants for backend service URLs
// Update these URLs as per your environment or deployment
import env from '../config/env';

export const SERVER_URL = env.ENUMERATION_HOST;

// URL for the file storage service
export const FILESTORE_URL = env.FILESTORE_HOST;

// URL for the onboarding service
export const ONBOARDING_URL = env.ONBOARDING_HOST;

// URL for property tax calculation service
export const PROPERTY_TAX_CALC_URL = env.PROPERTY_TAX_CALC_HOST;
 
// URL for MDMS service
export const MDMS_URL = env.MDMS_HOST;

export const FILTER_TYPES = {
  APPLICATION_NO: 'Application No.',
  WARD: 'Ward',
  ZONE: 'Zone',
  DUE_DATE: 'Due Date',
} as const;

export const DEFAULT_SORT_ORDER = 'New - Old';
export const DEBOUNCE_DELAY = 150; 