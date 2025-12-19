
// Redux slice for managing filter state in the application inbox.
import { createSlice } from '@reduxjs/toolkit'
import type {PayloadAction} from '@reduxjs/toolkit'


/**
 * Represents the filter state for the application inbox, including agents, wards, statuses, sorting, and more.
 */
interface FilterState {
  agents: string[];      // List of selected agent IDs
  wards: string[];       // List of selected ward IDs
  statuses: string[];    // List of selected statuses
  sort: string;          // Current sort option
  searchValue: string;   // Search input value
  zones?: string[];      // (Optional) List of selected zones
  priority: string;      // Selected priority filter
}


// Initial state for the filter slice
const initialState: FilterState = {
  agents: [],
  wards: [],
  statuses: [],
  sort: '',
  searchValue: '',
  zones: [],
  priority: '',
}


// Slice for managing filter-related state and actions
const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    /**
     * Sets the selected agents filter.
     */
    setAgents: (state, action: PayloadAction<string[]>) => {
      state.agents = action.payload;
    },
    /**
     * Sets the selected wards filter.
     */
    setWards: (state, action: PayloadAction<string[]>) => {
      state.wards = action.payload;
    },
    /**
     * Sets the selected statuses filter.
     */
    setStatuses: (state, action: PayloadAction<string[]>) => {
      state.statuses = action.payload;
    },
    /**
     * Sets the current sort option.
     */
    setSort: (state, action: PayloadAction<string>) => {
      state.sort = action.payload;
    },
    /**
     * Sets all filters at once using a FilterState object.
     */
    setAllFilters: (state, action: PayloadAction<FilterState>) => {
      Object.assign(state, action.payload);
    },
    /**
     * Clears all filters, resetting to initial state.
     */
    clearFilters: (state) => {
      Object.assign(state, initialState);
    },
    /**
     * Sets the search value for filtering.
     */
    setSearchValue: (state, action: PayloadAction<string>) => {
      state.searchValue = action.payload;
    },
    /**
     * Sets the selected zones filter.
     */
    setZones: (state, action: PayloadAction<string[]>) => {
      state.zones = action.payload;
    },
    /**
     * Sets the selected priority filter.
     */
    setPriority: (state, action: PayloadAction<string>) => {
      state.priority = action.payload;
    },
  }
})

// Export filter actions and reducer for use in the Redux store
export const { setAgents, setWards, setStatuses, setSort, setAllFilters, clearFilters, setSearchValue, setZones, setPriority } = filterSlice.actions
export default filterSlice.reducer