'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Nav from '../components/Nav';
import FilterBar from '../components/FilterBar';
import DataCard from '../components/DataCard';

// Import MapView dynamically to avoid SSR issues with Leaflet
const MapView = dynamic(() => import('../components/MapView'), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-screen flex items-center justify-center" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <p className="text-white text-xl">Loading map...</p>
    </div>
  ),
});

interface Lead {
  address: string;
  lat: number;
  lng: number;
  price?: string;
  type: 'sold' | 'permit';
  description?: string;
}

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);

  const fetchLeads = async (userEmail: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/map-leads?email=${encodeURIComponent(userEmail)}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Access denied');
        setIsUnlocked(false);
        return;
      }

      setLeads(data.leads);
      setFilteredLeads(data.leads);
      setIsUnlocked(true);
      setError('');
      // Store email in localStorage for persistence
      localStorage.setItem('dashboardEmail', userEmail);
    } catch (err) {
      setError('Failed to load leads');
      setIsUnlocked(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if email is stored
    const storedEmail = localStorage.getItem('dashboardEmail');
    if (storedEmail) {
      setEmail(storedEmail);
      fetchLeads(storedEmail);
    } else {
      setLoading(false);
    }
  }, []);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    await fetchLeads(email);
  };

  const handleFilter = (type: string) => {
    if (type === 'all') {
      setFilteredLeads(leads);
    } else {
      setFilteredLeads(leads.filter((lead) => lead.type === type));
    }
  };

  const handleZipChange = (zip: string) => {
    // Implement zip filtering logic if needed
    console.log('Filter by zip:', zip);
  };

  const soldCount = filteredLeads.filter((l) => l.type === 'sold').length;
  const permitCount = filteredLeads.filter((l) => l.type === 'permit').length;

  // Locked page
  if (!isUnlocked) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        position: 'relative'
      }}>
        <Nav />
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          padding: '40px',
          borderRadius: '20px',
          maxWidth: '500px',
          width: '100%',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
        }}>
          <h1 style={{
            fontSize: '2.5em',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '15px'
          }}>
            🗺️ Map Dashboard
          </h1>
          <p style={{
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: '30px',
            fontSize: '1.1em'
          }}>
            Interactive map showing sold homes and active permits in Austin. Subscribe to unlock.
          </p>
          
          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgb(239, 68, 68)',
              color: 'white',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleUnlock} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={{
                width: '100%',
                padding: '15px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
              required
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '15px',
                background: loading ? '#999' : '#667eea',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '18px',
                borderRadius: '8px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.3s'
              }}
            >
              {loading ? 'Verifying...' : 'Unlock Dashboard'}
            </button>
          </form>

          <div style={{ marginTop: '25px', textAlign: 'center' }}>
            <a href="/pricing" style={{
              color: 'white',
              textDecoration: 'underline',
              fontSize: '1em'
            }}>
              Don't have access? Subscribe here
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Unlocked dashboard
  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      position: 'relative',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Nav />
      <FilterBar onFilter={handleFilter} onZipChange={handleZipChange} />
      <MapView leads={filteredLeads} />
      
      {/* Data Cards */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        zIndex: 1000
      }}>
        <DataCard label="Sold Homes" count={soldCount} color="text-blue-400" />
        <DataCard label="Active Permits" count={permitCount} color="text-orange-400" />
        <DataCard label="Total Leads" count={filteredLeads.length} color="text-green-400" />
      </div>

      {/* Refresh button */}
      <button
        onClick={() => fetchLeads(email)}
        style={{
          position: 'absolute',
          top: '80px',
          right: '20px',
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer',
          zIndex: 1000,
          backdropFilter: 'blur(10px)',
          fontSize: '14px',
          fontWeight: '600',
          transition: 'background 0.2s'
        }}
        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 1)'}
        onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.8)'}
      >
        🔄 Refresh
      </button>
    </div>
  );
}
