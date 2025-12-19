// This file provides the SidebarProvider and related context/hooks for managing sidebar state in the Service Manager dashboard.
// It handles sidebar open/close, navigation selection, toggles, and profile modal anchor for the sidebar UI.
import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Context type for sidebar state and actions
interface SidebarContextType {
  sideBarOpen: boolean; // Whether the sidebar is open
  setSideBarOpen: (open: boolean) => void; // Setter for sidebar open state
  toggleSideBar: () => void; // Toggle sidebar open/close
  selectedNav: string; // Currently selected navigation item
  setSelectedNav: (nav: string) => void; // Setter for selected navigation
  handleNavSelection: (nav: string) => void; // Handler for navigation selection
  allApplicationsToggle: boolean; // Toggle for "all applications" section
  setAllApplicationsToggle: (toggle: boolean) => void; // Setter for applications toggle
  profileModalAnchor: HTMLElement | null; // Anchor element for profile modal
  setProfileModalAnchor: (anchorEl: HTMLElement | null) => void; // Setter for profile modal anchor
}

// Create the sidebar context
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// Custom hook to access the sidebar context
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};


// Provider component to wrap parts of the app that need sidebar state
export const SidebarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State for whether the sidebar is open
  const [sideBarOpen, setSideBarOpen] = useState<boolean>(true);
  // State for the currently selected navigation item
  const [selectedNav, setSelectedNav] = useState<string>('dashboard');
  // State for toggling the "all applications" section
  const [allApplicationsToggle, setAllApplicationsToggle] = useState<boolean>(false);
  // State for the anchor element of the profile modal
  const [profileModalAnchor, setProfileModalAnchor] = useState<HTMLElement | null>(null);

  // Toggle the sidebar open/close state
  const toggleSideBar = () => setSideBarOpen(prev => !prev);

  // Handle navigation selection and redirect if needed
  const handleNavSelection = (nav: string) => {
    setSelectedNav(nav);
    // If on Service Manager property details, navigate back to Service Manager home
    if (location.pathname.startsWith('/service-manager/property-details/')) {
      navigate('/service-manager/home');
    }
  };

  return (
    <SidebarContext.Provider
      value={{
        sideBarOpen,
        setSideBarOpen,
        toggleSideBar,
        selectedNav,
        setSelectedNav,
        handleNavSelection,
        allApplicationsToggle,
        setAllApplicationsToggle,
        profileModalAnchor,
        setProfileModalAnchor,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};