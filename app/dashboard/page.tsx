'use client';

import { useState, useEffect } from 'react';
import Nav from '../components/Nav';

export default function Dashboard() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState('austin');
  const [error, setError] = useState('');

  const cities = [
    { name: 'Austin', value: 'austin', available: true },
    { name: 'Nashville', value: 'nashville', available: true },
    { name: 'Houston', value: 'houston', available: false },
    { name: 'Charlotte', value: 'charlotte', available: false },
    { name: 'Phoenix', value: 'phoenix', available: false },
    { name: 'San Antonio', value: 'sanantonio', available: false },
    { name: 'Chattanooga', value: 'chattanooga', available: false },
  ];

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleDownload = async () => {
    if (!email) {
      setError('Please enter your email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/leads?email=${encodeURIComponent(email)}&city=${selectedCity}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Access denied');
        setLoading(false);
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedCity}_leads_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      localStorage.setItem('userEmail', email);
      alert('Download started!');
    } catch (err) {
      setError('Error downloading leads');
    } finally {
      setLoading(false);
    }
  };
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
