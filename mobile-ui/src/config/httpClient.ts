// httpClient.ts
// Configures a custom Axios HTTP client with authentication and token refresh logic for API requests.
import axios from 'axios';
import { authService } from '../services/AuthService';

// Tenant ID for multi-tenant support, loaded from environment
const TENANT_ID = import.meta.env.VITE_TENANT_ID;

// Create an Axios instance with base URL and default headers
const httpClient = axios.create({
  baseURL: import.meta.env.VITE_ONBOARDING_HOST,
  headers: {
    'Content-Type': 'application/json',
    'X-Tenant-ID': TENANT_ID,
  },
});

// Request interceptor: attaches Authorization header with Bearer token if available
httpClient.interceptors.request.use(
  async (config) => {
    const token = await authService.getValidToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log('No token available for request');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handles 401 errors by attempting token refresh and retrying the request
httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log('HTTP Error:', error.response?.status, error.response?.statusText);
    if (error.response?.status === 401) {
      console.log('Received 401, attempting token refresh');
      try {
        // Try to refresh the access token
        const refreshed = await authService.refreshAccessToken();
        console.log('Token refresh result:', refreshed);
        if (refreshed) {
          const newToken = await authService.getValidToken();
          console.log('Got new token for retry:', newToken ? 'token exists' : 'no token');
          if (newToken) {
            // Retry the original request with the new token
            error.config.headers.Authorization = `Bearer ${newToken}`;
            console.log('Retrying request with new token');
            return httpClient.request(error.config);
          }
        }
      } catch (refreshError) {
        // If token refresh fails, log out and reload to trigger auth flow
        console.log('Token refresh failed:', refreshError);
        authService.logout();
        window.location.reload(); // This will trigger the auth flow
      }
    }
    return Promise.reject(error);
  }
);

// Export the configured Axios instance
export default httpClient;