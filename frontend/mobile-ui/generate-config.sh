#!/bin/sh
# Generate runtime configuration from environment variables
# This runs when the container starts, allowing dynamic config without rebuilding

cat <<EOF > /usr/share/nginx/html/config.js
window._env_ = {
  VITE_ENUMERATION_HOST: "${VITE_ENUMERATION_HOST:-}",
  VITE_MDMS_HOST: "${VITE_MDMS_HOST:-}",
  VITE_FILESTORE_HOST: "${VITE_FILESTORE_HOST:-}",
  VITE_ONBOARDING_HOST: "${VITE_ONBOARDING_HOST:-}",
  VITE_LOCALIZATION_HOST: "${VITE_LOCALIZATION_HOST:-}",
  VITE_PROPERTY_TAX_CALC_HOST: "${VITE_PROPERTY_TAX_CALC_HOST:-}",
  VITE_ZONE_URL: "${VITE_ZONE_URL:-}",
  VITE_KEYCLOAK_URL: "${VITE_KEYCLOAK_URL:-}",
  VITE_KEYCLOAK_REALM: "${VITE_KEYCLOAK_REALM:-}",
  VITE_KEYCLOAK_CLIENT_ID: "${VITE_KEYCLOAK_CLIENT_ID:-}",
  VITE_KEYCLOAK_CLIENT_SECRET: "${VITE_KEYCLOAK_CLIENT_SECRET:-}",
  VITE_KEYCLOAK_SCOPE: "${VITE_KEYCLOAK_SCOPE:-}",
  VITE_TENANT_ID: "${VITE_TENANT_ID:-}"
};
EOF

# Start nginx
nginx -g 'daemon off;'