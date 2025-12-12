// BottomNavigation renders the bottom tab bar for Agent screens.
// Displays navigation tabs for Home, Inbox, Notifications, and Search.
// Highlights the active tab and handles tab changes via props.
// Uses MUI icons and localized tab labels.

import React from 'react';
import '../../../../styles/BottomNavigation.css';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import SearchIcon from '@mui/icons-material/Search';
import DraftsOutlinedIcon from '@mui/icons-material/DraftsOutlined';
import DraftsIcon from '@mui/icons-material/Drafts';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import HomeIcon from '@mui/icons-material/Home';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import NotificationsIcon from '@mui/icons-material/Notifications';

import { useAppLocalization } from '../../../../services/AgentLocalisation/localisation-search-property';


// NavigationTab type defines available tabs
type NavigationTab = 'home' | 'inbox' | 'notifications' | 'search';


// Props for BottomNavigation:
//   - activeTab: currently selected tab
//   - onTabChange: callback for tab change
interface BottomNavigationProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
}


const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange
}) => {
  // Get localized tab labels
  const { homeNavText, inboxNavText, NotificationsNavText, searchNavText } = useAppLocalization();
  
  // Handle tab click and notify parent
  const handleTabClick = (tabId: NavigationTab) => {
    onTabChange(tabId);
  };

  // Define navigation items with icons and labels
  const navItems = [
    {
      id: 'home' as NavigationTab,
      label: homeNavText,
      icon: activeTab === 'home' ? (
        <HomeIcon style={{ color: '#000' }} />
      ) : (
        <HomeOutlinedIcon style={{ color: '#666' }} />
      )
    },
    {
      id: 'inbox' as NavigationTab,
      label: inboxNavText,
      icon: activeTab === 'inbox' ? (
        <DraftsIcon style={{ color: '#000' }} />
      ) : (
        <DraftsOutlinedIcon style={{ color: '#666' }} />
      )
    },
    {
      id: 'notifications' as NavigationTab,
      label: NotificationsNavText,
      icon: activeTab === 'notifications' ? (
        <NotificationsIcon style={{ color: '#000' }} />
      ) : (
        <NotificationsNoneOutlinedIcon style={{ color: '#666' }} />
      )
    },
    {
      id: 'search' as NavigationTab,
      label: searchNavText,
      icon: activeTab === 'search' ? (
        <SearchIcon style={{ color: '#000' }} />
      ) : (
        <SearchOutlinedIcon style={{ color: '#666' }} />
      )
    }
  ];

  // Render bottom navigation bar with tab buttons
  return (
    <div className="bottom-navigation" style={{height:'80px'}}>
      {navItems.map((item) => (
        <button
          key={item.id}
          className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
          onMouseDown={(e) => (e.currentTarget as HTMLButtonElement).blur()}
          onClick={() => handleTabClick(item.id)}
          aria-label={item.label}
        >
          <div className="nav-icon">
            {item.icon}
          </div>
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </div>
  );
};


// Export BottomNavigation for use in Agent screens
export default BottomNavigation;