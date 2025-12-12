// Redux slice for managing language preferences (citizen/agent)
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// State type for language settings
type LangState = {
  citizenLang: string;
  agentLang: string;
};

// Initialize language from localStorage or default to 'en'
const initialCitizenLang = localStorage.getItem('citizenLocale') || 'en';
const initialAgentLang = localStorage.getItem('agentLocale') || 'en';

// Initial state for language slice
const initialState: LangState = {
  citizenLang: initialCitizenLang,
  agentLang: initialAgentLang,
};

// Slice for handling language changes and syncing with localStorage
const langSlice = createSlice({
  name: 'lang',
  initialState,
  reducers: {
    // Set citizen language and persist to localStorage
    setCitizenLang(state, action: PayloadAction<string>) {
      state.citizenLang = action.payload;
      localStorage.setItem('citizenLocale', action.payload);
      localStorage.setItem('appLocale', action.payload);
    },
    // Set agent language and persist to localStorage
    setAgentLang(state, action: PayloadAction<string>) {
      state.agentLang = action.payload;
      localStorage.setItem('agentLocale', action.payload);
      localStorage.setItem('appLocale', action.payload);
    },
  },
});

export const { setCitizenLang, setAgentLang } = langSlice.actions;
export default langSlice.reducer;