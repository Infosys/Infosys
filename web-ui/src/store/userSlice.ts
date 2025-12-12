// Redux slice for managing user authentication and profile state
// Handles current user info, authentication status, and selected zone

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User, ZoneData } from '../app/features/login-signup/models/ProfileService';

// State structure for user-related data in Redux
interface UserState {
  currentUser: User | null; // Stores the logged-in user's profile, or null if not logged in
  isAuthenticated: boolean; // Indicates if a user is authenticated
  selectedZone: ZoneData | null; // The currently selected zone for the user
}

// Initial state for the user slice
const initialState: UserState = {
  currentUser: null,
  isAuthenticated: false,
  selectedZone: null,
};

// Redux Toolkit slice for user state management
const userSlice = createSlice({
  name: 'user', // Name of the slice
  initialState,
  reducers: {
    // Set the current user and mark as authenticated
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
      // Set the selected zone to the first zone in user's zoneData, if available
      state.selectedZone = action.payload.zoneData?.length ? action.payload.zoneData[0] : null;
    },
    // Clear user data and authentication status
    clearUser: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.selectedZone = null;
    },
    // Set the selected zone for the user
    setSelectedZone: (state, action: PayloadAction<ZoneData>) => {
      state.selectedZone = action.payload;
    }
  },
});

// Export actions for use in components and thunks
export const { setUser, clearUser, setSelectedZone } = userSlice.actions;
// Export the reducer to be included in the Redux store
export default userSlice.reducer;