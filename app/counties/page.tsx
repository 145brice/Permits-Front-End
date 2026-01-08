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
      status: 'Active'
    },
    {
      city: 'Nashville',
      county: 'Davidson County',
      state: 'Tennessee',
      population: '715,000+',
      avgLeads: '150-200/day',
      status: 'Active'
    },
    {
      city: 'Houston',
      county: 'Harris County',
      state: 'Texas',
      population: '2.3M+',
      avgLeads: '500-700/day',
      status: 'Coming Soon'
    },
    {
      city: 'Phoenix',
      county: 'Maricopa County',
      state: 'Arizona',
      population: '1.7M+',
      avgLeads: '400-500/day',
      status: 'Coming Soon'
    },
    {
      city: 'San Antonio',
      county: 'Bexar County',
      state: 'Texas',
      population: '1.5M+',
      avgLeads: '250-350/day',
      status: 'Coming Soon'
    },
    {
      city: 'Charlotte',
      county: 'Mecklenburg County',
      state: 'North Carolina',
      population: '900,000+',
      avgLeads: '200-300/day',
      status: 'Coming Soon'
    },
    {
      city: 'Chattanooga',
      county: 'Hamilton County',
      state: 'Tennessee',
      population: '185,000+',
      avgLeads: '80-120/day',
      status: 'Coming Soon'
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px',
      fontFamily: 'Arial, sans-serif',
      position: 'relative',
      paddingTop: '100px'
    }}>
      <Nav />
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{
            color: 'white',
            fontSize: 'clamp(2em, 5vw, 3.5em)',
            marginBottom: '15px',
            fontWeight: 'bold'
          }}>
            Expanding Nationwide
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.95)',
            fontSize: 'clamp(1.1em, 3vw, 1.4em)',
            marginBottom: '30px',
            lineHeight: '1.5'
          }}>
            Currently serving <strong>Austin</strong> with 300-400 fresh leads daily.<br/>
            More cities launching soon—lock in your price now.
          </p>
          <button
            onClick={() => window.location.href = '/purchase'}
            style={{
              padding: '18px 50px',
              background: 'white',
              color: '#667eea',
              border: 'none',
              borderRadius: '50px',
              fontSize: '1.2em',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 35px rgba(0,0,0,0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
            }}
          >
            Get Started Now
          </button>
        </div>

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
