// This file provides the CommissionerSidebarProvider and related context/hooks for managing sidebar state in the Commissioner dashboard.
// It handles sidebar open/close, navigation selection, toggles, and profile modal anchor for the sidebar UI.
import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Context type for sidebar state and actions
interface CommissionerSidebarContextType {
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
const CommissionerSidebarContext = createContext<CommissionerSidebarContextType | undefined>(undefined);

// Custom hook to access the sidebar context
export const useCommissionerSidebar = () => {
  const context = useContext(CommissionerSidebarContext);
  if (!context) {
    throw new Error('useCommissionerSidebar must be used within a CommissionerSidebarProvider');
  }
  return context;
};


// Provider component to wrap parts of the app that need sidebar state
export const CommissionerSidebarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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
    // If on Commissioner property details, navigate back to Commissioner home
    if (location.pathname.startsWith('/commissioner/property-details/')) {
      navigate('/commissioner/home');
    }
  };

  return (
    <CommissionerSidebarContext.Provider
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
    </CommissionerSidebarContext.Provider>
  );
};