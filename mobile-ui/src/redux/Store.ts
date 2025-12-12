// import { configureStore } from '@reduxjs/toolkit';
// import langReducer from './LangSlice';
// import { apiSlice } from './apiSlice';

// export const store = configureStore({
//   reducer: {
//     lang: langReducer,
//     [apiSlice.reducerPath]: apiSlice.reducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware().concat(apiSlice.middleware),
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;


// Currently using global one .. (./src/store.ts)