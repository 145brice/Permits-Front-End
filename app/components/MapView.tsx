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
  type: 'permit';
  description?: string;
}

interface MapViewProps {
  leads: Lead[];
  email?: string;
  isAuthenticated?: boolean;
  onSignInRequest?: () => void;
}

export default function MapView({ leads, email, isAuthenticated, onSignInRequest }: MapViewProps) {
  const isAdmin = email && ['test@example.com', 'admin@permits.com', '145brice@gmail.com'].includes(email.toLowerCase());

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
    <div style={{ height: '100vh', width: '100vw', position: 'relative' }}>
      {isAdmin && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '5px 10px',
          borderRadius: '5px',
          fontSize: '12px',
          fontWeight: 'bold',
          zIndex: 1000,
          backdropFilter: 'blur(10px)'
        }}>
          ADMIN ACCESS
        </div>
      )}
      {leads.length === 0 && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(255, 255, 255, 0.9)',
          color: 'black',
          padding: '20px',
          borderRadius: '10px',
          fontSize: '16px',
          fontWeight: 'bold',
          zIndex: 1000,
          textAlign: 'center'
        }}>
          Loading permits data...
        </div>
      )}
      <MapContainer
        center={[30.2672, -97.7431]} // Austin, TX
        zoom={11}
        style={{ height: '100vh', width: '100vw' }}
        className="z-0"
      >
      <TileLayer
        url="https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=jEn4MW4VhPVe82B3bazQ"
        attribution='&copy; <a href="https://www.maptiler.com/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        tileSize={512}
        zoomOffset={-1}
      />
      {leads.map((lead, i) => (
        <Marker key={i} position={[lead.lat, lead.lng]} icon={icon}>
          <Popup>
            <div className="p-2 text-sm">
              {isAuthenticated ? (
                <p className="font-bold text-gray-900">{lead.address}</p>
              ) : (
                <div>
                  <p className="font-bold text-gray-500">🔒 Address Hidden</p>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onSignInRequest?.();
                    }}
                    className="text-xs text-blue-600 mt-1 underline cursor-pointer bg-transparent border-none p-0"
                  >
                    Sign in to view address
                  </button>
                </div>
              )}
              <p className="text-xs text-orange-600">🔨 Permit</p>
              {lead.description && (
                <p className="text-xs text-gray-600 mt-1">{lead.description}</p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
    </div>
  );
}
