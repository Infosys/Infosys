// Main map view for property approval, using React Leaflet and GeoJSON overlays
import React, { useEffect, useState, useRef } from 'react'
import * as maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { containerStyle, mapWrapperStyle } from '../../property-approval/styles/mapviewstyle'
// import SearchInfo from './SearchInfo'


const MapView: React.FC<{ selectedZone?: string | null }> = ({ selectedZone }) => {
  const [geojsonData, setGeojsonData] = useState<any | null>(null)
  const [searchResults] = useState<any[] | null>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const [filteredData, setFilteredData] = useState<any | null>(null)

  // Load the GeoJSON data for wards on mount
  useEffect(() => {
    let mounted = true
    fetch('/wards.geojson')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (mounted) setGeojsonData(data) })
      .catch(() => { if (mounted) setGeojsonData(null) })
    return () => { mounted = false }
  }, [])

  // Filter GeoJSON based on selected zone
  useEffect(() => {
    if (!geojsonData) {
      setFilteredData(null)
      return
    }

    if (!selectedZone) {
      // No zone selected, show all
      setFilteredData(geojsonData)
      return
    }

    // Extract zone name without " Zone" suffix
    const zoneName = selectedZone.replace(' Zone', '').trim()

    // Filter features by Corporatio field
    const filtered = {
      type: 'FeatureCollection',
      features: geojsonData.features.filter((feature: any) => 
        feature.properties?.Corporatio === zoneName
      )
    }

    setFilteredData(filtered)

    // Fit map to filtered bounds after a short delay
    if (filtered.features.length > 0 && mapRef.current) {
      setTimeout(() => {
        try {
          // compute bounds from features
          const allCoords: number[][] = []
          filtered.features.forEach((f: any) => {
            const geom = f.geometry
            const gather = (arr: any) => {
              if (!arr) return
              if (typeof arr[0] === 'number') {
                allCoords.push(arr)
              } else {
                arr.forEach(gather)
              }
            }
            gather(geom.coordinates)
          })
          if (allCoords.length) {
            const lons = allCoords.map(c => c[0])
            const lats = allCoords.map(c => c[1])
            const sw: [number, number] = [Math.min(...lons), Math.min(...lats)]
            const ne: [number, number] = [Math.max(...lons), Math.max(...lats)]
            // maplibre fitBounds expects [[west,south],[east,north]]
            mapRef.current?.fitBounds([sw, ne], { padding: 50, maxZoom: 13 })
          }
        } catch (e) {
          console.error('Error fitting bounds:', e)
        }
      }, 200)
    }
  }, [selectedZone, geojsonData])

  useEffect(() => {
    // initialize MapLibre map
    if (mapRef.current || !mapContainerRef.current) return

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: 'https://api.maptiler.com/maps/streets-v2/style.json?key=YguiTF06mLtcpSVKIQyc',
      center: [77.5946, 12.9716],
      zoom: 12
    })

    mapRef.current = map

    // add zoom control (zoom in/out) at bottom-left; hide compass if not needed
   map.addControl(new maplibregl.NavigationControl({ showCompass: false, showZoom: true }), 'bottom-left')


    map.on('load', () => {
      try {
        // add an empty source; data will be set later
        if (!map.getSource('wards')) {
          map.addSource('wards', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } })
        }

        // fill layer
        if (!map.getLayer('wards-fill')) {
          map.addLayer({
            id: 'wards-fill',
            type: 'fill',
            source: 'wards',
            paint: {
              'fill-color': selectedZone ? '#22bb77' : '#f0f4ef',
              'fill-opacity': selectedZone ? 0.25 : 0.12
            }
          })
        }

        // line layer
        if (!map.getLayer('wards-line')) {
          map.addLayer({
            id: 'wards-line',
            type: 'line',
            source: 'wards',
            paint: {
              'line-color': selectedZone ? '#22bb77' : '#2b7',
              'line-width': selectedZone ? 2 : 1
            }
          })
        }
      } catch (e) {
        console.error('Error adding source/layers:', e)
      }
    })

    // cleanup
    return () => {
      try {
        map.remove()
      } catch (e) {
        console.error('Error removing map:', e)
      }
      mapRef.current = null
    }
  }, [mapContainerRef])

  // update source data when geojson/searchResults/filteredData change
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    const data = (searchResults && searchResults.length) ? { type: 'FeatureCollection', features: searchResults } : (filteredData || geojsonData)
    try {
      const src: any = map.getSource('wards')
      if (src && typeof src.setData === 'function') {
        src.setData(data || { type: 'FeatureCollection', features: [] })
      } else if (!src && data) {
        // if source missing (map not yet loaded), try adding when loaded
        map.on('load', () => {
          if (!map.getSource('wards')) map.addSource('wards', { type: 'geojson', data: data })
        })
      }
    } catch (e) {
      console.error('Error setting source data:', e)
    }
  }, [geojsonData, filteredData, searchResults])

  // reflect selectedZone visual changes (paint properties) and fitBounds is handled earlier
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    try {
      if (map.getLayer('wards-fill')) {
        map.setPaintProperty('wards-fill', 'fill-color', selectedZone ? '#22bb77' : '#f0f4ef')
        map.setPaintProperty('wards-fill', 'fill-opacity', selectedZone ? 0.25 : 0.12)
      }
      if (map.getLayer('wards-line')) {
        map.setPaintProperty('wards-line', 'line-color', selectedZone ? '#22bb77' : '#2b7')
        map.setPaintProperty('wards-line', 'line-width', selectedZone ? 2 : 1)
      }
    } catch (e) {
      console.error('Error updating paint properties:', e)
    }
  }, [selectedZone])

  return (
    <div style={containerStyle}>
      <div style={mapWrapperStyle}>
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

        {/* SearchInfo handles search UI and logic, passing all relevant state */}
        {/* <SearchInfo
          geojsonData={geojsonData}
          searchResults={searchResults}
          setSearchResults={setSearchResults}
          query={query}
          setQuery={setQuery}
          prevSearchResults={prevSearchResults}
          setPrevSearchResults={setPrevSearchResults}
          prevQuery={prevQuery}
          setPrevQuery={setPrevQuery}
          notFoundNames={notFoundNames}
          setNotFoundNames={setNotFoundNames}
          highlightKeys={highlightKeys}
          setHighlightKeys={setHighlightKeys}
          // cast mapRef to any to keep prop compatible with SearchInfo's type
          mapRef={mapRef as unknown as React.RefObject<any>}
        /> */}
      </div>
    </div>
  )
}

export default MapView