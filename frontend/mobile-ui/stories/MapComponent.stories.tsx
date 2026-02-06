//import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Box from '@mui/material/Box';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import MapComponent from '../src/app/features/Citizen/components/MapComponent';

// Create a simple div icon so we don't rely on external marker images
const divIcon = L.divIcon({
  html: `<div style="width:20px;height:20px;border-radius:50%;background:#C84C0E;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.3)"></div>`,
  className: '',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const sampleLatLng = { lat: 12.9352, lng: 77.6245 };
const sampleTile = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

const meta: Meta<typeof MapComponent> = {
  title: 'Citizen/MapComponent',
  component: MapComponent,
};

export default meta;
type Story = StoryObj<typeof MapComponent>;

export const Default: Story = {
  render: () => (
    <Box sx={{ width: 380, height: 260, p: 4 }}>
      <MapComponent latLng={sampleLatLng} tileUrl={sampleTile} customIcon={divIcon as any} />
    </Box>
  ),
};

export const DifferentLocation: Story = {
  render: () => (
    <Box sx={{ width: 380, height: 260, p: 4 }}>
      <MapComponent latLng={{ lat: 12.9716, lng: 77.5946 }} tileUrl={sampleTile} customIcon={divIcon as any} />
    </Box>
  ),
};
