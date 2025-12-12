import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';


// Defines the shape of the application state in Redux
interface ApplicationState {
  data: any;         // The application data (property, etc.)
  isLoading: boolean;// Loading state for async operations
  error: any;        // Error object or message
}


// Initial state for the application slice
const initialState: ApplicationState = {
  data: null,
  isLoading: false,
  error: null,
};


// Redux slice for managing application data, loading, and error state
const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    // Set the application data in state
    setApplicationData(state, action: PayloadAction<any>) {
      state.data = action.payload;
    },
    // Set the loading state (true/false)
    setApplicationLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    // Set the error object or message
    setApplicationError(state, action: PayloadAction<any>) {
      state.error = action.payload;
    },
  },
});


// Export actions for use in components and thunks
export const { setApplicationData, setApplicationLoading, setApplicationError } = applicationSlice.actions;

// Export the reducer to be included in the Redux store
export default applicationSlice.reducer;

// Selectors for accessing application state from the Redux store
export const selectApplication = (state: any) => state.application.data;
export const selectApplicationLoading = (state: any) => state.application.isLoading;
export const selectApplicationError = (state: any) => state.application.error;