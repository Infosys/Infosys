// Properties.tsx
// This page displays the citizen's properties and drafts, with tab switching, loading, error, and empty states.
// Features:
//   - Fetches properties and drafts via RTK Query
//   - Tab buttons to switch between properties and drafts
//   - Transforms API data for property cards
//   - Shows loading spinner, error message, or empty state as needed
//   - Renders property list and bottom navigation bar
// Used in: Citizen workflow for property management and review

import { Box, Button } from '@mui/material';
import { CottageOutlined } from '@mui/icons-material';
import { useAppSelector } from '../../../redux/Hooks';
import {
  getMessagesFromSession,
  useLocalization,
} from '../../../services/Citizen/Localization/LocalizationContext';
import PropertyList from '../../features/Citizen/components/ui/PropertyList';
import Header from '../../components/Header';
import LoadingPage from '../../components/Loader';
import { BottomBar } from '../../components/BottomBar';
import NoProperties from '../../features/Citizen/components/NoProperties';
import ErrorMessage from '../../features/Citizen/components/ErrorMessage';
import { useGetCitizenApplicationsQuery } from '../../features/Citizen/api/CitizenHomePageApi/CitizenHomePageApi';
import type {
  CitizenApplicationSummary,
  CitizenPropertySummary,
} from '../../features/Citizen/api/CitizenHomePageApi/CitizenHomePageModel';
import { useState, type JSX } from 'react';
import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';
import { useNavigate } from 'react-router-dom';

// Status to enumeration progress mapping
const STATUS_PROGRESS_MAP: Record<string, number> = {
  INITIATED: 20,
  ASSIGNED: 40,
  AUDIT_VERIFIED: 60,
  VERIFIED: 80,
  APPROVED: 100,
};

const EMPTY_PROPERTY: CitizenPropertySummary = {
  __appId: '',
  ID: '',
  PropertyNo: '',
  OwnershipType: '',
  PropertyType: '',
  ComplexName: '',
  Address: {
    ID: '',
    Locality: '',
    ZoneNo: '',
    WardNo: '',
    BlockNo: '',
    Street: '',
    ElectionWard: '',
    SecretariatWard: '',
    PinCode: 0,
    DifferentCorrespondenceAddress: false,
    PropertyID: '',
    CreatedAt: '',
    UpdatedAt: '',
  },
  AssessmentDetails: undefined,
  Amenities: [],
  ConstructionDetails: undefined,
  AdditionalDetails: undefined,
  GISData: undefined,
  CreatedAt: '',
  UpdatedAt: '',
  Documents: [],
  IGRS: undefined,
};

// SAFE transform (pure function, returns new object, no mutation)
function transformApplications(
  applications: CitizenApplicationSummary[],
  isDraft: boolean
) {
  return applications.map((app) => {
    // Defensive clone with typed fallback
    const property = app.Property
      ? ({ ...EMPTY_PROPERTY, ...app.Property } as CitizenPropertySummary)
      : { ...EMPTY_PROPERTY };
    const coordsArr = property.GISData?.Coordinates || [];
    const coordinates =
      Array.isArray(coordsArr) && coordsArr.length > 0
        ? {
            lat: coordsArr[0]?.Latitude ?? 0,
            lng: coordsArr[0]?.Longitude ?? 0,
          }
        : { lat: 0, lng: 0 };

    const addressObj = (property.Address || {}) as any;

    let enumerationProgress: number;
    if (isDraft) {
      enumerationProgress = -1;
    } else {
      const status = app.Status?.toUpperCase() || 'INITIATED';
      enumerationProgress = STATUS_PROGRESS_MAP[status] || 20;
    }

    const out = {
      // keep original property fields first (so PropertyList props still available)
      ...property,
      // UI-only computed fields
      id: property.ID || app.ID,
      propertyType: property.PropertyType || 'Residential',
      enumerationProgress,
      isDraft,
      applicationStatus: app.Status,
      propertyAddress: {
        street: addressObj.Street || '',
        locality: addressObj.Locality || '',
        wardNo: addressObj.WardNo || '',
        zoneNo: addressObj.ZoneNo || '',
        blockNo: addressObj.BlockNo || '',
        pincode: addressObj.PinCode || '',
      },
      locationData: {
        coordinates,
        address:
          [
            addressObj.BlockNo,
            addressObj.Locality,
            addressObj.Street,
            addressObj.WardNo,
            addressObj.ZoneNo,
            addressObj.PinCode,
          ]
            .filter(Boolean)
            .join(', ') ||
          property.ComplexName ||
          '',
      },
      // helper unique id for debugging/dedupe
      __appId: app.ID ?? `${property.ID || 'unknown'}-${isDraft ? 'd' : 'p'}`,
    };

    // freeze to detect accidental mutation in downstream components
    try {
      Object.freeze(out);
    } catch (e) {
      console.log(e);
    }

    return out;
  });
}

// dedupe by property ID (or app id) to ensure no overlaps
function dedupeById(items: any[]) {
  const seen = new Set<string>();
  const result: any[] = [];
  for (const it of items) {
    const key = it.id || it.PropertyID || it.__appId || JSON.stringify(it);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(it);
    }
  }
  return result;
}

function checkForOverlap(transformedProperties: any[], transformedDrafts: any[]) {
  if (globalThis.window !== undefined) {
    const propIds = new Set(transformedProperties.map((p) => p.id));
    const overlap = transformedDrafts.filter((d) => propIds.has(d.id)).map((d) => d.id);
    if (overlap.length) {
      console.warn(
        '[PropertiesView] overlap between properties and drafts (IDs):',
        overlap
      );
    }
  }
}

function Properties(): JSX.Element {
  // State for active tab (properties/drafts)
  const [activeTab, setActiveTab] = useState<'properties' | 'drafts'>('properties');
  const lang = useAppSelector((state) => state.lang.citizenLang);
  const { loading: localizationLoading } = useLocalization();
  const messages = getMessagesFromSession('CITIZEN')!;

  const assesseeId = localStorage.getItem('user_id')!;
  const navigate = useNavigate();

  // Fetch properties (isDraft = false)
  const {
    data: propertiesData,
    isLoading: isLoadingProperties,
    isError: isErrorProperties,
  } = useGetCitizenApplicationsQuery({
    assesseeId,
    isDraft: false,
  });

  // Fetch drafts (isDraft = true)
  const {
    data: draftsData,
    isLoading: isLoadingDrafts,
    isError: isErrorDrafts,
  } = useGetCitizenApplicationsQuery({
    assesseeId,
    isDraft: true,
  });

  const propertiesApplications: CitizenApplicationSummary[] = propertiesData?.data ?? [];
  const draftsApplications: CitizenApplicationSummary[] = draftsData?.data ?? [];

  // Build lists (no memo) and dedupe
  const transformedProperties = transformApplications(propertiesApplications, false);
  const transformedDrafts = transformApplications(draftsApplications, true);

  checkForOverlap(transformedProperties, transformedDrafts);

  // dedupe to be safe (prefer drafts to appear in drafts only - remove from properties if overlap)
  // remove from properties any item whose id also appears in drafts
  const draftIds = new Set(transformedDrafts.map((d) => d.id));
  const propertiesFiltered = transformedProperties.filter((p) => !draftIds.has(p.id));
  const propertiesFinal = dedupeById(propertiesFiltered);
  const draftsFinal = dedupeById(transformedDrafts);

  const currentData = activeTab === 'properties' ? propertiesFinal : draftsFinal;

  const isLoading = activeTab === 'properties' ? isLoadingProperties : isLoadingDrafts;
  const isError = activeTab === 'properties' ? isErrorProperties : isErrorDrafts;

  if (localizationLoading) {
    return <LoadingPage />;
  }

  return (
    <Box
      sx={{
        bgcolor: '#F6F1ED',
        minHeight: '100vh',
        width: '100%',
        mx: 'auto',
        position: 'relative',
      }}
    >
      {/* Header with localized title and subtitle */}
      <Header
        header={messages['citizen.commons'][lang]['my-properties']}
        subHeader={
          activeTab === 'properties'
            ? messages['citizen.my-properties'][lang]['property-list']
            : 'Draft Properties'
        }
        icon={<CottageOutlined sx={{ fontSize: 32 }} />}
      />

      {/* Main content */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: `140px`,
          pb: `76px`,
          px: 1,
          boxSizing: 'border-box',
          minHeight: '100vh',
          mx: 'auto',
          background: '#F5F5F5',
        }}
      >
        {/* Tab Buttons for properties/drafts */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            mb: 3,
            width: '100%',
            maxWidth: '400px',
          }}
        >
          <Button
            variant={activeTab === 'properties' ? 'contained' : 'outlined'}
            sx={{
              flex: 1,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: 16,
              borderRadius: 2,
              py: 1,
              bgcolor: activeTab === 'properties' ? '#C84C0E' : 'transparent',
              color: activeTab === 'properties' ? '#fff' : '#C84C0E',
              borderColor: '#C84C0E',
              '&:hover': {
                bgcolor:
                  activeTab === 'properties' ? '#a03a07' : 'rgba(200, 76, 14, 0.04)',
                borderColor: '#a03a07',
              },
            }}
            onClick={() => setActiveTab('properties')}
          >
            Properties
          </Button>
          <Button
            variant={activeTab === 'drafts' ? 'contained' : 'outlined'}
            sx={{
              flex: 1,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: 16,
              borderRadius: 2,
              py: 1,
              bgcolor: activeTab === 'drafts' ? '#C84C0E' : 'transparent',
              color: activeTab === 'drafts' ? '#fff' : '#C84C0E',
              borderColor: '#C84C0E',
              '&:hover': {
                bgcolor: activeTab === 'drafts' ? '#a03a07' : 'rgba(200, 76, 14, 0.04)',
                borderColor: '#a03a07',
              },
            }}
            onClick={() => setActiveTab('drafts')}
          >
            Drafts
          </Button>
        </Box>

        {/* Loading State */}
        {isLoading && (
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              justifyContent: 'center',
              minHeight: '50vh',
              mt: '-20vh',
            }}
          >
            <LoadingPage />
          </Box>
        )}

        {/* Error State */}
        {!isLoading && isError && <ErrorMessage />}

        {/* Empty State */}
        {!isLoading && !isError && currentData.length === 0 && <NoProperties />}

        {/* Properties/Drafts List */}
        {!isLoading && !isError && currentData.length > 0 && (
          // Force remount of PropertyList when tab changes so any internal state is reset
          <PropertyList key={activeTab} properties={currentData} />
        )}
      </Box>
      {activeTab === 'properties' && propertiesFinal.length > 0 && (
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'left',
            position: 'fixed',
            bottom: 76,
            left: 10,
            zIndex: 100,
          }}
        >
          <Button
            variant="contained"
            sx={{
              bgcolor: '#C84C0E',
              color: '#fff',
              borderRadius: 2,
              fontWeight: 600,
              fontSize: 16,
              width: '50%',
              maxWidth: 400,
              boxShadow: '0 2px 8px rgba(200,76,14,0.08)',
              '&:hover': { bgcolor: '#a03a07' },
              textTransform: 'none',
              zIndex: 100,
            }}
            onClick={() => {
              navigate('/citizen/property-tax-calculator', {
                state: { properties: propertiesFinal },
              });
            }}
          >
            <CalculateOutlinedIcon sx={{ mr: 1 }} />
            Tax Calculator
          </Button>
        </Box>
      )}
      <BottomBar />
    </Box>
  );
}

export default Properties;
