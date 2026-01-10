'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Nav from '../components/Nav';
import FilterBar from '../components/FilterBar';
import DataCard from '../components/DataCard';

// Dynamically import MapView to avoid SSR issues
const MapView = dynamic(() => import('../components/MapView'), {
  ssr: false,
  loading: () => <div>Loading map...</div>
});

export default function Dashboard() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState('austin');
  const [error, setError] = useState('');
  const [hasAccess, setHasAccess] = useState(false);
  const [leads, setLeads] = useState<any[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<any[]>([]);
  const [permitCount, setPermitCount] = useState(0);
  const [lastWeekData, setLastWeekData] = useState(null);
  const [showLastWeek, setShowLastWeek] = useState(false);

  const cities = [
    { name: 'Austin', value: 'austin', available: true },
    { name: 'Nashville', value: 'nashville', available: true },
    { name: 'Houston', value: 'houston', available: false },
    { name: 'Charlotte', value: 'charlotte', available: false },
    { name: 'Phoenix', value: 'phoenix', available: false },
    { name: 'San Antonio', value: 'sanantonio', available: true },
    { name: 'Chattanooga', value: 'chattanooga', available: false },
  ];

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setEmail(storedEmail);
      setHasAccess(true);
      // Automatically fetch map data for returning users
      fetchMapLeads(storedEmail);
    }
  }, []);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Test access by trying to fetch leads
      const response = await fetch(`/api/leads?email=${encodeURIComponent(email)}&city=austin`);
      
      if (response.ok) {
        setHasAccess(true);
        localStorage.setItem('userEmail', email);
        // Fetch map data for the dashboard
        await fetchMapLeads(email);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Access denied');
      }
    } catch (err) {
      setError('Error verifying access');
    } finally {
      setLoading(false);
    }
  };

  const fetchLeads = async (userEmail: string) => {
    try {
      const response = await fetch(`/api/leads?email=${encodeURIComponent(userEmail)}&city=austin`);
      if (response.ok) {
        const data = await response.json();
        setLeads(data.leads || []);
        setFilteredLeads(data.leads || []);
        setPermitCount(data.permitCount || 0);
      }
    } catch (err) {
      console.error('Error fetching leads:', err);
    }
  };

  const fetchMapLeads = async (userEmail: string) => {
    try {
      const response = await fetch(`/api/map-leads?email=${encodeURIComponent(userEmail)}`);
      if (response.ok) {
        const data = await response.json();
        setFilteredLeads(data.leads || []);
      } else {
        console.error('Error fetching map leads:', response.statusText);
      }
    } catch (err) {
      console.error('Error fetching map leads:', err);
    }
  };

  const fetchLastWeek = async () => {
    try {
      // Call the back end directly (assuming BACKEND_URL is set)
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5002';
      const response = await fetch(`${backendUrl}/last-week?cities=nashville,austin,sanantonio`);

      if (response.ok) {
        const data = await response.json();
        setLastWeekData(data);
        setShowLastWeek(true);

        // Transform the data for display
        const allPermits = [];
        let totalCount = 0;
        for (const [city, cityData] of Object.entries(data)) {
          const cityInfo = cityData as any; // Type assertion for the API response
          if (cityInfo.permits) {
            allPermits.push(...cityInfo.permits.map((permit: any) => ({
              ...permit,
              city: city
            })));
            totalCount += cityInfo.count;
          }
        }
        setFilteredLeads(allPermits);
        setPermitCount(totalCount);
      } else {
        console.error('Error fetching last week data');
      }
    } catch (err) {
      console.error('Error fetching last week:', err);
    }
  };

  const handleFilter = (filters: any) => {
    // Implement filtering logic
    setFilteredLeads(leads);
  };

  const handleZipChange = (zipCode: string) => {
    // Implement zip code filtering
    setFilteredLeads(leads);
  };

  if (!hasAccess) {
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
            Interactive map showing active permits in Austin. Subscribe to unlock.
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
      <MapView leads={filteredLeads} email={email} />
      
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
        <DataCard label="Active Permits" count={permitCount} color="text-orange-400" />
        <DataCard label="Total Permits" count={filteredLeads.length} color="text-green-400" />
      </div>

      {/* Control buttons */}
      <div style={{
        position: 'absolute',
        top: '80px',
        right: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        zIndex: 1000
      }}>
        <button
          onClick={() => fetchMapLeads(email)}
          style={{
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'background 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 1)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.8)'}
        >
          🔄 Refresh Austin
        </button>

        <button
          onClick={fetchLastWeek}
          style={{
            background: showLastWeek ? 'rgba(52, 152, 219, 0.8)' : 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'background 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = showLastWeek ? 'rgba(52, 152, 219, 1)' : 'rgba(0, 0, 0, 1)'}
          onMouseOut={(e) => e.currentTarget.style.background = showLastWeek ? 'rgba(52, 152, 219, 0.8)' : 'rgba(0, 0, 0, 0.8)'}
        >
          📅 Last 7 Days
        </button>
      </div>
    </div>
  );
}
