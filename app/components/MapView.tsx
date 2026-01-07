'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// Fix for default marker icons in react-leaflet
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface Lead {
  address: string;
  lat: number;
  lng: number;
  price?: string;
  type: 'sold' | 'permit';
  description?: string;
}

interface MapViewProps {
  leads: Lead[];
}

export default function MapView({ leads }: MapViewProps) {
  useEffect(() => {
    // Ensure Leaflet is only loaded on client
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }, []);

  return (
    <MapContainer
      center={[30.2672, -97.7431]} // Austin, TX
      zoom={11}
      style={{ height: '100vh', width: '100vw' }}
      className="z-0"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {leads.map((lead, i) => (
        <Marker key={i} position={[lead.lat, lead.lng]} icon={icon}>
          <Popup>
            <div className="p-2 text-sm">
              <p className="font-bold text-gray-900">{lead.address}</p>
              {lead.price && <p className="text-green-600">${lead.price}</p>}
              <p className="text-xs">
                {lead.type === 'sold' ? '🏡 Sold Home' : '🔨 Permit'}
              </p>
              {lead.description && (
                <p className="text-xs text-gray-600 mt-1">{lead.description}</p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
