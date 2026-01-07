'use client';

import Nav from '../components/Nav';

export default function Counties() {
  const coverage = [
    {
      city: 'Austin',
      county: 'Travis County',
      state: 'Texas',
      population: '1M+',
      avgLeads: '300-400/day',
      status: 'Live Now',
      statusColor: '#28a745'
    },
    {
      city: 'Nashville',
      county: 'Davidson County',
      state: 'Tennessee',
      population: '715,000+',
      avgLeads: '150-200/day',
      status: 'Coming Soon',
      statusColor: '#ffc107'
    },
    {
      city: 'Houston',
      county: 'Harris County',
      state: 'Texas',
      population: '2.3M+',
      avgLeads: '500-700/day',
      status: 'Coming Soon',
      statusColor: '#ffc107'
    },
    {
      city: 'Phoenix',
      county: 'Maricopa County',
      state: 'Arizona',
      population: '1.7M+',
      avgLeads: '400-500/day',
      status: 'Coming Soon',
      statusColor: '#ffc107'
    },
    {
      city: 'San Antonio',
      county: 'Bexar County',
      state: 'Texas',
      population: '1.5M+',
      avgLeads: '250-350/day',
      status: 'Coming Soon',
      statusColor: '#ffc107'
    },
    {
      city: 'Charlotte',
      county: 'Mecklenburg County',
      state: 'North Carolina',
      population: '900,000+',
      avgLeads: '200-300/day',
      status: 'Coming Soon',
      statusColor: '#ffc107'
    },
    {
      city: 'Chattanooga',
      county: 'Hamilton County',
      state: 'Tennessee',
      population: '185,000+',
      avgLeads: '80-120/day',
      status: 'Coming Soon',
      statusColor: '#ffc107'
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'Arial, sans-serif',
      position: 'relative'
    }}>
      <Nav />
      
      {/* Hero */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '220px 40px 60px',
        textAlign: 'center'
      }}>
        <h1 style={{
          color: 'white',
          fontSize: 'clamp(2.5em, 5vw, 3.5em)',
          marginBottom: '20px',
          fontWeight: 'bold'
        }}>
          Coverage Areas
        </h1>
        <p style={{
          color: 'rgba(255,255,255,0.95)',
          fontSize: '1.3em',
          marginBottom: '20px'
        }}>
          Austin live now. 6 more major markets launching soon.
        </p>
        <p style={{
          color: 'rgba(255,255,255,0.85)',
          fontSize: '1.1em'
        }}>
          Get access to all cities with one subscription
        </p>
      </div>

      {/* Coverage Grid */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 40px 80px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px'
        }}>
          {coverage.map((location, idx) => (
            <div
              key={idx}
              style={{
                background: 'white',
                borderRadius: '15px',
                padding: '35px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                transition: 'all 0.3s',
                border: location.status === 'Live Now' ? '3px solid #28a745' : '1px solid #ddd',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
              }}
            >
              {location.status === 'Live Now' && (
                <div style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  background: '#28a745',
                  color: 'white',
                  padding: '6px 15px',
                  borderRadius: '20px',
                  fontSize: '0.85em',
                  fontWeight: 'bold'
                }}>
                  ● LIVE
                </div>
              )}
              
              <h2 style={{
                color: '#333',
                fontSize: '2em',
                marginBottom: '10px',
                fontWeight: 'bold'
              }}>
                {location.city}
              </h2>
              
              <p style={{
                color: '#667eea',
                fontSize: '1.1em',
                marginBottom: '20px',
                fontWeight: '600'
              }}>
                {location.county}, {location.state}
              </p>

              <div style={{
                background: '#f9f9f9',
                padding: '20px',
                borderRadius: '10px',
                marginBottom: '20px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '12px'
                }}>
                  <span style={{ color: '#666' }}>Population:</span>
                  <span style={{ color: '#333', fontWeight: 'bold' }}>{location.population}</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span style={{ color: '#666' }}>Avg. Leads:</span>
                  <span style={{
                    color: '#667eea',
                    fontWeight: 'bold',
                    fontSize: '1.1em'
                  }}>
                    {location.avgLeads}
                  </span>
                </div>
              </div>

              <div style={{
                textAlign: 'center',
                padding: '12px',
                background: location.status === 'Live Now' ? '#e8f5e9' : '#fff3cd',
                borderRadius: '8px',
                color: location.statusColor,
                fontWeight: 'bold',
                fontSize: '1.05em'
              }}>
                {location.status === 'Live Now' ? '✓ Available Now' : '⏱ Coming Soon'}
              </div>
            </div>
          ))}
        </div>

        {/* Stats Bar */}
        <div style={{
          marginTop: '60px',
          background: 'rgba(255,255,255,0.15)',
          borderRadius: '15px',
          padding: '40px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '30px'
          }}>
            <div>
              <div style={{
                fontSize: '3em',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '10px'
              }}>
                7
              </div>
              <div style={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: '1.1em'
              }}>
                Major Cities
              </div>
            </div>
            <div>
              <div style={{
                fontSize: '3em',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '10px'
              }}>
                1,500+
              </div>
              <div style={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: '1.1em'
              }}>
                Daily Leads
              </div>
            </div>
            <div>
              <div style={{
                fontSize: '3em',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '10px'
              }}>
                24/7
              </div>
              <div style={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: '1.1em'
              }}>
                Auto Updates
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{
        background: 'white',
        padding: '80px 40px',
        textAlign: 'center'
      }}>
        <h2 style={{
          color: '#333',
          fontSize: '2.5em',
          marginBottom: '20px'
        }}>
          Get Access to All Cities
        </h2>
        <p style={{
          color: '#666',
          fontSize: '1.2em',
          marginBottom: '30px',
          maxWidth: '600px',
          margin: '0 auto 30px'
        }}>
          One subscription gives you unlimited access to leads from all current and future cities
        </p>
        <button
          onClick={() => window.location.href = '/pricing'}
          style={{
            padding: '18px 50px',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            fontSize: '1.3em',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
            transition: 'all 0.3s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.5)';
            e.currentTarget.style.background = '#5568d3';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
            e.currentTarget.style.background = '#667eea';
          }}
        >
          View Pricing
        </button>
      </div>
    </div>
  );
}

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px',
      paddingTop: '220px',
      fontFamily: 'Arial, sans-serif',
      position: 'relative'
    }}>
      <Nav />
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '10px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          marginBottom: '30px'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse'
          }}>
            <thead>
              <tr style={{
                background: '#667eea',
                color: 'white'
              }}>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>City</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>County</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>State</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Population</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Avg. Leads/Day</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {coverage.map((location, idx) => (
                <tr key={idx} style={{
                  background: idx % 2 === 0 ? '#f9f9f9' : 'white'
                }}>
                  <td style={{ padding: '15px', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>{location.city}</td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #eee' }}>{location.county}</td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #eee' }}>{location.state}</td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #eee' }}>{location.population}</td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #eee', color: '#667eea', fontWeight: 'bold' }}>{location.avgLeads}</td>
                  <td style={{ 
                    padding: '15px', 
                    borderBottom: '1px solid #eee',
                    color: location.status === 'Active' ? '#28a745' : '#999',
                    fontWeight: location.status === 'Active' ? 'bold' : 'normal'
                  }}>
                    {location.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '10px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          marginBottom: '30px'
        }}>
          <h2 style={{
            color: '#333',
            fontSize: '2em',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            What's Included
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            <div style={{ padding: '20px' }}>
              <h3 style={{ color: '#667eea', marginBottom: '10px' }}>📋 Permit Types</h3>
              <p style={{
                color: '#666',
                fontSize: '0.85em',
                fontStyle: 'italic',
                marginBottom: '10px'
              }}>
                *Note: Not all permit types are available in all cities
              </p>
              <ul style={{ color: '#666', lineHeight: '1.8' }}>
                <li>Building Permits</li>
                <li>Electrical Permits</li>
                <li>Plumbing Permits</li>
                <li>Mechanical Permits</li>
                <li>Driveway / Sidewalks</li>
              </ul>
            </div>
            <div style={{ padding: '20px' }}>
              <h3 style={{ color: '#667eea', marginBottom: '10px' }}>📊 Data Points</h3>
              <p style={{
                color: '#666',
                fontSize: '0.85em',
                fontStyle: 'italic',
                marginBottom: '10px'
              }}>
                *Note: Not all data points are available on all permits
              </p>
              <ul style={{ color: '#666', lineHeight: '1.8' }}>
                <li>Date</li>
                <li>City</li>
                <li>Permit Type</li>
                <li>Permit Number</li>
                <li>Address</li>
                <li>Description</li>
              </ul>
            </div>
            <div style={{ padding: '20px' }}>
              <h3 style={{ color: '#667eea', marginBottom: '10px' }}>🔄 Updates</h3>
              <ul style={{ color: '#666', lineHeight: '1.8' }}>
                <li>Daily refresh</li>
                <li>CSV format</li>
                <li>Instant download</li>
                <li>Historical data available</li>
                <li>Clean, organized data</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
