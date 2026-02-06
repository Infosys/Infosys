
// This file sets up a pre-configured Axios HTTP client with authentication and tenant handling
import axios from 'axios';
import { authService } from './AuthService';
import env from '../../../../config/env';


// Tenant ID for multi-tenant API requests
const TENANT_ID = env.TENANT_ID;


// Create an Axios instance with base URL and default headers
const httpClient = axios.create({
  baseURL: env.ONBOARDING_HOST,
  headers: {
    'Content-Type': 'application/json',
    'X-Tenant-ID': TENANT_ID,
  },
});


// Request interceptor: adds Authorization header with Bearer token if available
httpClient.interceptors.request.use(
  async (config) => {
    console.log('Making request to:', config.url);
    const token = await authService.getValidToken();
    console.log('Got token for request:', token ? 'token exists' : 'no token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Added Authorization header to request');
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
        const refreshed = await authService.refreshAccessToken();
        console.log('Token refresh result:', refreshed);
        if (refreshed) {
          const newToken = await authService.getValidToken();
          console.log('Got new token for retry:', newToken ? 'token exists' : 'no token');
          if (newToken) {
            error.config.headers.Authorization = `Bearer ${newToken}`;
            console.log('Retrying request with new token');
            return httpClient.request(error.config);
          }
        }
      } catch (refreshError) {
        console.log('Token refresh failed:', refreshError);
        authService.logout();
        window.location.reload(); // This will trigger the auth flow
      }
    }
    return Promise.reject(error);
  }
);


// Export the configured HTTP client for use throughout the app
export default httpClient;