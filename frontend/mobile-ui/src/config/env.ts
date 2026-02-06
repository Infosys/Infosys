// Runtime environment configuration
// This reads from window._env_ which is populated at container startup
// Allows changing config without rebuilding the Docker image

interface RuntimeEnv {
  VITE_ENUMERATION_HOST: string;
  VITE_MDMS_HOST: string;
  VITE_FILESTORE_HOST: string;
  VITE_ONBOARDING_HOST: string;
  VITE_LOCALIZATION_HOST: string;
  VITE_PROPERTY_TAX_CALC_HOST: string;
  VITE_ZONE_URL: string;
  VITE_KEYCLOAK_URL: string;
  VITE_KEYCLOAK_REALM: string;
  VITE_KEYCLOAK_CLIENT_ID: string;
  VITE_KEYCLOAK_CLIENT_SECRET: string;
  VITE_KEYCLOAK_SCOPE: string;
  VITE_TENANT_ID: string;
}

// Extend window interface to include runtime config
declare global {
  interface Window {
    _env_?: RuntimeEnv;
  }
}

// Fallback to build-time env vars for local development
export const env = {
  ENUMERATION_HOST: window._env_?.VITE_ENUMERATION_HOST || import.meta.env.VITE_ENUMERATION_HOST,
  MDMS_HOST: window._env_?.VITE_MDMS_HOST || import.meta.env.VITE_MDMS_HOST,
  FILESTORE_HOST: window._env_?.VITE_FILESTORE_HOST || import.meta.env.VITE_FILESTORE_HOST,
  ONBOARDING_HOST: window._env_?.VITE_ONBOARDING_HOST || import.meta.env.VITE_ONBOARDING_HOST,
  LOCALIZATION_HOST: window._env_?.VITE_LOCALIZATION_HOST || import.meta.env.VITE_LOCALIZATION_HOST,
  PROPERTY_TAX_CALC_HOST: window._env_?.VITE_PROPERTY_TAX_CALC_HOST || import.meta.env.VITE_TAXCALCULATOR_HOST,
  ZONE_URL: window._env_?.VITE_ZONE_URL || import.meta.env.VITE_ZONE_URL,
  KEYCLOAK_URL: window._env_?.VITE_KEYCLOAK_URL || import.meta.env.VITE_KEYCLOAK_URL,
  KEYCLOAK_REALM: window._env_?.VITE_KEYCLOAK_REALM || import.meta.env.VITE_KEYCLOAK_REALM,
  KEYCLOAK_CLIENT_ID: window._env_?.VITE_KEYCLOAK_CLIENT_ID || import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
  KEYCLOAK_CLIENT_SECRET: window._env_?.VITE_KEYCLOAK_CLIENT_SECRET || import.meta.env.VITE_KEYCLOAK_CLIENT_SECRET,
  KEYCLOAK_SCOPE: window._env_?.VITE_KEYCLOAK_SCOPE || import.meta.env.VITE_KEYCLOAK_SCOPE,
  TENANT_ID: window._env_?.VITE_TENANT_ID || import.meta.env.VITE_TENANT_ID,
};

export default env;
