// Redux store setup for the app
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import langReducer from './redux/LangSlice';
import agentApiSlice from './app/features/Agent/api/agentApiSlice';
import apiSlice from './redux/apiSlice';
import filestoreApiSlice from './redux/fileStoreApiSlice';
import { taxCalculatorApiSlice } from './redux/taxCalculatorApiSlice';

// Combine all reducers (language, API, agent, file store, tax calculator)
const appReducer = combineReducers({
  lang: langReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
  [agentApiSlice.reducerPath]: agentApiSlice.reducer,
  [filestoreApiSlice.reducerPath]: filestoreApiSlice.reducer,
  [taxCalculatorApiSlice.reducerPath]: taxCalculatorApiSlice.reducer,
});

// Root reducer: resets state on logout
const rootReducer = (state: ReturnType<typeof appReducer> | undefined, action: any) => {
  if (action?.type === 'auth/logout') {
    state = undefined;
  }
  return appReducer(state, action);
};

// Create the Redux store with root reducer and middleware for APIs
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(
      apiSlice.middleware, 
      agentApiSlice.middleware,
      filestoreApiSlice.middleware,
      taxCalculatorApiSlice.middleware
    ),
});

// Types for state and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;