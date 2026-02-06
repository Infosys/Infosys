// HomePage component for Agent portal: displays property list, map, filters, and actions
// Handles fetching, filtering, and paginating property data, as well as locale and notification popups
import React, { useState, useRef, useEffect, useMemo } from 'react';
import LocationOffIcon from '@mui/icons-material/LocationOff';
import { useNavigate } from 'react-router-dom';
import draftDeleteIcon from '../../../assets/AgentAssets/draft_delete.svg';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import MapComponent from '../../../components/common/MapComponent';
import '../../../styles/HomePage.css';
import '../../../styles/DraftPage.css';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import Layout from '../../features/Agent/components/Layout';
import type { NavigationTab, PropertyItem } from '../../../types';
import { fetchData, filterProperties } from '../../../services/dataService';
import type { DatabaseData } from '../../../services/dataService';
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded';
import { usePropertyForm } from '../../../context/PropertyFormContext';
import '../../../styles/globals.css';
import LocationMapWithDrawing from '../PropertyForm/LocationMapWithDrawing';
import Pagination from '../../features/Agent/components/Pagination';
import { SupportAgentRounded } from '@mui/icons-material';
import { useHomePageLocalization } from '../../../services/AgentLocalisation/localisation-homepage';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import ChangeLocalePopup from '../../../components/Popup/ChangeLocalePopup';
import { setAgentLang } from '../../../redux/LangSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/Hooks';
import {
  useGetAllPropertiesQuery,
  useGetDraftPropertiesQuery,
} from '../../features/Agent/api/homePageApi';
import { mapApplicationToPropertyItem } from '../../features/Agent/utils/propertyMapper';
import { useFormMode } from '../../../context/FormModeContext';
import { Button } from '@mui/material';
import { buttonStyleSx } from '../../../styles/ts-styles/Citizen/HomePage/ContinueButton.style';
import { useDeleteApplicationMutation } from '../../../redux/apis/applicationApi';
import { NotificationPopup } from '../../components/Popup/NotificationPopup';
import LoadingPage from '../../components/Loader';

type CalendarTab = 'All' | 'New' | 'Drafts' | 'Others';

interface HomePageProps {
  properties?: PropertyItem[];
  onDraftClick?: (propertyId?: string) => void;
}

const LOCALE_MISMATCH_POPUP_FLAG = 'citizenLocaleMismatchChecked';

const HomePage: React.FC<HomePageProps> = () => {
  // State management for pagination, filters, UI toggles, and data
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const navigate = useNavigate();
  const [data, setData] = useState<DatabaseData | null>(null);
  const [activeCalendarTab, setActiveCalendarTab] = useState<CalendarTab>('All');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [filteredProperties, setFilteredProperties] = useState<PropertyItem[]>([]);
  const { resetForm } = usePropertyForm();
  const [selectedDateSort, setSelectedDateSort] = useState<string>('');
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showChangeLocalePopup, setShowChangeLocalePopup] = useState(false);
  const dispatch = useAppDispatch();
  const loginLocale = localStorage.getItem('loginLocale') || 'en';
  const lang = useAppSelector((state) => state.lang.agentLang);

  // Fetch non-draft properties from API
  const {
    data: nonDraftResponse,
    isLoading: isLoadingNonDraft,
    error: nonDraftError,
  } = useGetAllPropertiesQuery({
    agentId: localStorage.getItem('user_id') || '',
  });

  // Fetch draft properties from API
  const {
    data: draftResponse,
    isLoading: isLoadingDraft,
    error: draftError,
  } = useGetDraftPropertiesQuery({
    agentId: localStorage.getItem('user_id') || '',
  });

  const isLoading = isLoadingNonDraft || isLoadingDraft;
  const error = nonDraftError || draftError;

  // Combine both API responses into a single property list
  const allProperties = useMemo(() => {
    const nonDrafts = nonDraftResponse?.data?.map(mapApplicationToPropertyItem) || [];
    const drafts = draftResponse?.data?.map(mapApplicationToPropertyItem) || [];
    return [...nonDrafts, ...drafts];
  }, [nonDraftResponse, draftResponse]);

  // Handle switching agent language to login locale
  const handleSwitchToLoginLocale = () => {
    dispatch(setAgentLang(loginLocale));
    setShowChangeLocalePopup(false);
    localStorage.setItem(LOCALE_MISMATCH_POPUP_FLAG, 'true');
  };

  // Close the locale mismatch popup
  const handleClosePopup = () => {
    setShowChangeLocalePopup(false);
    localStorage.setItem(LOCALE_MISMATCH_POPUP_FLAG, 'true');
  };

  const { mode, setMode } = useFormMode();

  const getDateSortLabel = (sortValue: string): string => {
    if (sortValue === 'earliest') return earliestText;
    if (sortValue === 'oldest') return oldestText;
    return dateLabelText;
  };

  // Localization: fetches localized strings for UI labels
  const {
    agentIdText,
    helpText,
    newPropertyText,
    allTabText,
    newTabText,
    draftsTabText,
    continueText,
    deleteText,
    savedText,
    noPropertiesText,
    noDataSelectedDateText,
    dateLabelText,
  } = useHomePageLocalization();

  // Helper function to get localized tab text for calendar tabs
  const getTabText = (tab: CalendarTab): string => {
    switch (tab) {
      case 'All':
        return allTabText;
      case 'New':
        return newTabText;
      case 'Drafts':
        return draftsTabText;
      case 'Others':
        return 'Others';
      default:
        return tab;
    }
  };

  // Click outside dropdown handler for closing custom dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDateDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (mode == 'none') {
      localStorage.removeItem('applicationId');
      localStorage.removeItem('propertyId');
      localStorage.removeItem('applicationLogId');
    }
  }, [mode]);

  // Load database data (not directly used in main UI, but may be for location info)
  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedData = await fetchData();
        setData(fetchedData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, []);

  // Filter properties based on selected tab and date
  // Filter properties based on selected tab and date
  useEffect(() => {
    let filtered = allProperties;

    if (activeCalendarTab !== 'Drafts' && activeCalendarTab !== 'Others') {
      const filterType = activeCalendarTab.toLowerCase() as 'all' | 'new';
      filtered = filterProperties(allProperties, filterType);
    } else if (activeCalendarTab === 'Drafts') {
      // Show only drafts
      filtered = allProperties.filter((property) => property.isDraft);
    }
    // For 'Others' tab, filtered remains as allProperties (empty logic can be added later)

    if (selectedDate && activeCalendarTab !== 'Drafts') {
      filtered = filtered.filter((property) => {
        const propertyDate = new Date(property.dueDate).toDateString();
        const selectedDateObj = new Date(selectedDate).toDateString();
        return propertyDate === selectedDateObj;
      });
    }

    // Apply date sorting if selected
    if (selectedDateSort === 'earliest') {
      filtered = [...filtered].sort(
        (a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
      );
    } else if (selectedDateSort === 'oldest') {
      filtered = [...filtered].sort(
        (a, b) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()
      );
    }

    setFilteredProperties(filtered);
  }, [allProperties, activeCalendarTab, selectedDate, selectedDateSort]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [activeCalendarTab, selectedDate, selectedDateSort]);

  // Handle navigation tab changes (home, search, inbox, notifications)
  const handleTabChange = (tab: NavigationTab) => {
    setActiveTab(tab);

    switch (tab) {
      case 'home':
        navigate('/agent');
        break;
      case 'search':
        navigate('/agent/search-property');
        break;
      case 'inbox':
        // inbox navigation - to be implemented
        navigate('/under-construction');
        break;
      case 'notifications':
        // notifications navigation - to be implemented
        navigate('/under-construction');
        break;
    }
  };

  // Handle calendar tab (All/New/Drafts) selection
  const handleCalendarTabClick = (tab: CalendarTab) => {
    setActiveCalendarTab(tab);
    if (tab !== 'Drafts') {
      setSelectedDate('');
      setShowCalendar(false);
    }
  };

  // Start new property application
  const handleNewPropertyClick = () => {
    resetForm();
    setMode('new');
    localStorage.removeItem('propertyId');
    localStorage.removeItem('applicationId');
    localStorage.removeItem('applicationLogId');
    navigate('/property-form/preliminary-information');
  };

  // Mutation hook for deleting applications
  const [deleteApplication] = useDeleteApplicationMutation();

  // Delete a draft property after confirmation
  const handleDeleteDraft = async (draftId: string) => {
    if (globalThis.window.confirm('Are you sure you want to delete this draft?')) {
      try {
        const response = await deleteApplication({ applicationId: draftId }).unwrap();

        if (response.success) {
          setPopup({
            type: 'success',
            title: 'Draft Deleted',
            message: response.message || 'Draft deleted successfully',
            open: true,
          });
        }
      } catch (error: any) {
        console.log(error);
      }
    }
  };

  // Handle date selection from date picker
  const onDateChange = (date: any) => {
    if (date === null) {
      setSelectedDate('');
      return;
    }
    const formattedDate = date ? dayjs(date).format('YYYY-MM-DD') : '';
    setSelectedDate(formattedDate);
  };

  // Get CSS class for property status badge
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'high':
        return 'status-high';
      case 'medium':
        return 'status-medium';
      case 'low':
        return 'status-low';
      default:
        return 'status-medium';
    }
  };

  // Continue editing a draft property
  const handleContinueClick = (draftId: string) => {
    const application = draftResponse?.data.find((app) => app.ID === draftId);

    const propertyId = application!.Property.ID || '';
    localStorage.setItem('propertyId', propertyId);
    if (application?.ID) {
      localStorage.setItem('applicationId', application.ID);
    }

    setMode('draft');
    navigate('/property-form/preliminary-information');
  };

  // View details/verification for a submitted property
  const handlePropertyClick = (applicationID: string) => {
    const application = nonDraftResponse?.data.find((app) => app.ID === applicationID);
    const propertyId = application?.Property.ID || '';
    localStorage.setItem('propertyId', propertyId);

    if (application?.ID) {
      localStorage.setItem('applicationLogId', application.ID);
      localStorage.setItem('applicationId', application.ID);
    }
    setMode('verify');
    navigate('/agent/verification/' + propertyId);
  };

  // Prepare property locations for map display
  const propertyLocations = useMemo(() => {
    // Filter properties based on active tab
    let propertiesForMap = filteredProperties;

    // For 'All' and 'New' tabs, exclude drafts
    if (activeCalendarTab === 'All' || activeCalendarTab === 'New') {
      propertiesForMap = filteredProperties.filter((prop) => !prop.isDraft);
    }

    return propertiesForMap
      .filter((prop) => prop.gisData?.latitude && prop.gisData?.longitude)
      .map((prop) => ({
        id: prop.id,
        applicationNo: prop.pId,
        lat: prop.gisData!.latitude,
        lng: prop.gisData!.longitude,
        address: prop.address,
        status: prop.status,
      }));
  }, [filteredProperties, activeCalendarTab]);

  // Handle sorting properties by date (earliest/oldest)
  const handleDateSortChange = (value: string) => {
    setSelectedDateSort(value);
    setShowDateDropdown(false);

    if (value === 'earliest') {
      const sorted = [...filteredProperties].sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      );
      setFilteredProperties(sorted);
    } else if (value === 'oldest') {
      const sorted = [...filteredProperties].sort(
        (a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
      );
      setFilteredProperties(sorted);
    }
  };

  // State for notification popup
  const [popup, setPopup] = useState<{
    type: 'success';
    title: string;
    message: string;
    open: boolean;
  }>({ type: 'success', title: '', message: '', open: false });

  // Show welcome popup on first login
  useEffect(() => {
    const popupFlag = sessionStorage.getItem('showWelcomePopup');
    if (popupFlag === 'true') {
      setPopup({
        type: 'success',
        title: 'Successfully Logged In!',
        message: 'Welcome to Property Tax - Agent Portal!',
        open: true,
      });
      sessionStorage.removeItem('showWelcomePopup');
    }
  }, []);

  // Show success popup after property creation
  useEffect(() => {
    const showSuccess = localStorage.getItem('showSuccessPropCreation');
    if (showSuccess === 'true') {
      setPopup({
        type: 'success',
        title: 'Success!',
        message:
          localStorage.getItem('successMessage') || 'Operation completed successfully!',
        open: true,
      });
      localStorage.removeItem('propertyNo');
      localStorage.removeItem('showSuccessPropCreation');
    }
  }, [localStorage.getItem('showSuccessPropCreation')]);

  // Show locale mismatch popup if agent language differs from login locale
  useEffect(() => {
    const alreadyChecked = localStorage.getItem(LOCALE_MISMATCH_POPUP_FLAG);
    if (alreadyChecked !== 'true' && alreadyChecked !== null) {
      if (lang && loginLocale && lang !== loginLocale) {
        setShowChangeLocalePopup(true);
      }
    }
  }, [lang, loginLocale]);

  // Date sorting options for dropdown
  const earliestText = "New to Old";
  const oldestText = "Old to New";
  const dateOptions = useMemo(
    () => [
      { id: '', label: dateLabelText },
      { id: 'earliest', label: earliestText },
      { id: 'oldest', label: oldestText },
    ],
    [dateLabelText, earliestText, oldestText]
  );

  // CLIENT-SIDE PAGINATION
  // Calculate total pages based on filtered properties
  const totalPages = useMemo(() => {
    return Math.ceil(filteredProperties.length / pageSize);
  }, [filteredProperties.length, pageSize]);

  // Get paginated properties for current page
  const paginatedProperties = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredProperties.slice(startIndex, endIndex);
  }, [filteredProperties, page, pageSize]);

  // Prepare draft property cards for display
  const draftProperties = paginatedProperties
    .filter((property) => property.isDraft)
    .map((property) => ({
      id: property.id,
      pid: property.propertyNo,
      title: `${property.address.split(',')[0]} Property - Draft`,
      description: property.description,
      address: property.address,
      savedDate: `${savedText}: ${new Date(property.createdDate || '').toLocaleDateString(
        'en-US',
        {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }
      )}`,
      dueDate: new Date(property.dueDate).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }),
    }));

// Helper function to render map or location unavailable message
const renderPropertyMap = (propertyId: string) => {
  const loc = propertyLocations.find((pl) => pl.id === propertyId);
  
  if (loc && typeof loc.lat === "number" && typeof loc.lng === "number") {
    return (
      <div className="thumbnail-map-container">
        <LocationMapWithDrawing
          center={[loc.lat, loc.lng]}
          onLocationUpdate={() => {}}
          readOnly={true}
        />
      </div>
    );
  }
  
  return (
    <div className="no-location-message">
      <span> <LocationOffIcon /></span>{''}
      Location not available
    </div>
  );
};

// Helper function to render a single draft property card
const renderDraftCard = (draft: typeof draftProperties[0]) => {
  return (
    <div key={draft.id} className="draft-property-card">
      <div className="draft-header">
        <h3 className="draft-title">{draft.title}</h3>
        <button
          className="draft-delete-button"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteDraft(draft.id);
          }}
          aria-label={deleteText}
        >
          <img
            src={draftDeleteIcon}
            alt={deleteText}
            style={{ width: 20, height: 20 }}
          />
        </button>
      </div>
      <div className="draft-card-parent">
        <div className="draft-card-content">
          <p className="draft-id">{draft.pid}</p>
          <div className="draft-meta">
            <span className="saved-info">
              <AccessAlarmIcon /> {draft.savedDate}
            </span>
          </div>
          <div className="draft-address">
            <span className="location-icon">
              <svg
                width="16"
                height="16"
                viewBox="0 0 28 28"
                fill="currentColor"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
            </span>
            <span>{draft.address}</span>
          </div>
        </div>
        <div className="draft-card-map">
          <div className="property-card-map-placeholder">
            {renderPropertyMap(draft.id)}
          </div>
        </div>
      </div>
      <div className="draft-footer">
        <Button sx={buttonStyleSx}>{draft.dueDate}</Button>
        <button
          className="continue-button"
          onClick={() => {
            handleContinueClick(draft.id);
          }}
        >
          {continueText}
        </button>
      </div>
    </div>
  );
};

// Helper function to render a single property card
const renderPropertyCard = (item: PropertyItem) => {
  const showGreenTick = !item.isNew && !item.isDraft;

  return (
    <div
      key={item.id}
      className="property-card"
      onClick={() => handlePropertyClick(item.id)}
    >
      <div className="property-card-inner">
        <div className="property-card-left">
          <div className="property-card-id">{item.pId}</div>
          <div className="property-card-status-section">
            <span className={`status-badge ${getStatusColor(item.status)}`}>
              {item.status}
            </span>
          </div>
          <div className="property-card-field">
            <div className="property-field-label">Category ID</div>
            <div className="property-field-value">
              {item.description || item.pId}
            </div>
          </div>
          <div className="property-card-field">
            <div className="property-field-label">Address</div>
            <div className="property-field-value">{item.address}</div>
          </div>
        </div>
        <div className="property-card-right">
          <div className="property-card-map-placeholder">
            {renderPropertyMap(item.id)}
          </div>
          {!showGreenTick && (
            <div className="property-card-date-badge">
              {new Date(item.dueDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function to render draft properties
const renderDrafts = () => {
  if (draftProperties.length > 0) {
    return draftProperties.map(renderDraftCard);
  }
  
  return (
    <div className="no-properties">
      <p>{noPropertiesText}</p>
    </div>
  );
};

// Helper function to render regular properties
const renderRegularProperties = () => {
  if (paginatedProperties.length > 0) {
    return paginatedProperties.map(renderPropertyCard);
  }

  // No properties found
  if (selectedDate) {
    return (
      <div className="no-properties">
        <p>{noDataSelectedDateText}</p>
      </div>
    );
  }

  return (
    <div className="no-properties">
      <p>{noPropertiesText}</p>
    </div>
  );
};

// Main helper function to render property list based on active tab
const renderPropertyList = () => {
  // Handle 'Others' tab
  if (activeCalendarTab === "Others") {
    return (
      <div className="no-properties">
        {/* Other Properties tab is under construction. */}
      </div>
    );
  }

  // Handle 'Drafts' tab
  if (activeCalendarTab === "Drafts") {
    return renderDrafts();
  }

  // Handle 'All' and 'New' tabs (regular properties)
  return renderRegularProperties();
};

  // Show loading state while fetching properties
  if (isLoading) {
    return <LoadingPage message="Brewing up your content..." />;
  }

  // Show error state if property fetch fails
  if (error) {
    return (
      <Layout
        activeTab={activeTab}
        onTabChange={handleTabChange}
        showNavigation={true}
        headerProps={{
          showLanguage: true,
          showProfile: true,
          locationText: data?.location.address || 'Loading...',
        }}
      >
        <div className="home-page">
          <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
            Error loading properties. Please try again later.
          </div>
        </div>
      </Layout>
    );
  }

  // Main render: layout, popups, map, filters, property list, and pagination
  return (
    <>
      <ChangeLocalePopup
        open={showChangeLocalePopup}
        currentLang={lang}
        loginLocale={loginLocale}
        onAccept={handleSwitchToLoginLocale}
        onClose={handleClosePopup}
      />
      <NotificationPopup
        type={popup.type}
        open={popup.open}
        title={popup.title}
        message={popup.message}
        duration={3000}
        onClose={() => setPopup((p) => ({ ...p, open: false }))}
      />

      <Layout
        activeTab={activeTab}
        onTabChange={handleTabChange}

        showNavigation={true}
        headerProps={{
          showLanguage: true,
          showProfile: true,
          locationText: data?.location.address || 'Loading...',
        }}
      >
        <div className="home-page">
          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="action-btn agent-btn2">
              <div className="btn-icon agent-icon">
                <BadgeOutlinedIcon style={{ width: 45, height: 50 }} />
              </div>
              <span className="btn-text">{agentIdText}</span>
            </button>

            <button className="action-btn help-btn">
              <div className="btn-icon help-icon">
                <SupportAgentRounded style={{ width: 45, height: 50 }} />
              </div>
              <span className="btn-text">{helpText}</span>
            </button>
          </div>

          {/* Map Section */}
          <div
            className="map-frame"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <MapComponent properties={propertyLocations} />
          </div>

          {/* Add New Property button */}
          <div className="property-section-buttons">
            <button
              className="property-btn"
              type="button"
              aria-label="Add new property"
              onClick={() => handleNewPropertyClick()}
            >
              <span className="add-property-content">{newPropertyText}</span>
            </button>

            {/* uncomment below code when the no dues generation is to be enabled */}
            {/* <button
              className="property-btn"
              type="button"
              aria-label="Add new property"
              onClick={() => "" }
            >
              <span className="add-property-content">Generate no dues</span>
            </button> */}
          </div>

          {/* Filter and Map Section */}
          <div style={{ marginLeft: '5%' }} className="filter-section">
            <div className="calendar-map-row">
              <div
                className="calendar-header"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <svg
                  onClick={() => setShowCalendar(true)}
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                </svg>

                <DatePicker
                  value={selectedDate ? dayjs(selectedDate) : null}
                  onChange={onDateChange}
                  open={showCalendar}
                  onClose={() => setShowCalendar(false)}
                  onAccept={() => setShowCalendar(false)}
                  slotProps={{
                    textField: {
                      style: { display: 'none' },
                    },
                    actionBar: {
                      actions: ['clear', 'accept'],
                    },
                  }}
                />
                {selectedDate && (
                  <button
                    type="button"
                    style={{
                      marginLeft: '0px',
                      cursor: 'pointer',
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      font: 'inherit',
                      color: 'inherit',
                    }}
                    onClick={() => setShowCalendar(true)}
                    aria-label="Open calendar to change date"
                  >
                    {new Date(selectedDate).toLocaleDateString()}
                  </button>
                )}
              </div>

              <button
                className={`checkbox`}
                onClick={() => navigate('/agent/reviewed-properties')}
                aria-pressed={false}
                title="View reviewed properties"
              >
                <span>
                  <CheckBoxRoundedIcon />
                </span>
              </button>

              {/* Custom Dropdown Component */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  justifyContent: 'end',
                  width: '100%',
                }}
              >
                <div
                  ref={dropdownRef}
                  className="dropdown-container dropdown-container-date-sort"
                  style={{ position: 'relative' }}
                >
                  <button
                    type="button"
                    className="dropdown-button"
                    onClick={() => setShowDateDropdown(!showDateDropdown)}
                    style={{
                      width: '120px',
                      height: '36px',
                      padding: '6px 32px 6px 12px',
                      borderRadius: '16px',
                      marginRight: '16px',
                      border: '1.5px solid #c84c03',
                      cursor: 'pointer',
                      backgroundColor: 'white',
                      fontSize: '14px',
                      display: 'flex',
                      backgroundOrigin: 'transparent',
                      color: selectedDateSort ? '#000' : '#666',
                    }}
                  >
                    <span
                      style={{
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {getDateSortLabel(selectedDateSort)}
                    </span>
                    <ArrowDropDownOutlinedIcon
                      className="dropdown-arrow"
                      style={{
                        transition: '0',
                        flexShrink: 0,
                        color: '#C84A00',
                        marginRight: '20px',
                        marginBottom: '20px',
                      }}
                    />
                  </button>
                  {showDateDropdown && (
                    <div
                      className="dropdown-menu"
                      style={{
                        position: 'absolute',                        
                        top: '100%',
                        right: '0',
                        marginTop: '4px',
                        marginRight: '30px',
                        backgroundColor: 'white',
                        border: '2px solid #fff',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        zIndex: 1000,
                        width: '120px',
                        overflow: 'hidden',
                      }}
                    >
                      {dateOptions.map((opt, index) => (
                        <button
                          key={opt.id}
                          type="button"
                          className={'dropdown-option'}
                          onClick={() => handleDateSortChange(opt.id)}
                          style={{
                            backgroundColor: 'white',
                            cursor: 'pointer',
                            fontSize: '14px',
                            color: opt.id === '' ? '#666' : '#000',
                            border: 'none',
                            borderBottom:
                              index < dateOptions.length - 1
                                ? '1px solid #f0f0f0'
                                : 'none',
                            width: '100%',
                            textAlign: 'left',
                            padding: '8px 12px',
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = '#f5f5f5')
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              opt.id === selectedDateSort ? '#f5f5f5' : 'white')
                          }
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Calendar tabs */}
            <div className="calendar-tabs">
              {/* ['All', 'New', 'Drafts', 'Others' ] add others tab in the below array to render the other tab */}
              {(['All', 'New', 'Drafts'] as CalendarTab[]).map((tab) => (
                <button
                  key={tab}
                  className={`cal-tab ${tab.toLowerCase()} ${
                    activeCalendarTab === tab ? 'active' : ''
                  }`}
                  onClick={() => handleCalendarTabClick(tab)}
                >
                  {activeCalendarTab === tab && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                  )}
                  <span className="tab-label">{getTabText(tab)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Property Items List - USING PAGINATED DATA */}
          <div className="property-list">
            {renderPropertyList()}

            {/* Pagination - show only if there are multiple pages and not on Others tab */}
            {activeCalendarTab !== 'Others' &&
              filteredProperties.length > 0 &&
              totalPages > 1 && (
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={(newPage) => setPage(newPage)}
                />
              )}
          </div>
        </div>
      </Layout>
    </>
  );
};

// Export the HomePage component as default
export default HomePage;
