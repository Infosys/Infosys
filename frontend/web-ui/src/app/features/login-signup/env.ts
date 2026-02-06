
import env from '../../../config/env';

// URL for obtaining Keycloak access and refresh tokens
export const KEYCLOAK_TOKEN_URL =
  `${env.KEYCLOAK_URL}/realms/${env.KEYCLOAK_REALM}/protocol/openid-connect/token`;

// URL for fetching user information from Keycloak
export const KEYCLOAK_USER_INFO_URL =
  `${env.KEYCLOAK_URL}/realms/${env.KEYCLOAK_REALM}/protocol/openid-connect/userinfo`;

