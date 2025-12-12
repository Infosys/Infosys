// ReviewedProperty: Agent view for listing, searching, and filtering reviewed properties with map and pagination
import React, { useState, useRef, useEffect, useMemo } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from 'react-router-dom';
import Layout from '../../features/Agent/components/Layout';
import type { NavigationTab, PropertyItem } from '../../../types';
import LocationMapWithDrawing from '../PropertyForm/LocationMapWithDrawing';
import Pagination from '../../features/Agent/components/Pagination';
import { useReviewedPropertyLocalization } from '../../../services/AgentLocalisation/localisation-reviewedProperty';
import { useGetApplicationsQuery } from '../../features/Agent/api/reviewPageApi';
import '../../../styles/HomePage.css';
import '../../../styles/ReviewedProperty.css';

// Props for the custom dropdown filter component
interface CustomDropdownProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  width?: number | string;
  placeholder?: string;
  className?: string;
}

// Custom dropdown component for date sorting
const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  value,
  onChange,
  width = 120,
  placeholder = 'Select',
  className = '',
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selected = options.find(opt => opt.value === value);

  return (
    <div
      ref={ref}
      className={`custom-dropdown ${className}`}
      style={{ width, minWidth: width, maxWidth: width, position: 'relative' }}
    >
      <button
        type="button"
        className="custom-dropdown-btn"
        onClick={() => setOpen(o => !o)}
        style={{
          width: '120px',
          minWidth: '120px',
          maxWidth: '120px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          textAlign: 'right',
          border: '2px solid #C6561A',
          borderRadius: '32px'
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span style={{ flex: 1, textAlign: 'center' }}>{selected ? selected.label : placeholder}</span>
        <span className="custom-dropdown-arrow" style={{ marginLeft: 8, display: 'flex', alignItems: 'center' }}>
          <KeyboardArrowDownIcon style={{ fontSize: 20, color: '#000' }} />
        </span>
      </button>
      {open && (
        <ul
          className="custom-dropdown-list"
          style={{
            width: '120px',
            minWidth: '120px',
            maxWidth: '120px',
            position: 'absolute',
            left: 0,
            top: '100%',
            zIndex: 1000,
            background: '#fff',
            border: '1.5px solid #000',
            borderRadius: 12,
            margin: 0,
            padding: 0,
            listStyle: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}
          role="listbox"
        >
          {options.map(opt => (
            <li
              key={opt.value}
              className={`custom-dropdown-item${opt.value === value ? ' selected' : ''}`}
              style={{
                padding: '10px 16px',
                cursor: 'pointer',
                background: opt.value === value ? '#f5f5f5' : '#fff',
                color: '#000',
                fontWeight: 500,
                fontSize: 14,
                borderBottom: '1px solid #f0f0f0',
                borderRadius: 0
              }}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              role="option"
              aria-selected={opt.value === value}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Main component for reviewed property list page
const ReviewedProperty: React.FC = () => {
  const loc = useReviewedPropertyLocalization();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDateSort, setSelectedDateSort] = useState('');

  // Get assigned agent ID from localStorage (fallback to default)
  const assignedAgent = localStorage.getItem('agentId') || 'e09421f8-ab1a-4e62-a96b-5b26dff739ef';

  // RTK Query - fetch reviewed property applications
  const { data: apiResponse, isLoading, error } = useGetApplicationsQuery({ 
    AssignedAgent: assignedAgent 
  });

  // Convert API applications to PropertyItem format for display
  const allProperties = useMemo((): PropertyItem[] => {
    if (!apiResponse?.data) return [];
    
    return apiResponse.data.map(app => ({
      id: app.ID,
      pId: app.ApplicationNo,
      description: app.Property?.PropertyType || 'N/A',
      address: app.Property?.Address 
        ? `${app.Property.Address.Street}, ${app.Property.Address.Locality}, ${app.Property.Address.ZoneNo}`
        : 'Address not available',
      status: app.Status,
      dueDate: new Date(app.DueDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      isNew: false,
      isDraft: app.IsDraft,
      createdDate: app.CreatedAt,
      type: app.Property?.OwnershipType || 'N/A',
      phoneNumber: '',
      area: '',
      propertyType: app.Property?.PropertyType || 'N/A',
      isVerified: app.Status === 'AUDIT_VERIFIED',
    }));
  }, [apiResponse]);

  // Filter properties by search query and sort by date
  const filteredProperties = useMemo(() => {
    let filtered = allProperties;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.pId.toLowerCase().includes(query) ||
          p.address.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    // Sort by date if selected
    if (selectedDateSort === 'earliest') {
      filtered = [...filtered].sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      );
    } else if (selectedDateSort === 'oldest') {
      filtered = [...filtered].sort(
        (a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
      );
    }

    return filtered;
  }, [allProperties, searchQuery, selectedDateSort]);

  // Client-side pagination for property cards
  const paginatedProperties = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredProperties.slice(startIndex, endIndex);
  }, [filteredProperties, page, pageSize]);

  // Calculate total number of pages
  const totalPages = useMemo(() => {
    return Math.ceil(filteredProperties.length / pageSize);
  }, [filteredProperties.length, pageSize]);

  // Reset to page 1 when search or sort changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedDateSort]);

  // Extract property locations for map display
  const propertyLocations = useMemo(() => {
    if (!apiResponse?.data) return [];
    
    return apiResponse.data
      .filter(app => app.Property?.GISData?.Coordinates && app.Property.GISData.Coordinates.length > 0)
      .map(app => ({
        id: app.ID,
        applicationNo: app.ApplicationNo,
        lat: app.Property!.GISData!.Coordinates[0].Latitude,
        lng: app.Property!.GISData!.Coordinates[0].Longitude,
        address: app.Property?.Address
          ? `${app.Property.Address.Street}, ${app.Property.Address.Locality}`
          : 'Address not available',
        status: app.Status === 'AUDIT_VERIFIED' ? 'Low' : 'High',
      }));
  }, [apiResponse]);

  // Handle navigation tab changes (home, search, etc.)
  const handleTabChange = (tab: NavigationTab) => {
    switch (tab) {
      case 'home': navigate('/agent'); break;
      case 'search': navigate('/agent/search'); break;
      case 'inbox': break;
      case 'notifications': break;
    }
  };

  // Navigate to property information submitted page
  const handlePropertyClick = (_propertyId: string) => {
    navigate('/PropertyInformationSubmitted');
  };

  // Handle date sort dropdown change
  const handleDateSortChange = (value: string) => {
    setSelectedDateSort(value);
  };

  // Show loading state while fetching properties
  if (isLoading) {
    return (
      <Layout
        activeTab="home"
        onTabChange={handleTabChange}
        showHeader={false}
        showNavigation={false}
        hideLocationIcon={true}
      >
        <div className="reviewed-property-page">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            Loading reviewed properties...
          </div>
        </div>
      </Layout>
    );
  }

  // Show error state if property fetch fails
  if (error) {
    return (
      <Layout
        activeTab="home"
        onTabChange={handleTabChange}
        showHeader={false}
        showNavigation={false}
        hideLocationIcon={true}
      >
        <div className="reviewed-property-page">
          <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
            Error loading reviewed properties. Please try again later.
          </div>
        </div>
      </Layout>
    );
  }

  // Main render: layout, header, search/filter, property cards, and pagination
  return (
    <Layout
      activeTab="home"
      onTabChange={handleTabChange}
      showHeader={false}
      showNavigation={false}
      hideLocationIcon={true}
    >
      <div className="reviewed-property-page">
        {/* HEADER */}
        <div style={{ padding: '24px 16px 0 16px' }}>
          <button
            onClick={() => navigate("/agent")}
            aria-label="Back"
            style={{
              background: 'transparent',
              border: '1px solid #E0E0E0',
              borderRadius: '20px',
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              marginBottom: '16px',
              color: '#FC670C',
              fontSize: '15px',
              fontWeight: 500
            }}
          >
            <ArrowBackIosIcon style={{ fontSize: '18px' }} />
            <span>{loc.previousText}</span>
          </button>
          <h1 className="reviewed-title" style={{ margin: 0, padding: 0 }}>{loc.reviewedPropertiesTitleText}</h1>
        </div>

        {/* SEARCH + FILTER */}
        <div style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="search-container">
            <div className="search-input-wrapper">
              <input
                id="search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={loc.searchPlaceholderText}
                className="search-input"
              />
              <button type="button" className="search-btn" aria-label={loc.searchBtnText}>
                <SearchOutlinedIcon />
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <CustomDropdown
              options={[
                { value: '', label: loc.dateLabelText },
                { value: 'earliest', label: loc.earliestText },
                { value: 'oldest', label: loc.oldestText },
              ]}
              value={selectedDateSort}
              onChange={handleDateSortChange}
              width={120}
              placeholder={loc.dateLabelText}
            />
          </div>
        </div>

        {/* PROPERTY CARDS */}
        <div className="property-list">
          {paginatedProperties.length > 0 ? (
            paginatedProperties.map((item: PropertyItem) => {
              const showGreenTick = !item.isNew && !item.isDraft;
              return (
                <div
                  key={item.id}
                  className="property-card"
                  onClick={() => handlePropertyClick(item.id)}
                >
                  <div className="card-layout">
                    {/* LEFT: Info */}
                    <div className="card-content">
                      <div className="property-id">{item.pId}</div>
                      {showGreenTick && (
                        <div className="verified-tag">{loc.verifiedText}</div>
                      )}
                      <div className="property-info">
                        <div className="info-label">{loc.categoryIdText}</div>
                        <div className="info-value">{item.description || item.pId}</div>
                      </div>
                      <div className="property-info">
                        <div className="info-label">{loc.addressText}</div>
                        <div className="info-value property-address">{item.address}</div>
                      </div>
                    </div>

                    {/* RIGHT: Map & Date */}
                    <div className="card-right">
                      <div className="propertyCard-location">
                        {(() => {
                          const locItem = propertyLocations.find(pl =>
                            pl.id === item.id ||
                            pl.applicationNo === item.pId
                          );
                          if (locItem && typeof locItem.lat === 'number' && typeof locItem.lng === 'number') {
                            return (
                              <div style={{ width: '100%', height: '100%' }}>
                                <div className="map-container-main" style={{ width: '100%', height: '100%' }}>
                                  <LocationMapWithDrawing
                                    center={[locItem.lat, locItem.lng]}
                                    onLocationUpdate={() => { /* thumbnail no-op */ }}
                                    readOnly={true}
                                  />
                                </div>
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </div>
                      <div className="reviewed-date">
                        {item.dueDate}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="no-properties">
              <p>{searchQuery ? loc.noPropertiesFoundText : loc.noPropertiesFoundText}</p>
            </div>
          )}

          {totalPages > 1 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={newPage => setPage(newPage)}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};


// Export the ReviewedProperty component as default
export default ReviewedProperty;