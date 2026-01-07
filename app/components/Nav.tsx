'use client';

import { useState } from 'react';

export default function Nav() {
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const cities = [
    { name: 'Austin', active: true },
    { name: 'Nashville', active: false },
    { name: 'Houston', active: false },
    { name: 'Phoenix', active: false },
    { name: 'San Antonio', active: false },
    { name: 'Charlotte', active: false },
    { name: 'Chattanooga', active: false }
  ];

  const handleCityClick = (cityName: string, isActive: boolean) => {
    if (!isActive) {
      alert(`${cityName} leads coming soon! Currently only Austin is available.`);
      return;
    }
    setSelectedCity(cityName);
    setShowEmailPopup(true);
  };

  const handleDownload = async () => {
    if (!email) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/leads?email=${encodeURIComponent(email)}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedCity.toLowerCase()}-leads.csv`;
        a.click();
        alert('Download started!');
        setShowEmailPopup(false);
        setEmail('');
      } else {
        const error = await response.json();
        alert(error.error || 'Access denied');
      }
    } catch (err) {
      alert('Error downloading leads');
    }
    setLoading(false);
  };

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        {/* City Links Section */}
        <div style={{
          padding: '20px 30px',
          textAlign: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h1 style={{
            color: 'white',
            fontSize: '2em',
            marginBottom: '15px',
            fontWeight: 'bold'
          }}>
            Construction Leads
          </h1>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '12px',
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            {cities.map((city) => (
              <button
                key={city.name}
                onClick={() => handleCityClick(city.name, city.active)}
                style={{
                  padding: '10px 20px',
                  background: city.active ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)',
                  color: city.active ? '#667eea' : 'white',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '6px',
                  fontSize: '0.95em',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  whiteSpace: 'nowrap'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {city.name}
                {!city.active && ' (Soon)'}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Links Section */}
        <div style={{
          padding: '15px 30px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{
        display: 'flex',
        gap: '12px',
        alignItems: 'center'
      }}>
        <a
          href="/"
          style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '0.9em',
            fontWeight: '600',
            padding: '8px 16px',
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '6px',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
        >
          Home
        </a>
        <a
          href="/dashboard"
          style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '0.9em',
            fontWeight: '600',
            padding: '8px 16px',
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '6px',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
        >
          Map 🗺️
        </a>
        <a
          href="/counties"
          style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '0.9em',
            fontWeight: '600',
            padding: '8px 16px',
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '6px',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
        >
          Coverage
        </a>
        <a
          href="/pricing"
          style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '0.9em',
            fontWeight: '600',
            padding: '8px 16px',
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '6px',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
        >
          Pricing
        </a>
        <a
          href="/purchase"
          style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '0.9em',
            fontWeight: '600',
            padding: '8px 16px',
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '6px',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
        >
          Purchase
        </a>
          </div>
        </div>
      </nav>

      {/* Email Popup Modal */}
      {showEmailPopup && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '20px'
        }}
        onClick={() => setShowEmailPopup(false)}
        >
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '10px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            maxWidth: '500px',
            width: '100%'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{
              color: '#333',
              marginBottom: '10px',
              fontSize: '2em'
            }}>
              Download {selectedCity} Leads
            </h2>
            <p style={{
              color: '#666',
              marginBottom: '25px',
              fontSize: '1em'
            }}>
              Enter your email to access today's construction permit leads
            </p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              style={{
                width: '100%',
                padding: '15px',
                border: '2px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px',
                marginBottom: '15px',
                boxSizing: 'border-box'
              }}
            />
            <div style={{
              display: 'flex',
              gap: '10px'
            }}>
              <button
                onClick={handleDownload}
                disabled={loading || !email}
                style={{
                  flex: 1,
                  padding: '15px',
                  background: loading || !email ? '#ccc' : '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '16px',
                  cursor: loading || !email ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold'
                }}
              >
                {loading ? 'Downloading...' : 'Download'}
              </button>
              <button
                onClick={() => {
                  setShowEmailPopup(false);
                  setEmail('');
                }}
                style={{
                  padding: '15px 25px',
                  background: '#999',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
            <p style={{
              color: '#999',
              fontSize: '0.85em',
              marginTop: '15px',
              textAlign: 'center'
            }}>
              Access granted for active subscribers and recent payers
            </p>
          </div>
        </div>
      )}
    </>
