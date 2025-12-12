
// URL for obtaining Keycloak access and refresh tokens
export const KEYCLOAK_TOKEN_URL =
  `${import.meta.env.VITE_KEYCLOAK_URL}/realms/${import.meta.env.VITE_KEYCLOAK_REALM}/protocol/openid-connect/token`;

// URL for fetching user information from Keycloak
export const KEYCLOAK_USER_INFO_URL =
  `${import.meta.env.VITE_KEYCLOAK_URL}/realms/${import.meta.env.VITE_KEYCLOAK_REALM}/protocol/openid-connect/userinfo`;

