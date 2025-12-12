// env.ts
// Exports environment-based URLs for Keycloak authentication endpoints.
// URL for obtaining Keycloak access tokens
export const KEYCLOAK_TOKEN_URL =
  `${import.meta.env.VITE_KEYCLOAK_URL}/realms/${import.meta.env.VITE_KEYCLOAK_REALM}/protocol/openid-connect/token`;
// URL for fetching Keycloak user info
export const KEYCLOAK_USER_INFO_URL =
  `${import.meta.env.VITE_KEYCLOAK_URL}/realms/${import.meta.env.VITE_KEYCLOAK_REALM}/protocol/openid-connect/userinfo`;

