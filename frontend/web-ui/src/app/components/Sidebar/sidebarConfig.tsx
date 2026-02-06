// This file defines the primary navigation items for the Service Manager and Commissioner sidebars.
// Each item includes a key, label, icon, and group for use in sidebar navigation components.
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import LocationCityOutlinedIcon from '@mui/icons-material/LocationCityOutlined';
import ChecklistOutlinedIcon from '@mui/icons-material/ChecklistOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import SyncIcon from '@mui/icons-material/Sync';
import { type NavItem } from './CM_Sidebar';
import searchProperty from '../Sidebar/assets/action_key.svg'

const SearchPropertyIcon = () => (
  <img 
    src={searchProperty} 
    alt="Search Property" 
    style={{ width: '24px', height: '24px' }} 
  />
);

// Primary navigation items for the Service Manager sidebar
export const serviceManagerPrimaryItems: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: <DashboardOutlinedIcon />, group: 'primary' },
  { key: 'applicationInbox', label: 'Application Inbox', icon: <SyncIcon />, group: 'primary' },
  { key: 'searchProperty', label: 'Search Property', icon: <SearchPropertyIcon />, group: 'primary' },
  { key: 'allApplications', label: 'All Applications', icon: <ChecklistOutlinedIcon />, group: 'primary' },
  { key: 'mapView', label: 'Map View', icon: <MapOutlinedIcon />, group: 'primary' }
];

// Primary navigation items for the Commissioner sidebar
export const commissionerPrimaryItems: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: <DashboardOutlinedIcon />, group: 'primary' },
  { key: 'applicationApproval', label: 'Application Approval', icon: <CheckCircleOutlineIcon />, group: 'primary' },
  { key: 'searchProperty', label: 'Search Property', icon: <SearchPropertyIcon />, group: 'primary' },
  { key: 'allApplications', label: 'All Applications', icon: <ChecklistOutlinedIcon />, group: 'primary' }
];

export const adminPrimaryItems: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: <DashboardOutlinedIcon />, group: 'primary' },
  { key: 'userManagement', label: 'User Management', icon: <PeopleOutlinedIcon />, group: 'primary' },
  { key: 'demandGeneration', label: 'Demand Generation', icon: <SearchPropertyIcon />, group: 'primary' },
  { key: 'mapConfiguration', label: 'Map Configuration', icon: <MapOutlinedIcon />, group: 'primary' },
  { key: 'localization', label: 'Localization', icon: <LocationCityOutlinedIcon />, group: 'primary' },
  { key: 'accessControl', label: 'Access Control', icon: <SecurityOutlinedIcon />, group: 'primary' },
  {key: 'notificationManagement', label: 'Notifications', icon: <NotificationsOutlinedIcon />, group: 'primary' }
];
