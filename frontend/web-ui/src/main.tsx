// Main entry point for the React application
// Sets up global providers, Redux store, persistence, and authentication context

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'leaflet/dist/leaflet.css'
import App from './App.tsx'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { AuthProvider } from './app/features/login-signup/provider/AuthProvider.tsx';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';

// Render the root React component into the DOM
createRoot(document.getElementById('root')!).render(
  // StrictMode helps with highlighting potential problems in development
  <StrictMode>
    {/* Redux Provider makes the store available to all components */}
    <Provider store={store}>
      {/* PersistGate delays rendering until persisted state is loaded */}
      <PersistGate loading={null} persistor={persistor}>
        {/* AuthProvider supplies authentication context to the app */}
        <AuthProvider>
          {/* Main App component containing routes and UI */}
          <App />
        </AuthProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
)