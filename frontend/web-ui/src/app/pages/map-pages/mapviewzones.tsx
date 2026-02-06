// Map View Zones page for the property tax web UI
// Displays a map with property zones, sidebar navigation, and zone selection logic

import React, { useState, useEffect } from 'react'
import MapView from '../../features/comissioner-app-features/property-approval/components/mapview'
import SearchInfo from '../../features/comissioner-app-features/property-approval/components/SearchInfo'
import MapHeading from '../../features/comissioner-app-features/property-approval/components/MapHeading'
import { jurisdictionDropdownStyles } from '../../styles/HomePageStyle/HomePageStyle'
import Box from '@mui/material/Box'
import { JurisdictionDropdown } from '../../components/JurisdictionDropdown/JurisdictionDropdown'

type ZoneData = {
  zoneName: string
  wardNumber: string
  totalProperties: number
  compliance: number
  backgroundColor?: string
}

// Main component for viewing property zones on a map
const MapViewZones: React.FC = () => {
  // State for selected zone, list of zones, loading, and sidebar
  const [selectedZone, setSelectedZone] = useState<string | null>(null)
  const [zones, setZones] = useState<ZoneData[]>([])
  const [loading, setLoading] = useState(true)

  // Safe-cast MapView to allow passing an optional prop
  const MapViewAny = MapView as unknown as React.ComponentType<{ selectedZone?: string | null }>

  useEffect(() => {
    const fetchZonesFromGeoJSON = async () => {
      try {
        const response = await fetch('/wards.geojson')
        const geoJsonData = await response.json()
        
        const getComplianceColor = (compliance: number) => {
          if (compliance >= 90) return '#D4EDDA' // Light green for 90% and above
          if (compliance >= 70) return '#FFF3CD' // Light yellow for 70-89%
          return '#F8D7DA' // Light red for below 70%
        }

        // Group wards by Corporatio (zone)
        const zoneMap = new Map<string, number>()
        
        geoJsonData.features.forEach((feature: any) => {
          const zoneName = feature.properties.Corporatio
          if (zoneName) {
            zoneMap.set(zoneName, (zoneMap.get(zoneName) || 0) + 1)
          }
        })

        // Hardcoded compliance and total properties data for each zone
        const zoneDataMap: Record<string, { totalProperties: number; compliance: number }> = {
          'Central': { totalProperties: 1256, compliance: 78 },
          'East': { totalProperties: 1425, compliance: 65 },
          'West': { totalProperties: 982, compliance: 85 },
          'South': { totalProperties: 1678, compliance: 92 },
          'North': { totalProperties: 1123, compliance: 58 }
        }

        // Create zones array with fetched zone names and ward counts
        const zonesArray: ZoneData[] = Array.from(zoneMap.entries()).map(([zoneName, wardCount]) => {
          const data = zoneDataMap[zoneName] || { totalProperties: 1000, compliance: 70 }
          return {
            zoneName: `${zoneName} Zone`,
            wardNumber: `${wardCount} Ward${wardCount > 1 ? 's' : ''}`,
            totalProperties: data.totalProperties,
            compliance: data.compliance,
            backgroundColor: getComplianceColor(data.compliance)
          }
        })

        setZones(zonesArray)
        setLoading(false)
      } catch (error) {
        console.error('Error loading GeoJSON:', error)
        setLoading(false)
      }
    }

    fetchZonesFromGeoJSON()
  }, [])

  // Handler for selecting a zone
  const handleZoneSelect = (zoneName: string) => {
    setSelectedZone(zoneName)
    // Notify MapView (or any listener) via window event
    window.dispatchEvent(new CustomEvent('zoneSelected', { detail: { zoneName } }))
  }

  // Handler for clearing zone selection
  const handleBack = () => {
    setSelectedZone(null)
    window.dispatchEvent(new CustomEvent('zoneSelectionCleared'))
  }


  const fullHeightMapWrapperStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    position: 'relative',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  }

  // Show loading state while fetching zones
  if (loading) {
    return (
      <Box
        sx={{
          position: 'relative',
          height: '100vh',
          color: '#0f172a',
          fontFamily: 'Inter,Segoe UI,Roboto,Arial,Helvetica,sans-serif',
          bgcolor: '#E5E5E5',
          overflow: 'hidden',
        }}
      >
        {/* Jurisdiction Dropdown - Fixed at top right */}
        <Box sx={jurisdictionDropdownStyles}>
          <JurisdictionDropdown backgroundColor="#F7E4DB" hoverBackgroundColor="#F7E4DB" />
        </Box>

        {/* Topbar */}
        <MapHeading />

        {/* Main content area - Map */}
        <Box
        sx={{
          position: 'absolute',
          top: '100px', // Change this from '140px' to '100px'
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
        }}
      >
        <div style={fullHeightMapWrapperStyle}>
          <MapViewAny selectedZone={selectedZone} />
          <SearchInfo zones={zones} onZoneSelect={handleZoneSelect} onBack={handleBack}  />
        </div>
      </Box>
      </Box>
    )
  }

  // Render the main map view with zones and sidebar
  return (
    <Box
      sx={{
        position: 'relative',
        height: '100vh',
        color: '#0f172a',
        fontFamily: 'Inter,Segoe UI,Roboto,Arial,Helvetica,sans-serif',
        bgcolor: '#E5E5E5',
        overflow: 'hidden',
      }}
    >
      {/* Jurisdiction Dropdown - Fixed at top right */}
      <Box sx={jurisdictionDropdownStyles}>
        <JurisdictionDropdown backgroundColor="#F7E4DB" hoverBackgroundColor="#F7E4DB" />
      </Box>

      {/* Topbar */}
      <MapHeading />

      {/* Main content area - Map */}
      <Box
        sx={{
          position: 'absolute',
          top: '100px',
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
        }}
      >
        <div style={fullHeightMapWrapperStyle}>
          <MapViewAny selectedZone={selectedZone} />
          <SearchInfo zones={zones} onZoneSelect={handleZoneSelect} onBack={handleBack}  />
        </div>
      </Box>
    </Box>
  )
}

export default MapViewZones