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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [lastWeekData, setLastWeekData] = useState(null);
  const [showLastWeek, setShowLastWeek] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);

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
      setIsAuthenticated(true);
    }
    // Load map leads for everyone (public access)
    fetchMapLeads(storedEmail);
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
        setIsAuthenticated(true);
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

  const fetchMapLeads = async (userEmail?: string | null) => {
    try {
      const emailParam = userEmail ? `?email=${encodeURIComponent(userEmail)}` : '';
      const response = await fetch(`/api/map-leads${emailParam}`);
      if (response.ok) {
        const data = await response.json();
        setFilteredLeads(data.leads || []);
        setIsAuthenticated(data.isAuthenticated || false);
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

  // Show dashboard for everyone - public map access
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
      <MapView 
        leads={filteredLeads} 
        email={email} 
        isAuthenticated={isAuthenticated}
        onSignInRequest={() => setShowSignInModal(true)}
      />
      
      {/* Sign-in modal - appears when clicking a pin */}
      {showSignInModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3000
          }}
          onClick={() => setShowSignInModal(false)}
        >
          <div 
            style={{
              background: 'white',
              padding: '30px',
              borderRadius: '15px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
              textAlign: 'center',
              maxWidth: '400px',
              width: '90%'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ color: '#333', marginBottom: '15px', fontSize: '24px' }}>
              🔒 Unlock Full Access
            </h3>
            <p style={{ color: '#666', marginBottom: '20px', fontSize: '16px' }}>
              Sign in to view complete address details
            </p>
            <form onSubmit={handleUnlock} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid #ddd',
                  fontSize: '16px'
                }}
                required
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '12px',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? 'Verifying...' : 'Sign In'}
              </button>
            </form>
            {error && (
              <p style={{ color: 'red', marginTop: '10px', fontSize: '14px' }}>
                {error}
              </p>
            )}
            <button
              onClick={() => setShowSignInModal(false)}
              style={{
                marginTop: '15px',
                background: 'none',
                border: 'none',
                color: '#666',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Continue browsing
            </button>
          </div>
        </div>
      )}
      
      {/* Data Cards */}
      
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
