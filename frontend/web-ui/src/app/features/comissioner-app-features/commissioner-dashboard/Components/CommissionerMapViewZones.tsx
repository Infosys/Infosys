import React, { useState, useEffect } from 'react'
import MapView from '../../../comissioner-app-features/property-approval/components/mapview'
import SearchInfo from '../../../comissioner-app-features/property-approval/components/SearchInfo'
import Box from '@mui/material/Box'

type ZoneData = {
  zoneName: string
  wardNumber: string
  totalProperties: number
  compliance: number
  collected?: number  // Amount collected in Cr
  pending?: number    // Amount pending in Cr
  backgroundColor?: string
}

interface CommissionerMapViewZonesProps {
  onBack?: () => void
}

const CommissionerMapViewZones: React.FC<CommissionerMapViewZonesProps> = ({ onBack }) => {
  const [selectedZone, setSelectedZone] = useState<string | null>(null)
  const [zones, setZones] = useState<ZoneData[]>([])
  const [loading, setLoading] = useState(true)

  const MapViewAny = MapView as unknown as React.ComponentType<{ selectedZone?: string | null }>

  useEffect(() => {
    const fetchZonesFromGeoJSON = async () => {
      try {
        const response = await fetch('/wards.geojson')
        const geoJsonData = await response.json()
        
        const getComplianceColor = (compliance: number) => {
          if (compliance >= 90) return '#D4EDDA' // Light green
          if (compliance >= 70) return '#FFF3CD' // Light yellow
          return '#F8D7DA' // Light red
        }

        // Group wards by Corporatio (zone)
        const zoneMap = new Map<string, number>()
        
        geoJsonData.features.forEach((feature: any) => {
          const zoneName = feature.properties.Corporatio
          if (zoneName) {
            zoneMap.set(zoneName, (zoneMap.get(zoneName) || 0) + 1)
          }
        })

        // Zone data with collected and pending amounts (in Crores)
        const zoneDataMap: Record<string, { 
          totalProperties: number
          compliance: number
          collected: number
          pending: number
        }> = {
          'Central': { 
            totalProperties: 1256, 
            compliance: 78, 
            collected: 45.5,  // 45.5 Cr collected
            pending: 12.3     // 12.3 Cr pending
          },
          'East': { 
            totalProperties: 1425, 
            compliance: 65, 
            collected: 38.2,
            pending: 20.5
          },
          'West': { 
            totalProperties: 982, 
            compliance: 85, 
            collected: 52.8,
            pending: 9.2
          },
          'South': { 
            totalProperties: 1678, 
            compliance: 92, 
            collected: 68.9,
            pending: 6.1
          },
          'North': { 
            totalProperties: 1123, 
            compliance: 58, 
            collected: 32.4,
            pending: 23.6
          }
        }

        // Create zones array with fetched zone names and ward counts
        const zonesArray: ZoneData[] = Array.from(zoneMap.entries()).map(([zoneName, wardCount]) => {
          const data = zoneDataMap[zoneName] || { 
            totalProperties: 1000, 
            compliance: 70,
            collected: 40.0,
            pending: 15.0
          }
          return {
            zoneName: `${zoneName} Zone`,
            wardNumber: `${wardCount} Ward${wardCount > 1 ? 's' : ''}`,
            totalProperties: data.totalProperties,
            compliance: data.compliance,
            collected: data.collected,
            pending: data.pending,
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

  const handleZoneSelect = (zoneName: string) => {
    setSelectedZone(zoneName)
    window.dispatchEvent(new CustomEvent('zoneSelected', { detail: { zoneName } }))
  }

  const handleBack = () => {
    setSelectedZone(null)
    if (onBack) {
      onBack()
    }
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

  if (loading) {
    return (
      <Box sx={{ height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Loading map data...
      </Box>
    )
  }

  return (
    <Box
      sx={{
        position: 'relative',
        height: '600px',
        borderRadius: 2,
        mb: 2,
        bgcolor: '#ffffff',
        overflow: 'hidden',
      }}
    >
      <div style={fullHeightMapWrapperStyle}>
        <MapViewAny selectedZone={selectedZone} />
        <SearchInfo zones={zones} onZoneSelect={handleZoneSelect} onBack={handleBack} />
      </div>
    </Box>
  )
}

export default CommissionerMapViewZones
