declare module 'react-map-gl' {
  import * as React from 'react'
  import type { MapboxOptions, Map as MapboxMap } from 'mapbox-gl'

  export interface MapProps extends React.HTMLAttributes<HTMLElement> {
    initialViewState?: any
    mapLib?: any
    mapStyle?: string | object
    onLoad?: (event: any) => void
    style?: React.CSSProperties
    interactiveLayerIds?: string[]
    children?: React.ReactNode
  }

  export const Map: React.ComponentType<MapProps>

  export const Source: React.ComponentType<any>
  export const Layer: React.ComponentType<any>
}
