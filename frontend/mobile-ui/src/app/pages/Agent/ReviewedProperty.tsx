// ReviewedProperty: Agent view for listing, searching, and filtering reviewed properties with map and pagination
import React, { useState, useEffect, useMemo, useRef } from 'react';
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
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';

// Props for the custom dropdown filter component
interface CustomDropdownProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  width?: number | string;
  placeholder?: string;
  getLabel?: (value: string) => string;
}

// Custom dropdown component for date sorting
const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  value,
  onChange,
  width = 100,
  placeholder = 'Select',
  getLabel,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setShowDropdown(false);
  };

  const getDisplayLabel = (val: string): string => {
    if (getLabel) return getLabel(val);
    const option = options.find((opt) => opt.value === val);
    return option ? option.label : placeholder;
  };

  const widthValue = typeof width === 'number' ? `${width}px` : width;

  return (
    <div
      ref={dropdownRef}
      className="dropdown-container dropdown-container-date-sort"
      style={{ position: 'relative' }}
    >
      <button
        type="button"
        className="dropdown-button"
        onClick={() => setShowDropdown(!showDropdown)}
        style={{
          width: widthValue,
          height: '36px',
          padding: '6px 12px',
          borderRadius: '16px',
          border: '1.5px solid #c84c03',
          cursor: 'pointer',
          backgroundColor: 'white',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: value ? '#000' : '#666',
          position: 'relative',
        }}
      >
        <span
          style={{
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            paddingRight: '8px',
          }}
        >
          {getDisplayLabel(value)}
        </span>
        <ArrowDropDownOutlinedIcon
          style={{
            color: '#C84A00',
            fontSize: 20,
            flexShrink: 0,
          }}
        />
      </button>
      {showDropdown && (
        <div
          className="dropdown-menu"
          style={{
            position: 'absolute',
            top: '100%',
            right: '0',
            marginTop: '4px',
            backgroundColor: 'white',
            border: '2px solid #fff',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: 1000,
            width: widthValue,
            overflow: 'hidden',
          }}
        >
          {options.map((opt, index) => (
            <button
              key={opt.value}
              type="button"
              className="dropdown-option"
              onClick={() => handleOptionClick(opt.value)}
              style={{
                backgroundColor: opt.value === value ? '#f5f5f5' : 'white',
                cursor: 'pointer',
                fontSize: '14px',
                color: opt.value === '' ? '#666' : '#000',
                border: 'none',
                borderBottom:
                  index < options.length - 1 ? '1px solid #f0f0f0' : 'none',
                width: '100%',
                textAlign: 'left',
                padding: '8px 12px',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = '#f5f5f5')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor =
                  opt.value === value ? '#f5f5f5' : 'white')
              }
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Main component for reviewed property list page
const ReviewedProperty: React.FC = () => {
  const loc = useReviewedPropertyLocalization();

  loc.earliestText = "New to Old";
  loc.oldestText = "Old to New";

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDateSort, setSelectedDateSort] = useState('');

  // Get assigned agent ID from localStorage (fallback to default)
  const assignedAgent =
    localStorage.getItem('agentId') || 'e09421f8-ab1a-4e62-a96b-5b26dff739ef';

  // RTK Query - fetch reviewed property applications
  const {
    data: apiResponse,
    isLoading,
    error,
  } = useGetApplicationsQuery({
    AssignedAgent: assignedAgent,
  });

  // Convert API applications to PropertyItem format for display
  const allProperties = useMemo((): PropertyItem[] => {
    if (!apiResponse?.data) return [];

    return apiResponse.data.map((app) => ({
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
        (p) =>
          p.pId.toLowerCase().includes(query) ||
          p.address.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    // Sort by date if selected
    if (selectedDateSort === 'earliest') {
      filtered = [...filtered].sort(
        (a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
      );
    } else if (selectedDateSort === 'oldest') {
      filtered = [...filtered].sort(
        (a, b) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()
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
      .filter(
        (app) =>
          app.Property?.GISData?.Coordinates &&
          app.Property.GISData.Coordinates.length > 0
      )
      .map((app) => ({
        id: app.ID,
        applicationNo: app.ApplicationNo,
        lat: app.Property?.GISData?.Coordinates[0].Latitude,
        lng: app.Property?.GISData?.Coordinates[0].Longitude,
        address: app.Property?.Address
          ? `${app.Property.Address.Street}, ${app.Property.Address.Locality}`
          : 'Address not available',
        status: app.Status === 'AUDIT_VERIFIED' ? 'Low' : 'High',
      }));
  }, [apiResponse]);

  // Handle navigation tab changes (home, search, etc.)
  const handleTabChange = (tab: NavigationTab) => {
    switch (tab) {
      case 'home':
        navigate('/agent');
        break;
      case 'search':
        navigate('/agent/search');
        break;
      case 'inbox':
        break;
      case 'notifications':
        break;
    }
  };

  // Navigate to property information submitted page
  const handlePropertyClick = (propertyId: string) => {
    // Find the property data to get the application details
    const propertyData = apiResponse?.data.find((app) => app.ID === propertyId);

    if (propertyData) {
      localStorage.setItem('propertyId', propertyData.PropertyID);
      localStorage.setItem('applicationId', propertyData.ID);
    }
    navigate('/agent/property-information-submitted');
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
      showNavigation={false}
      hideLocationIcon={true}
    >
      <div className="reviewed-property-page">
        {/* HEADER */}
        <div style={{ padding: '24px 16px 0 16px' }}>
          <button
            onClick={() => navigate('/agent')}
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
              fontWeight: 500,
            }}
          >
            <ArrowBackIosIcon style={{ fontSize: '18px' }} />
            <span>{loc.previousText}</span>
          </button>
          <h1 className="reviewed-title" style={{ margin: 0, padding: 0 }}>
            {loc.reviewedPropertiesTitleText}
          </h1>
        </div>

        {/* SEARCH + FILTER */}
        <div
          style={{
            padding: '24px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
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
                          const locItem = propertyLocations.find(
                            (pl) => pl.id === item.id || pl.applicationNo === item.pId
                          );
                          if (
                            locItem &&
                            typeof locItem.lat === 'number' &&
                            typeof locItem.lng === 'number'
                          ) {
                            return (
                              <div style={{ width: '100%', height: '100%' }}>
                                <div
                                  className="map-container-main"
                                  style={{ width: '100%', height: '100%' }}
                                >
                                  <LocationMapWithDrawing
                                    center={[locItem.lat, locItem.lng]}
                                    onLocationUpdate={() => {
                                      /* thumbnail no-op */
                                    }}
                                    readOnly={true}
                                  />
                                </div>
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </div>
                      <div className="reviewed-date">{item.dueDate}</div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="no-properties">
              <p>{loc.noPropertiesFoundText}</p>
            </div>
          )}

          {totalPages > 1 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={(newPage) => setPage(newPage)}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

// Export the ReviewedProperty component as default
export default ReviewedProperty;
