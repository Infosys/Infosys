import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface AdminSidebarContextType {
  sideBarOpen: boolean;
  setSideBarOpen: (open: boolean) => void;
  toggleSideBar: () => void;
  selectedNav: string;
  setSelectedNav: (nav: string) => void;
  handleNavSelection: (nav: string) => void;
  profileModalAnchor: HTMLElement | null;
  setProfileModalAnchor: (anchorEl: HTMLElement | null) => void;
}

const AdminSidebarContext = createContext<AdminSidebarContextType | undefined>(undefined);

export const useAdminSidebar = () => {
  const context = useContext(AdminSidebarContext);
  if (!context) {
    throw new Error('useAdminSidebar must be used within an AdminSidebarProvider');
  }
  return context;
};

export const AdminSidebarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sideBarOpen, setSideBarOpen] = useState<boolean>(true);
  const [selectedNav, setSelectedNav] = useState<string>('dashboard');
  const [profileModalAnchor, setProfileModalAnchor] = useState<HTMLElement | null>(null);

  const toggleSideBar = () => setSideBarOpen(prev => !prev);

  const handleNavSelection = (nav: string) => {
    setSelectedNav(nav);
  };

  return (
    <AdminSidebarContext.Provider
      value={{
        sideBarOpen,
        setSideBarOpen,
        toggleSideBar,
        selectedNav,
        setSelectedNav,
        handleNavSelection,
        profileModalAnchor,
        setProfileModalAnchor,
      }}
    >
      {children}
    </AdminSidebarContext.Provider>
  );
};
