// Redux store setup for the property tax web UI
// Configures reducers, middleware, persistence, and API slices

import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { apiSlice } from './apiSlice';
import { filestoreApiSlice } from './filestoreApiSlice';
import applicationReducer from '../app/features/service-manager-app-features/application-view/redux/apiSlice';
import { onboardingApiSlice } from './onboardingApiSlice';
import filterReducer from '../app/features/service-manager-app-features/application-inbox/store/filterSlice';
import userReducer from './userSlice';
import { mdmsApi } from '../app/features/service-manager-app-features/application-view/api/mdmsService/mdmsApi';
import propertyTaxCalcApiSlice from './propertyTaxCalcApiSlice';
import { zoneApi } from '../app/features/comissioner-app-features/commissioner-dashboard/CommissionerDashBoardApi/zoneApi';

// Configuration for persistence of user state
const userPersistConfig = {
  key: 'userState',
  storage: storage,
  whitelist: ['currentUser'], // specify which parts of user state to persist
};

// Wrap user reducer with persistence
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

// Main Redux store configuration
export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    application: applicationReducer,
    [onboardingApiSlice.reducerPath]: onboardingApiSlice.reducer,
    [filestoreApiSlice.reducerPath]: filestoreApiSlice.reducer,
    [zoneApi.reducerPath]: zoneApi.reducer,
    [mdmsApi.reducerPath]: mdmsApi.reducer,
    [propertyTaxCalcApiSlice.reducerPath]: propertyTaxCalcApiSlice.reducer,
    filter: filterReducer,
    user: persistedUserReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    })
      .concat(apiSlice.middleware)
      .concat(filestoreApiSlice.middleware)
      .concat(onboardingApiSlice.middleware)
      .concat(zoneApi.middleware)
      .concat(mdmsApi.middleware)
      .concat(propertyTaxCalcApiSlice.middleware)
});

// Enable refetchOnFocus/refetchOnReconnect behaviors for RTK Query
setupListeners(store.dispatch);

// Persistor for redux-persist
export const persistor = persistStore(store);
// RootState and AppDispatch types for use throughout the app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

