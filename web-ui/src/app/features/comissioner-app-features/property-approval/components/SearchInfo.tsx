
// SearchInfo displays a searchable list of zones with compliance and property info
import React, { useMemo, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import { Box, Card, CardContent, Typography, TextField, InputAdornment, IconButton } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
// import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import arrowLeft from '../assets/Search/arrow_left_alt.svg'
import type { Map as LeafletMap } from 'leaflet'
import { panelStyle } from '../../property-approval/styles/mapviewstyle'


// Type for a single zone's data
type ZoneData = {
  zoneName: string // Name of the zone
  wardNumber?: string // Ward number (optional)
  totalProperties?: number // Total properties in the zone
  compliance?: number // Compliance percentage
  backgroundColor?: string // Optional background color for card
  // Legacy fields for backwards compatibility
  count?: number // Legacy property count
  ward?: string // Legacy ward name
  [k: string]: any // Allow extra fields
}

// type WardItem = { wardName: string; wardId?: string }

// Props for SearchInfo component
interface SearchInfoProps {
  zones?: ZoneData[] // List of zones to display/search
  onZoneSelect?: (zoneName: string) => void // Callback when a zone is selected
  onBack?: () => void // Callback for back button
  renderZoneCard?: (zone: ZoneData, index: number) => React.ReactNode

  // Optional controlled query support
  query?: string
  setQuery?: Dispatch<SetStateAction<string>>

  // Optional props passed from MapView (for advanced search/highlight)
  geojsonData?: any | null
  searchResults?: any[] | null
  setSearchResults?: Dispatch<SetStateAction<any[] | null>>
  prevSearchResults?: any[] | null
  setPrevSearchResults?: Dispatch<SetStateAction<any[] | null>>
  prevQuery?: string | null
  setPrevQuery?: Dispatch<SetStateAction<string | null>>
  notFoundNames?: string[] | null
  setNotFoundNames?: Dispatch<SetStateAction<string[] | null>>
  highlightKeys?: Set<string>
  setHighlightKeys?: Dispatch<SetStateAction<Set<string>>>
  mapRef?: React.RefObject<LeafletMap | null>
}


const SearchInfo: React.FC<SearchInfoProps> = ({
  zones = [],
  onZoneSelect,
  onBack,
  renderZoneCard,
  query: propQuery,
  setQuery: setPropQuery,
}) => {
  // Local state for the search query if not controlled by parent
  const [localQuery, setLocalQuery] = useState(propQuery ?? '')
  // Use controlled query if provided, otherwise use local state
  const query = propQuery !== undefined ? propQuery : localQuery
  const setQuery = setPropQuery ?? setLocalQuery

  // Filter zones based on the search query (case-insensitive)
  const filteredZones = useMemo(() => {
    const q = (query || '').trim().toLowerCase()
    if (!q || q === 'all') return zones // Show all zones when empty or "all"
    return zones.filter(
      (z) =>
        (z.zoneName || '').toString().toLowerCase().includes(q) ||
        (z.wardNumber || '').toString().toLowerCase().includes(q) ||
        (z.count?.toString() || '').includes(q) ||
        (z.ward || '').toString().toLowerCase().includes(q),
    )
  }, [zones, query])

  // If a zone is selected, prepare searchable wards list
  // const selectedZoneData = selectedZone ? zones.find((z) => z.zoneName === selectedZone) : null
  // const filteredWards = useMemo<WardItem[]>(() => {
  //   const q = (query || '').trim().toLowerCase()
  //   if (!selectedZoneData) return []
  //   const wardsList: WardItem[] = (selectedZoneData.wards || []) as WardItem[]
  //   if (!q) return wardsList
  //   return wardsList.filter((w: WardItem) => (w.wardName || '').toLowerCase().includes(q) || (w.wardId || '').toLowerCase().includes(q))
  // }, [selectedZoneData, query])

  return (
    <div style={panelStyle as React.CSSProperties}>
      {/* Top section: back button and title */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.5, mb: 1 }}>
        <IconButton
          size="small"
          onClick={onBack}
          aria-label="back"
          sx={{ backgroundColor: '#F7E4DB', p: 0.3, borderRadius: '20px',
             '&:hover': {
              backgroundColor: '#F7E4DB', // Keep same color on hover
            }
          }}
        >
          <img src={arrowLeft} alt="back" style={{ width: 28, height: 28, display: 'block' }} />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 300,pl:0.5 }}>
          Zone Collection Information
        </Typography>
      </Box>

      {/* Search input for filtering zones */}
      <TextField
        placeholder="Search Zones"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        fullWidth
        variant="outlined"
        size="small"
        sx={{
          mb: 2,
          // root outline and background to match pill UI
          '& .MuiOutlinedInput-root': {
            borderRadius: '28px',
            backgroundColor: '#ffffff',
            boxShadow: '0 6px 20px rgba(0,0,0,0.35)',
            height: 38,
            // remove extra right padding so adornment can sit flush
            paddingRight: 0,
            '& fieldset': { border: 'none' },
          },
          // input padding and placeholder color
          '& .MuiOutlinedInput-input': {
            padding: '10px 12px',
            fontSize: 14,
            '&::placeholder': { color: '#cfcfcf', opacity: 1 },
          },
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end" sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
              <Box sx={{
                ml: 'auto',
                width: 36,
                height: 36,
                // bgcolor: '#ffffff',
                // borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                // boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
              }}>
                <SearchIcon sx={{ fontSize: 18, color: '#151515ff' }} />
              </Box>
            </InputAdornment>
          ),
        }}
      />

      {/* List of filtered zones or search instructions */}
      <Box sx={{ 
        overflowY: 'auto', 
        maxHeight: 'calc(100vh - 280px)',
        pb: 2,
        pr: 1,
        '&::-webkit-scrollbar': {
          width: '7px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#C84C0E',
          borderRadius: '10px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          backgroundColor: '#A03D0B',
        },
      }}>
        {filteredZones.length === 0 ? (
          // No zones found for the search query
          <Typography sx={{ textAlign: 'center', color: '#7F8C8D', py: 4 }}>
            No zones available
          </Typography>
        ) : (
          // Render each filtered zone as a card
          filteredZones.map((z, idx) => (
            renderZoneCard ? (
              <React.Fragment key={z.zoneName || idx}>
                {renderZoneCard(z, idx)}
              </React.Fragment>
            ) : (
            <Card
              key={z.zoneName || idx}
              onClick={() => onZoneSelect?.(z.zoneName)}
              sx={{
                cursor: onZoneSelect ? 'pointer' : 'default',
                mb: 2,
                borderRadius: '12px',
                boxShadow: 'none',
                border: '1px solid #E0E0E0',
                backgroundColor: z.backgroundColor || '#FFFFFF',
                '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.15)', transform: 'translateY(-2px)' },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                {/* Zone Title */}
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600, 
                    color: '#1F2937',
                    fontSize: '16px',
                    mb: 0.5
                  }}
                >
                  {z.zoneName}
                </Typography>
                
                {/* Ward Number */}
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#6B7280',
                    fontSize: '14px',
                    mb: 2
                  }}
                >
                  {z.wardNumber || z.ward || 'N/A'}
                </Typography>

                {/* Total Properties */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Total Properties:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#2C3E50' }}>
                    {z.totalProperties ?? z.count ?? 'N/A'}
                  </Typography>
                </Box>

                {/* Compliance */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 500,
                      fontStyle: 'italic',
                      color: '#5D6D7E'
                    }}
                  >
                    Compliance
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 600,
                      color: z.compliance && z.compliance >= 80 ? '#4CAF50' : 
                             z.compliance && z.compliance >= 60 ? '#FF9800' : '#F44336'
                    }}
                  >
                    {z.compliance ? `${z.compliance}%` : 'N/A'}
                  </Typography>
                </Box>

                {/* Progress Bar for compliance percentage */}
                {z.compliance && (
                  <Box 
                    sx={{ 
                      height: 6,
                      backgroundColor: '#E0E0E0',
                      borderRadius: 3,
                      overflow: 'hidden',
                      mt: 1
                    }}
                  >
                    <Box 
                      sx={{ 
                        height: '100%',
                        width: `${z.compliance}%`,
                        backgroundColor: z.compliance >= 80 ? '#4CAF50' : 
                                       z.compliance >= 60 ? '#FF9800' : '#F44336',
                        borderRadius: 3,
                        transition: 'width 0.3s ease'
                      }} 
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
            )
          ))
        )}
      </Box>
    </div>
  )
}

export default SearchInfo