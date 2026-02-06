import React, { useState, useEffect, useRef } from 'react';
import BottomNavigation from '../components/BottomNavigation';
import '../../../../styles/Layout.css';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../../../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../../context/LanguageContext';
import { useAppLocalization } from '../../../../services/AgentLocalisation/localisation-search-property';
import translateIndicSvg from '../../../assets/Citizen/home_page/translate_indic.svg';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';

type NavigationTab = 'home' | 'inbox' | 'notifications' | 'search';
 
interface AgentUser {
  id: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  zoneData: {
    zoneNumber: string;
    wards: string[];
  }[];
  preferredLanguage: string;
  profile: {
    firstName: string;
    lastName: string;
    fullName: string;
    phoneNumber: string;
    adhaarNo: number;
    gender: string;
    address: {
      addressLine1: string;
      addressLine2: string | null;
      city: string;
      state: string;
      pinCode: string;
    };
    department: string;
    designation: string;
  };
  createdDate: string;
  updatedDate: string;
  createdBy: string;
  updatedBy: string;
}
 
interface LayoutProps {
  children: React.ReactNode;
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  showNavigation?: boolean;
  hideLocationIcon?: boolean;
  headerProps?: {
    title?: string;
    showBackButton?: boolean;
    onBack?: () => void;
    showLanguage?: boolean;
    showProfile?: boolean;
    showHome?: boolean;
    onHome?: () => void;
    locationText?: string;
    onLanguageSelect?: (locale: string) => void;
    currentLocale?: string;
    jurisdictionText?: string;
    languageText?: string;
    profileText?: string;
    logoutText?: string;
    homeNavText?: string;
    inboxNavText?: string;
    insightsNavText?: string;
    searchNavText?: string;
  };
}
 
const Layout: React.FC<LayoutProps> = ({
  children,
  activeTab,
  onTabChange,
  showNavigation = true,
  hideLocationIcon = false,
  headerProps = {},
}) => {
  const { logout } = useAuth();
  const { locale, setLocale } = useLanguage();
  const { jurisdictionText, languageText, profileText, logoutText } =
    useAppLocalization();
  // Read agent user from sessionStorage
  const agentUser: AgentUser | null = (() => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  })();
  const zoneData = agentUser?.zoneData || [];
  const [selectedZoneIndex, setSelectedZoneIndex] = useState(0);
  const [selectedWard, setSelectedWard] = useState<string>(
    zoneData?.[0]?.wards?.[0] || ''
  );
 
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const languageRef = useRef<HTMLButtonElement>(null);
  const locationPopupRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'kn', name: 'ಕನ್ನಡ' },
  ];
 
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
 
      // Profile dropdown
      if (profileRef.current && !profileRef.current.contains(target)) {
        setShowProfileDropdown(false);
      }
 
      // Language dropdown
      if (languageRef.current && !languageRef.current.contains(target)) {
        setShowLanguageDropdown(false);
      }
 
      // Location popup (with MUI Select support)
      if (showLocationPopup) {
        const popup = locationPopupRef.current;
 
        // If clicking inside the location popup, ignore
        if (popup?.contains(target)) return;
 
        // If clicking inside MUI Select menu, ignore
        const popoverMenu = document.querySelector('.MuiPopover-root,.MuiMenu-root');
        if (popoverMenu?.contains(target)) return;
 
        // If clicking outside, close
        setShowLocationPopup(false);
      }
    };
 
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLocationPopup]);
 
  const handleProfileClick = () => {
    navigate('/profile');
  };
 
  const handleLanguageClick = () => {
    setShowLanguageDropdown(!showLanguageDropdown);
  };
 
  const handleLanguageSelect = (langCode: string) => {
    setLocale(langCode);
    setShowLanguageDropdown(false);
  };
 
  const handleLogout = () => {
    logout();
    setShowProfileDropdown(false);
    navigate('/login');
  };
 
  const handleZoneSelect = (i: number) => {
    setSelectedZoneIndex(i);
    setSelectedWard(zoneData[i]?.wards?.[0] || '');
  };
 
  const handleWardSelect = (ward: string) => {
    setSelectedWard(ward);
  };
 
  const handleJurisdictionConfirm = () => {
    setShowLocationPopup(false);
    // Here you can save selected zone/ward if needed elsewhere
  };
 
  // Extract left icon area rendering logic
  const renderLeftIconArea = () => {
    if (headerProps.showBackButton && headerProps.onBack) {
      return (
        <button
          className="icon-btn back-btn"
          onMouseDown={(e) => (e.currentTarget as HTMLButtonElement).blur()}
          onClick={headerProps.onBack}
          aria-label="Back"
        >
          <KeyboardBackspaceOutlinedIcon
            style={{ background: '#FBEEE8', borderRadius: '50%', color: '#939393' }}
          />
        </button>
      );
    }
 
    if (hideLocationIcon) {
      return null;
    }
 
    return (
      <div style={{ position: 'relative', minWidth: 240 }}>
        <button
          className="location-pill"
          onClick={() => setShowLocationPopup(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setShowLocationPopup(true);
            }
          }}
          tabIndex={0}
          style={{ cursor: 'pointer' }}
          aria-label="Location"
        >
          <div className="location-icon-zone-ward-row">
            <LocationOnOutlinedIcon
              style={{ marginRight: 8, verticalAlign: 'middle', fontSize: 24 }}
            />
            <div>
              <span className="jurisdiction-label-mini">{jurisdictionText}</span>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 10,
                  justifyContent: 'center',
                }}
              >
                <div
                  className="location-zone"
                  style={{ fontWeight: 350, fontSize: 16 }}
                >
                  {zoneData[selectedZoneIndex]?.zoneNumber ?? ''}
                </div>
                <div
                  className="location-ward"
                  style={{ fontWeight: 350, fontSize: 16 }}
                >
                  {selectedWard}
                </div>
              </div>
            </div>
          </div>
        </button>
        {/* Location Popup */}
        {showLocationPopup && (
          <div className="location-popup-backdrop">
            <div
              className="location-popup"
              ref={locationPopupRef}
              style={{ minWidth: 340 }}
            >
              <div className="location-popup-header">
                <span className="location-popup-title">
                  Select Zone &amp; Ward
                </span>
                <button
                  className="location-popup-close"
                  onClick={() => setShowLocationPopup(false)}
                >
                  &times;
                </button>
              </div>
              <div className="popup-form-mui">
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel id="zone-label">Zone</InputLabel>
                  <Select
                    labelId="zone-label"
                    value={selectedZoneIndex}
                    label="Zone"
                    onChange={(e) => handleZoneSelect(Number(e.target.value))}
                    size="small"
                    sx={{ background: '#f5faff', borderRadius: 2, fontSize: 16 }}
                  >
                    {zoneData.map((zone, idx) => (
                      <MenuItem
                        key={zone.zoneNumber}
                        value={idx}
                        sx={{
                          fontWeight: selectedZoneIndex === idx ? 600 : 400,
                          fontSize: 16,
                          bgcolor:
                            selectedZoneIndex === idx ? '#eaf3ff' : 'inherit',
                          '&.Mui-selected': {
                            backgroundColor: '#edf6ff !important',
                          },
                        }}
                      >
                        {zone.zoneNumber}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel id="ward-label">Ward</InputLabel>
                  <Select
                    labelId="ward-label"
                    value={selectedWard}
                    label="Ward"
                    onChange={(e) => handleWardSelect(e.target.value)}
                    size="small"
                    sx={{ background: '#f5faff', borderRadius: 2, fontSize: 16 }}
                  >
                    {zoneData[selectedZoneIndex]?.wards?.map((ward) => (
                      <MenuItem
                        key={ward}
                        value={ward}
                        sx={{
                          fontWeight: selectedWard === ward ? 600 : 400,
                          fontSize: 16,
                          bgcolor: selectedWard === ward ? '#eaf3ff' : 'inherit',
                          '&.Mui-selected': {
                            backgroundColor: '#edf6ff !important',
                          },
                        }}
                      >
                        {ward}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <Button
                sx={{
                  mt: 1,
                  padding: '6px 24px',
                  borderRadius: '6px',
                  background: '#1976d2',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '15px',
                  boxShadow: '0 2px 6px rgba(30,110,218,0.10)',
                  '&:hover': { background: '#1563b9' },
                }}
                onClick={handleJurisdictionConfirm}
              >
                Confirm
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };
 
  return (
    <div className="mobile-app">
      <main className={`main-content ${showNavigation ? 'with-navigation' : ''}`}>
        <div className="main-icons" aria-hidden={false}>
          <div
            className="left-icon-area"
            style={{
              background: 'none',
              borderRadius: '0',
              height: 'initial',
              marginBottom: '0',
              marginLeft: '0',
            }}
          >
            {renderLeftIconArea()}
          </div>
 
          {headerProps.title && (
            <div className="center-title" aria-hidden="true">
              <div className="page-title">{headerProps.title}</div>
            </div>
          )}
 
          <div className="icons-right">
            {headerProps.showLanguage && (
              <button
                className="icon-action language-action"
                style={{ position: 'relative', cursor: 'pointer' }}
                ref={languageRef}
                onClick={handleLanguageClick}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleLanguageClick();
                  }
                }}
                tabIndex={0}
              >
                <div
                  className="icon-btn language-btn"
                  aria-hidden="true"
                  style={{ cursor: 'pointer', pointerEvents: 'none' }}
                >
                  <img
                    src={translateIndicSvg}
                    alt="Language translate"
                    style={{
                      width: '35px',
                      height: '35px',
                      alignItems: 'center',
                      pointerEvents: 'none',
                    }}
                  />
                </div>
                <span
                  className="action-label"
                  style={{ marginLeft: '2px', cursor: 'pointer', pointerEvents: 'none' }}
                >
                  {languageText}
                </span>
                {showLanguageDropdown && (
                  <div className="profile-dropdown" style={{ zIndex: 1000 }}>
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        className="dropdown-item"
                        onClick={() => handleLanguageSelect(lang.code)}
                        style={{
                          backgroundColor:
                            locale === lang.code ? '#f0f0f0' : 'transparent',
                          fontWeight: locale === lang.code ? 'bold' : 'normal',
                        }}
                      >
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </button>
            )}
            {headerProps.showHome && (
              <div
                className="icon-action home-action"
                // tabIndex={0}
                aria-label="Home"
                onMouseDown={(e) => (e.currentTarget as HTMLElement).blur()}
              >
                <button
                  className="icon-btn home-btn"
                  onMouseDown={(e) => (e.currentTarget as HTMLButtonElement).blur()}
                  onClick={headerProps.onHome}
                  // aria-hidden={true}
                >
                  <HomeOutlinedIcon
                    style={{
                      borderRadius: '50%',
                      background: '#F7E4DB',
                      color: '#1C1B1F66',
                    }}
                  />
                </button>
              </div>
            )}
            {headerProps.showProfile && (
              <div className="icon-action profile-action" ref={profileRef}>
                <div
                  className="icon-btn profile-btn"
                  aria-hidden={true}
                  onClick={handleProfileClick}
                  style={{ cursor: 'pointer' }}
                  onMouseDown={(e) => (e.currentTarget as HTMLElement).blur()}
                >
                  <AccountCircleOutlinedIcon sx={{ color: '#000', fontSize: 24 }} />
                </div>
                <span
                  className="action-label"
                  onClick={handleProfileClick}
                  style={{ cursor: 'pointer' }}
                >
                  {profileText}
                </span>
                {showProfileDropdown && (
                  <div className="profile-dropdown">
                    <button className="dropdown-item" onClick={handleLogout}>
                      <LogoutIcon style={{ marginRight: '8px', fontSize: '18px' }} />
                      <span>{logoutText}</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {children}
      </main>
      {showNavigation && (
        <BottomNavigation activeTab={activeTab} onTabChange={onTabChange} />
      )}
    </div>
  );
};
export default Layout;