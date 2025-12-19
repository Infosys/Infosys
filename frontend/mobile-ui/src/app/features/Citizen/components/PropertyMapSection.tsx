// PropertyMapSection.tsx
// This component displays a map section for a property, allowing users to toggle between different map views (standard and land use).
// Props:
//   latLng: Object with latitude and longitude of the property
//   customIcon: Leaflet icon to mark the property location
// Used in: Citizen property detail and location views

import React, { type FC } from 'react';
import { Box } from '@mui/material';

import { useAppSelector } from '../../../../redux/Hooks';
import {
  getMessagesFromSession,
  useLocalization,
} from '../../../../services/Citizen/Localization/LocalizationContext';
import LoadingPage from '../../../components/Loader';
import MapComponent from './MapComponent';

// Keep the old URLs for compatibility with existing UI tab toggles (not used by MapLibre style directly)
const MAP_URL =
  'https://api.maptiler.com/maps/base-v4/style.json?key=YguiTF06mLtcpSVKIQyc';
const LANDUSE_URL =
  'https://api.maptiler.com/maps/streets-v2/style.json?key=YguiTF06mLtcpSVKIQyc';

type PropertyMapProps = {
  latLng: {
    lat: number;
    lng: number;
  };
  customIcon: {
    iconUrl?: string;
    iconSize?: [number, number];
    iconAnchor?: [number, number];
    popupAnchor?: [number, number];
    className?: string;
  };
};

const PropertyMapSection: FC<PropertyMapProps> = ({ latLng, customIcon }) => {
  const lang = useAppSelector((state) => state.lang.citizenLang);
  const { loading } = useLocalization();
  const messages = getMessagesFromSession('CITIZEN')!;

  const MAP_TABS = [
    { label: messages['citizen.home'][lang]['map-btn'], key: 'map' },
    { label: messages['citizen.my-properties'][lang]['land-use'], key: 'landuse' },
  ];

  const [activeMapTab, setActiveMapTab] = React.useState('map');
  const tileUrl = activeMapTab === 'landuse' ? LANDUSE_URL : MAP_URL;

  // Show loader if localization is loading
  if (loading) {
    return <LoadingPage />;
  }

  return (
    <Box
      sx={{
        width: '100%',
        borderRadius: '14px',
        overflow: 'hidden',
        height: 300,
        mb: 1.3,
        bgcolor: '#fff',
        position: 'relative',
        border: '1.2px solid #000',
        boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          height: '50px',
          width: '100%',
          bgcolor: '#fff',
          border: '1px solid #00000033',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {MAP_TABS.map((tab, i) => (
          <Box
            key={tab.key}
            onClick={() => setActiveMapTab(tab.key)}
            sx={{
              flex: 1,
              textAlign: 'center',
              cursor: 'pointer',
              fontWeight: activeMapTab === tab.key ? 700 : 500,
              fontSize: '18px',
              color: activeMapTab === tab.key ? '#C84C0E' : '#787878',
              bgcolor: '#fff',
              borderTopLeftRadius: i === 0 ? '10px' : 0,
              borderTopRightRadius: i === MAP_TABS.length - 1 ? '10px' : 0,
              border: '1.5px solid #E0E0E0',
              borderBottom: activeMapTab === tab.key ? '3px solid #E26512' : 'none',
              borderRight: i === 0 ? 'none' : '1.5px solid #E0E0E0',
              pt: '7px',
              pb: '3px',
              transition: 'none',
              backgroundClip: 'padding-box',
            }}
          >
            {tab.label}
          </Box>
        ))}
      </Box>

      <Box sx={{ height: 250, width: '100%' }}>
        {/* Pass the selected tileUrl for compatibility; MapComponent uses MapTiler style internally */}
        <MapComponent latLng={latLng} customIcon={customIcon} tileUrl={tileUrl} />
      </Box>
    </Box>
  );
};

export default PropertyMapSection;
