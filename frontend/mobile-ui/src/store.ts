// Redux store setup for the app
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import langReducer from './redux/LangSlice';
import agentApiSlice from './app/features/Agent/api/agentApiSlice';
import apiSlice from './redux/apiSlice';
import filestoreApiSlice from './redux/fileStoreApiSlice';

// Combine all reducers (language, API, agent, file store)
const appReducer = combineReducers({
  lang: langReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
  [agentApiSlice.reducerPath]: agentApiSlice.reducer,
  [filestoreApiSlice.reducerPath]: filestoreApiSlice.reducer,
});

// Root reducer: resets state on logout
const rootReducer = (state: ReturnType<typeof appReducer> | undefined, action: any) => {
  if (action && action.type === 'auth/logout') {
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
      filestoreApiSlice.middleware
    ),
});

// Types for state and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;